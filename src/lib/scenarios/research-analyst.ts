import type { PlaygroundScenario } from "@/lib/playground-data";

export const researchAnalystScenario: PlaygroundScenario = {
  id: "research-analyst",
  name: "Research Analyst",
  emphasis: "token-efficiency",
  emphasisLabel: "Token Efficiency",
  meta: {
    title: "Research Analysis Scenario",
    description:
      "A research analyst synthesizes information about a market trend. This scenario demonstrates how compressed, high-signal context outperforms verbose, low-signal context — doing more with fewer tokens.",
    infoCards: [
      { icon: "Search", label: "Topic", value: "AI agent market — 2024 trends" },
      { icon: "FileText", label: "Sources", value: "3 reports, 2 articles" },
      { icon: "AlertTriangle", label: "Constraint", value: "4K token budget" },
    ],
  },
  customerMessage:
    "Write a 3-paragraph executive briefing on the AI agent market opportunity for 2025. Focus on market size, key players, and enterprise adoption barriers. Our board meeting is tomorrow.",
  recommendedBuildOrder: [
    "system-prompt",
    "rag",
    "tools",
    "few-shot",
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
      tokens: 220,
      description: "Concise role with output constraints — optimized for token efficiency.",
      content: `<system>
You are a senior research analyst preparing executive briefings.

<constraints>
- Output: exactly 3 paragraphs
- Tone: authoritative, data-driven, no hedging
- Citations: inline (Source Name, Date)
- Numbers: always include source and date
- No filler phrases: "It's worth noting", "Interestingly", etc.
- Budget: the context window is limited — every token must earn its place
</constraints>

<structure>
P1: Market size + growth trajectory (with numbers)
P2: Key players + competitive landscape
P3: Enterprise adoption barriers + our opportunity
</structure>
</system>`,
    },
    {
      id: "tools",
      name: "Tool Definitions",
      shortName: "Tools",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 200,
      description: "Research tools for fact-checking and source verification.",
      content: `<tools>
[
  {
    "name": "search_reports",
    "description": "Search internal research database for reports and data",
    "parameters": { "query": "string", "date_range": "string (optional)", "source_type": "report|article|data" }
  },
  {
    "name": "verify_stat",
    "description": "Cross-reference a statistic against our verified data sources",
    "parameters": { "claim": "string", "source": "string" }
  },
  {
    "name": "get_company_profile",
    "description": "Retrieve competitive intelligence for a company",
    "parameters": { "company_name": "string" }
  },
  {
    "name": "calculate_market_metrics",
    "description": "Calculate market growth rates, TAM/SAM/SOM from raw data",
    "parameters": { "metric": "string", "data_points": "number[]" }
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
      tokens: 280,
      description: "One compressed example briefing showing the exact tone and density expected.",
      content: `<examples>
## Example: Cloud Infrastructure Briefing (Q2 2024)

The global cloud infrastructure market reached $79B in Q2 2024, up 22% YoY (Synergy Research, July 2024). AWS maintains 31% share, Azure 25%, GCP 11% — but the gap is narrowing at 2pts/year. Edge compute is the fastest-growing segment at 34% CAGR, driven by latency-sensitive AI workloads (Gartner, June 2024).

Three dynamics are reshaping competition. First, sovereign cloud mandates in EU and APAC are creating $12B in addressable market that hyperscalers cannot serve alone (IDC, May 2024). Second, GPU-as-a-service is emerging as a fourth pillar alongside compute, storage, and networking. Third, Kubernetes-native platforms (e.g., CoreWeave) are capturing AI-specific workloads at 3x the margin of general compute.

Enterprise adoption faces two structural barriers: data residency compliance (cited by 67% of CIOs) and multi-cloud complexity (McKinsey, Q2 2024). Our opportunity is the compliance automation layer — a $4.2B segment growing at 28% where no vendor has >8% share.
</examples>`,
    },
    {
      id: "history",
      name: "Conversation History",
      shortName: "History",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 180,
      description: "Prior briefing requests showing what the board cares about.",
      content: `<conversation_history>
[Previous Request — Q2 Board Prep]
User: "Briefing on cloud cost optimization trends."
Agent: [Delivered 3-paragraph briefing — board liked the data density but asked for more competitive framing]

[Feedback]
User: "Board wants to see where WE fit in the landscape, not just market overview. Always end with our specific opportunity."

[Previous Request — Q3 Strategy]
User: "Compare our positioning vs. top 3 competitors."
Agent: [Delivered comparison — board praised the specificity of market share numbers]
User: "This is the format they like. Always cite specific numbers with sources."
</conversation_history>`,
    },
    {
      id: "rag",
      name: "RAG Documents",
      shortName: "RAG",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 310,
      description: "Compressed research data — high signal density, no filler.",
      content: `<retrieved_documents>
[Source: Gartner AI Agent Forecast, Sept 2024 — COMPRESSED]
- AI agent market: $5.1B (2024) → projected $47B (2028), 74% CAGR
- Enterprise AI agent adoption: 12% (2024), projected 62% (2027)
- Top use cases: customer service (34%), code generation (28%), data analysis (21%)
- Average deployment: 4.2 agents per enterprise, up from 1.1 in 2023

[Source: a16z AI Agent Landscape, Aug 2024 — COMPRESSED]
- Key players: OpenAI (Assistants API), Anthropic (Claude tools), Google (Gemini agents), Microsoft (Copilot Studio)
- Startup layer: LangChain, CrewAI, AutoGen — $2.3B combined funding
- Infrastructure: 73% of agents built on top of 3 foundation model providers
- Differentiation shifting from model quality → context engineering + tool integration

[Source: McKinsey Enterprise AI Survey, July 2024 — COMPRESSED]
- Barrier #1: Data privacy/security (cited by 71% of enterprises)
- Barrier #2: Integration with existing systems (64%)
- Barrier #3: Lack of in-house expertise (58%)
- Barrier #4: Unclear ROI measurement (49%)
- Companies with dedicated AI platform teams: 3.2x more likely to succeed

[Source: Internal Strategy Doc — Q4 Priorities]
- Our TAM: context engineering platform = $8.2B by 2027
- Current market share: <1% (early entrant)
- Competitive advantage: developer-first, framework-agnostic
- Board priority: enterprise pilot conversions (currently 23% → target 45%)
</retrieved_documents>`,
    },
    {
      id: "memory",
      name: "Memory",
      shortName: "Memory",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 160,
      description: "Board preferences and analyst's learned writing patterns.",
      content: `<memory>
## Board Preferences (learned across sessions)
- Prefer numbers over narratives — always lead with data
- Want competitive framing — "where do we win?"
- Dislike hedging language — be definitive
- Appreciate when our opportunity is quantified with TAM/share
- Time-sensitive: tomorrow's meeting means no follow-up rounds

## Analyst Patterns
- Best-received briefings: 200-250 words per paragraph
- Citation format they prefer: (Source Name, Date)
- Always end with specific action opportunity, not general observation
- Use bullet points sparingly — board prefers flowing prose with embedded data

## Token Efficiency Notes
- RAG documents are pre-compressed (summaries, not full reports)
- Each source contributes ~3-4 key data points
- Redundant information across sources already deduplicated
- Total context is 40% smaller than raw source documents
</memory>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Generic Filler",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "The AI agent market is growing rapidly and represents a significant opportunity. Many companies are investing in AI agents for various use cases. There are several challenges to adoption, but the market is expected to grow substantially in the coming years.\n\nKey players include major tech companies and startups. The competitive landscape is evolving as new entrants bring innovative approaches to market.\n\nEnterprise adoption faces challenges including security concerns, integration complexity, and skills gaps. However, the market opportunity remains compelling for companies positioned to address these barriers.",
      issues: [
        "Zero specific data points — no numbers, no sources",
        "Generic statements that could apply to any tech market",
        "No competitive framing or company positioning",
        "Filler phrases: 'significant opportunity', 'substantial growth'",
        "Useless for a board meeting — lacks credibility",
        "No structure matching the briefing format",
      ],
      strengths: [],
    },
    {
      id: "system-only",
      label: "Structured but Empty",
      requiredComponents: ["system-prompt"],
      score: 20,
      agentResponse:
        "The AI agent market is experiencing rapid growth, though I don't have specific market size figures to cite. Industry analysts project significant expansion through 2028, driven by enterprise demand for automation. Customer service and code generation are among the leading use cases.\n\nThe competitive landscape includes major foundation model providers building agent capabilities, alongside a growing ecosystem of agent framework startups. Differentiation is shifting from pure model quality toward tooling and integration capabilities.\n\nEnterprise adoption barriers include data security, system integration complexity, and expertise gaps. Our opportunity lies in addressing these barriers with a developer-focused platform approach.",
      issues: [
        "No specific numbers — admits it doesn't have data",
        "Cannot cite sources — no research material available",
        "Vague competitive landscape ('major providers', 'startups')",
        "Our opportunity is generic — no TAM or market share",
        "Board would reject this for lacking data density",
      ],
      strengths: [
        "Correct 3-paragraph structure",
        "No filler phrases — concise language",
        "Follows P1/P2/P3 topic structure from prompt",
        "Authoritative tone (despite lacking data)",
      ],
    },
    {
      id: "system-rag",
      label: "Data-Rich Draft",
      requiredComponents: ["system-prompt", "rag"],
      score: 55,
      agentResponse:
        "The AI agent market reached $5.1B in 2024 and is projected to hit $47B by 2028, a 74% CAGR (Gartner, Sept 2024). Enterprise adoption is accelerating from 12% to a projected 62% by 2027, with the average enterprise running 4.2 agents, up from 1.1 in 2023. Top use cases are customer service (34%), code generation (28%), and data analysis (21%).\n\nFour players dominate: OpenAI (Assistants API), Anthropic (Claude tools), Google (Gemini agents), and Microsoft (Copilot Studio). The startup layer — LangChain, CrewAI, AutoGen — has attracted $2.3B in combined funding (a16z, Aug 2024). Critically, 73% of agents are built on just 3 foundation model providers, and differentiation is shifting from model quality to context engineering and tool integration.\n\nAdoption barriers are structural: data privacy (71%), system integration (64%), expertise gaps (58%), and unclear ROI (49%) (McKinsey, July 2024). Our context engineering platform addresses a $8.2B TAM by 2027 where we hold <1% share. Companies with dedicated AI platform teams are 3.2x more likely to succeed — positioning our developer-first, framework-agnostic approach as the enabling layer.",
      issues: [
        "Doesn't know board prefers competitive framing",
        "Doesn't know board wanted 'where do we win' positioning",
        "Paragraph density slightly unbalanced",
        "No reference to pilot conversion targets or metrics board tracks",
      ],
      strengths: [
        "Every claim backed by specific source and date",
        "High data density — numbers in every sentence",
        "Correct structure: market → players → opportunity",
        "Our positioning with specific TAM and share",
        "Token-efficient RAG: compressed sources, no filler",
      ],
    },
    {
      id: "system-tools-rag",
      label: "Verified Analysis",
      requiredComponents: ["system-prompt", "tools", "rag"],
      score: 65,
      agentResponse:
        "[calls verify_stat(\"AI agent market $5.1B 2024\", \"Gartner\")]\n[calls verify_stat(\"74% CAGR to $47B by 2028\", \"Gartner\")]\n\nThe AI agent market reached $5.1B in 2024, projected to $47B by 2028 at 74% CAGR (Gartner, Sept 2024 — verified). Enterprise adoption stands at 12%, projected to reach 62% by 2027, with 4.2 agents per enterprise versus 1.1 last year. Customer service (34%), code generation (28%), and data analysis (21%) drive adoption.\n\nFour players anchor the market: OpenAI, Anthropic, Google, and Microsoft on the model layer, with LangChain, CrewAI, and AutoGen ($2.3B combined funding) on the framework layer (a16z, Aug 2024). The critical shift: 73% of agents are built on 3 model providers, making differentiation a function of context engineering and tool integration, not model quality.\n\nStructural barriers remain: data privacy (71% of enterprises), system integration (64%), expertise gaps (58%) (McKinsey, July 2024). Our opportunity: context engineering platforms represent an $8.2B TAM by 2027. No vendor holds >5% share. Our developer-first approach targets the enabling layer where enterprises with dedicated AI teams succeed at 3.2x the rate of those without.",
      issues: [
        "Board preferences not incorporated (learned from past sessions)",
        "Doesn't end with specific action opportunity",
        "No mention of pilot conversion metrics board tracks",
        "Competitive framing could be sharper per board feedback",
      ],
      strengths: [
        "Statistics cross-verified via tools before citing",
        "High data density with inline citations",
        "Market → Players → Opportunity structure",
        "Specific TAM and competitive positioning",
        "Token-efficient — no filler or hedging",
      ],
    },
    {
      id: "all-minus-memory",
      label: "Board-Ready Draft",
      requiredComponents: ["system-prompt", "tools", "few-shot", "rag", "history"],
      score: 85,
      agentResponse:
        "[calls verify_stat(\"AI agent market $5.1B 2024\", \"Gartner\")]\n\nThe AI agent market hit $5.1B in 2024 and is on track for $47B by 2028 — a 74% CAGR that outpaces cloud infrastructure's peak growth (Gartner, Sept 2024). Enterprise adoption is inflecting: 12% today, projected 62% by 2027, with deployments scaling from 1.1 to 4.2 agents per enterprise in a single year. The demand is concentrated in customer service (34%), code generation (28%), and data analysis (21%).\n\nThe competitive landscape has two layers. Foundation providers — OpenAI, Anthropic, Google, Microsoft — own the model layer, but 73% of agents are built on just 3 of them, commoditizing model access (a16z, Aug 2024). The framework layer (LangChain, CrewAI, AutoGen; $2.3B in combined funding) is where differentiation lives: context engineering and tool integration, not model quality. This shift creates an opening.\n\nFour barriers gate enterprise adoption: data privacy (71%), system integration (64%), expertise gaps (58%), and unclear ROI (49%) (McKinsey, July 2024). Our context engineering platform targets the $8.2B enabling layer — a segment where no vendor holds >5% share and where companies with dedicated AI platform teams succeed at 3.2x the rate. We are positioned to be that platform team for enterprises that don't have one.",
      issues: [
        "Doesn't apply board's specific preference for competitive framing",
        "Missing pilot conversion metric (23% → 45% target)",
        "Could quantify our specific opportunity more precisely",
      ],
      strengths: [
        "Data density matches example briefing format",
        "Every paragraph leads with numbers",
        "Competitive framing incorporated per board feedback",
        "Ends with specific positioning statement",
        "Citations inline with source and date",
        "No hedging or filler — authoritative tone throughout",
        "Matches prior feedback: 'where do we fit'",
      ],
    },
    {
      id: "all",
      label: "Board-Ready Final",
      requiredComponents: ["system-prompt", "tools", "few-shot", "history", "rag", "memory"],
      score: 95,
      agentResponse:
        "[calls verify_stat(\"AI agent market $5.1B 2024\", \"Gartner\")]\n\nThe AI agent market hit $5.1B in 2024 and is on track for $47B by 2028 — a 74% CAGR that outpaces cloud infrastructure's peak growth (Gartner, Sept 2024). Enterprise adoption is inflecting: 12% today, projected 62% by 2027, with deployments scaling from 1.1 to 4.2 agents per enterprise in one year. Demand concentrates in customer service (34%), code generation (28%), and data analysis (21%) — all segments where context engineering determines agent quality.\n\nThe competitive map has two layers, and we need to be on the right one. Foundation model providers (OpenAI, Anthropic, Google, Microsoft) own infrastructure, but 73% of agents run on just 3 providers — model access is commoditizing (a16z, Aug 2024). Value is migrating to the framework layer: context engineering + tool integration. LangChain, CrewAI, and AutoGen have raised $2.3B combined, but none offer an enterprise-grade, framework-agnostic platform. That's our gap.\n\nFour barriers gate enterprise adoption: data privacy (71%), system integration (64%), expertise gaps (58%), unclear ROI (49%) (McKinsey, July 2024). Our context engineering platform addresses the $8.2B enabling layer where no vendor holds >5% share. Enterprises with dedicated AI platform teams succeed at 3.2x the rate — we are that team, externalized. Current pilot conversion sits at 23%; reaching our 45% target would put us at $12M ARR by Q3, making the board's growth mandate achievable within this fiscal year.",
      issues: ["Could include a one-line competitive threat assessment"],
      strengths: [
        "Board preferences fully applied: competitive framing, data density, 'where do we win'",
        "Pilot conversion metric included (23% → 45%)",
        "Specific ARR projection tied to board's growth mandate",
        "Token-efficient: compressed RAG = 40% fewer tokens than raw reports",
        "Authoritative tone — no hedging per board preference",
        "Ends with quantified action opportunity",
        "Every sentence earns its token cost",
        "Matches the exact format board praised in prior sessions",
      ],
    },
    {
      id: "rag-only",
      label: "Data Dump",
      requiredComponents: ["rag"],
      score: 15,
      agentResponse:
        "Here's what the research shows:\n\n- AI agent market: $5.1B (2024) → $47B (2028), 74% CAGR\n- Enterprise adoption: 12% → 62% by 2027\n- Top use cases: customer service 34%, code gen 28%, data analysis 21%\n- Key players: OpenAI, Anthropic, Google, Microsoft\n- Startups: LangChain, CrewAI, AutoGen — $2.3B funding\n- Barriers: privacy 71%, integration 64%, expertise 58%, ROI 49%\n- Our TAM: $8.2B by 2027, <1% share\n\nLet me know if you'd like me to organize this differently.",
      issues: [
        "Bullet-point dump — not a briefing",
        "No synthesis or analysis — just regurgitated data",
        "No narrative structure or competitive framing",
        "Board cannot present bullet points to investors",
        "No writing quality — generic connector phrases",
        "Doesn't match any briefing format",
      ],
      strengths: [
        "Has the right data points available",
        "Numbers are accurate from sources",
      ],
    },
    {
      id: "system-fewshot",
      label: "Polished but Hollow",
      requiredComponents: ["system-prompt", "few-shot"],
      score: 30,
      agentResponse:
        "The AI agent market is experiencing a growth trajectory comparable to cloud infrastructure's early expansion, though I cannot cite specific market size figures. Enterprise adoption is accelerating across customer service, code generation, and data analysis, with the average enterprise deploying multiple agents where a year ago they had one.\n\nThe competitive landscape bifurcates into foundation model providers and framework builders. The model layer is consolidating around a handful of providers, commoditizing access. Value is migrating to the integration and orchestration layer, where startups are attracting significant venture funding. Differentiation increasingly comes from context engineering and tool integration rather than model quality.\n\nEnterprise adoption is gated by data privacy, system integration complexity, and expertise gaps. Our platform targets the enabling layer for enterprises building AI agent capabilities — a segment where market leadership is still up for grabs.",
      issues: [
        "No specific numbers — reads as opinion, not research",
        "No source citations — board can't verify claims",
        "Sounds authoritative but is making things up",
        "Cannot quantify our opportunity or market position",
        "Would not survive a 'what's your source?' question",
      ],
      strengths: [
        "Matches the prose style of the example briefing",
        "Correct paragraph structure and topic flow",
        "No filler phrases — learned from example",
        "Competitive framing present (model vs. framework layers)",
      ],
    },
  ],
  principles: [
    {
      id: "compress-dont-truncate",
      title: "Compress, Don't Truncate",
      description: "RAG documents are pre-compressed summaries, not truncated full reports. Each source contributes 3-4 key data points. This delivers the same analytical value at 40% fewer tokens.",
      linkedComponents: ["rag"],
    },
    {
      id: "signal-density",
      title: "Signal Density Over Volume",
      description: "The system prompt is only 220 tokens but packs constraints, structure, and anti-patterns. More tokens ≠ better results. A 220-token prompt with high signal beats a 500-token prompt with filler.",
      linkedComponents: ["system-prompt"],
    },
    {
      id: "every-token-earns-its-place",
      title: "Every Token Earns Its Place",
      description: "Compare the 'Data Dump' (RAG-only) response to the 'Board-Ready Final'. The same data points are used, but structured context turns raw data into actionable intelligence. Token cost is similar; value is 5x higher.",
      linkedComponents: ["system-prompt", "rag", "few-shot"],
    },
    {
      id: "learned-preferences-save-retries",
      title: "Learned Preferences Save Retries",
      description: "Memory stores 'board prefers competitive framing' and 'always quantify our opportunity'. Without this, the first draft gets sent back for revision — costing another full context window of tokens.",
      linkedComponents: ["memory", "history"],
    },
  ],
};
