import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scalingProblem = [
  {
    tools: "5-10",
    accuracy: "95%+",
    tokens: "~1,500",
    verdict: "Optimal",
    color: "text-green-600",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  {
    tools: "10-20",
    accuracy: "85-90%",
    tokens: "~4,000",
    verdict: "Acceptable",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
  {
    tools: "20-50",
    accuracy: "50-70%",
    tokens: "~10,000",
    verdict: "Degraded",
    color: "text-orange-600",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
  },
  {
    tools: "50+",
    accuracy: "30-40%",
    tokens: "15,000+",
    verdict: "Broken",
    color: "text-red-600",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
  },
];

const selectionStrategies = [
  {
    name: "RAG over Tool Descriptions",
    badge: "Recommended",
    description:
      "Embed all tool descriptions in a vector database. When a request arrives, embed the user message and find the most similar tool descriptions. Return only the top-k matches.",
    howItWorks: [
      "Index each tool's name + description as a document in a vector DB",
      "On each request, embed the user message",
      "Search for top-k most similar tool descriptions (k=5-10)",
      "Include matched tools in the LLM call alongside core tools",
      "Model sees only relevant tools, improving selection accuracy",
    ],
    when: "Registries with 20+ tools. The standard approach for production agents.",
    source: "LangChain Bigtool",
  },
  {
    name: "Category-Based Routing",
    badge: "Simple",
    description:
      "Group tools into categories (billing, support, admin). Use a lightweight classifier to route to the right category first, then provide all tools within that category.",
    howItWorks: [
      "Define tool categories: billing (5 tools), support (8 tools), admin (4 tools)",
      "Use intent classification to detect the category from the user message",
      "Load all tools in the matched category",
      "Optionally use RAG within a category for further refinement",
      "Fast and predictable — no embedding needed for the routing step",
    ],
    when: "Well-defined domains with clear boundaries. Good when tools naturally cluster.",
    source: "Common Pattern",
  },
  {
    name: "Two-Stage Selection",
    badge: "Advanced",
    description:
      "Combine coarse and fine selection. First, use category routing or keyword matching to narrow to 15-20 candidate tools. Then use RAG or a small model to pick the final 5-8.",
    howItWorks: [
      "Stage 1: Fast filter using keywords, categories, or a classifier",
      "Stage 2: Semantic search over the filtered subset for precise matching",
      "Always include 'core' tools (think, respond_to_user) regardless of routing",
      "Cache frequently co-occurring tool sets to skip routing for common queries",
      "Monitor which tools actually get selected to optimize routing rules",
    ],
    when: "Very large registries (100+ tools) or latency-sensitive applications.",
    source: "Production Pattern",
  },
];

const coreToolsPattern = [
  {
    name: "think",
    description: "Always available. Lets the model reason through complex decisions before acting.",
    alwaysIncluded: true,
  },
  {
    name: "respond_to_user",
    description: "Always available. Sends a final response to the user.",
    alwaysIncluded: true,
  },
  {
    name: "request_clarification",
    description: "Always available. Asks the user for more information when the query is ambiguous.",
    alwaysIncluded: true,
  },
  {
    name: "search_orders",
    description: "Dynamically loaded when the user's message relates to orders, purchases, or shipments.",
    alwaysIncluded: false,
  },
  {
    name: "create_ticket",
    description: "Dynamically loaded when the user's message relates to support, issues, or escalation.",
    alwaysIncluded: false,
  },
];

export function ToolSelection() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Tool selection</strong> is how you decide which tools the model
          sees for each request. With a small tool set (under 10), you can
          include all tools every time. But as your registry grows past 20
          tools, you need dynamic selection — otherwise the model drowns in
          definitions and picks the wrong tool.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is one of the highest-leverage optimizations in tool-using
          agents. Research from UC Berkeley (Gorilla) and LangChain (Bigtool)
          shows that tool selection accuracy drops dramatically as tool count
          increases — from 95% with 10 tools to 30% with 50+.
        </p>
      </div>

      {/* Scaling Problem */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            The Tool Scaling Problem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            More tools means more context tokens, more confusion, and worse
            selection accuracy. These numbers are approximate but reflect
            consistent findings across multiple research papers.
          </p>
          <div className="space-y-2">
            {scalingProblem.map((tier) => (
              <div
                key={tier.tools}
                className={`flex items-center gap-4 p-3 rounded-lg ${tier.bg} border ${tier.border}`}
              >
                <span className="w-16 text-sm font-mono font-bold text-foreground/90">
                  {tier.tools}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Accuracy: <strong className={tier.color}>{tier.accuracy}</strong>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Context: <strong className="text-foreground/70">{tier.tokens}</strong>
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${tier.color} border-current`}
                >
                  {tier.verdict}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selection Strategies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Selection Strategies</h3>
        {selectionStrategies.map((strategy) => (
          <Card key={strategy.name} className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge variant="secondary" className="text-xs">
                  {strategy.badge}
                </Badge>
                {strategy.name}
                <span className="ml-auto text-xs text-muted-foreground font-normal">
                  {strategy.source}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {strategy.description}
              </p>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  How It Works
                </p>
                <ol className="space-y-1">
                  {strategy.howItWorks.map((step, i) => (
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
              <div className="bg-muted/20 rounded-md px-4 py-2.5">
                <span className="text-xs text-muted-foreground">
                  Use when:{" "}
                </span>
                <span className="text-xs text-foreground/90">
                  {strategy.when}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Core vs Dynamic Tools */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Core vs Dynamic Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Separate your tools into two groups: <strong>core tools</strong> that
            are always available (reasoning, responding) and{" "}
            <strong>dynamic tools</strong> that are loaded per-request based on
            relevance.
          </p>
          <div className="space-y-2">
            {coreToolsPattern.map((tool) => (
              <div
                key={tool.name}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  tool.alwaysIncluded
                    ? "bg-green-500/5 border-green-500/10"
                    : "bg-muted/10 border-border/50"
                }`}
              >
                <Badge
                  variant="outline"
                  className={`text-xs font-mono shrink-0 ${
                    tool.alwaysIncluded
                      ? "text-green-600 border-green-500/40"
                      : "text-muted-foreground border-border"
                  }`}
                >
                  {tool.alwaysIncluded ? "Core" : "Dynamic"}
                </Badge>
                <div>
                  <code className="text-xs font-mono text-foreground/80">
                    {tool.name}
                  </code>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          Dynamic tool selection is not premature optimization — it is{" "}
          <strong>essential architecture</strong> for any agent with more than
          15-20 tools. Without it, you are paying the full context cost of
          every tool definition on every request and accepting a 3x degradation
          in tool selection accuracy. The investment in a tool index pays back
          on every single request.
        </p>
      </div>
    </div>
  );
}
