import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const decompositionStrategies = [
  {
    name: "Static Decomposition",
    badge: "Simple",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Tasks are split into predefined stages at development time. The pipeline structure is fixed — every task follows the same sequence of agents regardless of complexity.",
    howItWorks: [
      "Define a fixed sequence of stages at development time (research -> code -> test)",
      "Every task flows through all stages in order",
      "Each stage maps to a specific agent with a predetermined role",
      "No runtime adaptation — the pipeline is the same for simple and complex tasks",
    ],
    pros: ["Predictable execution", "Easy to debug and monitor", "No orchestrator LLM calls needed"],
    cons: ["Wastes time on unnecessary stages for simple tasks", "Can't handle tasks that need additional stages", "One-size-fits-all approach"],
    when: "Well-understood workflows where task complexity is consistent. CI/CD pipelines, data processing, content generation.",
  },
  {
    name: "LLM-Driven Dynamic Decomposition",
    badge: "Adaptive",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "An orchestrator LLM analyzes the task and dynamically generates a set of subtasks with dependencies. The decomposition adapts to task complexity — simple tasks get 2 subtasks, complex tasks get 8+.",
    howItWorks: [
      "Orchestrator LLM receives the task description and list of available agent types",
      "LLM produces a JSON array of subtasks with agent assignments and dependencies",
      "Dependencies are validated as a DAG (no circular dependencies)",
      "Subtasks with met dependencies execute in parallel",
      "Orchestrator can add subtasks mid-execution if needed",
    ],
    pros: ["Adapts to task complexity", "Enables parallel execution of independent subtasks", "Can handle novel task types without code changes"],
    cons: ["Orchestrator LLM call adds latency and cost", "Decomposition quality depends on orchestrator model", "Risk of over-decomposition (too many subtasks)"],
    when: "Variable-complexity tasks, general-purpose agent systems, tasks where the required steps aren't known in advance.",
  },
  {
    name: "Hierarchical Decomposition",
    badge: "Scalable",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "A top-level orchestrator breaks the task into major phases, then sub-orchestrators further decompose each phase into atomic subtasks. Scales to very complex projects.",
    howItWorks: [
      "Top-level orchestrator splits task into 2-4 major phases",
      "Each phase is assigned to a sub-orchestrator",
      "Sub-orchestrators decompose their phase into atomic subtasks",
      "Atomic subtasks are assigned to worker agents",
      "Results flow back up: workers -> sub-orchestrators -> top-level orchestrator",
    ],
    pros: ["Scales to very complex tasks", "Each level has manageable scope", "Sub-orchestrators can specialize"],
    cons: ["Multiple levels of orchestration overhead", "Coordination between sub-orchestrators is complex", "Debugging across levels is challenging"],
    when: "Large-scale projects with multiple workstreams. Building entire applications, complex research with multiple dimensions, enterprise workflows.",
  },
];

const dagConcepts = [
  {
    concept: "Dependency Graph (DAG)",
    description:
      "A directed acyclic graph where nodes are subtasks and edges represent dependencies. Subtask B depends on A means A must complete before B starts. The graph must have no cycles.",
  },
  {
    concept: "Topological Sort",
    description:
      "An ordering of subtasks such that every dependency comes before the tasks that depend on it. This determines the execution order and identifies which tasks can run in parallel.",
  },
  {
    concept: "Critical Path",
    description:
      "The longest chain of dependent subtasks that determines the minimum total execution time. Optimizing the critical path has the biggest impact on overall latency.",
  },
  {
    concept: "Fan-Out Width",
    description:
      "The maximum number of subtasks that can run in parallel at any point. Higher fan-out means more parallelism but also more concurrent LLM calls and higher peak cost.",
  },
];

const decompositionGuidelines = [
  {
    guideline: "Each subtask should be completable by one agent in one call",
    description:
      "If a subtask requires multiple LLM calls or multiple tools, it's not atomic enough. Break it down further until each subtask is a single, focused unit of work.",
  },
  {
    guideline: "Subtask descriptions must be self-contained",
    description:
      "An agent receiving a subtask should have all the context it needs in the subtask description plus the shared state. It should never need to 'guess' what previous agents did.",
  },
  {
    guideline: "Minimize inter-subtask dependencies",
    description:
      "The more dependencies, the less parallelism. Design subtasks to be as independent as possible. If two subtasks share a dependency, consider merging them or restructuring.",
  },
  {
    guideline: "Set complexity estimates for capacity planning",
    description:
      "Tag each subtask as low/medium/high complexity. This helps the orchestrator allocate resources: simple subtasks might use a smaller model, complex ones get the strongest model.",
  },
  {
    guideline: "Include validation criteria in each subtask",
    description:
      "Every subtask should define what 'done' looks like. This enables automatic validation before passing results downstream and prevents garbage from propagating through the pipeline.",
  },
];

export function TaskDecomposition() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Task decomposition is the art of breaking a complex task into{" "}
          <strong>agent-sized pieces</strong> — subtasks that are small enough
          for a single agent to handle with a focused context, yet large enough
          to produce meaningful output. Good decomposition is the difference
          between a multi-agent system that works and one that wastes tokens on
          coordination overhead.
        </p>
      </div>

      {/* Decomposition Strategies */}
      <div className="space-y-6">
        {decompositionStrategies.map((strategy) => (
          <Card key={strategy.name} className={`bg-card/50 ${strategy.border}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge variant="outline" className={`${strategy.color} border-current`}>
                  {strategy.badge}
                </Badge>
                <span className={strategy.color}>{strategy.name}</span>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                    Pros
                  </p>
                  <ul className="space-y-1">
                    {strategy.pros.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-green-600 mt-0.5">+</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                    Cons
                  </p>
                  <ul className="space-y-1">
                    {strategy.cons.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-red-600 mt-0.5">-</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-muted/20 rounded-md px-4 py-2.5">
                <span className="text-xs text-muted-foreground">Use when: </span>
                <span className="text-xs text-foreground/90">{strategy.when}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DAG Concepts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Task Graph Concepts
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Dynamic decomposition produces a <strong>dependency graph</strong> — a
          DAG (Directed Acyclic Graph) that determines execution order and
          parallelization opportunities.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {dagConcepts.map((concept) => (
            <Card key={concept.concept} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm text-primary mb-2">{concept.concept}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {concept.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Decomposition Guidelines
        </h3>
        <div className="space-y-3">
          {decompositionGuidelines.map((item) => (
            <Card key={item.guideline} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-primary"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.guideline}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          The ideal subtask size is one that fills 30-50% of an agent&apos;s
          context window. Too small and you waste tokens on coordination
          overhead. Too large and the agent&apos;s context gets polluted with
          mixed concerns. When in doubt, err on the side of fewer, larger
          subtasks — you can always split further if quality degrades.
        </p>
      </div>
    </div>
  );
}
