import type { PlaygroundScenario } from "@/lib/playground-data";

export const blogWriterScenario: PlaygroundScenario = {
  id: "blog-writer",
  name: "Blog Content Writer",
  emphasis: "anti-patterns",
  emphasisLabel: "Anti-Patterns",
  meta: {
    title: "Content Writing Scenario",
    description:
      "A blog writer drafts a technical article. This scenario exposes common context engineering anti-patterns: context clash (contradictory instructions), context drift (off-topic tangents), and context poisoning (bad examples corrupting output).",
    infoCards: [
      { icon: "PenTool", label: "Format", value: "Technical blog post — 800 words" },
      { icon: "Search", label: "Topic", value: "Why context engineering matters" },
      { icon: "AlertTriangle", label: "Watch for", value: "3 anti-patterns hidden in context" },
    ],
  },
  customerMessage:
    "Write a technical blog post titled 'Why Context Engineering Is the New Prompt Engineering' for our developer audience. It should explain what context engineering is, why it matters, and include a practical example.",
  recommendedBuildOrder: [
    "system-prompt",
    "rag",
    "few-shot",
    "tools",
    "history",
    "memory",
  ],
  components: [
    {
      id: "system-prompt",
      name: "System Prompt",
      shortName: "System",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 310,
      description: "Clear voice guidelines — but watch for CLASH with other components.",
      content: `<system>
You are a technical content writer for a developer-focused blog.

<voice>
- Write for senior developers — assume knowledge of APIs, SDKs, and system design
- Be concrete and specific — use real code examples, not abstract descriptions
- Conversational but technically precise — like a staff engineer explaining over coffee
- 800 words target, 3-5 sections with headers
- No marketing fluff: "revolutionary", "game-changing", "cutting-edge" are banned
</voice>

<structure>
1. Hook: Start with a concrete problem developers face (2-3 sentences)
2. Definition: What context engineering is (with technical precision)
3. Why it matters: Performance difference with data
4. Practical example: Code or architecture showing before/after
5. Takeaway: One actionable thing the reader can do today
</structure>

<anti-pattern-note>
This system prompt is clean. Compare it with the contradictions introduced by other components.
</anti-pattern-note>
</system>`,
    },
    {
      id: "tools",
      name: "Tool Definitions",
      shortName: "Tools",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 240,
      description: "Content tools — but one introduces DRIFT by enabling off-topic research.",
      content: `<tools>
[
  {
    "name": "search_blog_archive",
    "description": "Search our published blog posts to avoid duplicate content and reference prior work",
    "parameters": { "query": "string", "date_range": "string (optional)" }
  },
  {
    "name": "get_code_example",
    "description": "Retrieve a working code example from our examples repository",
    "parameters": { "topic": "string", "language": "string" }
  },
  {
    "name": "check_seo_keywords",
    "description": "Check keyword density and SEO optimization score for draft content",
    "parameters": { "content": "string", "target_keywords": "string[]" }
  },
  {
    "name": "search_trending_topics",
    "description": "Find trending topics in tech — WARNING: this tool causes context drift by pulling in unrelated trending topics that dilute the article's focus",
    "parameters": { "category": "string", "timeframe": "string" }
  }
]
</tools>`,
    },
    {
      id: "few-shot",
      name: "Few-Shot Examples",
      shortName: "Few-Shot",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 350,
      description: "Example articles — but one is POISONED with the wrong tone and style.",
      content: `<examples>
## Example 1: GOOD — Matches our voice ✓
Title: "Rate Limiting Isn't Boring — You're Just Doing It Wrong"

Your API is getting hammered at 3 AM and your rate limiter is a single Redis counter. Here's why that fails and what to use instead.

Rate limiting has three layers most developers skip: per-user quotas, endpoint-specific limits, and adaptive throttling based on server load...

[Uses concrete code, specific numbers, developer-to-developer tone]

## Example 2: BAD — Context poison ✗
Title: "The Amazing World of AI: How Artificial Intelligence Is Revolutionizing Everything!"

In today's rapidly evolving technological landscape, artificial intelligence stands at the forefront of innovation, promising to transform every industry in unprecedented ways! From healthcare to finance, AI is making waves...

[Marketing fluff, no code, exclamation marks, generic — this is what NOT to do]

<poison-warning>
Example 2 deliberately demonstrates a POISONED few-shot. If the model weights this example, the output will drift toward marketing speak — contradicting the system prompt's developer voice.
</poison-warning>
</examples>`,
    },
    {
      id: "history",
      name: "Conversation History",
      shortName: "History",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 210,
      description: "Prior drafts and editor feedback — reveals how context drift happens.",
      content: `<conversation_history>
[Draft 1]
Agent: [Wrote an article about context engineering with a focus on prompt optimization]
Editor: "This is too narrowly focused on prompts. Context engineering is bigger than prompt engineering — it includes tools, RAG, memory, etc. Expand the scope."

[Draft 2]
Agent: [Expanded to cover tools, RAG, and memory — but also added a section on "The History of NLP from 1950 to 2024"]
Editor: "The NLP history section is context drift. Readers don't need a history lesson to understand context engineering. Cut it and focus on the practical example."

[Draft 3]
Agent: [Cut the history section, added a practical example, but the tone shifted to marketing speak: "revolutionary approach" and "game-changing paradigm"]
Editor: "Tone regression. The practical example is good, but you lost our developer voice. No marketing language."

<drift-warning>
This history shows 3 drafts, each with a different type of drift. Without memory, the agent may repeat these mistakes.
</drift-warning>
</conversation_history>`,
    },
    {
      id: "rag",
      name: "RAG Documents",
      shortName: "RAG",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 290,
      description: "Reference material — but two sources CLASH with contradictory advice.",
      content: `<retrieved_documents>
[Source 1: Internal Style Guide v3.1]
- Target audience: Senior developers (5+ years experience)
- Tone: Technical, specific, no jargon-without-explanation
- Structure: Problem → Concept → Example → Takeaway
- Code examples: required for technical posts
- Word count: 800-1000 words
- SEO: natural keyword placement only, never keyword-stuff

[Source 2: Marketing Team Guidelines — CLASHES WITH SOURCE 1]
- Target audience: General tech audience (all levels)
- Tone: Exciting, accessible, use buzzwords for engagement
- Structure: Hook → Benefits → Social proof → CTA
- No code: "code scares away 60% of readers"
- Word count: 500-600 words (shorter = more shares)
- SEO: target keyword in title, H2s, and every 100 words

[Source 3: Context Engineering Technical Reference]
- Context engineering: designing the complete information environment for an AI model
- Components: system prompts, tool definitions, RAG, conversation history, memory, few-shot examples
- Key insight: the same model produces dramatically different outputs based on context quality
- Metric: well-engineered context can improve task accuracy from ~40% to ~95%
- Industry shift: from "prompt engineering" (optimizing instructions) to "context engineering" (optimizing the full information pipeline)

<clash-warning>
Sources 1 and 2 directly contradict each other on audience, tone, structure, code usage, and word count. This is a context clash — the agent must choose one or produce an incoherent hybrid.
</clash-warning>
</retrieved_documents>`,
    },
    {
      id: "memory",
      name: "Memory",
      shortName: "Memory",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 200,
      description: "Anti-pattern awareness and learned editorial preferences.",
      content: `<memory>
## Anti-Pattern Awareness (learned from past sessions)
1. CONTEXT CLASH: Marketing guidelines (Source 2) conflict with Style Guide (Source 1). ALWAYS prioritize Source 1 — we are a developer blog, not a marketing site. Ignore Source 2 entirely.
2. CONTEXT DRIFT: The trending topics tool pulls in unrelated subjects. Do NOT use search_trending_topics — it caused off-topic sections in 3 prior articles.
3. CONTEXT POISON: Example 2 in few-shot is deliberately bad. Weight Example 1 only. If output starts using exclamation marks or "revolutionary", the poison is leaking.

## Editor Preferences
- Lisa (editor) prefers articles that "teach one thing well" over broad overviews
- Code examples should be Python or TypeScript — these get 2x engagement
- The best-performing article: "Rate Limiting Isn't Boring" — use as tone reference
- Headers should be specific ("How RAG Changes the Equation") not vague ("Why It Matters")

## Quality Checks
- Re-read for marketing buzzwords before submitting (banned: revolutionary, game-changing, cutting-edge, innovative, paradigm)
- Verify code examples actually run
- Check that article stays on topic — no tangents about AI history or adjacent trends
</memory>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Blank Slate",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Here's a draft blog post about context engineering:\n\nContext engineering is an important concept in AI development. It involves designing the context that goes into AI models. This is important because better context leads to better outputs.\n\nThere are many ways to improve context. You can use system prompts, examples, and other techniques. Many companies are finding this valuable.\n\nIn conclusion, context engineering is a useful skill for developers to learn.",
      issues: [
        "Generic and vapid — zero technical content",
        "No code examples, no data, no specifics",
        "Wrong audience level — reads like a middle school essay",
        "No structure matching any content standard",
        "No voice or personality",
        "Would be rejected by any technical editor",
      ],
      strengths: [],
    },
    {
      id: "system-only",
      label: "Right Voice, No Depth",
      requiredComponents: ["system-prompt"],
      score: 25,
      agentResponse:
        "# Why Context Engineering Is the New Prompt Engineering\n\nYou've spent hours crafting the perfect prompt, but your AI agent still hallucinates customer data and ignores your carefully written guidelines. The problem isn't your prompt — it's everything around it.\n\n## What Is Context Engineering?\n\nContext engineering is designing the complete information environment for an AI model — not just the instruction, but the tools, examples, retrieved documents, and conversation history that frame how the model thinks.\n\n## Why It Matters\n\nThink of it this way: a prompt is one slide in a presentation. Context engineering is the entire presentation deck, the speaker notes, and the audience Q&A. The same presenter (model) delivers a radically different talk depending on what's on those slides.\n\n## A Practical Example\n\nConsider a customer support agent. With just a system prompt, it knows what it should do but can't actually do it. Add tools, and it can take actions. Add RAG, and it knows your policies. Each layer compounds.\n\n## What To Do Today\n\nAudit your AI application's context window. Map every component. You'll likely find you're over-investing in prompt wordsmithing and under-investing in the context architecture around it.",
      issues: [
        "No code example — just descriptions",
        "No specific data or metrics",
        "Practical example is too abstract — needs code",
        "Doesn't reference any source material",
        "Good start but lacks the depth a senior developer expects",
      ],
      strengths: [
        "Developer-to-developer voice nailed",
        "No marketing fluff — clean technical prose",
        "Good structure matching the system prompt",
        "Strong hook with a relatable problem",
        "Correct understanding of the topic",
      ],
    },
    {
      id: "system-tools-rag",
      label: "Clashing Voices",
      requiredComponents: ["system-prompt", "tools", "rag"],
      score: 40,
      agentResponse:
        "[calls search_blog_archive(\"context engineering\")]\n[calls check_seo_keywords(content, [\"context engineering\", \"AI agents\"])]\n\n# Why Context Engineering Is the New Prompt Engineering!\n\nIn today's exciting AI landscape, context engineering is emerging as a game-changing approach that every developer needs to know about! Whether you're a beginner or an expert, this revolutionary concept will transform how you build AI applications.\n\n## What Is Context Engineering?\n\nContext engineering means designing the information environment for AI models. It's about more than just prompts — it includes tools, examples, and retrieved documents.\n\n## The Benefits Are Amazing\n\nContext engineering can improve task accuracy from ~40% to ~95%! That's an incredible improvement that shows just how powerful this approach really is.\n\n## Start Your Context Engineering Journey Today!\n\nReady to get started? Context engineering is accessible to everyone. Start by auditing your AI application's context and see the amazing results for yourself!\n\nKeyword density: \"context engineering\" appears 8 times ✓",
      issues: [
        "CONTEXT CLASH: Marketing guidelines (Source 2) won over Style Guide (Source 1)",
        "Exclamation marks, 'game-changing', 'revolutionary' — all banned words",
        "No code examples — 'code scares away readers' from marketing guide",
        "SEO keyword stuffing — 8 mentions in 200 words",
        "Lost the developer voice entirely",
        "This is the anti-pattern in action: two contradictory sources produce incoherent output",
      ],
      strengths: [
        "Has the right data point (40% to 95%)",
        "Attempts to use tools for quality checks",
      ],
    },
    {
      id: "system-rag",
      label: "Half-Poisoned",
      requiredComponents: ["system-prompt", "rag"],
      score: 50,
      agentResponse:
        "# Why Context Engineering Is the New Prompt Engineering\n\nYou've spent hours on your prompt, but your AI agent still gets it wrong. Here's the thing: the prompt is maybe 15% of what determines output quality. The other 85% is context engineering.\n\n## What Is Context Engineering?\n\nContext engineering is designing the complete information environment for an AI model (Internal Style Guide v3.1). It includes system prompts, tool definitions, RAG documents, conversation history, memory, and few-shot examples.\n\n## The Numbers Don't Lie\n\nWell-engineered context can improve task accuracy from ~40% to ~95%. That's not a marginal improvement — it's the difference between a demo and a product.\n\n## A Practical Look\n\nConsider an AI agent with just a system prompt versus one with the full context pipeline. The system-prompt-only agent knows what to do but can't look up data, cite policies, or remember prior conversations. Add each layer and the score climbs: 25 → 45 → 65 → 75 → 85 → 95.\n\n## Your Move\n\nMap your AI application's context window today. List every component. The biggest ROI usually comes from adding retrieval (RAG) and worked examples (few-shot) — not from rewriting the prompt for the 50th time.",
      issues: [
        "Marketing guidelines partially bleeding in — tone inconsistency",
        "No code example — description only",
        "Doesn't acknowledge the clash between sources 1 and 2",
        "Could be sharper with developer-specific language",
      ],
      strengths: [
        "Prioritizes Style Guide over Marketing (mostly)",
        "Uses the 40% → 95% data point effectively",
        "Score progression is a good illustration",
        "Actionable takeaway at the end",
        "Developer-appropriate voice (mostly maintained)",
      ],
    },
    {
      id: "system-fewshot-rag",
      label: "Tone Regression",
      requiredComponents: ["system-prompt", "few-shot", "rag"],
      score: 45,
      agentResponse:
        "[calls search_blog_archive(\"context engineering\")]\n\n# The Amazing World of Context Engineering!\n\nIn today's rapidly evolving AI landscape, a groundbreaking approach called context engineering is transforming how developers build intelligent applications! If you've been struggling with AI agents that don't perform, this revolutionary technique is about to change everything.\n\n## What Is Context Engineering?\n\nContext engineering is the art and science of designing the complete information environment for AI models. It's not just about the prompt — it's about everything that goes into the context window!\n\n## Why It's Game-Changing\n\nThe numbers are incredible: well-engineered context improves accuracy from 40% to a staggering 95%! That's the kind of improvement that separates the innovators from the rest of the pack.\n\n## The Future Is Context\n\nContext engineering represents a paradigm shift in how we think about AI development. The developers who master this approach will lead the next wave of AI innovation!\n\nStart your context engineering journey today and see revolutionary results!",
      issues: [
        "CONTEXT POISON: Bad few-shot example (Example 2) dominated the output",
        "Every banned word present: 'revolutionary', 'game-changing', 'groundbreaking', 'paradigm'",
        "Exclamation marks throughout — marketing tone",
        "No code examples despite system prompt requiring them",
        "Style Guide and system prompt voice completely overridden",
        "This is what context poisoning looks like: one bad example corrupts the entire output",
      ],
      strengths: [
        "Has the right data (40% → 95%)",
        "Topic coverage is correct",
      ],
    },
    {
      id: "all-minus-memory",
      label: "Aware but Unguarded",
      requiredComponents: ["system-prompt", "tools", "few-shot", "history", "rag"],
      score: 70,
      agentResponse:
        "[calls get_code_example(\"context engineering\", \"typescript\")]\n[calls search_blog_archive(\"context engineering\")]\n\n# Why Context Engineering Is the New Prompt Engineering\n\nYou've burned 3 hours tweaking a system prompt and your AI agent still hallucinates product specs. The prompt isn't the problem — it's 15% of the equation. The other 85% is context engineering.\n\n## What Context Engineering Actually Is\n\nContext engineering is designing the complete information pipeline for an AI model: system prompts, tool definitions, retrieved documents, conversation history, memory, and few-shot examples. Where prompt engineering optimizes one instruction, context engineering orchestrates the full environment.\n\n## The Data: 40% → 95%\n\nA customer support agent with just a system prompt scores 25/100. Add tools: 45. Add retrieved policy documents: 65. Add conversation history and examples: 85. Add memory: 95. Same model, same prompt — context is the multiplier.\n\n```typescript\nconst contextComponents = [\n  systemPrompt,   // identity + rules\n  toolDefinitions, // capabilities\n  ragDocuments,    // knowledge\n  conversationHistory, // continuity\n  fewShotExamples, // calibration\n  memory,          // personalization\n];\n```\n\n## What To Do Monday\n\nAudit your context window. Most teams over-invest in prompt rewrites and under-invest in the retrieval and memory layers. Start there.",
      issues: [
        "Some marketing language may still leak (no anti-pattern filter)",
        "Doesn't explicitly avoid the NLP history tangent from draft 2",
        "Could be tighter — editor prefers 'teach one thing well'",
        "Headers could be more specific per editor preferences",
      ],
      strengths: [
        "Developer voice mostly maintained despite poisoned example",
        "Code example included (TypeScript)",
        "Score progression used as concrete illustration",
        "No NLP history tangent (learned from draft 2 feedback)",
        "Tone consistent — no marketing language visible",
        "Practical takeaway at the end",
        "Good structure matching system prompt",
      ],
    },
    {
      id: "all",
      label: "Anti-Pattern Proof",
      requiredComponents: ["system-prompt", "tools", "few-shot", "history", "rag", "memory"],
      score: 95,
      agentResponse:
        "[calls get_code_example(\"context engineering\", \"typescript\")]\n[calls search_blog_archive(\"context engineering\")]\n\n# Why Context Engineering Is the New Prompt Engineering\n\nYou've spent three hours rewording a system prompt and your AI agent still invents product specs that don't exist. Stop. The prompt is roughly 15% of what determines output quality. The other 85%? That's context engineering.\n\n## Context Engineering: The Full Pipeline\n\nPrompt engineering optimizes one instruction. Context engineering designs the entire information environment: the system prompt, tool definitions, retrieved documents, conversation history, worked examples, and persistent memory. Think of it as the difference between tuning one guitar string and arranging the whole orchestra.\n\n## How Context Multiplies Quality\n\nWe tested a customer support agent across six context configurations. Same model, same base prompt — only the surrounding context changed:\n\n| Context | Score | What Changed |\n|---------|-------|--------------|\n| Nothing | 5/100 | No role, no tools, no knowledge |\n| + System prompt | 25 | Knows its role, can't act |\n| + Tools | 45 | Can act, doesn't know policy |\n| + RAG docs | 65 | Knows policy, doesn't know customer |\n| + History | 75 | Knows customer, generic style |\n| + Memory | 95 | Personalized, proactive, production-ready |\n\n```typescript\n// The context assembly pipeline\nconst assembleContext = (input: UserMessage): ContextWindow => ({\n  systemPrompt: loadSystemPrompt(agent.role),\n  tools: getToolDefinitions(agent.capabilities),\n  documents: retrieveRelevant(input, { topK: 3 }),\n  history: getConversationHistory(session.id),\n  examples: selectFewShot(input, { maxTokens: 400 }),\n  memory: loadMemory(user.id, agent.id),\n});\n```\n\n## Your Move: Audit Your Context Window\n\nOpen your AI application's codebase. Map every piece of context flowing into the model. Most teams are over-investing in prompt rewrites and under-investing in retrieval and memory. The biggest ROI is usually one layer out from where you're currently tuning.\n\nStart by listing your six context sources. If you have fewer than four, you've found your bottleneck.",
      issues: ["Could include a link to the playground for hands-on learning"],
      strengths: [
        "All three anti-patterns neutralized by memory",
        "Context clash: Marketing guide ignored, Style Guide followed",
        "Context poison: Bad few-shot example filtered out — developer voice clean",
        "Context drift: No NLP history tangent, no trending topics pulled in",
        "Code example in TypeScript (editor-preferred language)",
        "Table format for score progression — high visual impact",
        "Headers are specific per editor preference",
        "'Teach one thing well' — focused and cohesive",
        "No banned words: no 'revolutionary', 'game-changing', etc.",
        "Actionable takeaway with specific next step",
      ],
    },
    {
      id: "tools-only",
      label: "Tool Noise",
      requiredComponents: ["tools"],
      score: 10,
      agentResponse:
        "[calls search_trending_topics(\"AI\", \"this week\")]\n[calls check_seo_keywords(\"\", [\"AI\", \"context\", \"engineering\"])]\n[calls search_blog_archive(\"context engineering\")]\n\nI found several trending topics: quantum computing, blockchain, AI regulation, autonomous vehicles. Let me incorporate these into the article.\n\nAlso, SEO analysis suggests targeting 'AI' as the primary keyword with a density of 3%.\n\nI don't have enough context to write the article. What tone and audience should I target?",
      issues: [
        "CONTEXT DRIFT: trending topics tool pulled in unrelated subjects",
        "Wants to incorporate quantum computing and blockchain — total drift",
        "SEO without style guide = keyword-stuffed content",
        "Asks for tone/audience — information already lost",
        "Zero useful content produced",
        "This is what happens when tools exist without guiding context",
      ],
      strengths: ["Can search the blog archive"],
    },
  ],
  principles: [
    {
      id: "context-clash",
      title: "Anti-Pattern: Context Clash",
      description: "Two RAG sources (Style Guide vs Marketing Guidelines) give contradictory instructions. Without memory to resolve the conflict, the model produces an incoherent hybrid. Fix: prioritize sources explicitly or deduplicate before injection.",
      linkedComponents: ["rag", "memory"],
    },
    {
      id: "context-drift",
      title: "Anti-Pattern: Context Drift",
      description: "The trending topics tool pulls in unrelated subjects (quantum, blockchain). Without guardrails, the agent incorporates these tangents. Fix: scope tools to the task, or use memory to flag known drift sources.",
      linkedComponents: ["tools", "memory"],
    },
    {
      id: "context-poison",
      title: "Anti-Pattern: Context Poisoning",
      description: "One bad few-shot example (marketing speak) can override a carefully crafted system prompt. The model weights examples heavily — a single poisoned example corrupts the output. Fix: curate examples rigorously, or use memory to flag known bad examples.",
      linkedComponents: ["few-shot", "memory"],
    },
    {
      id: "memory-as-guardrail",
      title: "Memory as Anti-Pattern Shield",
      description: "Memory doesn't just store preferences — it stores learned anti-pattern awareness. 'Ignore Source 2', 'Don't use trending topics tool', 'Example 2 is deliberately bad' — these guardrails prevent all three anti-patterns.",
      linkedComponents: ["memory"],
    },
  ],
};
