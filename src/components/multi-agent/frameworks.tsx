import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const frameworks = [
  {
    name: "CrewAI",
    badge: "Role-Based Teams",
    color: "text-blue-600",
    border: "border-blue-500/20",
    tagline: "AI agents that work together like a real crew",
    description:
      "CrewAI is built around the metaphor of a human team: you define agents with roles (Researcher, Writer, Editor), assign them tasks, and let them collaborate. Supports sequential and hierarchical processes with built-in memory and tool integration.",
    strengths: [
      "Intuitive role-based API — easy for beginners",
      "Built-in sequential and hierarchical orchestration",
      "Agent memory and learning across tasks",
      "Large ecosystem of pre-built tools",
      "Active community and frequent updates",
    ],
    limitations: [
      "Less control over state management than LangGraph",
      "Hierarchical process can be opaque (manager decisions)",
      "Python-first (TypeScript support is newer)",
      "Debugging complex interactions can be challenging",
    ],
    bestFor: "Content creation teams, research workflows, data analysis pipelines. Teams that want to ship multi-agent systems fast without deep infrastructure work.",
    keyFeatures: [
      "Agent roles with backstory and goals",
      "Sequential and hierarchical processes",
      "Task delegation between agents",
      "Built-in tools: web search, file operations, etc.",
      "Memory: short-term, long-term, and entity memory",
    ],
  },
  {
    name: "LangGraph",
    badge: "Stateful Graphs",
    color: "text-green-600",
    border: "border-green-500/20",
    tagline: "Build complex agent workflows as graphs",
    description:
      "LangGraph models agent workflows as directed graphs with nodes (agents/functions) and edges (transitions). Provides fine-grained control over state, conditional routing, cycles, and human-in-the-loop. The most flexible framework for complex workflows.",
    strengths: [
      "Fine-grained control over state and transitions",
      "Conditional edges for dynamic routing",
      "Supports cycles (revision loops, iterative refinement)",
      "Built-in checkpointing and state persistence",
      "Human-in-the-loop patterns are first-class",
      "TypeScript and Python SDKs",
    ],
    limitations: [
      "Steeper learning curve (graph programming model)",
      "More boilerplate than CrewAI for simple workflows",
      "Requires more upfront design (defining state schema, edges)",
      "Graph debugging tools are still maturing",
    ],
    bestFor: "Complex stateful workflows, systems needing human approval steps, pipelines with revision loops, teams that need maximum control over orchestration.",
    keyFeatures: [
      "StateGraph with typed channels",
      "Conditional edges based on state",
      "Subgraphs for modular composition",
      "Checkpointing for durability",
      "Human-in-the-loop interrupts",
      "Streaming for real-time updates",
    ],
  },
  {
    name: "AutoGen",
    badge: "Conversations",
    color: "text-purple-600",
    border: "border-purple-500/20",
    tagline: "Multi-agent conversations with humans in the loop",
    description:
      "AutoGen (from Microsoft Research) models multi-agent systems as conversations between agents. Agents take turns speaking, can call tools, and can involve human participants. Excels at debate, brainstorming, and iterative refinement patterns.",
    strengths: [
      "Natural conversational model — agents chat with each other",
      "Strong human-in-the-loop support",
      "Group chat with multiple agents",
      "Code execution sandbox built-in",
      "Backed by Microsoft Research",
    ],
    limitations: [
      "Conversation-based model doesn't fit all workflows",
      "Agent ordering in group chat can be unpredictable",
      "Heavier resource usage (multi-turn conversations)",
      "API has undergone significant changes (v0.1 to v0.4)",
    ],
    bestFor: "Code generation with iterative debugging, collaborative brainstorming, systems where agents need to debate or discuss. Research and prototyping.",
    keyFeatures: [
      "ConversableAgent base class",
      "Group chat manager for multi-agent conversations",
      "UserProxyAgent for human participation",
      "Docker-based code execution",
      "Nested chat for hierarchical conversations",
    ],
  },
  {
    name: "OpenAI Swarm",
    badge: "Lightweight Handoffs",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    tagline: "Simple agent handoffs, nothing more",
    description:
      "Swarm is OpenAI's experimental, educational framework that focuses on one thing: agent-to-agent handoffs. Agents include transfer functions in their tools, enabling fluid routing between specialists. Intentionally minimal — no state management, no orchestrator, no persistence.",
    strengths: [
      "Extremely simple — under 500 lines of code",
      "No abstraction overhead — just functions and handoffs",
      "Easy to understand and extend",
      "Great for learning multi-agent concepts",
      "Natural fit for customer support routing",
    ],
    limitations: [
      "No built-in state management",
      "No error handling or retry logic",
      "No persistence or checkpointing",
      "Experimental — not production-ready as-is",
      "OpenAI models only (no multi-provider support)",
    ],
    bestFor: "Customer support triage, simple routing between specialists, learning multi-agent patterns, prototyping handoff flows before building production systems.",
    keyFeatures: [
      "Agent with instructions and functions",
      "transfer_to_agent() for handoffs",
      "Context variables passed between agents",
      "Stateless by design",
      "Run loop handles conversation flow",
    ],
  },
  {
    name: "Custom Solution",
    badge: "Full Control",
    color: "text-red-600",
    border: "border-red-500/20",
    tagline: "Build exactly what you need, nothing you don't",
    description:
      "Build your own orchestration layer using raw LLM APIs. Maximum control, maximum responsibility. Justified when existing frameworks don't support your specific orchestration pattern, or when you need tight integration with existing infrastructure.",
    strengths: [
      "Complete control over every aspect of orchestration",
      "No framework overhead or abstractions to work around",
      "Tight integration with existing infrastructure",
      "Can optimize for specific performance requirements",
      "No dependency on framework maintenance/updates",
    ],
    limitations: [
      "Months of development for robust orchestration",
      "Must build retry logic, state management, error handling",
      "No community support or shared patterns",
      "High maintenance burden over time",
      "Risk of reinventing existing solutions poorly",
    ],
    bestFor: "Unique orchestration patterns not supported by frameworks. Teams with strong infrastructure expertise. Systems with strict security/compliance requirements that prevent using third-party frameworks.",
    keyFeatures: [
      "Direct LLM API integration",
      "Custom state management layer",
      "Bespoke communication protocols",
      "Integration with existing tooling",
      "Performance-optimized for specific use cases",
    ],
  },
];

const decisionMatrix = [
  {
    criterion: "Learning Curve",
    crewai: "Low",
    langgraph: "Medium-High",
    autogen: "Medium",
    swarm: "Very Low",
    custom: "High",
  },
  {
    criterion: "Flexibility",
    crewai: "Medium",
    langgraph: "Very High",
    autogen: "Medium",
    swarm: "Low",
    custom: "Maximum",
  },
  {
    criterion: "Production Readiness",
    crewai: "High",
    langgraph: "High",
    autogen: "Medium",
    swarm: "Low",
    custom: "Depends",
  },
  {
    criterion: "TypeScript Support",
    crewai: "Partial",
    langgraph: "Full",
    autogen: "Limited",
    swarm: "No",
    custom: "Full",
  },
  {
    criterion: "State Management",
    crewai: "Built-in",
    langgraph: "Advanced",
    autogen: "Basic",
    swarm: "None",
    custom: "Build it",
  },
  {
    criterion: "Error Handling",
    crewai: "Built-in",
    langgraph: "Built-in",
    autogen: "Basic",
    swarm: "None",
    custom: "Build it",
  },
];

export function Frameworks() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          You don&apos;t need to build multi-agent orchestration from scratch.
          Several frameworks handle the hard parts — message routing, state
          management, error handling, and coordination. Choose based on your
          workflow complexity, team expertise, and production requirements.
        </p>
      </div>

      {/* Framework Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {frameworks.map((f) => (
          <Card key={f.name} className={`bg-card/50 ${f.border} text-center`}>
            <CardContent className="pt-5 pb-4">
              <Badge variant="secondary" className="text-[10px] mb-2">
                {f.badge}
              </Badge>
              <h3 className={`font-bold text-sm ${f.color}`}>{f.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Framework Cards */}
      <div className="space-y-6">
        {frameworks.map((framework) => (
          <Card key={framework.name} className={`bg-card/50 ${framework.border}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Badge variant="outline" className={`${framework.color} border-current`}>
                  {framework.badge}
                </Badge>
                <span className={framework.color}>{framework.name}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground italic">
                {framework.tagline}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {framework.description}
              </p>

              {/* Key Features */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Key Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {framework.keyFeatures.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Strengths & Limitations */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                    Strengths
                  </p>
                  <ul className="space-y-1">
                    {framework.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-green-600 mt-0.5">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                    Limitations
                  </p>
                  <ul className="space-y-1">
                    {framework.limitations.map((l) => (
                      <li key={l} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-red-600 mt-0.5">-</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best For */}
              <div className="bg-muted/20 rounded-md px-4 py-2.5">
                <span className="text-xs text-muted-foreground">Best for: </span>
                <span className="text-xs text-foreground/90">{framework.bestFor}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decision Matrix */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Framework Comparison Matrix
        </h3>
        <Card className="bg-card/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criterion</th>
                  <th className="text-left p-3 text-xs font-semibold text-blue-600 uppercase tracking-wider">CrewAI</th>
                  <th className="text-left p-3 text-xs font-semibold text-green-600 uppercase tracking-wider">LangGraph</th>
                  <th className="text-left p-3 text-xs font-semibold text-purple-600 uppercase tracking-wider">AutoGen</th>
                  <th className="text-left p-3 text-xs font-semibold text-yellow-600 uppercase tracking-wider">Swarm</th>
                  <th className="text-left p-3 text-xs font-semibold text-red-600 uppercase tracking-wider">Custom</th>
                </tr>
              </thead>
              <tbody>
                {decisionMatrix.map((row) => (
                  <tr key={row.criterion} className="border-b border-border/30">
                    <td className="p-3 font-medium text-foreground/90 text-xs">{row.criterion}</td>
                    <td className="p-3 text-xs text-muted-foreground">{row.crewai}</td>
                    <td className="p-3 text-xs text-muted-foreground">{row.langgraph}</td>
                    <td className="p-3 text-xs text-muted-foreground">{row.autogen}</td>
                    <td className="p-3 text-xs text-muted-foreground">{row.swarm}</td>
                    <td className="p-3 text-xs text-muted-foreground">{row.custom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Recommendation */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Choosing Your Framework</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>
                <strong className="text-blue-600">CrewAI</strong> if you want to ship a role-based agent team this week
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>
                <strong className="text-green-600">LangGraph</strong> if you need fine-grained control over complex, stateful workflows
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>
                <strong className="text-purple-600">AutoGen</strong> if your use case is naturally conversational (debate, brainstorming, iterative code)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>
                <strong className="text-yellow-600">Swarm</strong> for learning, prototyping, or simple handoff routing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">5.</span>
              <span>
                <strong className="text-red-600">Custom</strong> only when existing frameworks genuinely can&apos;t support your pattern
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
