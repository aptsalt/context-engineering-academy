import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const techniques = [
  {
    name: "Context Compaction",
    badge: "Core",
    description:
      "Summarize conversation history when approaching the context window limit. The summary replaces the full history, enabling the agent to continue with minimal performance loss.",
    howItWorks: [
      "Monitor token count of current context",
      "When threshold reached (e.g., 80% of window), trigger compaction",
      "Use LLM to generate high-fidelity summary of conversation",
      "Replace full history with compact summary + current task",
      "Agent continues with fresh context budget",
    ],
    when: "Long-running agent sessions, multi-step workflows, customer support conversations",
    source: "Anthropic",
  },
  {
    name: "Structured Scratchpads",
    badge: "Core",
    description:
      "External note-taking files where agents persist intermediate findings, plans, and state. Survives compaction and can be shared across agents.",
    howItWorks: [
      "Define a structured format (goal, findings, open questions, conclusions)",
      "Agent writes to scratchpad after each significant step",
      "Scratchpad is re-read into context when needed",
      "Information persists even if conversation compacts",
      "Multiple agents can read/write the same scratchpad",
    ],
    when: "Research tasks, complex reasoning, multi-agent collaboration, tasks spanning hours or days",
    source: "Anthropic / LangChain",
  },
  {
    name: "Dynamic Tool Selection (RAG over Tools)",
    badge: "Advanced",
    description:
      "Instead of providing all tools every time, use vector search over tool descriptions to select only the most relevant tools for each specific task.",
    howItWorks: [
      "Index all tool descriptions in a vector database",
      "When a task arrives, embed the task description",
      "Search for most similar tool descriptions (top-k, e.g., 8)",
      "Only include matched tools in the LLM call",
      "Reduces context usage and improves tool selection accuracy by 3x",
    ],
    when: "Large tool registries (30+ tools), tools with overlapping descriptions, agent platforms",
    source: "LangChain Bigtool",
  },
  {
    name: "Multi-Agent Context Isolation",
    badge: "Architecture",
    description:
      "Split complex tasks across specialized sub-agents, each with their own isolated context window focused on their specific role.",
    howItWorks: [
      "Define specialized agents (researcher, coder, tester, reviewer)",
      "Each agent has its own system prompt, tools, and context window",
      "Orchestrator delegates tasks and passes summaries between agents",
      "Sub-agent contexts are isolated — research doesn't pollute coding context",
      "Results are aggregated by the orchestrator",
    ],
    when: "Complex workflows, tasks mixing research + implementation + testing, quality-sensitive applications",
    source: "Anthropic / OpenAI Swarm",
  },
  {
    name: "Context Trimming & Filtering",
    badge: "Optimization",
    description:
      "Rather than summarizing, use hard-coded heuristics to prune context: remove older messages, filter by importance, or drop low-priority content.",
    howItWorks: [
      "Define priority rules: system messages > tool results > recent messages > old messages",
      "When approaching limits, drop lowest-priority content first",
      "Use sliding window: keep only last N messages",
      "Filter out intermediate tool calls that produced no useful results",
      "Faster and cheaper than LLM-based summarization",
    ],
    when: "High-throughput applications, cost-sensitive scenarios, when compaction latency is too high",
    source: "LangChain / General",
  },
  {
    name: "Think Tool / Scratchpad Reasoning",
    badge: "Advanced",
    description:
      'Give the model a separate "thinking" workspace to process information without cluttering the main context. Up to 54% improvement on specialized benchmarks.',
    howItWorks: [
      "Provide a 'think' tool the agent can call to reason through complex decisions",
      "Thinking output is isolated from the main conversation context",
      "Agent offloads complex reasoning without consuming main context budget",
      "Results of thinking can be selectively pulled back into main context",
      "Prevents reasoning steps from polluting the operational context",
    ],
    when: "Complex decision-making, planning tasks, when agent needs to weigh multiple options",
    source: "Anthropic",
  },
  {
    name: "Information Hierarchy",
    badge: "Design Pattern",
    description:
      "Establish clear precedence rules for conflicting information in context. Prevents context clash — a 39% performance drop when information conflicts.",
    howItWorks: [
      "Define hierarchy: system prompt > verified facts > RAG docs > conversation history",
      "Deduplicate retrieved documents before injection",
      "Reconcile conflicting information before sending to model",
      "Include hierarchy rules in system prompt",
      "Monitor for and flag contradictions in retrieved content",
    ],
    when: "RAG applications, any system with multiple information sources, compliance-sensitive domains",
    source: "Microsoft Research / Anthropic",
  },
  {
    name: "Instruction Reinforcement",
    badge: "Reliability",
    description:
      "Re-inject critical instructions periodically to combat instruction drift — the tendency for agents to gradually stop following system prompt rules in long conversations.",
    howItWorks: [
      "Identify critical rules that must never be violated (safety, format, behavior)",
      "Periodically insert reminders in user messages (every N turns)",
      "After compaction, ensure critical rules are preserved in the summary",
      "Maintain high instruction-to-content ratio",
      "Test instruction adherence at various conversation lengths",
    ],
    when: "Safety-critical applications, long conversations, agents handling sensitive data",
    source: "General / Anthropic",
  },
];

export function Techniques() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          These are the concrete techniques you implement when building context-
          engineered systems. Each addresses a specific challenge in managing the
          context window.
        </p>
      </div>

      <div className="space-y-4">
        {techniques.map((tech) => (
          <Card key={tech.name} className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge variant="secondary" className="text-xs">
                  {tech.badge}
                </Badge>
                {tech.name}
                <span className="ml-auto text-xs text-muted-foreground font-normal">
                  {tech.source}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tech.description}
              </p>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  How It Works
                </p>
                <ol className="space-y-1">
                  {tech.howItWorks.map((step, i) => (
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
                <span className="text-xs text-muted-foreground">Use when: </span>
                <span className="text-xs text-foreground/90">{tech.when}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
