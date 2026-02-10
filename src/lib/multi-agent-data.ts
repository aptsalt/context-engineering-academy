export interface MultiAgentChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const multiAgentChapters: MultiAgentChapter[] = [
  {
    id: "when-multi-agent",
    number: 1,
    title: "When to Go Multi-Agent",
    subtitle: "Single agent limits and the case for teams",
    icon: "users",
  },
  {
    id: "orchestration-patterns",
    number: 2,
    title: "Orchestration Patterns",
    subtitle: "Sequential, parallel, hierarchical, swarm",
    icon: "git-branch",
  },
  {
    id: "agent-communication",
    number: 3,
    title: "Agent Communication",
    subtitle: "Message passing, shared state, event-driven",
    icon: "messages",
  },
  {
    id: "shared-memory",
    number: 4,
    title: "Shared State & Memory",
    subtitle: "Coordination without context pollution",
    icon: "database",
  },
  {
    id: "task-decomposition",
    number: 5,
    title: "Task Decomposition",
    subtitle: "Breaking complex tasks into agent-sized pieces",
    icon: "puzzle",
  },
  {
    id: "error-recovery",
    number: 6,
    title: "Error Handling & Recovery",
    subtitle: "Retries, fallbacks, and graceful degradation",
    icon: "shield",
  },
  {
    id: "frameworks",
    number: 7,
    title: "Frameworks",
    subtitle: "CrewAI, AutoGen, LangGraph, custom solutions",
    icon: "package",
  },
  {
    id: "production-patterns",
    number: 8,
    title: "Production Patterns",
    subtitle: "Scaling, monitoring, and deploying agent teams",
    icon: "rocket",
  },
  {
    id: "interactive-examples",
    number: 9,
    title: "Interactive Examples",
    subtitle: "See multi-agent patterns in action with live code",
    icon: "code",
  },
  {
    id: "anti-patterns",
    number: 10,
    title: "Anti-Patterns & Failure Modes",
    subtitle: "Agent sprawl, deadlocks, context leakage, and more",
    icon: "warning",
  },
  {
    id: "best-practices",
    number: 11,
    title: "Best Practices Checklist",
    subtitle: "Production-ready guidelines from leading AI teams",
    icon: "check",
  },
  {
    id: "resources",
    number: 12,
    title: "Resources & Further Reading",
    subtitle: "Docs, papers, repos, and courses",
    icon: "book",
  },
];

export interface MultiAgentQuote {
  text: string;
  author: string;
  role: string;
}

export const multiAgentQuotes: MultiAgentQuote[] = [
  {
    text: "The future of AI is not a single model doing everything, but specialized agents collaborating — each with its own context, tools, and expertise.",
    author: "Andrew Ng",
    role: "Founder, DeepLearning.AI",
  },
  {
    text: "Multi-agent systems let you decompose complex workflows into manageable pieces. Each agent gets a clean context window focused on what it does best.",
    author: "Harrison Chase",
    role: "CEO, LangChain",
  },
  {
    text: "CrewAI is built on the belief that the most effective AI systems mirror how high-performing human teams operate — specialized roles, clear communication, shared goals.",
    author: "Joao Moura",
    role: "Creator, CrewAI",
  },
  {
    text: "AutoGen enables next-gen LLM applications based on multi-agent conversations. Agents can be customized, can converse with each other, and can seamlessly allow human participation.",
    author: "Chi Wang",
    role: "Creator, AutoGen (Microsoft Research)",
  },
];

export interface MultiAgentCodeExample {
  id: string;
  title: string;
  description: string;
  category: string;
  bad: {
    label: string;
    code: string;
    explanation: string;
  };
  good: {
    label: string;
    code: string;
    explanation: string;
  };
}

export const multiAgentCodeExamples: MultiAgentCodeExample[] = [
  {
    id: "single-vs-multi",
    title: "Single Agent vs Agent Team",
    description: "When one agent tries to do everything vs specialized agents",
    category: "Architecture",
    bad: {
      label: "One agent doing everything",
      code: `// BAD: Single agent handles research, code, tests, review
const response = await llm.generate({
  system: \`You are a senior engineer. You must:
1. Research the best database for this use case
2. Design the schema
3. Write the migration code
4. Write integration tests
5. Review the code for security issues
6. Write deployment documentation

Do ALL of this in one conversation.\`,
  tools: [
    searchWeb, readDocs, queryDatabase,
    writeFile, readFile, runCommand,
    runTests, lintCode, checkSecurity,
    writeMarkdown, deployService,
    // 20+ more tools...
  ],
  messages, // Context gets polluted with mixed concerns
});`,
      explanation:
        "A single agent juggling 6 different roles pollutes its context with unrelated information. Research findings dilute coding context, test output obscures security review, and the agent loses track of what it was doing. Tool overload (20+ tools) further degrades performance.",
    },
    good: {
      label: "Specialized agent team with orchestrator",
      code: `// GOOD: Orchestrator delegates to focused agents
interface AgentConfig {
  name: string;
  systemPrompt: string;
  tools: Tool[];
}

const agents: AgentConfig[] = [
  {
    name: "researcher",
    systemPrompt: "You research technical approaches and databases...",
    tools: [searchWeb, readDocs, summarize],
  },
  {
    name: "architect",
    systemPrompt: "You design database schemas...",
    tools: [readFile, writeFile, validateSchema],
  },
  {
    name: "implementer",
    systemPrompt: "You write migration code...",
    tools: [readFile, writeFile, runCommand],
  },
  {
    name: "tester",
    systemPrompt: "You write and run tests...",
    tools: [readFile, writeTest, runTests],
  },
];

async function orchestrate(task: string) {
  const research = await runAgent("researcher", task);
  const schema = await runAgent("architect", {
    task,
    research: research.summary,
  });
  const code = await runAgent("implementer", {
    task,
    schema: schema.output,
  });
  const tests = await runAgent("tester", {
    code: code.files,
  });
  return { research, schema, code, tests };
}`,
      explanation:
        "Each agent has 3-4 focused tools and a narrow system prompt. The orchestrator passes only summaries between agents, keeping each context window clean. The researcher's papers don't pollute the implementer's coding context.",
    },
  },
  {
    id: "context-passing",
    title: "Inter-Agent Context Passing",
    description: "How to pass information between agents without context pollution",
    category: "Communication",
    bad: {
      label: "Passing entire conversation history",
      code: `// BAD: Forward everything to the next agent
async function handoff(
  fromAgent: Agent,
  toAgent: Agent,
  task: string,
) {
  const result = await fromAgent.run(task);

  // Passing the ENTIRE conversation to the next agent
  const nextResult = await toAgent.run({
    system: toAgent.systemPrompt,
    messages: [
      // All of agent 1's messages dumped in
      ...fromAgent.conversationHistory, // 50+ messages!
      {
        role: "user",
        content: \`Now continue with: \${task}\`,
      },
    ],
  });

  return nextResult;
}`,
      explanation:
        "Forwarding the entire conversation history from one agent to another defeats the purpose of multi-agent architecture. The receiving agent's context is immediately polluted with irrelevant messages, tool calls, and intermediate reasoning from the previous agent.",
    },
    good: {
      label: "Structured summary handoff",
      code: `// GOOD: Pass structured summaries between agents
interface AgentHandoff {
  fromAgent: string;
  summary: string;
  keyDecisions: string[];
  artifacts: { name: string; content: string }[];
  openQuestions: string[];
}

async function handoff(
  fromAgent: Agent,
  toAgent: Agent,
  task: string,
): Promise<AgentHandoff> {
  const result = await fromAgent.run(task);

  // Extract only what the next agent needs
  const summary = await summarize(result, {
    preserveDecisions: true,
    preserveArtifacts: true,
    maxTokens: 500,
  });

  const nextResult = await toAgent.run({
    system: toAgent.systemPrompt,
    messages: [
      {
        role: "user",
        content: \`## Previous Agent Output
Agent: \${fromAgent.name}
Summary: \${summary.text}
Key Decisions: \${summary.decisions.join(", ")}

## Your Task
\${task}\`,
      },
    ],
  });

  return nextResult;
}`,
      explanation:
        "The handoff extracts only the essential information: a summary, key decisions, artifacts, and open questions. The receiving agent gets a clean, focused context with just enough background to continue the work. This preserves the context isolation benefit of multi-agent architecture.",
    },
  },
  {
    id: "error-handling",
    title: "Multi-Agent Error Handling",
    description: "Graceful failure when agents in a pipeline fail",
    category: "Reliability",
    bad: {
      label: "No error handling — pipeline crashes",
      code: `// BAD: If any agent fails, everything crashes
async function pipeline(task: string) {
  // No try/catch, no retries, no fallbacks
  const research = await researchAgent.run(task);
  const plan = await plannerAgent.run(research);
  const code = await coderAgent.run(plan);
  const review = await reviewerAgent.run(code);
  const tests = await testerAgent.run(code);

  return { research, plan, code, review, tests };
  // If coderAgent fails, we lose ALL progress
  // from research and planning phases
}`,
      explanation:
        "A single failure anywhere in the pipeline loses all previous work. There are no retries, no fallback strategies, and no way to recover partial results. In production, agent failures are common — network issues, rate limits, context overflow, or the model simply producing invalid output.",
    },
    good: {
      label: "Circuit breaker with fallback agents",
      code: `// GOOD: Retry, fallback, and partial recovery
interface PipelineStep<T> {
  agent: Agent;
  fallbackAgent?: Agent;
  maxRetries: number;
  validate: (result: T) => boolean;
}

async function resilientPipeline(task: string) {
  const steps: PipelineStep<unknown>[] = [
    {
      agent: researchAgent,
      fallbackAgent: simpleSearchAgent,
      maxRetries: 2,
      validate: (r) => r.sources.length > 0,
    },
    {
      agent: coderAgent,
      fallbackAgent: simpleCoder,
      maxRetries: 3,
      validate: (r) => r.code && !r.syntaxErrors,
    },
  ];

  const results: Map<string, unknown> = new Map();

  for (const step of steps) {
    const result = await executeWithRetry(step, {
      onRetry: (attempt, error) => {
        log(\`Retry \${attempt}: \${error.message}\`);
      },
      onFallback: (error) => {
        log(\`Falling back: \${error.message}\`);
        return step.fallbackAgent?.run(task);
      },
    });

    results.set(step.agent.name, result);
  }

  return results;
}`,
      explanation:
        "Each pipeline step has retry logic with configurable attempts, a validation function to verify output quality, and an optional fallback agent (e.g., a simpler model that's more reliable). Partial results are preserved even if later steps fail, and structured logging enables debugging.",
    },
  },
  {
    id: "shared-state",
    title: "Shared State Management",
    description: "How agents coordinate through shared state without conflicts",
    category: "Coordination",
    bad: {
      label: "Unstructured shared global state",
      code: `// BAD: All agents read/write to the same global object
const globalState: Record<string, unknown> = {};

async function runAgents(task: string) {
  // All agents share one mutable object
  // No schema, no isolation, no conflict resolution
  await Promise.all([
    researchAgent.run(task, globalState),
    coderAgent.run(task, globalState),
    reviewerAgent.run(task, globalState),
  ]);

  // Race condition: coder and reviewer both wrote
  // to globalState.feedback — who wins?
  // No way to know what each agent changed
  return globalState;
}`,
      explanation:
        "A shared mutable object with no schema creates race conditions, overwrites, and makes debugging impossible. When multiple agents write to the same keys simultaneously, data is lost. There's no audit trail of what changed and why.",
    },
    good: {
      label: "Typed state store with scoped access",
      code: `// GOOD: Typed state with scoped agent access
interface SharedState {
  research: { findings: string[]; sources: string[] };
  code: { files: Map<string, string>; errors: string[] };
  review: { comments: string[]; approved: boolean };
  meta: { startedAt: Date; completedSteps: string[] };
}

class AgentStateStore {
  private state: SharedState;
  private locks: Map<string, string> = new Map();

  // Each agent gets scoped read/write access
  getScopedAccess(agentName: string, writeKeys: (keyof SharedState)[]) {
    return {
      read: () => structuredClone(this.state), // Immutable read
      write: async (key: keyof SharedState, value: unknown) => {
        if (!writeKeys.includes(key)) {
          throw new Error(
            \`\${agentName} cannot write to \${key}\`,
          );
        }
        await this.acquireLock(key, agentName);
        this.state[key] = value as never;
        this.releaseLock(key);
        this.emitChange(agentName, key);
      },
    };
  }
}

// Usage: each agent only writes to its own section
const store = new AgentStateStore(initialState);
const researchAccess = store.getScopedAccess("researcher", ["research"]);
const codeAccess = store.getScopedAccess("coder", ["code"]);`,
      explanation:
        "Each agent gets scoped access: it can read the full state (immutably) but only write to its designated section. Locking prevents race conditions, and change events enable reactive coordination. The typed schema ensures agents can't corrupt each other's data.",
    },
  },
  {
    id: "task-decomposition",
    title: "Task Decomposition",
    description: "Breaking complex tasks into parallelizable subtasks",
    category: "Orchestration",
    bad: {
      label: "Static, hardcoded task splitting",
      code: `// BAD: Hardcoded decomposition — doesn't adapt
async function buildFeature(feature: string) {
  // Always the same 3 steps, regardless of complexity
  const research = await researchAgent.run(
    \`Research \${feature}\`,
  );
  const code = await coderAgent.run(
    \`Implement \${feature}\`,
  );
  const tests = await testerAgent.run(
    \`Test \${feature}\`,
  );

  // What if the feature needs DB migration? UI work?
  // What if research reveals it's already implemented?
  // What if the task is too big for one coding agent?
  return { research, code, tests };
}`,
      explanation:
        "A hardcoded 3-step pipeline can't adapt to task complexity. Simple features waste time on unnecessary research. Complex features need more steps (migration, UI, API). The decomposition should match the task, not force the task into a fixed structure.",
    },
    good: {
      label: "LLM-driven dynamic decomposition",
      code: `// GOOD: Let the orchestrator decompose dynamically
interface Subtask {
  id: string;
  description: string;
  assignTo: string;
  dependsOn: string[];
  estimatedComplexity: "low" | "medium" | "high";
}

async function dynamicDecompose(task: string): Promise<Subtask[]> {
  const subtasks = await orchestrator.run({
    system: \`You are a project manager. Break this task into
subtasks. For each subtask specify:
- Which agent type should handle it
- Dependencies on other subtasks
- Estimated complexity

Agent types available: researcher, architect,
frontend-dev, backend-dev, tester, reviewer

Return JSON array of subtasks.\`,
    messages: [{ role: "user", content: task }],
  });

  return subtasks;
}

async function executeDAG(subtasks: Subtask[]) {
  const completed = new Set<string>();
  const results = new Map<string, unknown>();

  while (completed.size < subtasks.length) {
    // Find all subtasks whose dependencies are met
    const ready = subtasks.filter(
      (t) =>
        !completed.has(t.id) &&
        t.dependsOn.every((d) => completed.has(d)),
    );

    // Execute ready subtasks in parallel
    const batch = await Promise.all(
      ready.map((t) => runAgent(t.assignTo, t, results)),
    );

    for (const result of batch) {
      completed.add(result.taskId);
      results.set(result.taskId, result);
    }
  }

  return results;
}`,
      explanation:
        "The orchestrator uses an LLM to dynamically decompose tasks based on complexity. It builds a dependency graph (DAG) and executes independent subtasks in parallel. A simple bug fix might produce 2 subtasks; a complex feature might produce 8. The decomposition adapts to the work.",
    },
  },
  {
    id: "framework-comparison",
    title: "Framework Selection",
    description: "Choosing the right multi-agent framework for your use case",
    category: "Frameworks",
    bad: {
      label: "Building everything from scratch",
      code: `// BAD: Reinventing the wheel for common patterns
class MyOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private messageQueue: Message[] = [];
  private stateStore: Record<string, unknown> = {};

  // 500+ lines of custom orchestration logic
  async addAgent(config: AgentConfig) { /* ... */ }
  async routeMessage(msg: Message) { /* ... */ }
  async handleFailure(agent: string) { /* ... */ }
  async executeDAG(tasks: Task[]) { /* ... */ }
  async manageState(key: string, value: unknown) { /* ... */ }
  // Custom retry logic, custom state management,
  // custom message routing, custom logging...
  // All of this already exists in frameworks
}`,
      explanation:
        "Building custom orchestration from scratch means reimplementing message routing, state management, error handling, retry logic, and DAG execution. This is months of work, and the result is usually less robust than established frameworks that have been battle-tested in production.",
    },
    good: {
      label: "Using the right framework for the job",
      code: `// GOOD: Use frameworks, customize where needed

// CrewAI — best for role-based agent teams
import { Agent, Task, Crew } from "crewai";

const researcher = new Agent({
  role: "Senior Researcher",
  goal: "Find comprehensive information",
  tools: [searchTool, scrapeTool],
});

const crew = new Crew({
  agents: [researcher, writer, reviewer],
  tasks: [researchTask, writeTask, reviewTask],
  process: "sequential", // or "hierarchical"
});

// LangGraph — best for complex stateful workflows
import { StateGraph } from "@langchain/langgraph";

const graph = new StateGraph({ channels: schema })
  .addNode("research", researchNode)
  .addNode("code", codeNode)
  .addNode("review", reviewNode)
  .addEdge("research", "code")
  .addConditionalEdge("review", shouldRevise, {
    revise: "code",
    approve: END,
  });

// OpenAI Swarm — best for lightweight handoffs
import { Swarm } from "openai-swarm";

const triageAgent = new SwarmAgent({
  instructions: "Route to the right specialist",
  functions: [transferToSales, transferToSupport],
});`,
      explanation:
        "Each framework excels at different patterns. CrewAI is ideal for role-based teams with sequential or hierarchical processes. LangGraph gives fine-grained control over stateful workflows with conditional edges. OpenAI Swarm is lightweight and perfect for simple agent-to-agent handoffs. Choose based on your use case, don't reinvent.",
    },
  },
];

export interface MultiAgentAntiPattern {
  name: string;
  icon: string;
  description: string;
  cause: string;
  symptom: string;
  fix: string;
  severity: "critical" | "high" | "medium";
}

export const multiAgentAntiPatterns: MultiAgentAntiPattern[] = [
  {
    name: "Agent Sprawl",
    icon: "sprawl",
    description:
      "Creating too many agents for a task that doesn't need them, adding complexity without proportional benefit.",
    cause:
      "Prematurely splitting into multi-agent before validating that a single agent can't handle the task. Adding agents for every minor subtask.",
    symptom:
      "High latency from excessive inter-agent communication. Increased costs from multiple LLM calls. More failure points than a single-agent approach. Simple tasks taking 10x longer.",
    fix: "Start with a single agent. Only split when you have clear evidence of context pollution or tool overload. A good heuristic: if an agent needs fewer than 3 tools and its context stays under 50% of the window, it doesn't need splitting.",
    severity: "high",
  },
  {
    name: "Communication Flood",
    icon: "flood",
    description:
      "Agents sending too many messages or too much data between each other, overwhelming the system with inter-agent chatter.",
    cause:
      "No protocol for what information gets passed between agents. Agents forwarding entire conversation histories instead of summaries. No message size limits.",
    symptom:
      "Orchestrator's context window fills up with agent outputs. Exponential token costs from message passing. Agents spending more time communicating than working. Latency spikes from serializing large messages.",
    fix: "Define a strict communication protocol. Pass structured summaries (under 500 tokens) between agents, not raw outputs. Use a shared state store for large artifacts instead of message passing. Implement message budgets per agent.",
    severity: "critical",
  },
  {
    name: "Single Point of Failure",
    icon: "spof",
    description:
      "The orchestrator agent becomes a bottleneck — if it fails, the entire system fails with no recovery path.",
    cause:
      "All coordination runs through one agent with no redundancy. No checkpointing of intermediate results. No fallback orchestration strategy.",
    symptom:
      "A single orchestrator failure loses all progress from completed subtasks. Rate limit on the orchestrator model blocks the entire pipeline. If the orchestrator hallucinates a bad plan, all downstream agents execute the wrong tasks.",
    fix: "Checkpoint results after each pipeline step. Use a durable state store (database, not in-memory) so progress survives crashes. Implement a simple fallback orchestrator that can resume from checkpoints. Consider hierarchical orchestration where sub-orchestrators handle independent branches.",
    severity: "critical",
  },
  {
    name: "Context Leakage",
    icon: "leak",
    description:
      "Sensitive information from one agent's context unintentionally leaks into another agent's context through shared state or message passing.",
    cause:
      "No access controls on shared state. Agents passing full context instead of filtered summaries. PII or secrets included in inter-agent messages without scrubbing.",
    symptom:
      "Customer PII from a support agent ends up in a reporting agent's context. API keys from a deployment agent leak into a logging agent. Agents reference information they shouldn't have access to.",
    fix: "Implement scoped state access — each agent can only read/write designated state sections. Scrub PII and secrets from inter-agent messages. Use role-based access control for shared state. Audit what information flows between agents.",
    severity: "critical",
  },
  {
    name: "Orchestration Overhead",
    icon: "overhead",
    description:
      "The coordination cost between agents exceeds the actual work being done, making multi-agent slower and more expensive than single-agent.",
    cause:
      "Too many small agents that each do trivial work. Synchronous coordination when async would suffice. The orchestrator makes an LLM call for every routing decision.",
    symptom:
      "80% of token spend goes to orchestration, not task execution. Simple tasks take 30+ seconds due to sequential agent coordination. Cost per task is 5-10x higher than single-agent baseline with no quality improvement.",
    fix: "Measure orchestration overhead explicitly: track tokens spent on coordination vs actual work. Use deterministic routing (code, not LLM) when the routing logic is simple. Batch small tasks into a single agent call. Only use LLM-based orchestration when the routing decision genuinely requires intelligence.",
    severity: "high",
  },
  {
    name: "Deadlock / Circular Dependencies",
    icon: "deadlock",
    description:
      "Agents waiting on each other in a cycle, causing the pipeline to hang indefinitely.",
    cause:
      "Agent A waits for Agent B's output, but Agent B is waiting for Agent A. Poorly defined dependency graphs with cycles. No timeout on agent-to-agent waiting.",
    symptom:
      "Pipeline hangs indefinitely with no error message. Agents appear idle but are actually waiting on each other. Resource usage stays constant (agents are alive but blocked).",
    fix: "Validate the dependency graph is a DAG (directed acyclic graph) before execution. Implement timeouts on all inter-agent waits. Use topological sort to determine execution order. Add cycle detection to your orchestration layer.",
    severity: "high",
  },
];

export interface MultiAgentBestPractice {
  category: string;
  items: { title: string; description: string }[];
}

export const multiAgentBestPractices: MultiAgentBestPractice[] = [
  {
    category: "Architecture Design",
    items: [
      {
        title: "Start with one agent, split only when needed",
        description:
          "Begin with a single well-prompted agent. Only introduce multi-agent when you see clear evidence of context pollution, tool overload, or quality degradation from mixed concerns.",
      },
      {
        title: "Each agent gets a focused role and 3-5 tools",
        description:
          "Specialized agents with narrow tool sets and focused system prompts outperform generalist agents. If an agent needs 10+ tools, it's doing too much.",
      },
      {
        title: "Use the simplest orchestration pattern that works",
        description:
          "Sequential pipelines cover 80% of use cases. Only add parallel execution, hierarchical coordination, or swarm patterns when the task genuinely requires them.",
      },
      {
        title: "Design for partial failure",
        description:
          "Every agent call can fail. Design pipelines where completed steps are preserved, failed steps can retry, and the system can return partial results rather than nothing.",
      },
    ],
  },
  {
    category: "Communication & State",
    items: [
      {
        title: "Pass summaries, not full context, between agents",
        description:
          "When handing off between agents, send a structured summary (under 500 tokens) of key decisions, artifacts, and open questions — not the entire conversation history.",
      },
      {
        title: "Use typed, scoped shared state",
        description:
          "Define a TypeScript interface for shared state. Give each agent read access to all state but write access only to its designated section. Use locks for concurrent writes.",
      },
      {
        title: "Checkpoint after every pipeline step",
        description:
          "Persist intermediate results to a durable store after each agent completes. This enables resume-from-checkpoint on failure and makes debugging much easier.",
      },
      {
        title: "Define explicit communication protocols",
        description:
          "Standardize how agents communicate: message format, maximum size, required fields. Ad-hoc message passing leads to context bloat and debugging nightmares.",
      },
    ],
  },
  {
    category: "Error Handling & Reliability",
    items: [
      {
        title: "Implement retries with exponential backoff",
        description:
          "Agent calls fail due to rate limits, network issues, and model errors. Retry 2-3 times with increasing delays before falling back to an alternative strategy.",
      },
      {
        title: "Use fallback agents for critical steps",
        description:
          "For critical pipeline steps, define a fallback agent (e.g., a simpler model) that can produce acceptable output when the primary agent fails.",
      },
      {
        title: "Set timeouts on all agent operations",
        description:
          "Agents can hang due to infinite loops, model latency spikes, or deadlocks. Set timeouts on every agent call and inter-agent wait to prevent the entire system from freezing.",
      },
      {
        title: "Validate agent outputs before passing downstream",
        description:
          "Use schema validation (Zod) to verify each agent's output structure before passing it to the next agent. Catch malformed outputs early, before they corrupt downstream context.",
      },
    ],
  },
  {
    category: "Monitoring & Operations",
    items: [
      {
        title: "Track token spend per agent, not just total",
        description:
          "Know which agents consume the most tokens. Often, the orchestrator uses more tokens than the workers. Identify and optimize the most expensive agents first.",
      },
      {
        title: "Log the full agent dependency graph per run",
        description:
          "For every pipeline execution, log which agents ran, in what order, what they produced, and how long each took. This is essential for debugging multi-agent failures.",
      },
      {
        title: "Measure orchestration overhead ratio",
        description:
          "Track the ratio of tokens spent on coordination (orchestrator decisions, message passing) vs actual work (agent task execution). If overhead exceeds 30%, simplify your architecture.",
      },
      {
        title: "Set up alerts for agent failure rates",
        description:
          "Monitor each agent's success rate independently. An agent failing 20% of the time may be acceptable in isolation but catastrophic in a 5-agent pipeline (64% pipeline success rate).",
      },
    ],
  },
  {
    category: "Production Deployment",
    items: [
      {
        title: "Use queue-based orchestration for scalability",
        description:
          "Decouple agent execution from request handling using message queues (Redis, SQS, Kafka). This lets you scale agents independently and handle burst traffic without losing requests.",
      },
      {
        title: "Implement graceful degradation for each agent",
        description:
          "If a non-critical agent (e.g., formatting, logging) fails, the pipeline should continue with reduced functionality rather than failing entirely. Only critical agents should block the pipeline.",
      },
      {
        title: "Version your agent configurations independently",
        description:
          "Each agent's system prompt, tools, and model version should be versioned separately. This lets you update one agent without redeploying the entire pipeline, and roll back individual agents on regression.",
      },
      {
        title: "Load test with realistic agent interaction patterns",
        description:
          "Test the full multi-agent pipeline under load, not just individual agents. Inter-agent communication, shared state contention, and orchestrator bottlenecks only appear at scale.",
      },
    ],
  },
];

export interface MultiAgentResource {
  title: string;
  url: string;
  type: "blog" | "paper" | "repo" | "video" | "guide" | "docs";
  source: string;
  description: string;
}

export const multiAgentResources: MultiAgentResource[] = [
  {
    title: "Building Effective Agents",
    url: "https://www.anthropic.com/research/building-effective-agents",
    type: "guide",
    source: "Anthropic",
    description:
      "Anthropic's official guide on agent architectures, including when and how to use multi-agent patterns with Claude.",
  },
  {
    title: "CrewAI Documentation",
    url: "https://docs.crewai.com",
    type: "docs",
    source: "CrewAI",
    description:
      "Official docs for CrewAI — the framework for orchestrating role-based AI agent teams with sequential and hierarchical processes.",
  },
  {
    title: "AutoGen: Enabling Next-Gen LLM Applications",
    url: "https://arxiv.org/abs/2308.08155",
    type: "paper",
    source: "Microsoft Research",
    description:
      "The foundational paper on AutoGen's multi-agent conversation framework, enabling complex LLM workflows through inter-agent communication.",
  },
  {
    title: "LangGraph Multi-Agent Guide",
    url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/",
    type: "docs",
    source: "LangChain",
    description:
      "LangGraph's guide to building multi-agent systems with stateful graphs, conditional routing, and human-in-the-loop patterns.",
  },
  {
    title: "OpenAI Swarm (Experimental)",
    url: "https://github.com/openai/swarm",
    type: "repo",
    source: "OpenAI",
    description:
      "OpenAI's lightweight, experimental framework for multi-agent handoffs. Educational reference for understanding agent-to-agent transfers.",
  },
  {
    title: "Multi-Agent Systems with LLMs: A Survey",
    url: "https://arxiv.org/abs/2402.01680",
    type: "paper",
    source: "arXiv",
    description:
      "Comprehensive survey of LLM-based multi-agent systems covering communication, coordination, and evaluation frameworks.",
  },
  {
    title: "AgentScope: A Flexible yet Robust Multi-Agent Platform",
    url: "https://arxiv.org/abs/2402.14034",
    type: "paper",
    source: "Alibaba",
    description:
      "Platform for building robust multi-agent applications with built-in fault tolerance, distributed execution, and monitoring.",
  },
  {
    title: "The Landscape of Emerging AI Agent Architectures",
    url: "https://arxiv.org/abs/2404.11584",
    type: "paper",
    source: "arXiv",
    description:
      "Survey of single-agent and multi-agent architectures including hierarchical, peer-to-peer, and debate patterns for production use.",
  },
  {
    title: "Claude Code: Multi-Agent Orchestration",
    url: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/multi-agent",
    type: "docs",
    source: "Anthropic",
    description:
      "How Claude Code uses multi-agent patterns internally — task delegation, context isolation, and parallel execution.",
  },
  {
    title: "Building Multi-Agent Systems (DeepLearning.AI)",
    url: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/",
    type: "video",
    source: "DeepLearning.AI",
    description:
      "Andrew Ng's short course on building multi-agent systems with CrewAI, covering role-playing agents, task delegation, and collaboration.",
  },
];
