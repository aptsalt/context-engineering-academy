import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const strategies = [
  {
    number: 1,
    name: "Write",
    emoji: "✍️",
    color: "text-green-600",
    border: "border-green-500/20",
    tagline: "Save context outside the window",
    description:
      "Writing context means persisting information externally so it survives compaction and can be accessed later. Think of it as saving to disk.",
    techniques: [
      "Scratchpad files — structured notes the agent updates as it works",
      "Task plans written to external memory before execution",
      "Intermediate results persisted between agent steps",
      "Long-term memory stores for cross-session knowledge",
    ],
    realWorld:
      "Anthropic's multi-agent researcher writes a detailed research plan to a file. Sub-agents access it later as needed, ensuring continuity across hours of work.",
    keyInsight:
      "Without external write, long workflows collapse once context refreshes. The scratchpad is the agent's notebook.",
  },
  {
    number: 2,
    name: "Select",
    emoji: "🔍",
    color: "text-blue-600",
    border: "border-blue-500/20",
    tagline: "Pull the right info into the window",
    description:
      "Selecting context means dynamically retrieving relevant information and injecting it into the context window at the right moment. RAG is the primary mechanism.",
    techniques: [
      "RAG — semantic search over documents to find relevant chunks",
      "Dynamic tool selection — RAG over tool descriptions to pick relevant tools",
      "Just-in-time retrieval — fetch data only when the agent needs it",
      "Cached query results — reuse previous retrievals for identical queries",
    ],
    realWorld:
      "LangGraph's Bigtool library applies semantic search over tool descriptions, selecting only the 5-8 most relevant tools per task from a registry of hundreds.",
    keyInsight:
      "The right 5 chunks outperform 500 chunks dumped in. Selection quality directly determines output quality.",
  },
  {
    number: 3,
    name: "Compress",
    emoji: "🗜️",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    tagline: "Retain only what matters",
    description:
      "Compressing context means reducing token count while preserving the information needed for the task. This extends the effective lifespan of agent sessions.",
    techniques: [
      "Auto-compaction — summarize conversation when nearing limits",
      "Trimming — remove older messages by hard-coded heuristics",
      "Message filtering — keep only messages relevant to current task",
      "Tool output compression — return structured summaries, not raw API dumps",
    ],
    realWorld:
      "Claude Code's auto-compact feature summarizes hundreds of conversation turns into a concise summary when nearing the context limit, preserving task-critical details while freeing space.",
    keyInsight:
      "A focused 300-token context often outperforms an unfocused 113,000-token context. More is not better.",
  },
  {
    number: 4,
    name: "Isolate",
    emoji: "🔒",
    color: "text-purple-600",
    border: "border-purple-500/20",
    tagline: "Scope context per agent/task",
    description:
      "Isolation means splitting context across specialized sub-agents or modules, each with their own focused context window. Prevents cross-contamination.",
    techniques: [
      "Multi-agent architectures — each sub-agent has isolated context",
      "State schema isolation — expose only relevant fields to the LLM per turn",
      "Orchestrator pattern — leader passes summaries, not full context",
      "Separation of concerns — research, coding, testing in separate windows",
    ],
    realWorld:
      "Anthropic's multi-agent researcher uses many agents with isolated contexts. Each sub-agent's context window is allocated to a narrow sub-task, outperforming single-agent approaches.",
    keyInsight:
      "One agent doing everything → context pollution. Specialized agents with narrow contexts → higher quality per task.",
  },
];

export function FourStrategies() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          LangChain groups context engineering strategies into four buckets.
          These are the fundamental operations for managing an agent&apos;s{" "}
          <strong>&ldquo;working memory.&rdquo;</strong>
        </p>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {strategies.map((s) => (
          <Card key={s.name} className={`bg-card/50 ${s.border} text-center`}>
            <CardContent className="pt-6 pb-4">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <h3 className={`font-bold ${s.color}`}>{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.tagline}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Cards */}
      <div className="space-y-6">
        {strategies.map((strategy) => (
          <Card key={strategy.name} className={`bg-card/50 ${strategy.border}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{strategy.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${strategy.color} border-current`}>
                      Strategy {strategy.number}
                    </Badge>
                    <span className={strategy.color}>{strategy.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal mt-1">
                    {strategy.tagline}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {strategy.description}
              </p>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Techniques
                </p>
                <ul className="space-y-1.5">
                  {strategy.techniques.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm">
                      <span className={`${strategy.color} mt-1`}>&#9656;</span>
                      <span className="text-foreground/90">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Real-World Example
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {strategy.realWorld}
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-4 rounded-r-lg">
                <p className="text-xs font-semibold text-primary mb-1">
                  Key Insight
                </p>
                <p className="text-sm text-foreground/90">{strategy.keyInsight}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
