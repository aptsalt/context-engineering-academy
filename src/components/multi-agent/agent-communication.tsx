import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const communicationPatterns = [
  {
    name: "Direct Message Passing",
    badge: "Simple",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Agents communicate by sending structured messages directly to each other through the orchestrator. The orchestrator acts as a message router, deciding which agent receives which messages.",
    howItWorks: [
      "Agent A completes its task and produces a structured output",
      "The orchestrator extracts relevant information from the output",
      "The orchestrator formats the information as input for Agent B",
      "Agent B receives only the filtered, relevant context",
      "The orchestrator logs all inter-agent messages for debugging",
    ],
    strengths: [
      "Simple to implement and reason about",
      "Orchestrator controls information flow — prevents context pollution",
      "Easy to add message validation and filtering",
      "Clear audit trail of what each agent received",
    ],
    weaknesses: [
      "Orchestrator is a bottleneck for all communication",
      "Sequential by nature — agents can't communicate concurrently",
      "Orchestrator's context grows with each message routed",
    ],
    when: "Sequential pipelines, small teams (2-4 agents), workflows where the orchestrator needs to review every handoff.",
  },
  {
    name: "Shared Blackboard",
    badge: "Coordination",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "A shared data structure (the 'blackboard') that all agents can read from and write to. Agents coordinate by reading the current state and contributing their results. Originally from AI research in the 1980s.",
    howItWorks: [
      "Define a typed shared state object with sections per agent",
      "Each agent reads the blackboard to understand current state",
      "Agents write their results to their designated section",
      "Other agents reactively read updated sections when needed",
      "Locking prevents concurrent write conflicts",
    ],
    strengths: [
      "Agents can work independently — no direct coupling",
      "Any agent can read any other agent's results",
      "Natural fit for parallel execution patterns",
      "State persists across agent restarts and failures",
    ],
    weaknesses: [
      "Requires careful access control to prevent corruption",
      "Agents can become dependent on stale data",
      "Debugging is harder — no clear message trail",
      "Need locking or versioning for concurrent writes",
    ],
    when: "Parallel fan-out patterns, agents that need to share large artifacts (code files, research), long-running workflows.",
  },
  {
    name: "Event-Driven / Pub-Sub",
    badge: "Reactive",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Agents publish events when they complete work or need assistance. Other agents subscribe to relevant events and react accordingly. Decouples producers from consumers.",
    howItWorks: [
      "Define event types: TaskCompleted, NeedsReview, ErrorOccurred, etc.",
      "Agents publish events to an event bus when they complete steps",
      "Other agents subscribe to events they care about",
      "Events carry minimal payload — just enough to trigger the subscriber",
      "Subscribers fetch full context from shared state if needed",
    ],
    strengths: [
      "Highly decoupled — agents don't need to know about each other",
      "Easy to add new agents without modifying existing ones",
      "Natural fit for reactive, event-driven architectures",
      "Supports complex coordination without central bottleneck",
    ],
    weaknesses: [
      "Harder to reason about overall flow (event spaghetti)",
      "Debugging requires event tracing infrastructure",
      "Event ordering and exactly-once delivery are non-trivial",
      "Can lead to cascading event storms if not throttled",
    ],
    when: "Large agent teams (5+ agents), microservice-style architectures, systems where agents are added/removed dynamically.",
  },
  {
    name: "Request-Response (RPC-style)",
    badge: "Structured",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Agents call each other like function calls — sending a request with parameters and waiting for a structured response. The most familiar pattern for developers, mapping cleanly to async/await.",
    howItWorks: [
      "Define typed request/response interfaces for each agent",
      "Calling agent sends a typed request to the target agent",
      "Target agent processes the request and returns a typed response",
      "Calling agent blocks (or awaits) until the response arrives",
      "Timeouts prevent indefinite waiting on failed agents",
    ],
    strengths: [
      "Familiar mental model — just like function calls",
      "Strong typing catches integration errors at compile time",
      "Easy to test each agent independently with mock requests",
      "Clear request-response pairing simplifies debugging",
    ],
    weaknesses: [
      "Synchronous by default — blocks the calling agent",
      "Tight coupling between caller and callee interfaces",
      "Cascading failures if a downstream agent is slow or down",
      "Not suitable for broadcast or multi-receiver communication",
    ],
    when: "Hierarchical patterns where supervisor calls workers, strongly-typed workflows, teams that prefer explicit over implicit communication.",
  },
];

const protocolDesign = [
  {
    principle: "Keep payloads under 500 tokens",
    description:
      "Inter-agent messages should be summaries, not dumps. If you're passing more than 500 tokens between agents, you're leaking context that should stay in the sender's window.",
  },
  {
    principle: "Use structured formats, not free text",
    description:
      "Define TypeScript interfaces for all inter-agent messages. Free-text messages are unpredictable and hard to validate. Structured messages can be schema-validated before delivery.",
  },
  {
    principle: "Include metadata with every message",
    description:
      "Every message should carry: sender ID, timestamp, message type, and a correlation ID linking it to the original task. This metadata is essential for debugging and observability.",
  },
  {
    principle: "Separate data from control signals",
    description:
      "Don't mix task results with coordination instructions in the same message. Use different message types for 'here are my results' vs 'please review this' vs 'I failed, need fallback'.",
  },
];

export function AgentCommunication() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          How agents communicate determines the quality, speed, and reliability
          of your multi-agent system. The wrong communication pattern creates
          context pollution, race conditions, and debugging nightmares. The right
          pattern keeps each agent focused while enabling effective coordination.
        </p>
      </div>

      {/* Pattern Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {communicationPatterns.map((p) => (
          <Card key={p.name} className={`bg-card/50 ${p.border} text-center`}>
            <CardContent className="pt-5 pb-4">
              <Badge variant="secondary" className="text-[10px] mb-2">
                {p.badge}
              </Badge>
              <h3 className={`font-bold text-xs ${p.color}`}>{p.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Pattern Cards */}
      <div className="space-y-6">
        {communicationPatterns.map((pattern) => (
          <Card key={pattern.name} className={`bg-card/50 ${pattern.border}`}>
            <CardHeader>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Protocol Design Principles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Communication Protocol Design Principles
        </h3>
        <div className="space-y-3">
          {protocolDesign.map((principle) => (
            <Card key={principle.principle} className="bg-card/50">
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
                    <p className="text-sm font-medium">{principle.principle}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {principle.description}
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
          The best inter-agent communication feels like a well-run standup
          meeting: each participant shares a brief status update with just
          enough context for others to do their job. If your agents are sending
          each other novels, your communication pattern is wrong.
        </p>
      </div>
    </div>
  );
}
