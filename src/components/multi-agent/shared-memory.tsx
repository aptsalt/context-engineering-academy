import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const memoryPatterns = [
  {
    name: "Scoped State Store",
    badge: "Recommended",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "A typed state object where each agent has read access to the full state but write access only to its designated section. Prevents race conditions while enabling coordination.",
    howItWorks: [
      "Define a TypeScript interface with a section per agent role",
      "Each agent receives a scoped accessor with limited write permissions",
      "Reads return immutable snapshots — agents can't modify data they read",
      "Writes acquire a lock on the target section to prevent conflicts",
      "Change events notify other agents when relevant state updates",
    ],
    tradeoffs: {
      pros: ["Type-safe", "No race conditions", "Auditable changes"],
      cons: ["Locking overhead", "Requires upfront schema design"],
    },
  },
  {
    name: "Shared Scratchpad (File-based)",
    badge: "Persistent",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Agents read and write to structured files (markdown, JSON) that persist outside any single agent's context window. Survives context compaction and agent restarts.",
    howItWorks: [
      "Define a structured scratchpad format (goals, findings, decisions, artifacts)",
      "Agents read the scratchpad into their context when starting a task",
      "Agents write updates to the scratchpad after completing significant steps",
      "The scratchpad is the source of truth — not any single agent's context",
      "Even if an agent's context compacts, the scratchpad retains all findings",
    ],
    tradeoffs: {
      pros: ["Survives compaction", "Human-readable", "Easy debugging"],
      cons: ["File I/O overhead", "No real-time notifications", "Concurrent write risk"],
    },
  },
  {
    name: "Event-Sourced State",
    badge: "Advanced",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Instead of storing current state, store a log of events (state changes). The current state is derived by replaying events. Provides complete audit trail and enables time-travel debugging.",
    howItWorks: [
      "Agents emit typed events: ResearchCompleted, CodeWritten, TestPassed, etc.",
      "Events are appended to an immutable log (never modified or deleted)",
      "Current state is computed by reducing events in order",
      "Any agent can replay events to understand the full history",
      "Enables 'what happened' debugging for complex multi-agent failures",
    ],
    tradeoffs: {
      pros: ["Full audit trail", "Time-travel debugging", "Immutable history"],
      cons: ["Higher complexity", "Event replay cost", "Schema evolution is hard"],
    },
  },
  {
    name: "Context Window as Memory (Anti-pattern)",
    badge: "Avoid",
    color: "text-red-600",
    border: "border-red-500/20",
    description:
      "Relying solely on the conversation history as shared memory. Information exists only in the context window and is lost on compaction. This is the most common mistake in multi-agent systems.",
    howItWorks: [
      "Agent produces results that live only in its conversation messages",
      "Orchestrator copies full conversation to the next agent's context",
      "As conversations grow, earlier results are pushed out by compaction",
      "No external persistence — if the agent restarts, everything is lost",
      "Results in context pollution, data loss, and unpredictable behavior",
    ],
    tradeoffs: {
      pros: ["Zero setup effort"],
      cons: ["Data loss on compaction", "Context pollution", "No persistence", "Unscalable"],
    },
  },
];

const isolationStrategies = [
  {
    strategy: "Namespace Isolation",
    description:
      "Each agent writes to a namespaced key (e.g., state.researcher.findings, state.coder.files). Agents cannot write outside their namespace, preventing accidental overwrites.",
    example: "state['researcher']['findings'] vs state['coder']['files']",
  },
  {
    strategy: "Immutable Read Snapshots",
    description:
      "When an agent reads shared state, it receives a deep clone (structuredClone). Changes to the clone don't affect the shared state — the agent must explicitly write back via its scoped accessor.",
    example: "const snapshot = structuredClone(sharedState)",
  },
  {
    strategy: "Write-Ahead Logging",
    description:
      "Before any write to shared state, the intended change is logged. If the agent crashes mid-write, the system can replay or rollback the partial change.",
    example: "log({ agent: 'coder', key: 'files', before, after })",
  },
  {
    strategy: "TTL-based Expiration",
    description:
      "Shared state entries have a time-to-live. Stale data (e.g., research from 2 hours ago) automatically expires, preventing agents from acting on outdated information.",
    example: "setState('research', data, { ttl: '30m' })",
  },
];

export function SharedMemory() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          The central challenge of multi-agent systems: agents need to share
          information to coordinate, but sharing too much creates context
          pollution. The solution is <strong>structured shared memory</strong>{" "}
          with clear boundaries — each agent reads what it needs and writes only
          to its own section.
        </p>
      </div>

      {/* Core Principle */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Core Principle</p>
        <p className="text-foreground/90 leading-relaxed">
          Shared state should follow the <strong>principle of least privilege</strong>:
          every agent can read the full state (immutably), but each agent can
          only write to its designated section. This prevents one agent from
          corrupting another&apos;s data while still enabling full visibility into
          the overall workflow state.
        </p>
      </div>

      {/* Memory Patterns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Memory Patterns
        </h3>
        <div className="space-y-4">
          {memoryPatterns.map((pattern) => (
            <Card key={pattern.name} className={`bg-card/50 ${pattern.border}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                      Pros
                    </p>
                    <ul className="space-y-1">
                      {pattern.tradeoffs.pros.map((p) => (
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
                      {pattern.tradeoffs.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-red-600 mt-0.5">-</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Isolation Strategies */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          State Isolation Strategies
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {isolationStrategies.map((strategy) => (
            <Card key={strategy.strategy} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">{strategy.strategy}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {strategy.description}
                </p>
                <div className="bg-muted/30 rounded-md px-3 py-2 font-mono text-xs text-foreground/70">
                  {strategy.example}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">When to Use What</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>
                <strong className="text-foreground/90">Scoped State Store</strong> for most multi-agent systems. Start here.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>
                <strong className="text-foreground/90">Shared Scratchpad</strong> for long-running workflows that span hours or days.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>
                <strong className="text-foreground/90">Event-Sourced State</strong> when you need audit trails and time-travel debugging.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>
                <strong className="text-red-600">Never</strong> rely on context window alone as shared memory.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
