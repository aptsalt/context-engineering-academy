export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const chapters: Chapter[] = [
  {
    id: "what-is-it",
    number: 1,
    title: "What is Context Engineering?",
    subtitle: "The discipline that replaced prompt engineering",
    icon: "brain",
  },
  {
    id: "os-analogy",
    number: 2,
    title: "The Operating System Analogy",
    subtitle: "LLM = CPU, Context Window = RAM",
    icon: "cpu",
  },
  {
    id: "vs-prompt-engineering",
    number: 3,
    title: "Context vs Prompt Engineering",
    subtitle: "From crafting sentences to designing systems",
    icon: "arrows",
  },
  {
    id: "core-components",
    number: 4,
    title: "The 6 Core Components",
    subtitle: "System prompts, tools, memory, RAG, few-shot, history",
    icon: "layers",
  },
  {
    id: "four-strategies",
    number: 5,
    title: "The 4 Strategies",
    subtitle: "Write, Select, Compress, Isolate",
    icon: "strategy",
  },
  {
    id: "techniques",
    number: 6,
    title: "Key Techniques",
    subtitle: "Compaction, scratchpads, multi-agent, tool management",
    icon: "wrench",
  },
  {
    id: "anti-patterns",
    number: 7,
    title: "Anti-Patterns & Failure Modes",
    subtitle: "Context rot, poisoning, clash, and how to avoid them",
    icon: "warning",
  },
  {
    id: "interactive-examples",
    number: 8,
    title: "Interactive Examples",
    subtitle: "See context engineering in action with live code",
    icon: "code",
  },
  {
    id: "best-practices",
    number: 9,
    title: "Best Practices Checklist",
    subtitle: "Production-ready guidelines from Anthropic, LangChain & more",
    icon: "check",
  },
  {
    id: "resources",
    number: 10,
    title: "Resources & Further Reading",
    subtitle: "Papers, blogs, repos, and tools",
    icon: "book",
  },
  {
    id: "playground",
    number: 11,
    title: "Interactive Playground",
    subtitle: "Build a context window and watch an agent improve in real-time",
    icon: "play",
  },
];

export interface Quote {
  text: string;
  author: string;
  role: string;
}

export const quotes: Quote[] = [
  {
    text: "I really like the term 'context engineering' over prompt engineering. It describes the core skill better: the art of providing all the context for the task to be plausibly solvable by the LLM.",
    author: "Tobi Lütke",
    role: "CEO, Shopify",
  },
  {
    text: "Context engineering is the delicate art and science of filling the context window with just the right information for the next step.",
    author: "Andrej Karpathy",
    role: "AI Researcher, ex-Tesla/OpenAI",
  },
  {
    text: "Context engineering is in, and prompt engineering is out. AI leaders must prioritize context over prompts.",
    author: "Gartner",
    role: "July 2025",
  },
];

export interface CodeExample {
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

export const codeExamples: CodeExample[] = [
  {
    id: "system-prompt",
    title: "System Prompt Design",
    description: "Finding the right altitude for instructions",
    category: "Instructional Context",
    bad: {
      label: "Over-specified (brittle)",
      code: `// BAD: Hardcoded rules for every scenario
const systemPrompt = \`
You are a customer service agent.
If the user says "refund", say "I'll process your refund."
If the user says "cancel", say "Your subscription is cancelled."
If the user says "upgrade", say "Here are our upgrade options."
If the user says "hello", say "Welcome! How can I help?"
If the user says anything else, say "I don't understand."
\`;`,
      explanation:
        "Hardcoding every scenario creates brittle logic. The agent can't handle edge cases, compound requests, or anything not explicitly listed.",
    },
    good: {
      label: "Balanced guidance with reasoning",
      code: `// GOOD: Clear role + heuristics + reasoning
const systemPrompt = \`
You are a customer service agent for Acme Corp.

## Your Role
Help customers resolve billing, subscription, and
product questions. You have access to their account
data via tools.

## Guidelines
- Always verify the customer's identity before making
  account changes
- For refunds over $100, escalate to a human agent
- Be empathetic but concise. Mirror the customer's
  communication style
- If unsure about a policy, use the search_policies
  tool rather than guessing

## Tools Available
- get_account(customer_id): Fetch account details
- process_refund(order_id, reason): Issue a refund
- search_policies(query): Search internal policies
\`;`,
      explanation:
        'Anthropic calls this the "Goldilocks zone" — specific enough to guide behavior, flexible enough for the model to apply judgment. Includes role, heuristics, reasoning guidance, and tool descriptions.',
    },
  },
  {
    id: "rag-context",
    title: "RAG: Selecting Context",
    description: "Pulling relevant knowledge into the context window",
    category: "Knowledge Context",
    bad: {
      label: "Dump everything in",
      code: `// BAD: Stuffing all documents into context
async function answerQuestion(question: string) {
  const allDocs = await db.getAllDocuments(); // 500+ docs!

  const response = await llm.generate({
    system: "Answer based on the documents provided.",
    messages: [
      {
        role: "user",
        content: \`Documents: \${allDocs.join("\\n")}
                  Question: \${question}\`,
      },
    ],
  });

  return response;
}`,
      explanation:
        "Cramming all documents into context wastes tokens, degrades performance, and causes context rot. Research shows performance drops sharply past ~32K tokens even in 1M-token windows.",
    },
    good: {
      label: "Retrieve only what's relevant",
      code: `// GOOD: Semantic search + relevance filtering
async function answerQuestion(question: string) {
  // 1. Embed the query
  const queryEmbedding = await embed(question);

  // 2. Retrieve only top-k relevant chunks
  const relevantDocs = await vectorDB.search({
    embedding: queryEmbedding,
    topK: 5,
    minScore: 0.7, // Filter low-relevance results
  });

  // 3. Format with clear structure
  const context = relevantDocs
    .map((doc, i) =>
      \`[Source \${i + 1}: \${doc.metadata.title}]\\n\${doc.content}\`
    )
    .join("\\n\\n");

  const response = await llm.generate({
    system: \`Answer the question using ONLY the provided
sources. Cite sources by number. If the sources don't
contain the answer, say so.\`,
    messages: [
      {
        role: "user",
        content: \`Sources:\\n\${context}\\n\\nQuestion: \${question}\`,
      },
    ],
  });

  return response;
}`,
      explanation:
        "Uses vector similarity search to pull only the most relevant chunks. Adds source attribution, sets a minimum relevance threshold, and instructs the model to cite sources — preventing hallucination.",
    },
  },
  {
    id: "compaction",
    title: "Context Compaction",
    description: "Summarizing context when approaching window limits",
    category: "Compress Strategy",
    bad: {
      label: "No compaction — context grows forever",
      code: `// BAD: Conversation grows until it crashes
const messages: Message[] = [];

async function chat(userMessage: string) {
  messages.push({ role: "user", content: userMessage });

  // Eventually this WILL exceed the context window
  const response = await llm.generate({
    system: SYSTEM_PROMPT,
    messages, // Entire history, every single message
  });

  messages.push({ role: "assistant", content: response });
  return response;
}`,
      explanation:
        "Without compaction, the conversation history grows indefinitely until it exceeds the context window. Earlier messages get dropped or the call fails entirely.",
    },
    good: {
      label: "Auto-compact when nearing limits",
      code: `// GOOD: Compact when approaching context limit
const MAX_TOKENS = 100_000;
const COMPACT_THRESHOLD = 80_000;

async function chat(userMessage: string, state: AgentState) {
  state.messages.push({ role: "user", content: userMessage });

  const tokenCount = countTokens(state.messages);

  if (tokenCount > COMPACT_THRESHOLD) {
    // Summarize the conversation so far
    const summary = await llm.generate({
      system: \`Summarize this conversation. Preserve:
- Key decisions made
- Current task state and progress
- Important facts and user preferences
- Pending action items
Be concise but complete.\`,
      messages: state.messages,
    });

    // Replace history with compact summary
    state.messages = [
      {
        role: "user",
        content: \`[Previous conversation summary]\\n\${summary}\`,
      },
    ];
    state.messages.push({ role: "user", content: userMessage });
  }

  const response = await llm.generate({
    system: SYSTEM_PROMPT,
    messages: state.messages,
  });

  state.messages.push({ role: "assistant", content: response });
  return response;
}`,
      explanation:
        "Monitors token usage and triggers compaction before hitting limits. The summary preserves critical details — decisions, state, facts, and action items — enabling long-running agent sessions without performance degradation.",
    },
  },
  {
    id: "scratchpad",
    title: "Scratchpad / Structured Note-Taking",
    description: "Persisting information outside the context window",
    category: "Write Strategy",
    bad: {
      label: "Agent relies only on context memory",
      code: `// BAD: Agent has no external memory
async function researchAgent(topic: string) {
  const results = await searchWeb(topic);
  // All findings exist only in the context window
  // If context compacts, research is lost!

  const analysis = await llm.generate({
    system: "Analyze these research results.",
    messages: [
      { role: "user", content: JSON.stringify(results) },
    ],
  });

  return analysis;
}`,
      explanation:
        "All intermediate findings live only in the context window. If the agent runs long enough to need compaction, or if the research spans many steps, critical findings are lost.",
    },
    good: {
      label: "Write findings to a scratchpad file",
      code: `// GOOD: Persist findings in structured scratchpad
interface Scratchpad {
  goal: string;
  findings: { source: string; key_points: string[] }[];
  open_questions: string[];
  conclusions: string[];
}

async function researchAgent(topic: string) {
  const scratchpad: Scratchpad = {
    goal: topic,
    findings: [],
    open_questions: [topic],
    conclusions: [],
  };

  // Write scratchpad to file so agent can access it
  await writeFile("scratchpad.md", formatScratchpad(scratchpad));

  while (scratchpad.open_questions.length > 0) {
    const question = scratchpad.open_questions.shift()!;
    const results = await searchWeb(question);

    // Agent decides what's noteworthy
    const notes = await llm.generate({
      system: \`You are a research agent. You have a
scratchpad at scratchpad.md. Update it with any new
findings. Add new questions if they arise.
Current scratchpad:
\${formatScratchpad(scratchpad)}\`,
      messages: [
        { role: "user", content: JSON.stringify(results) },
      ],
      tools: [updateScratchpadTool, searchWebTool],
    });

    // Scratchpad persists across compaction cycles
    await writeFile("scratchpad.md", formatScratchpad(scratchpad));
  }

  return scratchpad.conclusions;
}`,
      explanation:
        "The scratchpad lives outside the context window in a file. Even if the conversation compacts, the agent can re-read its scratchpad. Structured format (goal, findings, open questions, conclusions) keeps it organized.",
    },
  },
  {
    id: "tool-management",
    title: "Tool Loadout Management",
    description: "Selecting the right tools for each task",
    category: "Select Strategy",
    bad: {
      label: "Give the agent every tool at once",
      code: `// BAD: 50+ tools with overlapping descriptions
const tools = [
  searchDatabase, querySQL, findRecords,
  lookupUser, getUserProfile, fetchAccount,
  sendEmail, sendNotification, sendMessage,
  createTicket, openIssue, reportBug,
  processPayment, chargeCard, billCustomer,
  // ... 35 more tools
];

// Model confused by overlapping tool descriptions
// "Should I use searchDatabase or querySQL?"
const response = await llm.generate({
  tools, // ALL of them, every time
  messages,
});`,
      explanation:
        "With 50+ tools, especially overlapping ones (searchDatabase vs querySQL vs findRecords), the model wastes tokens reading tool definitions and often picks the wrong tool. Studies show accuracy drops 3x with large tool sets.",
    },
    good: {
      label: "Dynamic tool selection via RAG",
      code: `// GOOD: Select relevant tools per task
const toolRegistry = new Map<string, Tool>();
const toolIndex = new VectorIndex(); // Tool descriptions indexed

async function selectTools(
  taskDescription: string,
  maxTools = 8,
) {
  // 1. Embed the task
  const embedding = await embed(taskDescription);

  // 2. Find most relevant tools
  const matches = await toolIndex.search({
    embedding,
    topK: maxTools,
    minScore: 0.6,
  });

  return matches.map((m) => toolRegistry.get(m.id)!);
}

// At agent runtime:
async function runAgent(task: string) {
  const relevantTools = await selectTools(task);

  // Agent only sees tools relevant to THIS task
  const response = await llm.generate({
    system: SYSTEM_PROMPT,
    tools: relevantTools, // 5-8 focused tools
    messages,
  });

  return response;
}`,
      explanation:
        "Uses vector search over tool descriptions to dynamically select only the most relevant tools for each task. Keeps the toolset small and focused. Research shows keeping under 30 tools gives 3x better tool selection accuracy.",
    },
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Context Isolation",
    description: "Splitting tasks across agents with isolated contexts",
    category: "Isolate Strategy",
    bad: {
      label: "Single agent doing everything",
      code: `// BAD: One agent handles research + code + testing
const response = await llm.generate({
  system: \`You are a software engineer. You must:
1. Research the best approach
2. Write the implementation
3. Write comprehensive tests
4. Review the code for security issues
5. Write documentation

Do ALL of these in one conversation.\`,
  messages, // Context gets polluted with mixed concerns
});`,
      explanation:
        "A single agent juggling research, coding, testing, review, and documentation pollutes its context with unrelated information. Each task's context interferes with the others, degrading quality across all tasks.",
    },
    good: {
      label: "Specialized sub-agents with scoped contexts",
      code: `// GOOD: Orchestrator delegates to focused sub-agents
interface SubAgent {
  name: string;
  systemPrompt: string;
  tools: Tool[];
}

const agents: SubAgent[] = [
  {
    name: "researcher",
    systemPrompt: "You research technical approaches...",
    tools: [searchDocs, readPaper, summarize],
  },
  {
    name: "implementer",
    systemPrompt: "You write production code...",
    tools: [readFile, writeFile, runCommand],
  },
  {
    name: "tester",
    systemPrompt: "You write and run tests...",
    tools: [readFile, writeTest, runTests],
  },
];

async function orchestrate(task: string) {
  // 1. Research phase (isolated context)
  const research = await runSubAgent("researcher", task);

  // 2. Implement with research findings (isolated context)
  const code = await runSubAgent(
    "implementer",
    \`Task: \${task}\\nResearch: \${research.summary}\`,
  );

  // 3. Test the implementation (isolated context)
  const testResults = await runSubAgent(
    "tester",
    \`Test this implementation:\\n\${code.files}\`,
  );

  return { research, code, testResults };
}`,
      explanation:
        "Each sub-agent has its own context window focused on its specific task. The researcher's context isn't polluted with test code, and the tester isn't distracted by research papers. The orchestrator passes only summaries between agents.",
    },
  },
  {
    id: "few-shot",
    title: "Few-Shot Examples",
    description: "Showing the model what good output looks like",
    category: "Instructional Context",
    bad: {
      label: "No examples — hope the model gets it right",
      code: `// BAD: Vague instruction with no examples
const response = await llm.generate({
  system: "Extract structured data from text.",
  messages: [
    {
      role: "user",
      content: "John Smith, 35, works at Google as a PM.",
    },
  ],
});
// Output format is unpredictable:
// Sometimes JSON, sometimes markdown, sometimes prose`,
      explanation:
        "Without examples, the model has to guess the desired output format. Results are inconsistent — sometimes JSON, sometimes markdown tables, sometimes prose. Each response may have different field names.",
    },
    good: {
      label: "Concrete examples of expected I/O",
      code: `// GOOD: Few-shot examples define the contract
const response = await llm.generate({
  system: \`Extract person data as JSON.

Example input: "Jane Doe, age 28, engineer at Meta"
Example output:
{
  "name": "Jane Doe",
  "age": 28,
  "company": "Meta",
  "role": "engineer"
}

Example input: "Bob Lee - 42 - CTO @ Stripe"
Example output:
{
  "name": "Bob Lee",
  "age": 42,
  "company": "Stripe",
  "role": "CTO"
}
\`,
  messages: [
    {
      role: "user",
      content: "John Smith, 35, works at Google as a PM.",
    },
  ],
});
// Output is consistently structured JSON`,
      explanation:
        "Two examples establish the exact output format, field names, and handling of different input formats. The model now reliably produces consistent JSON with the same schema. Few-shot examples are one of the most powerful context engineering tools.",
    },
  },
];

export interface AntiPattern {
  name: string;
  icon: string;
  description: string;
  cause: string;
  symptom: string;
  fix: string;
  severity: "critical" | "high" | "medium";
}

export const antiPatterns: AntiPattern[] = [
  {
    name: "Context Rot",
    icon: "decay",
    description:
      "Unpredictable degradation of LLM performance as input context grows longer.",
    cause:
      "Transformer attention spreads thin across too many tokens. The model can't focus on what matters when drowning in irrelevant context.",
    symptom:
      "Agent ignores earlier instructions, hallucinates facts, or produces lower-quality output as conversations get longer.",
    fix: "Implement compaction — summarize conversation history when approaching token limits. Preserve key decisions, state, and facts while discarding verbose intermediate steps.",
    severity: "critical",
  },
  {
    name: "Context Poisoning",
    icon: "poison",
    description:
      "A hallucination or error enters the context and gets referenced repeatedly in future responses.",
    cause:
      "The agent generates an incorrect fact. Because it's now in the conversation history, the model treats it as ground truth in subsequent turns.",
    symptom:
      "A wrong answer early in the conversation propagates through all later responses. The agent confidently builds on false premises.",
    fix: "Validate LLM outputs at critical decision points. Use tool calls to verify facts. Implement 'fact-checking' steps where the agent re-verifies its own claims against source data.",
    severity: "critical",
  },
  {
    name: "Context Clash",
    icon: "clash",
    description:
      "Conflicting information in the context window causes contradictory or confused outputs.",
    cause:
      "RAG retrieves documents that contradict each other, or system prompt instructions conflict with few-shot examples.",
    symptom:
      "Agent flip-flops between answers, produces internally contradictory responses, or confidently asserts both sides of a contradiction. Microsoft research showed a 39% average performance drop.",
    fix: "Deduplicate and reconcile retrieved documents before injecting into context. Establish clear information hierarchy: system prompt > verified facts > retrieved docs > conversation history.",
    severity: "high",
  },
  {
    name: "Tool Overload",
    icon: "overload",
    description:
      "Too many tools with overlapping descriptions confuse the model about which to use.",
    cause:
      "Providing 30+ tools, especially ones with similar descriptions (e.g., searchDB vs querySQL vs findRecords).",
    symptom:
      "Agent picks wrong tools, calls tools unnecessarily, or wastes tokens deliberating between similar options. 3x worse tool selection accuracy with bloated toolsets.",
    fix: "Use RAG over tool descriptions to dynamically select 5-10 relevant tools per task. Ensure each tool has a unique, non-overlapping description. If a human can't decide which tool to use, neither can the model.",
    severity: "high",
  },
  {
    name: "Instruction Drift",
    icon: "drift",
    description:
      "Agent gradually stops following system prompt instructions over long conversations.",
    cause:
      "As conversation history grows, the system prompt becomes a smaller fraction of total context. Recent messages dominate attention.",
    symptom:
      "Agent follows instructions well initially but gradually deviates — forgetting formatting rules, safety constraints, or persona guidelines.",
    fix: "Reinject key instructions periodically (e.g., in user messages). Use compaction to maintain a high instruction-to-content ratio. Consider re-prompting critical rules after every N turns.",
    severity: "medium",
  },
  {
    name: "Retrieval Noise",
    icon: "noise",
    description:
      "RAG returns irrelevant or repetitive passages that dilute the context.",
    cause:
      "Low-quality embeddings, no relevance threshold, or poorly chunked documents return tangentially related content.",
    symptom:
      "Agent hallucinates despite using RAG. Answers are vague or generic because the relevant information is buried under noise. Token budget wasted on irrelevant content.",
    fix: "Set minimum similarity thresholds (e.g., 0.7). Use reranking models to sort results by relevance. Implement smart chunking strategies. Test retrieval quality independently from generation quality.",
    severity: "medium",
  },
];

export interface BestPractice {
  category: string;
  items: { title: string; description: string }[];
}

export const bestPractices: BestPractice[] = [
  {
    category: "System Prompt Design",
    items: [
      {
        title: "Find the right altitude",
        description:
          'Not too prescriptive (brittle), not too vague (unpredictable). Anthropic calls this the "Goldilocks zone."',
      },
      {
        title: "Include role, guidelines, and tool descriptions",
        description:
          "A well-structured system prompt defines who the agent is, how it should behave, and what tools it can use.",
      },
      {
        title: "Version control your prompts",
        description:
          "Treat prompts like code. Store them in version control, review changes, and test them before deploying.",
      },
      {
        title: "Test with metaprompting",
        description:
          "Use an LLM to evaluate and improve your prompts before production. Continuously evaluate prompt effectiveness.",
      },
    ],
  },
  {
    category: "Context Window Management",
    items: [
      {
        title: "Implement compaction early",
        description:
          "Don't wait for context overflow. Set a threshold (e.g., 80% of window) and summarize proactively.",
      },
      {
        title: "Monitor token usage",
        description:
          "Track tokens per component (system prompt, tools, history, RAG). Know where your token budget goes.",
      },
      {
        title: "A focused 300 tokens > unfocused 100K tokens",
        description:
          "More context is not better context. Research shows performance peaks well below maximum window sizes.",
      },
      {
        title: "Use structured formats",
        description:
          "Bullets, tables, and labeled sections help the model parse context efficiently. Avoid walls of unstructured text.",
      },
    ],
  },
  {
    category: "Retrieval (RAG)",
    items: [
      {
        title: "Set minimum relevance thresholds",
        description:
          "Don't inject documents with low similarity scores. A score threshold of 0.7+ prevents noise.",
      },
      {
        title: "Use reranking after retrieval",
        description:
          "Initial vector search is fast but imprecise. A reranker model sorts results by actual relevance.",
      },
      {
        title: "Cite sources explicitly",
        description:
          'Instruct the model to cite which source each fact comes from. This enables verification and reduces hallucination.',
      },
      {
        title: "Chunk documents intelligently",
        description:
          "Don't split mid-paragraph or mid-thought. Use semantic chunking that preserves meaningful units.",
      },
    ],
  },
  {
    category: "Tool Design",
    items: [
      {
        title: "Keep tool sets small and focused",
        description:
          "Under 30 tools per task. Use dynamic tool selection (RAG over tool descriptions) for large registries.",
      },
      {
        title: "Write clear, non-overlapping descriptions",
        description:
          "If a human engineer can't tell which tool to use, the model won't either. Each tool needs a unique purpose.",
      },
      {
        title: "Design token-efficient tool outputs",
        description:
          "Tool responses go back into context. Return structured, concise data — not raw API dumps.",
      },
      {
        title: "Validate tool inputs and outputs",
        description:
          "Use schemas (like Zod) to validate what goes into and comes out of tools. Prevent garbage propagation.",
      },
    ],
  },
  {
    category: "Multi-Agent Architecture",
    items: [
      {
        title: "Start simple, add agents when needed",
        description:
          "Begin with a single agent. Only split into multi-agent when you have clear evidence of context pollution.",
      },
      {
        title: "Pass summaries, not full context, between agents",
        description:
          "When the orchestrator delegates to a sub-agent, send a concise task description — not the entire conversation.",
      },
      {
        title: "Give each agent a focused role",
        description:
          "Specialized agents with narrow tool sets and focused system prompts outperform generalist agents.",
      },
      {
        title: "Use scratchpads for long-running workflows",
        description:
          "Persist intermediate results in files or databases. Don't rely on context window alone for multi-step tasks.",
      },
    ],
  },
];

export interface Resource {
  title: string;
  url: string;
  type: "blog" | "paper" | "repo" | "video" | "guide";
  source: string;
  description: string;
}

export const resources: Resource[] = [
  {
    title: "Effective Context Engineering for AI Agents",
    url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    type: "blog",
    source: "Anthropic",
    description:
      "Official Anthropic engineering blog on compaction, scratchpads, and multi-agent context strategies.",
  },
  {
    title: "Context Engineering for Agents",
    url: "https://blog.langchain.com/context-engineering-for-agents/",
    type: "blog",
    source: "LangChain",
    description:
      "LangChain's framework: Write, Select, Compress, Isolate strategies with LangGraph examples.",
  },
  {
    title: "A Survey of Context Engineering for Large Language Models",
    url: "https://arxiv.org/abs/2507.13334",
    type: "paper",
    source: "arXiv",
    description:
      "Comprehensive academic survey covering 1,400+ papers on context retrieval, processing, and management.",
  },
  {
    title: "Agentic Context Engineering (ACE)",
    url: "https://arxiv.org/abs/2510.04618",
    type: "paper",
    source: "arXiv",
    description:
      "How LLM agents can evolve their own contexts — +10.6% improvement on agent benchmarks.",
  },
  {
    title: "LangChain Context Engineering Notebooks",
    url: "https://github.com/langchain-ai/context_engineering",
    type: "repo",
    source: "GitHub",
    description:
      "Official notebooks demonstrating write, select, compress, and isolate strategies in LangGraph.",
  },
  {
    title: "The New Skill in AI is Not Prompting, It's Context Engineering",
    url: "https://www.philschmid.de/context-engineering",
    type: "blog",
    source: "Philipp Schmid",
    description:
      "Practical guide from a Hugging Face engineer on moving from prompt to context engineering.",
  },
  {
    title: "Context Engineering: Bringing Engineering Discipline to Prompts",
    url: "https://addyo.substack.com/p/context-engineering-bringing-engineering",
    type: "blog",
    source: "Addy Osmani",
    description:
      "Chrome engineering lead's take on treating prompts as code with testing and version control.",
  },
  {
    title: "Context Engineering Guide",
    url: "https://www.promptingguide.ai/guides/context-engineering-guide",
    type: "guide",
    source: "Prompt Engineering Guide",
    description:
      "Comprehensive reference covering all aspects of context engineering with examples.",
  },
  {
    title: "Context Engineering: A Guide With Examples",
    url: "https://www.datacamp.com/blog/context-engineering",
    type: "guide",
    source: "DataCamp",
    description:
      "Beginner-friendly guide with code examples covering RAG, memory, tools, and structured output.",
  },
  {
    title: "Context Engineering for AI Agents",
    url: "https://weaviate.io/blog/context-engineering",
    type: "blog",
    source: "Weaviate",
    description:
      "Vector database perspective on context engineering with emphasis on retrieval and storage.",
  },
];
