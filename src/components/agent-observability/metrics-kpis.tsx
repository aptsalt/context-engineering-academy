import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const metricCategories = [
  {
    category: "Latency",
    color: "text-blue-600",
    border: "border-blue-500/20",
    metrics: [
      {
        name: "Time to First Token (TTFT)",
        description: "How long until the user sees the first token of the response. Critical for perceived performance in streaming UIs.",
        target: "< 500ms for streaming, < 2s for non-streaming",
      },
      {
        name: "Total Response Latency",
        description: "End-to-end time from user input to complete response. Includes planning, tool calls, LLM generation, and post-processing.",
        target: "p50 < 2s, p95 < 5s, p99 < 15s",
      },
      {
        name: "Tool Call Latency",
        description: "Time for each tool execution. Slow tools dominate agent latency since LLM calls block on tool results.",
        target: "p95 < 1s per tool call",
      },
    ],
  },
  {
    category: "Token Usage",
    color: "text-green-600",
    border: "border-green-500/20",
    metrics: [
      {
        name: "Input Tokens per Request",
        description: "How much context the model receives. Tracks system prompt size, conversation history, RAG documents, and tool definitions. Directly correlates with cost.",
        target: "Monitor trend — should not grow unbounded",
      },
      {
        name: "Output Tokens per Request",
        description: "How verbose the model's response is. High output tokens may indicate the model is over-explaining or generating unnecessary content.",
        target: "Model-specific, typically 200-2000 per response",
      },
      {
        name: "Token Efficiency Ratio",
        description: "Useful output tokens / total input tokens consumed. A falling ratio means you're stuffing more context for the same quality of output.",
        target: "> 0.1 (10% of input results in useful output)",
      },
    ],
  },
  {
    category: "Cost",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    metrics: [
      {
        name: "Cost per Request",
        description: "Total LLM API cost for a single user request, including all LLM calls, retries, and sub-agent invocations.",
        target: "Define per feature — e.g., simple Q&A < $0.01, complex analysis < $0.10",
      },
      {
        name: "Cost per Conversation",
        description: "Total cost across all messages in a conversation. Rises with conversation length due to growing context windows.",
        target: "Set per-conversation budget caps",
      },
      {
        name: "Cost per User (daily/monthly)",
        description: "Aggregated cost attributed to individual users. Identifies power users and potential abuse.",
        target: "Set per-user daily limits with automatic throttling",
      },
    ],
  },
  {
    category: "Quality & Reliability",
    color: "text-purple-600",
    border: "border-purple-500/20",
    metrics: [
      {
        name: "Success Rate (verified)",
        description: "Percentage of requests that produce a verified-correct response. Not just 'didn't throw an error' — use eval checks for actual correctness.",
        target: "> 95% for production systems",
      },
      {
        name: "Tool Call Accuracy",
        description: "Percentage of tool calls where the agent selected the correct tool with valid arguments. Wrong tool selection is a major failure mode.",
        target: "> 98% correct tool selection",
      },
      {
        name: "Hallucination Rate",
        description: "Percentage of responses flagged by automated eval checks as containing fabricated information. Requires running evals on sampled production traffic.",
        target: "< 2% for factual queries",
      },
      {
        name: "Retry Rate",
        description: "Percentage of requests that required at least one retry (LLM or tool). High retry rates indicate instability or poor prompt design.",
        target: "< 5% of requests require retries",
      },
    ],
  },
];

const metricsSetupCode = `import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("agent-metrics");

// Latency histograms (use buckets that match your SLOs)
const requestLatency = meter.createHistogram("agent.request.latency_ms", {
  description: "End-to-end request latency",
  unit: "ms",
});

const ttft = meter.createHistogram("agent.ttft_ms", {
  description: "Time to first token",
  unit: "ms",
});

const toolLatency = meter.createHistogram("agent.tool.latency_ms", {
  description: "Individual tool call latency",
  unit: "ms",
});

// Token counters
const inputTokens = meter.createHistogram("agent.tokens.input", {
  description: "Input tokens per request",
});

const outputTokens = meter.createHistogram("agent.tokens.output", {
  description: "Output tokens per request",
});

// Cost gauge
const requestCost = meter.createHistogram("agent.cost_usd", {
  description: "Cost per request in USD",
});

// Quality counters
const requestCounter = meter.createCounter("agent.requests.total", {
  description: "Total requests by status",
});

const toolCallCounter = meter.createCounter("agent.tool_calls.total", {
  description: "Tool calls by tool and status",
});

// Recording metrics in agent code
async function handleRequest(input: string, context: RequestContext) {
  const start = performance.now();
  const labels = {
    model: context.model,
    feature: context.feature,
  };

  try {
    const result = await agent.execute(input, context);
    const latencyMs = performance.now() - start;

    requestLatency.record(latencyMs, { ...labels, status: "success" });
    inputTokens.record(result.usage.inputTokens, labels);
    outputTokens.record(result.usage.outputTokens, labels);
    requestCost.record(result.estimatedCost, labels);
    requestCounter.add(1, { ...labels, status: "success" });

    if (result.ttftMs) {
      ttft.record(result.ttftMs, labels);
    }

    for (const tool of result.toolCalls) {
      toolCallCounter.add(1, {
        tool: tool.name,
        success: String(tool.success),
      });
      toolLatency.record(tool.latencyMs, { tool: tool.name });
    }

    return result;
  } catch (error) {
    requestLatency.record(performance.now() - start, { ...labels, status: "error" });
    requestCounter.add(1, { ...labels, status: "error" });
    throw error;
  }
}`;

export function MetricsKpis() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Agent metrics go far beyond response time and error rate. You need to
          track <strong>latency distributions</strong>,{" "}
          <strong>token consumption</strong>, <strong>per-request cost</strong>,{" "}
          <strong>tool call accuracy</strong>, and{" "}
          <strong>response quality</strong> — all broken down by model, feature,
          and user segment.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The goal is to answer three questions at any time:{" "}
          <em>Is the agent working correctly?</em>{" "}
          <em>How much is it costing?</em>{" "}
          <em>Where are the bottlenecks?</em>
        </p>
      </div>

      {/* Metrics by Category */}
      <div className="space-y-6">
        {metricCategories.map((cat) => (
          <Card key={cat.category} className={`bg-card/50 ${cat.border}`}>
            <CardContent className="pt-6">
              <Badge variant="outline" className={`${cat.color} border-current mb-4`}>
                {cat.category}
              </Badge>
              <div className="space-y-4">
                {cat.metrics.map((metric) => (
                  <div key={metric.name} className="bg-muted/10 rounded-lg p-4 border border-border/30">
                    <h4 className="font-semibold text-sm mb-1">{metric.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {metric.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                        Target:
                      </span>
                      <span className="text-xs text-foreground/70 font-mono">
                        {metric.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Insight: Percentiles */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          Why Percentiles, Not Averages
        </p>
        <p className="text-foreground/90 leading-relaxed">
          An average latency of 1.5 seconds sounds fine. But if your p99 is 25
          seconds, <strong>1 in 100 users waits 25 seconds</strong>. With 10,000
          daily requests, that&apos;s 100 terrible experiences per day. Percentiles
          (p50, p95, p99) reveal the full distribution. Use histogram metric types
          to compute percentiles efficiently.
        </p>
      </div>

      {/* Visual: Latency Budget */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Typical Agent Latency Budget (3-second target)
          </p>
          <div className="space-y-2">
            {[
              { name: "Query preprocessing", pct: 3, color: "bg-gray-500", ms: "90ms" },
              { name: "RAG retrieval", pct: 10, color: "bg-cyan-500", ms: "300ms" },
              { name: "Context assembly", pct: 2, color: "bg-purple-500", ms: "60ms" },
              { name: "LLM generation", pct: 60, color: "bg-green-500", ms: "1,800ms" },
              { name: "Tool execution", pct: 17, color: "bg-yellow-500", ms: "510ms" },
              { name: "Post-processing", pct: 3, color: "bg-orange-500", ms: "90ms" },
              { name: "Network/overhead", pct: 5, color: "bg-muted", ms: "150ms" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-36 text-xs text-muted-foreground truncate">
                  {item.name}
                </span>
                <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-16 text-xs font-mono text-muted-foreground text-right">
                  {item.ms}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            LLM generation dominates at 60% of total latency. Optimize the
            prompt/context size first — a 50% reduction in input tokens can
            reduce LLM latency by 30-40%.
          </p>
        </CardContent>
      </Card>

      {/* Implementation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Implementation with OpenTelemetry Metrics</h3>
        <CodeBlock code={metricsSetupCode} label="Agent metrics collection" />
      </div>
    </div>
  );
}
