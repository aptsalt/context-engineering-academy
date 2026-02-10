export interface AcademyModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
}

export interface Academy {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  modules: AcademyModule[];
  hasPlayground: boolean;
  status: "live" | "coming-soon";
}

export const academies: Academy[] = [
  {
    slug: "context-engineering-academy",
    title: "Context Engineering Academy",
    shortTitle: "Context Engineering",
    tagline: "Fill the context window with the right information",
    description:
      "Master the art and science of filling the context window with just the right information. 11 chapters covering fundamentals, strategies, techniques, anti-patterns, and production best practices — with interactive code examples.",
    icon: "brain",
    color: "chart-1",
    modules: [
      { id: "what-is-it", number: 1, title: "What is Context Engineering?", subtitle: "The discipline that replaced prompt engineering" },
      { id: "os-analogy", number: 2, title: "The Operating System Analogy", subtitle: "LLM = CPU, Context Window = RAM" },
      { id: "vs-prompt-engineering", number: 3, title: "Context vs Prompt Engineering", subtitle: "From crafting sentences to designing systems" },
      { id: "core-components", number: 4, title: "The 6 Core Components", subtitle: "System prompts, tools, memory, RAG, few-shot, history" },
      { id: "four-strategies", number: 5, title: "The 4 Strategies", subtitle: "Write, Select, Compress, Isolate" },
      { id: "techniques", number: 6, title: "Key Techniques", subtitle: "Compaction, scratchpads, multi-agent, tool management" },
      { id: "anti-patterns", number: 7, title: "Anti-Patterns & Failure Modes", subtitle: "Context rot, poisoning, clash, and how to avoid them" },
      { id: "interactive-examples", number: 8, title: "Interactive Examples", subtitle: "See context engineering in action with live code" },
      { id: "best-practices", number: 9, title: "Best Practices Checklist", subtitle: "Production-ready guidelines" },
      { id: "resources", number: 10, title: "Resources & Further Reading", subtitle: "Papers, blogs, repos, and tools" },
      { id: "playground", number: 11, title: "Interactive Playground", subtitle: "Build a context window and watch an agent improve" },
    ],
    hasPlayground: true,
    status: "live",
  },
  {
    slug: "agent-observability-academy",
    title: "Agent Observability Academy",
    shortTitle: "Agent Observability",
    tagline: "You can't fix what you can't see",
    description:
      "Learn how to trace, debug, and monitor AI agents in production. From structured logging to real-time dashboards — understand every step your agent takes.",
    icon: "eye",
    color: "chart-2",
    modules: [
      { id: "what-is-observability", number: 1, title: "What is Agent Observability?", subtitle: "Why logging isn't enough for AI agents" },
      { id: "tracing-fundamentals", number: 2, title: "Tracing Agent Execution", subtitle: "Following the chain from input to output" },
      { id: "structured-logging", number: 3, title: "Structured Logging", subtitle: "Logs that machines and humans can read" },
      { id: "metrics-kpis", number: 4, title: "Metrics & KPIs for Agents", subtitle: "Latency, token usage, success rates, cost" },
      { id: "debugging-failures", number: 5, title: "Debugging Agent Failures", subtitle: "Root cause analysis for non-deterministic systems" },
      { id: "observability-tools", number: 6, title: "Observability Tools", subtitle: "LangSmith, Phoenix, Langfuse, Braintrust" },
      { id: "dashboards", number: 7, title: "Building Dashboards", subtitle: "Real-time visibility into agent performance" },
      { id: "production-monitoring", number: 8, title: "Production Monitoring", subtitle: "Alerts, anomaly detection, and incident response" },
      { id: "cost-tracking", number: 9, title: "Cost Tracking & Optimization", subtitle: "Know where every token dollar goes" },
    ],
    hasPlayground: true,
    status: "live",
  },
  {
    slug: "llm-evals-academy",
    title: "LLM Evals Academy",
    shortTitle: "LLM Evals",
    tagline: "Ship with confidence",
    description:
      "Build evaluation systems that catch regressions before your users do. From simple assertions to complex rubric-based scoring — evaluate LLM outputs systematically.",
    icon: "clipboard-check",
    color: "chart-3",
    modules: [
      { id: "why-evals", number: 1, title: "Why Evals Matter", subtitle: "The foundation of reliable AI products" },
      { id: "eval-types", number: 2, title: "Types of Evaluations", subtitle: "Functional, quality, safety, and regression evals" },
      { id: "eval-datasets", number: 3, title: "Building Eval Datasets", subtitle: "Golden datasets, synthetic data, production sampling" },
      { id: "automated-evals", number: 4, title: "Automated Evaluations", subtitle: "LLM-as-judge, assertions, semantic similarity" },
      { id: "human-evals", number: 5, title: "Human Evaluation", subtitle: "When and how to involve human reviewers" },
      { id: "eval-frameworks", number: 6, title: "Eval Frameworks", subtitle: "promptfoo, Braintrust, LangSmith, custom solutions" },
      { id: "regression-testing", number: 7, title: "Regression Testing for LLMs", subtitle: "Catch quality drops before they ship" },
      { id: "eval-driven-dev", number: 8, title: "Eval-Driven Development", subtitle: "Write the eval first, then improve the prompt" },
      { id: "ci-cd", number: 9, title: "CI/CD for LLM Apps", subtitle: "Evals in your deployment pipeline" },
      { id: "interactive-examples", number: 10, title: "Interactive Examples", subtitle: "See eval patterns in action with live code" },
      { id: "anti-patterns", number: 11, title: "Anti-Patterns & Failure Modes", subtitle: "Common eval mistakes and how to avoid them" },
      { id: "best-practices", number: 12, title: "Best Practices Checklist", subtitle: "Production-ready eval guidelines" },
      { id: "resources", number: 13, title: "Resources & Further Reading", subtitle: "Tools, blogs, papers, and guides" },
    ],
    hasPlayground: true,
    status: "live",
  },
  {
    slug: "agentic-rag-academy",
    title: "Agentic RAG Academy",
    shortTitle: "Agentic RAG",
    tagline: "Everyone builds RAG, most do it wrong",
    description:
      "Go beyond naive RAG. Learn agentic retrieval patterns — query planning, multi-step reasoning, self-correcting retrieval, and production-grade RAG architectures.",
    icon: "database",
    color: "chart-4",
    modules: [
      { id: "rag-fundamentals", number: 1, title: "RAG Fundamentals", subtitle: "Retrieval-Augmented Generation from first principles" },
      { id: "chunking", number: 2, title: "Chunking Strategies", subtitle: "Semantic, recursive, agentic chunking" },
      { id: "embeddings", number: 3, title: "Embeddings & Vector Databases", subtitle: "Choosing models and storage for your use case" },
      { id: "retrieval-strategies", number: 4, title: "Retrieval Strategies", subtitle: "Hybrid search, reranking, query expansion" },
      { id: "agentic-patterns", number: 5, title: "Agentic RAG Patterns", subtitle: "Self-RAG, corrective RAG, adaptive retrieval" },
      { id: "query-routing", number: 6, title: "Query Routing & Planning", subtitle: "Multi-step retrieval with query decomposition" },
      { id: "rag-evaluation", number: 7, title: "Evaluating RAG Systems", subtitle: "Faithfulness, relevance, and answer quality" },
      { id: "production-rag", number: 8, title: "Production RAG Architecture", subtitle: "Scaling, caching, and real-time indexing" },
      { id: "advanced-patterns", number: 9, title: "Advanced Patterns", subtitle: "Graph RAG, multimodal RAG, conversational RAG" },
      { id: "rag-anti-patterns", number: 10, title: "Anti-Patterns & Failure Modes", subtitle: "The most common RAG mistakes and how to fix them" },
      { id: "rag-interactive-examples", number: 11, title: "Interactive Code Examples", subtitle: "Naive vs. production RAG patterns side by side" },
      { id: "rag-best-practices", number: 12, title: "Best Practices Checklist", subtitle: "Production-ready guidelines for every RAG stage" },
      { id: "rag-resources", number: 13, title: "Resources & Further Reading", subtitle: "Papers, docs, and guides" },
    ],
    hasPlayground: true,
    status: "live",
  },
  {
    slug: "multi-agent-orchestration-academy",
    title: "Multi-Agent Orchestration Academy",
    shortTitle: "Multi-Agent Orchestration",
    tagline: "From single agents to agent teams",
    description:
      "Design, build, and orchestrate teams of specialized AI agents. 12 chapters covering orchestration patterns, communication, shared state, task decomposition, error handling, frameworks, and production deployment — with interactive code examples.",
    icon: "network",
    color: "chart-5",
    modules: [
      { id: "when-multi-agent", number: 1, title: "When to Go Multi-Agent", subtitle: "Single agent limits and the case for teams" },
      { id: "orchestration-patterns", number: 2, title: "Orchestration Patterns", subtitle: "Sequential, parallel, hierarchical, swarm" },
      { id: "agent-communication", number: 3, title: "Agent Communication", subtitle: "Message passing, shared state, event-driven" },
      { id: "shared-memory", number: 4, title: "Shared State & Memory", subtitle: "Coordination without context pollution" },
      { id: "task-decomposition", number: 5, title: "Task Decomposition", subtitle: "Breaking complex tasks into agent-sized pieces" },
      { id: "error-recovery", number: 6, title: "Error Handling & Recovery", subtitle: "Retries, fallbacks, and graceful degradation" },
      { id: "frameworks", number: 7, title: "Frameworks", subtitle: "CrewAI, AutoGen, LangGraph, custom solutions" },
      { id: "production-patterns", number: 8, title: "Production Patterns", subtitle: "Scaling, monitoring, and deploying agent teams" },
      { id: "interactive-examples", number: 9, title: "Interactive Examples", subtitle: "See multi-agent patterns in action with live code" },
      { id: "anti-patterns", number: 10, title: "Anti-Patterns & Failure Modes", subtitle: "Agent sprawl, deadlocks, context leakage, and more" },
      { id: "best-practices", number: 11, title: "Best Practices Checklist", subtitle: "Production-ready guidelines from leading AI teams" },
      { id: "resources", number: 12, title: "Resources & Further Reading", subtitle: "Docs, papers, repos, and courses" },
    ],
    hasPlayground: true,
    status: "live",
  },
  {
    slug: "tool-use-mcp-academy",
    title: "Tool Use & MCP Academy",
    shortTitle: "Tool Use & MCP",
    tagline: "Agents are only as good as their tools",
    description:
      "Master tool design for AI agents and the Model Context Protocol (MCP). 12 chapters covering fundamentals, MCP servers, tool selection, security, and production patterns — with interactive code examples.",
    icon: "wrench",
    color: "chart-1",
    modules: [
      { id: "tool-fundamentals", number: 1, title: "Tool Use Fundamentals", subtitle: "How LLMs call functions and use results" },
      { id: "designing-tools", number: 2, title: "Designing Good Tools", subtitle: "Clear names, schemas, and descriptions" },
      { id: "mcp-intro", number: 3, title: "Model Context Protocol (MCP)", subtitle: "The standard for agent-tool communication" },
      { id: "building-mcp-servers", number: 4, title: "Building MCP Servers", subtitle: "Create tools any MCP client can use" },
      { id: "tool-selection", number: 5, title: "Tool Selection & Routing", subtitle: "Dynamic tool loading for large registries" },
      { id: "error-handling", number: 6, title: "Error Handling & Retries", subtitle: "Graceful failure when tools break" },
      { id: "security", number: 7, title: "Security & Sandboxing", subtitle: "Safe tool execution in production" },
      { id: "production-tools", number: 8, title: "Production Tool Architecture", subtitle: "Versioning, monitoring, and scaling tools" },
      { id: "interactive-examples", number: 9, title: "Interactive Examples", subtitle: "See tool use patterns in action with live code" },
      { id: "anti-patterns", number: 10, title: "Anti-Patterns & Failure Modes", subtitle: "Tool soup, leaky tools, and how to avoid them" },
      { id: "best-practices", number: 11, title: "Best Practices Checklist", subtitle: "Production-ready guidelines for tool use and MCP" },
      { id: "resources", number: 12, title: "Resources & Further Reading", subtitle: "Docs, specs, repos, and guides" },
    ],
    hasPlayground: true,
    status: "live",
  },
];

export function getAcademy(slug: string): Academy | undefined {
  return academies.find((a) => a.slug === slug);
}
