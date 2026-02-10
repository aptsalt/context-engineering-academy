import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const costBreakdown = [
  { name: "LLM Input Tokens", pct: 35, color: "bg-blue-500", detail: "System prompt + conversation history + RAG docs + tool definitions" },
  { name: "LLM Output Tokens", pct: 25, color: "bg-green-500", detail: "Model responses + reasoning tokens (3-5x input cost per token)" },
  { name: "Retries & Fallbacks", pct: 15, color: "bg-red-500", detail: "Failed requests that still consume tokens before failing" },
  { name: "Embedding Generation", pct: 10, color: "bg-purple-500", detail: "Query and document embeddings for RAG retrieval" },
  { name: "Tool API Calls", pct: 10, color: "bg-yellow-500", detail: "Third-party APIs called by agent tools (search, DB, etc.)" },
  { name: "Infrastructure", pct: 5, color: "bg-muted", detail: "Vector DB hosting, observability storage, compute" },
];

const modelPricing = [
  { model: "GPT-4o", input: "$2.50", output: "$10.00", use: "Complex reasoning, coding" },
  { model: "GPT-4o-mini", input: "$0.15", output: "$0.60", use: "Simple tasks, classification" },
  { model: "Claude Sonnet 4", input: "$3.00", output: "$15.00", use: "Complex analysis, coding" },
  { model: "Claude Haiku 3.5", input: "$0.80", output: "$4.00", use: "Quick tasks, routing" },
  { model: "Gemini 2.0 Flash", input: "$0.10", output: "$0.40", use: "High-volume, simple" },
];

const optimizationStrategies = [
  {
    name: "Model Routing by Complexity",
    impact: "40-70% cost reduction",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Not every request needs GPT-4o. Route simple queries (FAQ, classification, extraction) to cheaper models and reserve expensive models for complex reasoning. Use a lightweight classifier to determine complexity.",
    implementation: [
      "Build a complexity classifier (can be rule-based or a cheap LLM call)",
      "Route simple queries to GPT-4o-mini or Haiku ($0.15-0.80/MTok vs $2.50-3.00/MTok)",
      "Route complex queries to GPT-4o or Claude Sonnet",
      "Track quality metrics per route to ensure cheap models aren't degrading output",
    ],
  },
  {
    name: "Prompt Caching",
    impact: "50-90% reduction for repeated prefixes",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "If your system prompt and tool definitions are identical across requests, prompt caching lets you pay for those tokens once instead of every request. Both Anthropic and OpenAI offer native prompt caching.",
    implementation: [
      "Structure prompts with static prefix (system prompt, tools) and dynamic suffix (user input)",
      "Enable prompt caching on your LLM provider (automatic for Anthropic, explicit for OpenAI)",
      "Monitor cache hit rate — should be > 80% for repetitive workloads",
      "Keep the static prefix stable — changing it invalidates the cache",
    ],
  },
  {
    name: "Context Window Optimization",
    impact: "20-50% cost reduction",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Every token in the context window costs money. Reduce input tokens by compressing conversation history, limiting RAG results, and trimming tool definitions to only what's needed for each request.",
    implementation: [
      "Implement conversation compaction at 60-80% of context window capacity",
      "Limit RAG retrieval to top-3 chunks with minimum relevance threshold of 0.7",
      "Use dynamic tool selection to include only relevant tool definitions",
      "Compress tool outputs — return structured summaries instead of raw API responses",
    ],
  },
  {
    name: "Request-Level Budget Caps",
    impact: "Prevents runaway costs entirely",
    color: "text-red-600",
    border: "border-red-500/20",
    description:
      "Set maximum token and cost budgets per request. If the agent exceeds the budget (e.g., from a retry loop), terminate gracefully instead of continuing to burn tokens.",
    implementation: [
      "Set per-request token limits (e.g., max 50K input tokens, max 4K output tokens)",
      "Set per-request cost caps (e.g., $0.50 max per request)",
      "Implement circuit breakers: stop retrying after 3 failures",
      "Alert when any request exceeds 5x the average cost",
    ],
  },
  {
    name: "Output Token Management",
    impact: "15-30% cost reduction",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Output tokens cost 3-5x more than input tokens for most models. Instruct the model to be concise, use max_tokens limits, and avoid unnecessary reasoning in the response.",
    implementation: [
      "Set max_tokens to a reasonable limit for each use case",
      "Include 'be concise' instructions in the system prompt",
      "For internal agent steps (planning, tool selection), use shorter max_tokens",
      "Only allow verbose output for user-facing final responses",
    ],
  },
];

const budgetManagementCode = `// Comprehensive cost tracking and budget management
const MODEL_COSTS_PER_MTOK: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 2.50, output: 10.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "claude-sonnet-4-20250514": { input: 3.00, output: 15.00 },
  "claude-haiku-3.5": { input: 0.80, output: 4.00 },
};

interface CostTracker {
  traceId: string;
  userId: string;
  feature: string;
  totalCostUsd: number;
  breakdown: CostEntry[];
}

interface CostEntry {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  step: string;
}

function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = MODEL_COSTS_PER_MTOK[model];
  if (!pricing) throw new Error(\`Unknown model: \${model}\`);

  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  );
}

async function runAgentWithBudget(
  input: string,
  context: RequestContext,
  budgetUsd: number = 0.50,
): Promise<AgentResult> {
  const tracker: CostTracker = {
    traceId: context.traceId,
    userId: context.userId,
    feature: context.feature,
    totalCostUsd: 0,
    breakdown: [],
  };

  const wrappedLlm = {
    async generate(params: LlmParams): Promise<LlmResponse> {
      const response = await llm.generate(params);
      const cost = calculateCost(
        params.model,
        response.usage.inputTokens,
        response.usage.outputTokens,
      );

      tracker.totalCostUsd += cost;
      tracker.breakdown.push({
        model: params.model,
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        costUsd: cost,
        step: params.step ?? "unknown",
      });

      // Budget enforcement
      if (tracker.totalCostUsd > budgetUsd) {
        log.warn({
          event: "budget.exceeded",
          traceId: context.traceId,
          spent: tracker.totalCostUsd,
          budget: budgetUsd,
        });
        throw new BudgetExceededError(tracker);
      }

      return response;
    },
  };

  try {
    const result = await agent.execute(input, { ...context, llm: wrappedLlm });
    // Record cost metrics
    await metrics.recordCost(tracker);
    return result;
  } catch (error) {
    await metrics.recordCost(tracker);
    throw error;
  }
}`;

export function CostTracking() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          LLM costs are the most unpredictable line item in your infrastructure
          budget. Unlike traditional compute where costs scale linearly with
          traffic, agent costs can spike 10-50x based on prompt changes, retry
          loops, or context window growth — often without anyone noticing
          until the bill arrives.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The solution is <strong>per-request cost attribution</strong>: know
          exactly how much every request costs, attribute it to a user, feature,
          and model, and set alerts before spending spirals. You need to answer
          &quot;where is every token dollar going?&quot; at any time.
        </p>
      </div>

      {/* Cost Breakdown */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Typical Agent Cost Breakdown
          </p>
          <div className="space-y-2">
            {costBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-40 text-xs text-muted-foreground truncate">
                  {item.name}
                </span>
                <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-8 text-xs font-mono text-muted-foreground text-right">
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            LLM tokens (input + output) dominate at 60%. Output tokens are
            particularly expensive — 3-5x the cost of input tokens for most
            models. Retries add 15% on average; optimizing retry logic has
            outsized cost impact.
          </p>
        </CardContent>
      </Card>

      {/* Model Pricing Table */}
      <Card className="bg-card/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">
            Model Pricing Reference (per 1M tokens)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                    Model
                  </th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                    Input
                  </th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                    Output
                  </th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {modelPricing.map((model) => (
                  <tr key={model.model} className="border-b border-border/50">
                    <td className="py-2.5 px-3 font-mono text-xs font-medium">
                      {model.model}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-green-600">
                      {model.input}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-red-600">
                      {model.output}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">
                      {model.use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Output tokens cost 3-5x more than input tokens. A 1,000-token
            response from GPT-4o costs $0.01 — but that&apos;s $10K/month at
            1M requests. Pricing as of early 2025; check provider sites for
            current rates.
          </p>
        </CardContent>
      </Card>

      {/* Optimization Strategies */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Cost Optimization Strategies
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          These five strategies, applied together, can reduce agent costs by
          60-80% without meaningful quality degradation. Start with model
          routing — it typically has the highest ROI.
        </p>
        <div className="space-y-4">
          {optimizationStrategies.map((strategy) => (
            <Card
              key={strategy.name}
              className={`bg-card/50 ${strategy.border}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <Badge
                    variant="outline"
                    className={`${strategy.color} border-current`}
                  >
                    {strategy.impact}
                  </Badge>
                  {strategy.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Implementation Steps
                  </p>
                  <ol className="space-y-1">
                    {strategy.implementation.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Budget Management Code */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Per-Request Budget Enforcement
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Wrap your LLM client with a cost tracker that calculates cost on
          every call and enforces budget limits. This catches runaway requests
          before they burn through your budget.
        </p>
        <CodeBlock
          code={budgetManagementCode}
          label="Cost tracking with per-request budget enforcement"
        />
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          The Cost Observability Stack
        </p>
        <p className="text-foreground/90 leading-relaxed">
          At minimum, you need three things: (1){" "}
          <strong>Per-request cost calculation</strong> using model pricing
          tables and actual token counts. (2){" "}
          <strong>Cost attribution</strong> by user, feature, and model in
          your metrics system. (3){" "}
          <strong>Budget alerts</strong> at the request level ($0.50 max),
          daily level (per-user caps), and monthly level (feature budgets).
          Without all three, you are flying blind on the fastest-growing line
          item in your infrastructure budget.
        </p>
      </div>
    </div>
  );
}
