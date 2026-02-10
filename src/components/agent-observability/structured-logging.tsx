import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const logLevels = [
  {
    level: "ERROR",
    color: "text-red-600",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    when: "Unrecoverable failures — LLM API errors, tool crashes, rate limit exhaustion, context window overflow",
    example: '{"level":"error","traceId":"abc","event":"llm.error","error":"RateLimitExceeded","model":"gpt-4o","retries":3}',
  },
  {
    level: "WARN",
    color: "text-yellow-600",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    when: "Degraded behavior — slow responses, high token usage, tool retries, fallback to cheaper model, approaching context limits",
    example: '{"level":"warn","traceId":"abc","event":"context.high_usage","tokensUsed":95000,"limit":128000,"percentUsed":74}',
  },
  {
    level: "INFO",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    when: "Normal operations — request start/end, LLM call complete, tool execution success, agent step transitions",
    example: '{"level":"info","traceId":"abc","event":"tool.executed","tool":"search","latencyMs":245,"success":true,"results":5}',
  },
  {
    level: "DEBUG",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    when: "Detailed diagnostics — full prompts, retrieved documents, model parameters, embedding scores (disabled in production unless sampling)",
    example: '{"level":"debug","traceId":"abc","event":"rag.results","query":"refund policy","topScore":0.92,"chunks":["...truncated"]}',
  },
];

const structuredLogCode = `import pino from "pino";

// Create a base logger with default fields
const baseLogger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: "my-agent",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  },
});

// Create a request-scoped logger with trace context
export function createRequestLogger(traceId: string, userId?: string) {
  return baseLogger.child({
    traceId,
    userId,
    requestStartedAt: Date.now(),
  });
}

// Usage in agent code
async function handleRequest(input: string) {
  const traceId = crypto.randomUUID();
  const log = createRequestLogger(traceId, "usr_42");

  log.info({
    event: "agent.request.start",
    inputLength: input.length,
    inputPreview: input.slice(0, 100),
  });

  const llmStart = performance.now();
  const response = await llm.generate({
    model: "gpt-4o",
    messages: [{ role: "user", content: input }],
  });

  log.info({
    event: "llm.call.complete",
    model: "gpt-4o",
    latencyMs: Math.round(performance.now() - llmStart),
    inputTokens: response.usage.prompt_tokens,
    outputTokens: response.usage.completion_tokens,
    totalTokens: response.usage.total_tokens,
    finishReason: response.choices[0].finish_reason,
  });

  if (response.usage.total_tokens > 10000) {
    log.warn({
      event: "llm.high_token_usage",
      totalTokens: response.usage.total_tokens,
      threshold: 10000,
    });
  }

  return response;
}`;

const correlationCode = `// Correlation: connecting logs across services
import { AsyncLocalStorage } from "node:async_hooks";

interface RequestContext {
  traceId: string;
  spanId: string;
  userId: string;
  feature: string;
}

const contextStore = new AsyncLocalStorage<RequestContext>();

// Middleware: set context for entire request lifecycle
export function withRequestContext(
  traceId: string,
  userId: string,
  feature: string,
  fn: () => Promise<void>,
) {
  const ctx: RequestContext = {
    traceId,
    spanId: crypto.randomUUID().slice(0, 8),
    userId,
    feature,
  };

  return contextStore.run(ctx, fn);
}

// Logger automatically includes request context
export function getLogger() {
  const ctx = contextStore.getStore();
  if (!ctx) return baseLogger;

  return baseLogger.child({
    traceId: ctx.traceId,
    spanId: ctx.spanId,
    userId: ctx.userId,
    feature: ctx.feature,
  });
}

// Any function in the call stack can get a correlated logger
async function searchDocuments(query: string) {
  const log = getLogger(); // Automatically has traceId, userId, etc.
  log.info({ event: "rag.search.start", query });

  const results = await vectorDB.search(query);
  log.info({
    event: "rag.search.complete",
    resultCount: results.length,
    topScore: results[0]?.score,
  });

  return results;
}`;

export function StructuredLogging() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Structured logging</strong> means emitting logs as typed,
          machine-parseable JSON objects instead of freeform text strings.
          Every log entry has a consistent schema with fields for trace ID,
          event type, timestamps, and relevant metadata.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The difference is stark:{" "}
          <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">console.log(&quot;Tool failed: search&quot;)</code>{" "}
          is a dead end for debugging.{" "}
          <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">{`{"event":"tool.error","tool":"search","error":"timeout","latencyMs":5000,"traceId":"abc"}`}</code>{" "}
          can be queried, aggregated, alerted on, and correlated with other events.
        </p>
      </div>

      {/* Structured vs Unstructured */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-4">Structured vs Unstructured</Badge>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">
                Unstructured (text strings)
              </p>
              <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/70 leading-loose whitespace-pre-wrap">
{`[2025-07-15 14:32:01] Agent started
[2025-07-15 14:32:01] Input: What's my balance?
[2025-07-15 14:32:02] Calling GPT-4o...
[2025-07-15 14:32:04] Got response (took 2.1s)
[2025-07-15 14:32:04] Using 4521 tokens
[2025-07-15 14:32:04] Calling tool: get_account
[2025-07-15 14:32:05] Tool returned data
[2025-07-15 14:32:05] Done!`}
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                Can&apos;t filter, can&apos;t aggregate, can&apos;t correlate across requests.
                Finding &quot;all requests slower than 5 seconds&quot; means parsing text.
              </p>
            </div>
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3">
                Structured (JSON objects)
              </p>
              <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/70 leading-loose whitespace-pre-wrap">
{`{"traceId":"a1b","event":"agent.start","ts":1721...}
{"traceId":"a1b","event":"llm.call","model":"gpt-4o",
 "latencyMs":2100,"tokens":4521,"cost":0.032}
{"traceId":"a1b","event":"tool.call","tool":"get_account",
 "latencyMs":890,"success":true}
{"traceId":"a1b","event":"agent.complete",
 "totalLatencyMs":3200,"totalCost":0.032}`}
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                Every field is queryable. Find slow requests: <code className="text-xs bg-muted/50 px-1 rounded">latencyMs &gt; 5000</code>.
                Cost by model: <code className="text-xs bg-muted/50 px-1 rounded">sum(cost) group by model</code>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Levels for Agents */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Log Levels for AI Agents</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Traditional log levels need reinterpretation for agents. A
          &quot;warning&quot; isn&apos;t just &quot;something might be wrong&quot; — it&apos;s
          &quot;the agent is degrading in a way that affects user experience.&quot;
        </p>
        <div className="space-y-3">
          {logLevels.map((level) => (
            <Card key={level.level} className={`bg-card/50 ${level.border}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className={`${level.color} border-current font-mono`}>
                    {level.level}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  <strong>When to use:</strong> {level.when}
                </p>
                <div className="bg-[#0d1117] rounded-md p-2 font-mono text-[10px] text-[#e6edf3]/70 leading-relaxed overflow-x-auto">
                  {level.example}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Implementation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Implementation with Pino</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Pino is the fastest structured logging library for Node.js — zero
          overhead in production. Use child loggers to propagate trace context
          without manually passing IDs everywhere.
        </p>
        <CodeBlock code={structuredLogCode} label="Structured logging with Pino" />
      </div>

      {/* Correlation IDs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Correlation IDs with AsyncLocalStorage</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The hardest part of logging is propagating trace context through
          deeply nested function calls. Node.js&apos;s{" "}
          <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">AsyncLocalStorage</code>{" "}
          solves this — any function in the async call stack can access the
          current request&apos;s trace context without explicit parameter passing.
        </p>
        <CodeBlock code={correlationCode} label="Automatic context propagation" />
      </div>

      {/* What to Log */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">What to Log (and What Not To)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                Always Log
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Request start/end with latency</li>
                <li>LLM calls: model, tokens, latency, finish reason</li>
                <li>Tool calls: name, latency, success/failure</li>
                <li>Errors: type, message, retry count</li>
                <li>Cost: per-request calculated cost</li>
                <li>Decisions: why a tool or model was selected</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                Never Log (or log with caution)
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Full user messages (PII risk — truncate or hash)</li>
                <li>Full LLM outputs (storage cost — log length only)</li>
                <li>API keys or auth tokens</li>
                <li>Full RAG document contents (log metadata only)</li>
                <li>Full system prompts (version reference instead)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
