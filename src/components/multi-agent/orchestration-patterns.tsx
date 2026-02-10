import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const patterns = [
  {
    name: "Sequential Pipeline",
    badge: "Foundational",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Agents execute in a fixed order, each passing output to the next. The simplest multi-agent pattern and the right starting point for most workflows.",
    diagram: "User -> Researcher -> Planner -> Coder -> Reviewer -> Output",
    howItWorks: [
      "Define a fixed sequence of agents with clear roles",
      "Each agent receives the previous agent's output as input",
      "The orchestrator passes structured summaries between stages",
      "Each agent has its own context window, tools, and system prompt",
      "Final output is the last agent's result",
    ],
    strengths: [
      "Simple to implement and debug",
      "Clear data flow — easy to trace failures",
      "Each agent gets a clean, focused context",
      "Deterministic execution order",
    ],
    weaknesses: [
      "No parallelism — total latency is sum of all agents",
      "A failure in any stage blocks the entire pipeline",
      "Can't handle tasks with independent subtasks",
    ],
    when: "Linear workflows: research -> plan -> execute -> review. Code review pipelines, content creation workflows, data processing chains.",
    realWorld: "Claude Code uses a sequential pipeline for complex refactoring: analyze codebase -> plan changes -> implement -> run tests -> fix failures.",
  },
  {
    name: "Parallel Fan-Out / Fan-In",
    badge: "Performance",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "An orchestrator fans out independent subtasks to multiple agents running in parallel, then fans in (aggregates) their results.",
    diagram: "User -> Orchestrator ->> [Agent A, Agent B, Agent C] -> Aggregator -> Output",
    howItWorks: [
      "Orchestrator decomposes task into independent subtasks",
      "Independent subtasks are dispatched to agents in parallel (Promise.all)",
      "Each agent works in its own context window simultaneously",
      "An aggregator agent combines results into a final output",
      "Dependencies are resolved before fan-out to avoid deadlocks",
    ],
    strengths: [
      "Significantly faster for tasks with independent subtasks",
      "Near-linear speedup for embarrassingly parallel tasks",
      "Each parallel agent gets a clean context",
      "Partial results available if some agents fail",
    ],
    weaknesses: [
      "Higher token cost (multiple simultaneous LLM calls)",
      "Aggregation step can be complex for conflicting outputs",
      "Not suitable when subtasks depend on each other",
    ],
    when: "Independent subtasks: analyze 5 files simultaneously, research 3 topics in parallel, run frontend + backend + infra changes at once.",
    realWorld: "LangGraph uses fan-out to process multiple documents in parallel during RAG, then fans in to produce a single synthesized answer.",
  },
  {
    name: "Hierarchical (Supervisor)",
    badge: "Complex Workflows",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "A supervisor agent manages a team of worker agents, delegating tasks, reviewing results, and deciding next steps dynamically based on intermediate outcomes.",
    diagram: "User -> Supervisor -> [Worker A, Worker B] -> Supervisor (reviews) -> [re-delegate or finalize]",
    howItWorks: [
      "Supervisor receives the task and decides which agents to involve",
      "Supervisor delegates subtasks with specific instructions",
      "Workers execute and return results to the supervisor",
      "Supervisor reviews results, decides if revision is needed",
      "Supervisor can re-delegate, request changes, or finalize",
    ],
    strengths: [
      "Dynamic — supervisor adapts strategy based on results",
      "Quality control — supervisor reviews before finalizing",
      "Can handle complex, unpredictable workflows",
      "Natural escalation path for difficult subtasks",
    ],
    weaknesses: [
      "Supervisor becomes a single point of failure and bottleneck",
      "Supervisor's context grows with each worker interaction",
      "Higher latency due to review loops",
      "Supervisor LLM costs can exceed worker costs",
    ],
    when: "Complex projects where the plan may change based on findings. Software development, research with iterative refinement, quality-sensitive applications.",
    realWorld: "CrewAI's hierarchical process uses a manager agent that delegates to crew members, reviews their output, and decides whether to accept or request revisions.",
  },
  {
    name: "Swarm / Peer-to-Peer",
    badge: "Decentralized",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Agents hand off control to each other directly, without a central orchestrator. Each agent decides which agent should handle the conversation next.",
    diagram: "User -> Agent A -> (handoff) -> Agent B -> (handoff) -> Agent C -> Output",
    howItWorks: [
      "Each agent has a list of other agents it can transfer to",
      "When an agent determines another is better suited, it transfers",
      "The conversation context transfers with the handoff (or a summary)",
      "No central coordinator — agents self-organize",
      "Each agent includes transfer functions in its tool definitions",
    ],
    strengths: [
      "No single point of failure (no central orchestrator)",
      "Natural for customer service routing and triage",
      "Low overhead — no orchestrator LLM calls",
      "Agents can specialize without rigid pipeline structure",
    ],
    weaknesses: [
      "Difficult to debug — no central coordination log",
      "Agents can enter infinite handoff loops",
      "Context transfer between agents can be lossy",
      "Hard to ensure all necessary work gets done",
    ],
    when: "Customer support triage (route to billing, technical, sales). Multi-step assistants where the user's needs shift. Chatbot routing.",
    realWorld: "OpenAI Swarm uses this pattern — agents include transfer_to_agent() functions in their tools. A triage agent routes to specialists who can route to each other.",
  },
  {
    name: "Debate / Consensus",
    badge: "Quality",
    color: "text-red-600",
    border: "border-red-500/20",
    description:
      "Multiple agents independently generate solutions, then debate or vote to reach consensus. Used when correctness matters more than speed.",
    diagram: "User -> [Agent A, Agent B, Agent C] -> Debate Round(s) -> Judge -> Final Answer",
    howItWorks: [
      "Multiple agents independently analyze the same problem",
      "Each agent produces a solution with reasoning",
      "Agents are shown each other's solutions and asked to critique",
      "Multiple rounds of debate refine positions",
      "A judge agent (or majority vote) selects the final answer",
    ],
    strengths: [
      "Higher accuracy through independent verification",
      "Catches errors that a single agent might miss",
      "Reduces hallucination through cross-validation",
      "Especially effective for reasoning and analysis tasks",
    ],
    weaknesses: [
      "3-5x more expensive than single-agent (multiple full analyses)",
      "Significantly higher latency (multiple rounds)",
      "Debate can converge on a wrong answer if all agents share a bias",
      "Diminishing returns beyond 3 agents in most cases",
    ],
    when: "High-stakes decisions: medical analysis, legal review, security audits. Complex reasoning where accuracy is worth the cost. Fact verification.",
    realWorld: "Google DeepMind's multi-agent debate showed improved factual accuracy and reasoning. Multiple agents independently verify claims and argue for their conclusions.",
  },
];

export function OrchestrationPatterns() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          There are five fundamental patterns for orchestrating multiple agents.
          Each pattern makes different tradeoffs between latency, cost,
          quality, and complexity. Choose the simplest pattern that meets your
          requirements.
        </p>
      </div>

      {/* Pattern Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {patterns.map((p) => (
          <Card key={p.name} className={`bg-card/50 ${p.border} text-center`}>
            <CardContent className="pt-5 pb-4">
              <Badge variant="secondary" className="text-[10px] mb-2">
                {p.badge}
              </Badge>
              <h3 className={`font-bold text-sm ${p.color}`}>{p.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Pattern Cards */}
      <div className="space-y-6">
        {patterns.map((pattern) => (
          <Card key={pattern.name} className={`bg-card/50 ${pattern.border}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Badge variant="outline" className={`${pattern.color} border-current`}>
                  {pattern.badge}
                </Badge>
                <span className={pattern.color}>{pattern.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pattern.description}
              </p>

              {/* Flow Diagram */}
              <div className="bg-muted/20 rounded-lg p-4 font-mono text-xs text-foreground/80 overflow-x-auto">
                {pattern.diagram}
              </div>

              {/* How It Works */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  How It Works
                </p>
                <ol className="space-y-1">
                  {pattern.howItWorks.map((step, i) => (
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

              {/* Strengths & Weaknesses */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                    Strengths
                  </p>
                  <ul className="space-y-1">
                    {pattern.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-green-600 mt-0.5">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                    Weaknesses
                  </p>
                  <ul className="space-y-1">
                    {pattern.weaknesses.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-red-600 mt-0.5">-</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* When to use */}
              <div className="bg-muted/20 rounded-md px-4 py-2.5">
                <span className="text-xs text-muted-foreground">Use when: </span>
                <span className="text-xs text-foreground/90">{pattern.when}</span>
              </div>

              {/* Real world */}
              <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-4 rounded-r-lg">
                <p className="text-xs font-semibold text-primary mb-1">Real-World Example</p>
                <p className="text-sm text-foreground/90">{pattern.realWorld}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pattern Selection Guide */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Choosing the Right Pattern</h3>
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">
            Most teams should start with <strong>Sequential Pipeline</strong>{" "}
            and only adopt more complex patterns when they hit specific
            limitations:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>Need speed? Move independent steps to <strong className="text-foreground/90">Parallel Fan-Out</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>Need quality control? Add a <strong className="text-foreground/90">Supervisor</strong> for review loops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>Need flexible routing? Use <strong className="text-foreground/90">Swarm</strong> for agent-to-agent handoffs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>Need accuracy? Use <strong className="text-foreground/90">Debate</strong> for critical decisions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
