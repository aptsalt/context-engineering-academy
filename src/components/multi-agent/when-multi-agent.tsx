import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { multiAgentQuotes } from "@/lib/multi-agent-data";

const singleAgentLimits = [
  {
    limit: "Context Window Pollution",
    description:
      "When a single agent handles research, coding, testing, and review, its context fills with unrelated information. Research papers dilute coding context, test output obscures security review, and quality degrades across all tasks.",
    threshold: "Agent's context exceeds 60% capacity with mixed concerns",
  },
  {
    limit: "Tool Overload",
    description:
      "A single agent given 20+ tools struggles to select the right one. Studies show tool selection accuracy drops 3x when toolsets exceed 30 tools. The model wastes tokens reading irrelevant tool descriptions.",
    threshold: "Agent needs more than 10 tools for a single task",
  },
  {
    limit: "Conflicting Objectives",
    description:
      "Asking one agent to both write code AND review it for security creates conflicting incentives. The agent tends to be lenient with its own code. Separate agents provide genuine independent review.",
    threshold: "Agent must evaluate or critique its own output",
  },
  {
    limit: "Sequential Bottleneck",
    description:
      "A single agent can only do one thing at a time. If a task has independent subtasks (e.g., frontend + backend + tests), a single agent runs them sequentially while a team runs them in parallel.",
    threshold: "Task has 3+ independent subtasks that could parallelize",
  },
];

const decisionFramework = [
  {
    question: "Does the task involve more than 2 distinct roles?",
    ifYes: "Multi-agent: Give each role a focused agent",
    ifNo: "Single agent with role-switching instructions",
    weight: "high",
  },
  {
    question: "Does the agent need more than 10 tools?",
    ifYes: "Multi-agent: Split tools across specialists",
    ifNo: "Single agent with dynamic tool selection (RAG)",
    weight: "high",
  },
  {
    question: "Are there independent subtasks that could run in parallel?",
    ifYes: "Multi-agent: Fan out to parallel agents",
    ifNo: "Single agent with sequential execution",
    weight: "medium",
  },
  {
    question: "Does the task require self-evaluation or peer review?",
    ifYes: "Multi-agent: Separate creator and reviewer",
    ifNo: "Single agent with output validation",
    weight: "medium",
  },
  {
    question: "Is the task expected to run for 30+ minutes?",
    ifYes: "Multi-agent: Isolate contexts to prevent degradation",
    ifNo: "Single agent with compaction may suffice",
    weight: "low",
  },
];

const costBenefitRows = [
  {
    factor: "Latency",
    singleAgent: "Lower (one LLM call per step)",
    multiAgent: "Higher (orchestration + multiple calls)",
    verdict: "Single agent wins for simple tasks",
  },
  {
    factor: "Token Cost",
    singleAgent: "Lower total tokens",
    multiAgent: "Higher total, but each call is more focused",
    verdict: "Multi-agent costs 2-5x more",
  },
  {
    factor: "Quality (complex tasks)",
    singleAgent: "Degrades with context pollution",
    multiAgent: "Maintains quality via isolation",
    verdict: "Multi-agent wins for complex tasks",
  },
  {
    factor: "Reliability",
    singleAgent: "Single failure point",
    multiAgent: "Multiple failure points, but recoverable",
    verdict: "Depends on error handling",
  },
  {
    factor: "Debuggability",
    singleAgent: "One conversation to trace",
    multiAgent: "Multiple conversations + coordination logs",
    verdict: "Single agent easier to debug",
  },
];

export function WhenMultiAgent() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Multi-agent is not always the answer. A single well-prompted agent
          with good context engineering handles most tasks. Multi-agent
          architecture introduces coordination cost, latency, and complexity.
          Use it when — and only when — the benefits outweigh these costs.
        </p>
      </div>

      {/* Quotes */}
      <div className="grid gap-4 md:grid-cols-2">
        {multiAgentQuotes.slice(0, 2).map((quote) => (
          <Card key={quote.author} className="bg-card/50">
            <CardContent className="pt-6">
              <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold">{quote.author}</p>
                <p className="text-xs text-muted-foreground">{quote.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Single Agent Limits */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          When a Single Agent Breaks Down
        </h3>
        <div className="space-y-3">
          {singleAgentLimits.map((limit) => (
            <Card key={limit.limit} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 mt-2" />
                  <div>
                    <h4 className="font-semibold text-sm">{limit.limit}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                      {limit.description}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5">
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500/40">
                        Threshold
                      </Badge>
                      <span className="text-xs text-muted-foreground">{limit.threshold}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Decision Framework */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Decision Framework: Single vs Multi-Agent
        </h3>
        <div className="space-y-3">
          {decisionFramework.map((item) => (
            <Card key={item.question} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3 mb-3">
                  <Badge
                    variant="outline"
                    className={
                      item.weight === "high"
                        ? "text-red-600 border-red-500/40"
                        : item.weight === "medium"
                          ? "text-yellow-600 border-yellow-500/40"
                          : "text-blue-600 border-blue-500/40"
                    }
                  >
                    {item.weight}
                  </Badge>
                  <p className="text-sm font-medium">{item.question}</p>
                </div>
                <div className="grid gap-2 md:grid-cols-2 pl-[52px]">
                  <div className="bg-green-500/5 rounded-md p-3 border border-green-500/10">
                    <p className="text-xs font-semibold text-green-600 mb-1">Yes</p>
                    <p className="text-xs text-muted-foreground">{item.ifYes}</p>
                  </div>
                  <div className="bg-blue-500/5 rounded-md p-3 border border-blue-500/10">
                    <p className="text-xs font-semibold text-blue-600 mb-1">No</p>
                    <p className="text-xs text-muted-foreground">{item.ifNo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cost/Benefit Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Cost / Benefit Analysis
        </h3>
        <Card className="bg-card/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Factor</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Single Agent</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Multi-Agent</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {costBenefitRows.map((row) => (
                  <tr key={row.factor} className="border-b border-border/30">
                    <td className="p-4 font-medium text-foreground/90">{row.factor}</td>
                    <td className="p-4 text-muted-foreground">{row.singleAgent}</td>
                    <td className="p-4 text-muted-foreground">{row.multiAgent}</td>
                    <td className="p-4 text-xs text-foreground/80">{row.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          Anthropic&apos;s own recommendation: &ldquo;Start with a single agent. Only
          split into multi-agent when you have clear evidence that a single
          agent&apos;s context is being degraded by mixed concerns.&rdquo; The best
          multi-agent system is one where every agent earns its place through
          measurable quality improvement.
        </p>
      </div>
    </div>
  );
}
