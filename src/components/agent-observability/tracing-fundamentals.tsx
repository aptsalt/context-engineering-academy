import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const spanConcepts = [
  {
    name: "Root Span",
    description:
      "The top-level span representing the entire agent execution. Every trace has exactly one root span. Its duration is the total request latency.",
    color: "text-blue-600",
  },
  {
    name: "Child Span",
    description:
      "A sub-operation within a parent span. LLM calls, tool executions, and retrieval steps are typically child spans of the root.",
    color: "text-green-600",
  },
  {
    name: "Span Attributes",
    description:
      "Key-value metadata attached to a span: model name, token counts, tool name, success/failure, latency, and custom business context.",
    color: "text-yellow-600",
  },
  {
    name: "Span Events",
    description:
      "Timestamped log entries within a span. Useful for recording specific moments like 'rate limited, retrying' or 'context window at 80% capacity'.",
    color: "text-purple-600",
  },
];

const traceTreeCode = `// A typical agent trace tree structure
{
  "traceId": "abc-123-def-456",
  "rootSpan": {
    "name": "agent.handle_query",
    "duration": "3,200ms",
    "attributes": { "userId": "usr_42", "model": "gpt-4o" },
    "children": [
      {
        "name": "agent.plan",
        "duration": "450ms",
        "attributes": { "strategy": "decompose", "steps": 3 }
      },
      {
        "name": "agent.step.retrieve",
        "duration": "320ms",
        "attributes": { "tool": "vector_search", "results": 5 }
      },
      {
        "name": "agent.step.llm_call",
        "duration": "1,800ms",
        "attributes": {
          "model": "gpt-4o",
          "inputTokens": 4200,
          "outputTokens": 850,
          "cost": "$0.053"
        }
      },
      {
        "name": "agent.step.tool_call",
        "duration": "280ms",
        "attributes": {
          "tool": "calculator",
          "input": "revenue * 0.15",
          "success": true
        }
      },
      {
        "name": "agent.synthesize",
        "duration": "350ms",
        "attributes": { "outputTokens": 200 }
      }
    ]
  }
}`;

const otelSetupCode = `import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { trace, SpanStatusCode, type Span } from "@opentelemetry/api";

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource: new Resource({
    "service.name": "my-agent",
    "service.version": "1.0.0",
    "deployment.environment": "production",
  }),
  traceExporter: new OTLPTraceExporter({
    url: "https://otel-collector.example.com/v1/traces",
  }),
});
sdk.start();

// Create a tracer for agent operations
const tracer = trace.getTracer("agent-tracer");

// Helper to wrap agent operations in spans
export async function withSpan<T>(
  name: string,
  attributes: Record<string, string | number | boolean>,
  fn: (span: Span) => Promise<T>,
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    span.setAttributes(attributes);
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

// Usage in agent code
async function handleQuery(query: string, userId: string) {
  return withSpan("agent.query", { userId, queryLength: query.length }, async (rootSpan) => {
    // Plan step — automatically a child of rootSpan
    const plan = await withSpan("agent.plan", { query }, async (planSpan) => {
      const result = await planner.createPlan(query);
      planSpan.setAttribute("stepCount", result.steps.length);
      return result;
    });

    // Execute each step
    for (const [i, step] of plan.steps.entries()) {
      await withSpan(
        \`agent.step.\${step.type}\`,
        { stepIndex: i, tool: step.tool ?? "none" },
        async (stepSpan) => {
          const result = await executeStep(step);
          stepSpan.setAttribute("success", result.success);
          stepSpan.setAttribute("outputTokens", result.tokens ?? 0);
          return result;
        },
      );
    }
  });
}`;

export function TracingFundamentals() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Tracing</strong> is the backbone of agent observability. A
          trace captures the entire execution path of a single request — every
          LLM call, tool execution, and decision point — as a tree of{" "}
          <strong>spans</strong> with precise timing and metadata.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Without tracing, a multi-step agent is a black box. You see the input
          and output, but not the 5-10 intermediate steps that produced the
          result. When something goes wrong, you&apos;re guessing which step
          failed.
        </p>
      </div>

      {/* Span Concepts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Core Concepts</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {spanConcepts.map((concept) => (
            <Card key={concept.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <Badge variant="outline" className={`${concept.color} border-current mb-2`}>
                  {concept.name}
                </Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {concept.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trace Tree Visualization */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Anatomy of a Trace Tree</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A trace tree shows the parent-child relationships between spans. Each
          span has a name, duration, and attributes. The tree structure reveals
          the execution flow and where time is spent.
        </p>
        <CodeBlock code={traceTreeCode} label="Example: Agent trace tree (JSON)" />
        <div className="mt-4 bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-600 mb-1">Reading a trace tree</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This trace took 3,200ms total. The LLM call consumed 56% of the time
            (1,800ms). The planning step generated 3 steps. Vector search found 5
            results. The calculator tool succeeded. Total cost was $0.053. If the
            final answer is wrong, you can pinpoint exactly which step introduced
            the error.
          </p>
        </div>
      </div>

      {/* Waterfall Visualization */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Trace Waterfall (visual representation)
          </p>
          <div className="space-y-2">
            {[
              { name: "agent.handle_query", start: 0, width: 100, color: "bg-blue-500" },
              { name: "  agent.plan", start: 0, width: 14, color: "bg-purple-500" },
              { name: "  agent.step.retrieve", start: 14, width: 10, color: "bg-cyan-500" },
              { name: "  agent.step.llm_call", start: 24, width: 56, color: "bg-green-500" },
              { name: "  agent.step.tool_call", start: 80, width: 9, color: "bg-yellow-500" },
              { name: "  agent.synthesize", start: 89, width: 11, color: "bg-orange-500" },
            ].map((span) => (
              <div key={span.name} className="flex items-center gap-3">
                <span className="w-44 text-xs font-mono text-muted-foreground truncate">
                  {span.name}
                </span>
                <div className="flex-1 h-6 bg-muted/10 rounded relative">
                  <div
                    className={`absolute top-0 h-full ${span.color} rounded opacity-80`}
                    style={{ left: `${span.start}%`, width: `${span.width}%` }}
                  />
                </div>
                <span className="w-16 text-xs font-mono text-muted-foreground text-right">
                  {span.width === 100 ? "3,200ms" : `${Math.round(span.width * 32)}ms`}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            The waterfall view instantly reveals that the LLM call dominates
            latency. Optimizing the LLM step (prompt caching, smaller context,
            cheaper model) would have the biggest impact.
          </p>
        </CardContent>
      </Card>

      {/* OpenTelemetry Setup */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Implementing Traces with OpenTelemetry
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          OpenTelemetry (OTEL) is the vendor-neutral standard for distributed
          tracing. It works with every observability backend — Jaeger, Grafana
          Tempo, Honeycomb, Langfuse, and more. Here&apos;s a production setup
          for Node.js agents.
        </p>
        <CodeBlock code={otelSetupCode} label="OpenTelemetry setup for agent tracing" />
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Tracing Best Practices</p>
        <ul className="text-sm text-foreground/80 leading-relaxed space-y-2">
          <li>
            <strong>Name spans by operation, not implementation:</strong>{" "}
            Use &quot;agent.plan&quot; not &quot;callGPT4ForPlanning&quot;. You want stable
            names even when you swap models.
          </li>
          <li>
            <strong>Always record token counts and model name on LLM spans:</strong>{" "}
            This is essential for cost attribution and performance analysis.
          </li>
          <li>
            <strong>Record tool inputs and outputs (truncated) on tool spans:</strong>{" "}
            When a tool returns bad data, you need to see what it received and returned.
          </li>
          <li>
            <strong>Use semantic conventions:</strong>{" "}
            Follow OpenTelemetry semantic conventions for GenAI when they become stable.
            This ensures compatibility across tools.
          </li>
        </ul>
      </div>
    </div>
  );
}
