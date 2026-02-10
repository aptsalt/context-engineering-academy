export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const chapters: Chapter[] = [
  {
    id: "what-is-observability",
    number: 1,
    title: "What is Agent Observability?",
    subtitle: "Why logging isn't enough for AI agents",
    icon: "eye",
  },
  {
    id: "tracing-fundamentals",
    number: 2,
    title: "Tracing Agent Execution",
    subtitle: "Following the chain from input to output",
    icon: "route",
  },
  {
    id: "structured-logging",
    number: 3,
    title: "Structured Logging",
    subtitle: "Logs that machines and humans can read",
    icon: "file-text",
  },
  {
    id: "metrics-kpis",
    number: 4,
    title: "Metrics & KPIs for Agents",
    subtitle: "Latency, token usage, success rates, cost",
    icon: "bar-chart",
  },
  {
    id: "debugging-failures",
    number: 5,
    title: "Debugging Agent Failures",
    subtitle: "Root cause analysis for non-deterministic systems",
    icon: "bug",
  },
  {
    id: "observability-tools",
    number: 6,
    title: "Observability Tools",
    subtitle: "LangSmith, Phoenix, Langfuse, Braintrust",
    icon: "wrench",
  },
  {
    id: "dashboards",
    number: 7,
    title: "Building Dashboards",
    subtitle: "Real-time visibility into agent performance",
    icon: "layout-dashboard",
  },
  {
    id: "production-monitoring",
    number: 8,
    title: "Production Monitoring",
    subtitle: "Alerts, anomaly detection, and incident response",
    icon: "bell",
  },
  {
    id: "cost-tracking",
    number: 9,
    title: "Cost Tracking & Optimization",
    subtitle: "Know where every token dollar goes",
    icon: "dollar-sign",
  },
  {
    id: "interactive-examples",
    number: 10,
    title: "Interactive Examples",
    subtitle: "See observability patterns in action with live code",
    icon: "code",
  },
  {
    id: "anti-patterns",
    number: 11,
    title: "Anti-Patterns & Failure Modes",
    subtitle: "Log blindness, metric vanity, and how to avoid them",
    icon: "warning",
  },
  {
    id: "best-practices",
    number: 12,
    title: "Best Practices Checklist",
    subtitle: "Production-ready observability guidelines",
    icon: "check",
  },
  {
    id: "resources",
    number: 13,
    title: "Resources & Further Reading",
    subtitle: "Tools, docs, repos, and guides",
    icon: "book",
  },
];

export interface Quote {
  text: string;
  author: string;
  role: string;
}

export const quotes: Quote[] = [
  {
    text: "Observability is not about collecting data. It's about being able to ask arbitrary questions about your system without deploying new code.",
    author: "Charity Majors",
    role: "CTO, Honeycomb",
  },
  {
    text: "The hardest bugs in AI systems are the ones where the model confidently does the wrong thing. Without tracing, you'll never know why.",
    author: "Harrison Chase",
    role: "CEO, LangChain",
  },
  {
    text: "If you can't see what your agent is doing at every step, you don't have a production system. You have a demo.",
    author: "Jason Liu",
    role: "Creator, Instructor (structured outputs)",
  },
];

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  category: string;
  bad: {
    label: string;
    code: string;
    explanation: string;
  };
  good: {
    label: string;
    code: string;
    explanation: string;
  };
}

export const codeExamples: CodeExample[] = [
  {
    id: "basic-logging",
    title: "Agent Logging",
    description: "Capturing agent execution details",
    category: "Logging",
    bad: {
      label: "Unstructured console.log",
      code: `// BAD: Unstructured logging that's impossible to query
async function runAgent(input: string) {
  console.log("Starting agent...");
  console.log("Input: " + input);

  const response = await llm.generate({ messages: [{ role: "user", content: input }] });
  console.log("Got response: " + response.text);

  if (response.toolCalls.length > 0) {
    console.log("Tool calls: " + JSON.stringify(response.toolCalls));
    for (const call of response.toolCalls) {
      const result = await executeTool(call);
      console.log("Tool result: " + JSON.stringify(result));
    }
  }

  console.log("Done!");
  return response;
}`,
      explanation:
        "Unstructured console.log produces flat text that can't be queried, aggregated, or correlated. When something fails in production at 3 AM, you're grepping through megabytes of text with no way to filter by request, trace, or severity.",
    },
    good: {
      label: "Structured logging with correlation",
      code: `// GOOD: Structured, correlated, queryable logs
import { logger } from "@/lib/logger";

async function runAgent(input: string, traceId: string) {
  const log = logger.child({ traceId, component: "agent" });

  log.info({ event: "agent.start", inputLength: input.length });

  const startTime = performance.now();
  const response = await llm.generate({
    messages: [{ role: "user", content: input }],
  });
  const latencyMs = performance.now() - startTime;

  log.info({
    event: "llm.response",
    model: response.model,
    latencyMs,
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
    toolCallCount: response.toolCalls.length,
  });

  for (const call of response.toolCalls) {
    const toolStart = performance.now();
    const result = await executeTool(call);
    log.info({
      event: "tool.execution",
      toolName: call.name,
      latencyMs: performance.now() - toolStart,
      success: result.success,
    });
  }

  return response;
}`,
      explanation:
        "Structured logs use JSON with consistent fields. Every log entry includes a traceId for correlation, event types for filtering, and measured values (latency, tokens) for aggregation. You can query 'show me all tool executions slower than 2s in the last hour' instantly.",
    },
  },
  {
    id: "tracing",
    title: "Distributed Tracing",
    description: "Tracing multi-step agent executions",
    category: "Tracing",
    bad: {
      label: "No tracing — black box execution",
      code: `// BAD: No visibility into execution flow
async function handleUserQuery(query: string) {
  const plan = await planner.createPlan(query);
  const results = [];

  for (const step of plan.steps) {
    const result = await executeStep(step);
    results.push(result);
  }

  const answer = await synthesizer.combine(results, query);
  return answer;
  // If the answer is wrong, which step failed?
  // How long did each step take?
  // What context did each step see?
  // No way to know.
}`,
      explanation:
        "Without tracing, a multi-step agent is a black box. When the final answer is wrong, you can't tell if the planner made a bad plan, a tool returned bad data, or the synthesizer hallucinated. You're flying blind.",
    },
    good: {
      label: "OpenTelemetry-style tracing",
      code: `// GOOD: Full trace tree with spans for each step
import { trace } from "@/lib/telemetry";

async function handleUserQuery(query: string) {
  return trace.startSpan("agent.query", { input: query }, async (rootSpan) => {
    const plan = await trace.startSpan(
      "agent.plan",
      { query, parentSpan: rootSpan },
      async (planSpan) => {
        const result = await planner.createPlan(query);
        planSpan.setAttributes({
          stepCount: result.steps.length,
          planStrategy: result.strategy,
        });
        return result;
      }
    );

    const results = [];
    for (const [i, step] of plan.steps.entries()) {
      const result = await trace.startSpan(
        \`agent.step.\${step.type}\`,
        { stepIndex: i, tool: step.tool, parentSpan: rootSpan },
        async (stepSpan) => {
          const output = await executeStep(step);
          stepSpan.setAttributes({
            success: output.success,
            outputTokens: output.tokens,
          });
          return output;
        }
      );
      results.push(result);
    }

    return trace.startSpan(
      "agent.synthesize",
      { resultCount: results.length, parentSpan: rootSpan },
      async () => synthesizer.combine(results, query)
    );
  });
}`,
      explanation:
        "Each operation becomes a span in a trace tree. You can see the full execution path, how long each step took, what inputs/outputs flowed between steps, and exactly where a failure occurred. This is the foundation of agent debugging.",
    },
  },
  {
    id: "metrics",
    title: "Agent Metrics Collection",
    description: "Tracking the right KPIs for agent performance",
    category: "Metrics",
    bad: {
      label: "Only tracking success/failure",
      code: `// BAD: Binary success tracking tells you nothing useful
let successCount = 0;
let failureCount = 0;

async function runAgent(input: string) {
  try {
    const result = await agent.execute(input);
    successCount++;
    return result;
  } catch (error) {
    failureCount++;
    throw error;
  }
}

// Dashboard shows: 94% success rate
// But: Is that good? Are successful responses actually correct?
// Are some requests 10x more expensive than others?
// Is latency creeping up? No idea.`,
      explanation:
        "A single success/failure counter is a vanity metric. It tells you nothing about response quality, cost efficiency, latency distribution, or which types of queries are problematic. You'll think everything is fine until users start complaining.",
    },
    good: {
      label: "Multi-dimensional metrics with histograms",
      code: `// GOOD: Comprehensive agent metrics
import { metrics } from "@/lib/telemetry";

const agentLatency = metrics.createHistogram("agent.latency_ms", {
  buckets: [100, 250, 500, 1000, 2500, 5000, 10000],
});
const tokenUsage = metrics.createHistogram("agent.tokens", {
  buckets: [100, 500, 1000, 5000, 10000, 50000],
});
const toolCallCounter = metrics.createCounter("agent.tool_calls");
const costGauge = metrics.createGauge("agent.cost_usd");

async function runAgent(input: string, userId: string) {
  const startTime = performance.now();
  const labels = { model: "gpt-4o", userId };

  try {
    const result = await agent.execute(input);
    const latencyMs = performance.now() - startTime;

    agentLatency.record(latencyMs, labels);
    tokenUsage.record(result.usage.totalTokens, {
      ...labels,
      type: "total",
    });
    costGauge.set(result.usage.estimatedCost, labels);

    for (const tool of result.toolCalls) {
      toolCallCounter.add(1, {
        ...labels,
        toolName: tool.name,
        success: String(tool.success),
      });
    }

    return result;
  } catch (error) {
    agentLatency.record(performance.now() - startTime, {
      ...labels,
      error: "true",
    });
    throw error;
  }
}`,
      explanation:
        "Histograms reveal latency distributions (p50, p95, p99), not just averages. Counters with labels let you slice metrics by model, user, tool, and error state. Cost tracking per request enables budget alerts. This is what production observability looks like.",
    },
  },
  {
    id: "error-context",
    title: "Error Context Capture",
    description: "Capturing enough context to debug failures",
    category: "Debugging",
    bad: {
      label: "Swallowing errors with generic messages",
      code: `// BAD: Generic error handling that hides root cause
async function agentHandler(req: Request) {
  try {
    const result = await runAgent(req.body.input);
    return Response.json({ result });
  } catch (error) {
    console.error("Agent failed:", error);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
  // When this fires at 3 AM:
  // - What was the input?
  // - Which LLM call failed?
  // - What was the context window state?
  // - Was it a rate limit, timeout, or hallucination?
  // Nobody knows.
}`,
      explanation:
        "Generic error messages destroy debugging context. When you see 'Agent failed: Error: request failed' in your logs, you have no idea what the input was, which step failed, what the model saw, or what caused the failure. Every error investigation starts from zero.",
    },
    good: {
      label: "Rich error context with full state capture",
      code: `// GOOD: Capture full debugging context on failure
async function agentHandler(req: Request) {
  const traceId = crypto.randomUUID();
  const log = logger.child({ traceId, path: req.url });

  try {
    const input = req.body.input;
    log.info({ event: "request.start", inputLength: input.length });

    const result = await runAgent(input, traceId);
    return Response.json({ result, traceId });
  } catch (error) {
    const errorContext = {
      event: "request.error",
      errorType: error.constructor.name,
      errorMessage: error.message,
      input: req.body.input?.slice(0, 500),
      stack: error.stack,
      modelState: {
        lastModel: error.modelId,
        lastTokenUsage: error.tokenUsage,
        contextWindowUsed: error.contextTokens,
      },
      agentState: {
        stepsCompleted: error.completedSteps,
        lastToolCall: error.lastToolCall,
        retryCount: error.retries,
      },
    };

    log.error(errorContext);

    // Store full context for replay debugging
    await debugStore.save(traceId, {
      input: req.body.input,
      messages: error.messages,
      toolResults: error.toolResults,
      timestamp: Date.now(),
    });

    return Response.json(
      { error: "Agent execution failed", traceId },
      { status: 500 }
    );
  }
}`,
      explanation:
        "Rich error context captures everything you need: the input, which step failed, what the model saw, token usage at failure time, and the full message history for replay. The traceId lets you correlate across logs, traces, and the debug store.",
    },
  },
  {
    id: "cost-tracking",
    title: "Cost Attribution",
    description: "Tracking token costs per feature and user",
    category: "Cost",
    bad: {
      label: "Monthly bill surprise",
      code: `// BAD: No cost tracking — just check the bill monthly
async function runAgent(input: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: input },
    ],
  });

  return response.choices[0].message.content;
}

// End of month: "$47,000 OpenAI bill"
// CEO: "Why did costs 3x from last month?"
// Team: "...we don't know which feature or user caused it"`,
      explanation:
        "Without per-request cost tracking, you discover cost problems at the end of the billing cycle. You can't identify which features, users, or conversations are expensive. One runaway loop or verbose system prompt can blow your budget silently.",
    },
    good: {
      label: "Per-request cost attribution with alerts",
      code: `// GOOD: Track cost per request, user, and feature
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 2.50, output: 10.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "claude-sonnet-4-20250514": { input: 3.00, output: 15.00 },
};

async function runAgent(input: string, context: RequestContext) {
  const response = await openai.chat.completions.create({
    model: context.model,
    messages: context.messages,
  });

  const pricing = MODEL_COSTS[context.model];
  const costUsd =
    (response.usage.prompt_tokens / 1_000_000) * pricing.input +
    (response.usage.completion_tokens / 1_000_000) * pricing.output;

  await metrics.recordCost({
    traceId: context.traceId,
    userId: context.userId,
    feature: context.feature,
    model: context.model,
    inputTokens: response.usage.prompt_tokens,
    outputTokens: response.usage.completion_tokens,
    costUsd,
    timestamp: Date.now(),
  });

  // Alert if single request exceeds threshold
  if (costUsd > 0.50) {
    await alerts.warn({
      type: "high_cost_request",
      traceId: context.traceId,
      costUsd,
      userId: context.userId,
    });
  }

  return response.choices[0].message.content;
}`,
      explanation:
        "Per-request cost attribution lets you answer 'which feature costs the most?' and 'which users are most expensive?' instantly. Budget alerts catch runaway requests before they blow up. You can set per-user daily limits and per-feature cost budgets.",
    },
  },
  {
    id: "dashboard-metrics",
    title: "Dashboard Design",
    description: "Building actionable observability dashboards",
    category: "Dashboards",
    bad: {
      label: "Vanity metrics dashboard",
      code: `// BAD: Dashboard that looks pretty but isn't actionable
const dashboard = {
  panels: [
    { title: "Total Requests", query: "count(agent.requests)" },
    { title: "Success Rate", query: "avg(agent.success)" },
    { title: "Avg Latency", query: "avg(agent.latency_ms)" },
  ],
};
// Problems:
// - "Total Requests" is just a number going up
// - "Success Rate" hides quality issues (success != correct)
// - "Avg Latency" masks p99 outliers
// - No breakdown by model, feature, or error type
// - No cost visibility
// - No alerting thresholds`,
      explanation:
        "Vanity dashboards show numbers that always look good but never help you find problems. Average latency hides the fact that 1% of requests take 30 seconds. Success rate doesn't measure whether 'successful' responses were actually correct or useful.",
    },
    good: {
      label: "Actionable SRE-style dashboard",
      code: `// GOOD: Dashboard panels that drive action
const dashboard = {
  row1_health: [
    {
      title: "Request Rate (rpm)",
      query: "rate(agent.requests[5m])",
      alert: { condition: "< 10 or > 1000", severity: "warning" },
    },
    {
      title: "Error Rate by Type",
      query: "rate(agent.errors[5m]) by (error_type)",
      alert: { condition: "> 5%", severity: "critical" },
    },
    {
      title: "Latency Distribution (p50/p95/p99)",
      query: "histogram_quantile([0.5, 0.95, 0.99], agent.latency_ms)",
      alert: { condition: "p99 > 10000", severity: "warning" },
    },
  ],
  row2_quality: [
    {
      title: "Tool Call Success Rate by Tool",
      query: "rate(agent.tool_calls{success='true'}[5m]) by (tool_name)",
    },
    {
      title: "Hallucination Rate (eval-flagged)",
      query: "rate(agent.eval{result='hallucination'}[1h])",
      alert: { condition: "> 2%", severity: "critical" },
    },
  ],
  row3_cost: [
    {
      title: "Cost per Hour by Model",
      query: "sum(agent.cost_usd[1h]) by (model)",
      alert: { condition: "> 50", severity: "warning" },
    },
    {
      title: "Tokens per Request (input vs output)",
      query: "avg(agent.tokens) by (type)",
    },
    {
      title: "Cost per User (top 10)",
      query: "topk(10, sum(agent.cost_usd[24h]) by (user_id))",
    },
  ],
};`,
      explanation:
        "Actionable dashboards are organized by concern (health, quality, cost) with alerting thresholds on each panel. Latency uses percentiles instead of averages. Errors are broken down by type. Cost is attributed per model and user. Every panel answers a specific operational question.",
    },
  },
  {
    id: "alerting",
    title: "Intelligent Alerting",
    description: "Alerts that wake you up for the right reasons",
    category: "Monitoring",
    bad: {
      label: "Alert on every error",
      code: `// BAD: Alert fatigue from noisy rules
const alerts = [
  { name: "Any Error", condition: "agent.errors > 0", action: "page_oncall" },
  { name: "Slow Request", condition: "agent.latency > 1000", action: "page_oncall" },
  { name: "High Tokens", condition: "agent.tokens > 5000", action: "page_oncall" },
];

// Result: 200+ alerts per day
// On-call engineer mutes all alerts after day 1
// Real incident at 2 AM goes unnoticed because alerts are muted`,
      explanation:
        "Alerting on every error or threshold breach creates alert fatigue. When everything is urgent, nothing is. The on-call engineer either mutes alerts or stops responding. Critical incidents get lost in the noise.",
    },
    good: {
      label: "Tiered alerting with burn-rate SLOs",
      code: `// GOOD: SLO-based alerting with severity tiers
interface AlertRule {
  name: string;
  condition: string;
  window: string;
  severity: "info" | "warning" | "critical";
  action: "log" | "slack" | "page_oncall";
  runbook: string;
}

const alerts: AlertRule[] = [
  {
    name: "Error Budget Burn Rate (fast)",
    condition: "error_rate_1h > 14.4 * monthly_budget",
    window: "1h",
    severity: "critical",
    action: "page_oncall",
    runbook: "https://wiki/runbooks/agent-error-budget",
  },
  {
    name: "Error Budget Burn Rate (slow)",
    condition: "error_rate_6h > 6 * monthly_budget",
    window: "6h",
    severity: "warning",
    action: "slack",
    runbook: "https://wiki/runbooks/agent-error-budget",
  },
  {
    name: "Latency SLO Breach",
    condition: "p99_latency_5m > 15000 for 10m",
    window: "10m",
    severity: "critical",
    action: "page_oncall",
    runbook: "https://wiki/runbooks/agent-latency",
  },
  {
    name: "Cost Anomaly",
    condition: "hourly_cost > 2 * avg_hourly_cost_7d",
    window: "1h",
    severity: "warning",
    action: "slack",
    runbook: "https://wiki/runbooks/agent-cost",
  },
];`,
      explanation:
        "SLO-based alerting with burn rates means you're alerted based on how fast you're consuming your error budget, not on individual errors. Tiered severity routes info to logs, warnings to Slack, and only critical issues page the on-call. Every alert has a runbook link.",
    },
  },
];

export interface AntiPattern {
  name: string;
  icon: string;
  description: string;
  cause: string;
  symptom: string;
  fix: string;
  severity: "critical" | "high" | "medium";
}

export const antiPatterns: AntiPattern[] = [
  {
    name: "Log Blindness",
    icon: "eye-off",
    description:
      "Agent runs in production with no structured logging, making it impossible to understand what happened after the fact.",
    cause:
      "Using console.log with unstructured strings, or not logging at all. No correlation IDs between related log entries. Logging the wrong things (raw prompts instead of metadata).",
    symptom:
      "When a user reports a bad response, the team spends hours trying to reproduce it. Debugging requires reading raw log files with grep. No way to answer 'what did the agent see when it made this decision?'",
    fix: "Implement structured logging from day one. Every log entry should be JSON with a traceId, event type, timestamp, and relevant metadata. Use a logging library like Pino or Winston with child loggers for context propagation.",
    severity: "critical",
  },
  {
    name: "Trace Fragmentation",
    icon: "unlink",
    description:
      "Multi-step agent executions have no parent-child relationships, making it impossible to reconstruct the full execution path.",
    cause:
      "Each LLM call and tool execution is logged independently without a shared trace ID. When the agent calls a tool that calls another service, the trace breaks.",
    symptom:
      "You can see individual LLM calls but can't connect them into a full agent execution. Debugging a 5-step agent requires manually correlating timestamps across different log streams.",
    fix: "Use distributed tracing (OpenTelemetry) with span hierarchies. Every agent execution gets a root span, and each LLM call, tool execution, and sub-agent invocation gets a child span with the parent's trace context propagated.",
    severity: "critical",
  },
  {
    name: "Metric Vanity",
    icon: "trending-up",
    description:
      "Dashboards show impressive numbers (total requests, average latency, success rate) that never reveal actual problems.",
    cause:
      "Tracking averages instead of percentiles. Counting 'success' as 'didn't throw an error' rather than 'produced a correct response'. No breakdown by feature, model, or user segment.",
    symptom:
      "Dashboard shows 99% success rate and 500ms average latency while users complain about slow, wrong answers. P99 latency is actually 15 seconds. 'Successful' responses include hallucinated answers.",
    fix: "Replace averages with percentile distributions (p50, p95, p99). Define 'success' as verified-correct, not just non-error. Break down every metric by model, feature, user segment, and error type. If a metric can't trigger an action, remove it from the dashboard.",
    severity: "high",
  },
  {
    name: "Cost Ignorance",
    icon: "credit-card",
    description:
      "No per-request or per-feature cost tracking. The team discovers cost problems when the monthly invoice arrives.",
    cause:
      "Token usage and model pricing aren't tracked at the request level. No cost attribution to features, users, or conversations. No budget alerts or spending limits.",
    symptom:
      "Monthly LLM bill doubles with no explanation. One verbose system prompt or retry loop silently consumes thousands of dollars. The team can't answer 'which feature costs the most?' or 'which users are most expensive?'",
    fix: "Calculate cost per request using model pricing tables. Attribute costs to features, users, and conversation IDs. Set per-request cost alerts (e.g., flag anything over $0.50). Implement daily budget caps per feature and user.",
    severity: "high",
  },
  {
    name: "Alert Fatigue",
    icon: "bell-off",
    description:
      "Too many low-quality alerts cause the on-call team to mute notifications, missing critical incidents.",
    cause:
      "Alerting on every individual error instead of error rates. No severity tiers. No distinction between transient failures and systematic problems. Static thresholds instead of anomaly detection.",
    symptom:
      "200+ alerts per day, all with the same severity. On-call engineer mutes Slack channel after the first shift. A real production incident at 2 AM goes unnoticed for hours because nobody is watching.",
    fix: "Use SLO-based alerting with error budget burn rates. Tier alerts: info goes to logs, warnings go to Slack, only critical issues page on-call. Every alert must have a runbook. If an alert fires more than 5 times without action, fix it or delete it.",
    severity: "high",
  },
  {
    name: "Replay Impossibility",
    icon: "rewind",
    description:
      "When an agent produces a bad result, it's impossible to reproduce because the exact inputs, context, and state aren't captured.",
    cause:
      "Not storing the full message history, tool results, and retrieved documents that the agent saw at execution time. Relying on 'just re-run it' in a non-deterministic system.",
    symptom:
      "User reports a bad answer. Developer tries to reproduce it with the same input but gets a different (correct) answer. The bug can't be investigated because the original context is gone forever.",
    fix: "Store the full execution context (input, system prompt, messages, tool results, retrieved documents, model parameters) for every request, keyed by trace ID. Build a replay tool that can feed this exact context back to the model for deterministic debugging.",
    severity: "medium",
  },
];

export interface BestPractice {
  category: string;
  items: { title: string; description: string }[];
}

export const bestPractices: BestPractice[] = [
  {
    category: "Tracing & Logging",
    items: [
      {
        title: "Assign a trace ID to every request from the start",
        description:
          "Generate a UUID at the API gateway and propagate it through every LLM call, tool execution, and sub-agent invocation. This is the single most important observability practice.",
      },
      {
        title: "Use structured JSON logs, never console.log",
        description:
          "Every log entry should be a JSON object with traceId, timestamp, event type, and relevant metadata. Use libraries like Pino (Node.js) for zero-overhead structured logging.",
      },
      {
        title: "Log decisions, not just actions",
        description:
          "Don't just log 'called tool X'. Log why: 'selected tool X because query matched pattern Y with confidence 0.87'. Decision context is the most valuable debugging information.",
      },
      {
        title: "Implement trace sampling in high-volume production",
        description:
          "At scale, tracing every request is expensive. Sample 10-20% of normal traffic, but always trace 100% of errors and slow requests (tail-based sampling).",
      },
    ],
  },
  {
    category: "Metrics & Dashboards",
    items: [
      {
        title: "Track percentiles, not averages",
        description:
          "P50, P95, and P99 latencies reveal what users actually experience. An average of 500ms hides the fact that 1% of requests take 30 seconds.",
      },
      {
        title: "Define 'success' as verified-correct, not non-error",
        description:
          "An LLM response that doesn't throw an error but hallucinates an answer is not a success. Use eval-based quality checks to track actual correctness.",
      },
      {
        title: "Break down every metric by model, feature, and user segment",
        description:
          "Aggregate metrics hide problems. A 95% success rate overall might mean 99% for simple queries and 70% for complex reasoning tasks.",
      },
      {
        title: "Build dashboards organized by concern",
        description:
          "Group panels into health (latency, errors, throughput), quality (correctness, hallucination rate), and cost (tokens, spend). Every panel should answer a specific operational question.",
      },
    ],
  },
  {
    category: "Alerting & Incident Response",
    items: [
      {
        title: "Use SLO-based alerting with error budget burn rates",
        description:
          "Alert based on how fast you're consuming your error budget, not on individual errors. A fast burn (14.4x budget/hour) pages immediately. A slow burn (6x budget/6h) sends a Slack notification.",
      },
      {
        title: "Every alert must have a runbook",
        description:
          "An alert without a runbook is just noise. Document what the alert means, likely causes, and step-by-step investigation and remediation procedures.",
      },
      {
        title: "Tier alert severity and routing",
        description:
          "Info goes to logs, warnings go to Slack, only critical issues page on-call. If everything is critical, nothing is.",
      },
      {
        title: "Conduct post-incident reviews for AI-specific failures",
        description:
          "Traditional post-mortems need adaptation for AI systems. Include: what context did the agent see? Was it a model failure or a context failure? Would better observability have caught this earlier?",
      },
    ],
  },
  {
    category: "Debugging & Root Cause Analysis",
    items: [
      {
        title: "Classify every failure: model, context, tool, or orchestration",
        description:
          "The fix depends on the failure type. A hallucination (model failure) needs a different fix than missing RAG documents (context failure) or a tool timeout (tool failure). Trace-based debugging makes classification possible.",
      },
      {
        title: "Store full execution context for replay debugging",
        description:
          "Capture the input, system prompt, messages, tool results, and model parameters for every request (or a sample). This enables reproducing non-deterministic failures by feeding the exact same context back to the model.",
      },
      {
        title: "Build a debugging workflow that starts from the trace",
        description:
          "Every investigation should start with the trace ID. Pull up the trace tree, identify the failing span, inspect its inputs and outputs, classify the failure, and then fix. Never start by guessing.",
      },
      {
        title: "Add failing cases to your eval dataset automatically",
        description:
          "When you debug and fix a failure, add the input/expected output pair to your evaluation dataset. This prevents regression and builds a growing safety net of test cases from real production issues.",
      },
    ],
  },
  {
    category: "Cost & Performance Optimization",
    items: [
      {
        title: "Track cost per request, per feature, and per user",
        description:
          "Calculate cost using model pricing tables at the request level. Attribute to features and users. This is the only way to answer 'where is the money going?'",
      },
      {
        title: "Set budget alerts and per-request cost caps",
        description:
          "Alert when a single request exceeds $0.50 or when hourly spend exceeds 2x the 7-day average. Implement circuit breakers for runaway costs.",
      },
      {
        title: "Monitor token efficiency over time",
        description:
          "Track the ratio of useful output tokens to total tokens consumed. A rising ratio means your context engineering is improving. A falling ratio means you're wasting tokens on noise.",
      },
      {
        title: "Implement model routing based on complexity",
        description:
          "Not every request needs GPT-4o. Route simple queries to cheaper models and save expensive models for complex reasoning. Track cost savings from routing decisions.",
      },
    ],
  },
];

export interface Resource {
  title: string;
  url: string;
  type: "tool" | "blog" | "docs" | "repo" | "guide";
  source: string;
  description: string;
}

export const resources: Resource[] = [
  {
    title: "Langfuse — Open Source LLM Observability",
    url: "https://langfuse.com",
    type: "tool",
    source: "Langfuse",
    description:
      "Open-source LLM observability platform with tracing, prompt management, evaluations, and cost tracking. Self-hostable.",
  },
  {
    title: "LangSmith — LangChain Observability Platform",
    url: "https://smith.langchain.com",
    type: "tool",
    source: "LangChain",
    description:
      "Production monitoring and debugging platform for LLM applications. Deep integration with LangChain/LangGraph but works with any framework.",
  },
  {
    title: "Arize Phoenix — ML & LLM Observability",
    url: "https://phoenix.arize.com",
    type: "tool",
    source: "Arize AI",
    description:
      "Open-source observability for LLMs with trace visualization, retrieval analysis, and evaluation tools. Built for debugging RAG and agent systems.",
  },
  {
    title: "Helicone — LLM Gateway & Observability",
    url: "https://helicone.ai",
    type: "tool",
    source: "Helicone",
    description:
      "Proxy-based LLM observability that requires just one line of code. Automatic cost tracking, latency monitoring, and request logging.",
  },
  {
    title: "Braintrust — AI Product Evaluation",
    url: "https://braintrust.dev",
    type: "tool",
    source: "Braintrust",
    description:
      "End-to-end platform for evaluating, monitoring, and improving AI products. Combines evals, logging, and prompt playground.",
  },
  {
    title: "OpenTelemetry for LLM Observability",
    url: "https://opentelemetry.io/docs/languages/js/",
    type: "docs",
    source: "OpenTelemetry",
    description:
      "The vendor-neutral standard for distributed tracing. Use OTEL SDKs to instrument your agents and export to any backend.",
  },
  {
    title: "OpenLLMetry — OpenTelemetry for LLMs",
    url: "https://github.com/traceloop/openllmetry",
    type: "repo",
    source: "Traceloop",
    description:
      "Open-source auto-instrumentation for LLM frameworks using OpenTelemetry. Automatically traces LangChain, OpenAI, and more.",
  },
  {
    title: "Honeycomb Guide to Observability",
    url: "https://www.honeycomb.io/what-is-observability",
    type: "guide",
    source: "Honeycomb",
    description:
      "Charity Majors' team explains the difference between monitoring and observability. Essential reading for understanding observability principles.",
  },
  {
    title: "Observability for LLM-based Agents",
    url: "https://blog.langchain.com/observability-for-llm-applications/",
    type: "blog",
    source: "LangChain",
    description:
      "LangChain's guide to building observable LLM applications. Covers tracing, evaluation, and production monitoring patterns.",
  },
  {
    title: "Building Observable AI Systems",
    url: "https://www.anthropic.com/engineering",
    type: "blog",
    source: "Anthropic",
    description:
      "Anthropic's engineering blog with insights on building production AI systems including monitoring and evaluation best practices.",
  },
];
