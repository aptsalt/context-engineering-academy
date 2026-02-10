import type { PlaygroundScenario } from "@/lib/playground-data";

export const researchSynthesisScenario: PlaygroundScenario = {
  id: "research-synthesis",
  name: "Research Synthesis Pipeline",
  emphasis: "token-efficiency",
  emphasisLabel: "Token Efficiency",
  inputLabel: "Researcher",
  meta: {
    title: "Multi-Agent Research Synthesis",
    description:
      "A team of three specialized agents — searcher, analyst, and synthesizer — collaborate to produce comprehensive research. Toggle orchestration components to see how coordination transforms scattered searches into structured multi-perspective synthesis.",
    infoCards: [
      { icon: "Search", label: "Topic", value: "LLM fine-tuning vs RAG" },
      { icon: "User", label: "Agents", value: "3 specialized roles" },
      { icon: "FileText", label: "Output", value: "Structured report" },
    ],
  },
  customerMessage:
    "Research the trade-offs between LLM fine-tuning and RAG for enterprise knowledge management. I need a comprehensive analysis covering cost, latency, accuracy, and maintenance burden.",
  recommendedBuildOrder: [
    "search-agent",
    "analysis-agent",
    "synthesis-agent",
    "inter-agent-messaging",
    "context-isolation",
    "result-aggregation",
  ],
  components: [
    {
      id: "search-agent",
      name: "Search Agent Config",
      shortName: "Search",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 310,
      description: "Configures the search agent with strategies, source priorities, and deduplication rules.",
      content: `<search_agent>
## Role
Primary information gatherer. Executes targeted searches across multiple source types.

## Search Strategy
1. Academic: arxiv, Semantic Scholar for peer-reviewed research
2. Industry: Company engineering blogs (Anthropic, OpenAI, Google, Meta)
3. Benchmarks: MTEB, MMLU, domain-specific eval suites
4. Community: HackerNews, Reddit r/MachineLearning for practitioner experience

## Query Expansion
For topic "fine-tuning vs RAG":
- Core: "fine-tuning vs retrieval augmented generation comparison"
- Cost: "LLM fine-tuning cost production" + "RAG infrastructure cost"
- Latency: "fine-tuning inference latency" + "RAG retrieval latency overhead"
- Accuracy: "fine-tuning domain accuracy" + "RAG hallucination rate"
- Maintenance: "model drift fine-tuning" + "RAG index update frequency"

## Output Format
Each search result must include:
- Source URL and publication date
- Relevance score (0-1)
- Key claims extracted (max 3 per source)
- Bias indicator (vendor, academic, practitioner)

## Deduplication
- Merge results citing the same primary source
- Flag conflicting claims from different sources
- Prioritize: peer-reviewed > industry benchmark > blog post > forum
</search_agent>`,
    },
    {
      id: "analysis-agent",
      name: "Analysis Agent Config",
      shortName: "Analysis",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 340,
      description: "Configures the analysis agent to evaluate evidence, detect bias, and structure findings.",
      content: `<analysis_agent>
## Role
Evidence evaluator and critical thinker. Receives raw search results and produces structured analysis.

## Analysis Framework
For each comparison dimension (cost, latency, accuracy, maintenance):

### Evidence Grading
- A: Peer-reviewed with reproducible benchmarks
- B: Industry report with disclosed methodology
- C: Engineering blog with specific numbers
- D: Anecdotal or theoretical argument

### Bias Detection
- Vendor bias: Company promoting their own solution
- Survivorship bias: Only successful deployments reported
- Recency bias: Older approaches dismissed without evidence
- Scale bias: Results at one scale don't apply to another

### Structured Output
For each dimension produce:
{
  "dimension": "cost | latency | accuracy | maintenance",
  "fine_tuning": { "evidence": [...], "grade": "A-D", "summary": "..." },
  "rag": { "evidence": [...], "grade": "A-D", "summary": "..." },
  "verdict": "fine_tuning | rag | depends",
  "confidence": 0.0-1.0,
  "caveats": [...]
}

## Critical Checks
- Flag any claim lacking quantitative evidence
- Note when sample sizes are too small for conclusions
- Identify when findings are specific to a domain (legal, medical, code)
- Highlight where fine-tuning and RAG are complementary, not competing
</analysis_agent>`,
    },
    {
      id: "synthesis-agent",
      name: "Synthesis Agent Config",
      shortName: "Synth",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 320,
      description: "Configures the synthesis agent to produce a coherent, actionable report from analyzed findings.",
      content: `<synthesis_agent>
## Role
Final report composer. Transforms structured analysis into a clear, actionable document.

## Report Structure
1. Executive Summary (200 words max)
   - Bottom-line recommendation with confidence level
   - Key deciding factors

2. Dimension-by-Dimension Comparison
   - Cost: TCO over 12 months for a 10k-document corpus
   - Latency: P50 and P99 response times
   - Accuracy: Domain-specific accuracy benchmarks
   - Maintenance: Ongoing effort in engineer-hours/month

3. Decision Framework
   - "Choose fine-tuning when..." (3-5 criteria)
   - "Choose RAG when..." (3-5 criteria)
   - "Use both when..." (2-3 criteria)

4. Risk Analysis
   - Top 3 risks for each approach
   - Mitigation strategies

5. Sources and Confidence
   - Graded source list
   - Areas of high/low confidence
   - Recommended further research

## Tone and Style
- Write for a technical decision-maker (CTO/VP Eng level)
- Lead with recommendations, support with evidence
- Use tables for direct comparisons
- No hedging without justification — take a position
- Acknowledge uncertainty explicitly rather than hiding it
</synthesis_agent>`,
    },
    {
      id: "inter-agent-messaging",
      name: "Inter-Agent Messaging",
      shortName: "Messaging",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 280,
      description: "Defines the message passing protocol between search, analysis, and synthesis agents.",
      content: `<inter_agent_messaging>
## Message Flow
Search Agent -> Analysis Agent -> Synthesis Agent (primary flow)
Analysis Agent -> Search Agent (feedback loop for gaps)

## Message Types

### search_results
From: Search Agent -> Analysis Agent
{
  "type": "search_results",
  "dimension": "cost",
  "results": [...],
  "coverage_score": 0.85,
  "gaps_identified": ["No data on fine-tuning cost for models > 70B"]
}

### analysis_complete
From: Analysis Agent -> Synthesis Agent
{
  "type": "analysis_complete",
  "dimension": "cost",
  "findings": {...},
  "confidence": 0.78,
  "needs_more_data": false
}

### gap_request
From: Analysis Agent -> Search Agent
{
  "type": "gap_request",
  "dimension": "latency",
  "missing": "P99 latency benchmarks for RAG with reranking",
  "priority": "high"
}

### synthesis_draft
From: Synthesis Agent -> Analysis Agent (review loop)
{
  "type": "synthesis_draft",
  "section": "executive_summary",
  "content": "...",
  "claims_to_verify": ["RAG is 3x cheaper at scale"]
}

## Feedback Loops
- Analysis Agent can request additional searches (max 2 rounds)
- Synthesis Agent can request fact-checks on specific claims
- All messages logged for traceability
</inter_agent_messaging>`,
    },
    {
      id: "context-isolation",
      name: "Context Isolation",
      shortName: "Isolation",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 250,
      description: "Rules for managing each agent's context window to prevent token overflow and cross-contamination.",
      content: `<context_isolation>
## Why Isolation Matters
Each agent has a finite context window. Without isolation:
- Search agent drowns in analysis framework details it doesn't need
- Analysis agent wastes tokens on raw HTML from search results
- Synthesis agent gets overwhelmed with evidence it should receive pre-digested

## Isolation Rules

### Search Agent Context
- Receives: Query expansion terms, source priorities, dedup rules
- Does NOT receive: Analysis framework, synthesis template, previous reports
- Max context: 4,000 tokens (query + instructions + result buffer)

### Analysis Agent Context
- Receives: Extracted claims from search (not raw pages), analysis framework, bias checklist
- Does NOT receive: Search URLs, HTML content, synthesis formatting rules
- Max context: 8,000 tokens (claims + framework + structured output)

### Synthesis Agent Context
- Receives: Graded analysis per dimension, report template, style guide
- Does NOT receive: Raw search results, individual source details, analysis internals
- Max context: 6,000 tokens (analysis summaries + report template)

## Token Budget
Total pipeline budget: 18,000 tokens
- Search: 4,000 (22%)
- Analysis: 8,000 (44%)
- Synthesis: 6,000 (34%)

## Overflow Prevention
- Each agent's output is summarized before passing downstream
- Raw data stays in the agent that produced it
- Only structured artifacts cross agent boundaries
</context_isolation>`,
    },
    {
      id: "result-aggregation",
      name: "Result Aggregation",
      shortName: "Aggregate",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 260,
      description: "Strategy for combining outputs from all agents into a single coherent deliverable.",
      content: `<result_aggregation>
## Aggregation Pipeline
1. Collect analysis outputs for all 4 dimensions
2. Resolve cross-dimension conflicts (e.g., cost winner vs accuracy winner)
3. Generate unified recommendation with confidence-weighted scoring
4. Produce final report with all sections populated

## Conflict Resolution
When dimensions point to different winners:
- Weight by requester's stated priorities (cost vs accuracy)
- If no priority stated, weight: accuracy (0.3) > cost (0.3) > maintenance (0.2) > latency (0.2)
- Show both weighted and unweighted results

## Confidence Aggregation
Final confidence = weighted average of per-dimension confidence
- If any dimension confidence < 0.5, flag as "low confidence area"
- If overall confidence < 0.6, recommend additional research before deciding

## Output Assembly
### Final Deliverable Structure
1. Executive Summary with recommendation
2. Comparison table (dimensions x approaches)
3. Decision framework with clear criteria
4. Risk matrix
5. Appendix: Source quality assessment
6. Metadata: Total tokens used, agents involved, time elapsed

## Quality Metrics
- Source diversity: min 3 source types per dimension
- Evidence grade: average B or higher across all claims
- Coverage: all 4 dimensions analyzed with quantitative data
- Coherence: synthesis must not contradict any A-grade evidence
</result_aggregation>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Single Unfocused Search",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Here's what I found about fine-tuning vs RAG:\n\nFine-tuning is when you train a model on your data. RAG is when you retrieve documents and put them in the prompt. Fine-tuning is more expensive but can be more accurate. RAG is cheaper but adds latency.\n\nSome people on Reddit say fine-tuning is better for specific domains. Others say RAG is good enough for most use cases.\n\nI'd recommend trying RAG first since it's easier to set up. Let me know if you need more details on anything.",
      issues: [
        "No structured search strategy",
        "Vague claims with no evidence or sources",
        "No quantitative data on cost, latency, or accuracy",
        "Reddit as primary source without critical evaluation",
        "Recommendation without analysis framework",
        "Missing entire dimensions (maintenance burden)",
      ],
      strengths: [],
    },
    {
      id: "search-only",
      label: "Data Dump",
      requiredComponents: ["search-agent"],
      score: 18,
      agentResponse:
        "**Search Results (47 sources found):**\n\n1. [arxiv 2024] \"Retrieval-Augmented Generation for Knowledge-Intensive NLP\" — Claims RAG reduces hallucination by 30-50% vs base models.\n2. [OpenAI Blog] Fine-tuning GPT-4 costs ~$25/1M training tokens. Inference 2x base cost.\n3. [Pinecone Blog] RAG with vector DB adds 50-200ms latency per query.\n4. [Reddit r/ML] User reports fine-tuning Llama-70B cost $2,400 on A100s for legal domain.\n5. [Anthropic Research] Context window approaches reduce need for fine-tuning in most enterprise cases.\n... [42 more results]\n\nAll results sorted by relevance score. Sources span academic, industry, and community. Several conflicting claims about accuracy — fine-tuning advocates cite domain benchmarks, RAG advocates cite flexibility.\n\nI've collected the data but I'm not sure how to make sense of the conflicting information.",
      issues: [
        "Raw data dump without analysis or synthesis",
        "Conflicting claims left unresolved",
        "No bias detection on vendor sources",
        "No structure by comparison dimension",
        "Overwhelming volume without prioritization",
      ],
      strengths: [
        "Diverse source types (academic, industry, community)",
        "Quantitative data points collected",
        "Relevant search queries executed",
      ],
    },
    {
      id: "search-analysis",
      label: "Analyzed but Unstructured",
      requiredComponents: ["search-agent", "analysis-agent"],
      score: 35,
      agentResponse:
        "**Analysis of Fine-tuning vs RAG:**\n\n**Cost (Confidence: 0.78):**\nFine-tuning: $2,000-$25,000 initial training + 2x inference cost. (Grade B evidence)\nRAG: $200-$500/mo for vector DB + embedding costs. (Grade B evidence)\nVerdict: RAG cheaper for < 100k queries/month. Fine-tuning cheaper at scale.\n\n**Latency (Confidence: 0.65):**\nFine-tuning: Same as base model (~200ms). (Grade B evidence)\nRAG: Base + 50-200ms retrieval overhead. (Grade C evidence — limited P99 data)\nVerdict: Fine-tuning wins on latency.\n\n**Accuracy (Confidence: 0.72):**\nFine-tuning: +15-25% on domain tasks vs base model. (Grade A evidence)\nRAG: +10-20% with good retrieval, but dependent on chunk quality. (Grade B evidence)\nVerdict: Depends on domain and data quality.\n\n**Maintenance (Confidence: 0.55):**\nLimited quantitative data. Fine-tuning needs retraining for knowledge updates. RAG needs index management.\nVerdict: Insufficient evidence for strong recommendation.\n\nI've graded the evidence but haven't produced a decision-ready report.",
      issues: [
        "Analysis exists but no actionable synthesis",
        "No executive summary or recommendation",
        "No decision framework for the reader",
        "Low confidence area (maintenance) not addressed with follow-up",
        "No risk analysis",
      ],
      strengths: [
        "Evidence grading applied consistently",
        "Confidence scores per dimension",
        "Quantitative data where available",
        "Honest about evidence gaps",
      ],
    },
    {
      id: "search-analysis-synthesis",
      label: "Complete but Inefficient",
      requiredComponents: ["search-agent", "analysis-agent", "synthesis-agent"],
      score: 55,
      agentResponse:
        "## Executive Summary\nFor enterprise knowledge management with a 10k-document corpus, **start with RAG** (confidence: 0.74). RAG offers lower upfront cost ($500/mo vs $10k+ fine-tuning), faster iteration, and real-time knowledge updates. Consider adding fine-tuning for high-frequency, domain-specific queries where latency matters.\n\n## Comparison\n| Dimension | Fine-tuning | RAG | Winner |\n|-----------|------------|-----|--------|\n| Cost (12mo) | $15,000-$40,000 | $6,000-$12,000 | RAG |\n| Latency P50 | ~200ms | ~350ms | Fine-tuning |\n| Accuracy | +20% domain | +15% domain | Fine-tuning (marginal) |\n| Maintenance | 8 eng-hrs/month | 4 eng-hrs/month | RAG |\n\n## Decision Framework\n- Choose RAG when: Knowledge changes frequently, budget is limited, multiple domains\n- Choose fine-tuning when: Single domain, latency-critical, stable knowledge base\n- Use both when: High-stakes domain with dynamic knowledge\n\n## Risks\n- RAG: Retrieval quality degrades with poor chunking. Mitigation: eval pipeline.\n- Fine-tuning: Model drift on knowledge updates. Mitigation: scheduled retraining.\n\n*Note: This report consumed approximately 35,000 tokens across all agents. Some redundant processing occurred between search and analysis phases.*",
      issues: [
        "35,000 tokens used — far above efficient budget",
        "Redundant data passed between agents",
        "No context isolation led to token waste",
        "Agents may have seen irrelevant information",
        "No feedback loops to fill evidence gaps",
      ],
      strengths: [
        "Complete report with all sections",
        "Clear recommendation with confidence level",
        "Comparison table for quick reference",
        "Decision framework is actionable",
        "Risks identified with mitigations",
      ],
    },
    {
      id: "search-analysis-synthesis-messaging",
      label: "Coordinated Pipeline",
      requiredComponents: ["search-agent", "analysis-agent", "synthesis-agent", "inter-agent-messaging"],
      score: 70,
      agentResponse:
        "## Pipeline Execution Log\n- Search -> Analysis: 4 search_results messages (one per dimension)\n- Analysis -> Search: 1 gap_request (P99 latency data)\n- Search -> Analysis: 1 follow-up search_results\n- Analysis -> Synthesis: 4 analysis_complete messages\n- Synthesis -> Analysis: 1 fact-check request (\"RAG 3x cheaper\" claim)\n- Analysis -> Synthesis: 1 verification response (confirmed at scale < 50k queries)\n\n## Executive Summary\n**Recommendation: RAG-first with selective fine-tuning** (confidence: 0.79)\n\nFor enterprise knowledge management, RAG delivers 80% of the value at 40% of the cost. Add fine-tuning for high-frequency domain queries where the 150ms latency overhead matters.\n\n## Key Findings\n| Dimension | Fine-tuning | RAG | Winner | Confidence |\n|-----------|------------|-----|--------|------------|\n| Cost (12mo) | $18,000 | $7,200 | RAG | 0.82 |\n| Latency P50/P99 | 200ms/450ms | 350ms/800ms | Fine-tuning | 0.71 |\n| Accuracy | +22% domain | +16% domain | Fine-tuning | 0.76 |\n| Maintenance | 10 hrs/mo | 5 hrs/mo | RAG | 0.62 |\n\n*Pipeline used ~28,000 tokens. Feedback loops improved data quality but token usage still above target.*",
      issues: [
        "28,000 tokens — still above efficient budget",
        "No context isolation to prevent token waste",
        "No aggregation strategy for final output assembly",
      ],
      strengths: [
        "Feedback loops filled evidence gaps (P99 latency data)",
        "Fact-checking caught an overstated claim",
        "Structured message passing with typed messages",
        "Higher confidence scores from gap-filling",
        "Clear execution trace for debugging",
      ],
    },
    {
      id: "all-minus-aggregation",
      label: "Efficient Pipeline",
      requiredComponents: ["search-agent", "analysis-agent", "synthesis-agent", "inter-agent-messaging", "context-isolation"],
      score: 82,
      agentResponse:
        "## Pipeline Execution (Token Budget: 18,000)\n- Search Agent: 3,800/4,000 tokens used (95%)\n- Analysis Agent: 7,200/8,000 tokens used (90%)\n- Synthesis Agent: 5,100/6,000 tokens used (85%)\n- **Total: 16,100 tokens** (11% under budget)\n\n## Executive Summary\n**Recommendation: RAG-first, fine-tune selectively** (confidence: 0.81)\n\nFor a 10k-document enterprise corpus, RAG provides superior cost-efficiency ($7,200/yr vs $18,000/yr) and lower maintenance burden. Fine-tuning adds value for latency-sensitive, single-domain queries with stable knowledge.\n\n## Comparison\n| Dimension | Fine-tuning | RAG | Winner | Confidence | Evidence |\n|-----------|------------|-----|--------|------------|----------|\n| Cost (12mo) | $18,000 | $7,200 | RAG | 0.82 | Grade B |\n| Latency P50/P99 | 200/450ms | 350/780ms | Fine-tuning | 0.74 | Grade B |\n| Accuracy | +22% domain | +16% domain | Fine-tuning | 0.76 | Grade A |\n| Maintenance | 10 hrs/mo | 5 hrs/mo | RAG | 0.68 | Grade C |\n\n## Decision Framework\n- Choose RAG: Dynamic knowledge, multi-domain, budget under $10k/yr, team < 3 engineers\n- Choose fine-tuning: Single domain, > 100k queries/mo, latency < 300ms required\n- Hybrid: Mission-critical domain (legal, medical) with changing regulations\n\n*Context isolation reduced token usage by 54% vs unmanaged pipeline.*",
      issues: [
        "No formal aggregation strategy for resolving cross-dimension conflicts",
        "Decision framework weights not made explicit",
        "Missing quality metrics on source diversity",
      ],
      strengths: [
        "16,100 tokens — 54% reduction from unmanaged pipeline",
        "Each agent stayed within allocated token budget",
        "No cross-contamination of irrelevant context",
        "Evidence grades included in comparison table",
        "Higher confidence from focused agent contexts",
        "Decision framework is specific and actionable",
      ],
    },
    {
      id: "all",
      label: "Structured Multi-Perspective Synthesis",
      requiredComponents: ["search-agent", "analysis-agent", "synthesis-agent", "inter-agent-messaging", "context-isolation", "result-aggregation"],
      score: 95,
      agentResponse:
        "## Pipeline Metrics\n- Total tokens: 16,800/18,000 (93% efficiency)\n- Sources: 23 unique (8 academic, 7 industry, 5 benchmark, 3 practitioner)\n- Evidence quality: Average Grade B+ across all dimensions\n- Feedback loops: 2 (1 gap-fill, 1 fact-check) — both improved confidence\n\n## Executive Summary\n**Recommendation: RAG-first with selective fine-tuning** (overall confidence: 0.83)\n\nWeighted analysis (accuracy 0.3, cost 0.3, maintenance 0.2, latency 0.2) favors RAG for enterprise knowledge management. Fine-tuning is the right addition when query volume exceeds 100k/month or domain accuracy is mission-critical.\n\n## Detailed Comparison\n| Dimension | Fine-tuning | RAG | Winner | Confidence | Weight |\n|-----------|------------|-----|--------|------------|--------|\n| Cost (12mo) | $18,000 | $7,200 | RAG | 0.82 | 0.30 |\n| Latency P50/P99 | 200/450ms | 350/780ms | Fine-tuning | 0.74 | 0.20 |\n| Accuracy | +22% domain | +16% domain | Fine-tuning | 0.76 | 0.30 |\n| Maintenance | 10 hrs/mo | 5 hrs/mo | RAG | 0.68 | 0.20 |\n\n**Weighted Score:** RAG 0.64 vs Fine-tuning 0.52\n\n## Decision Framework\n| Criteria | Choose RAG | Choose Fine-tuning | Choose Both |\n|----------|-----------|-------------------|-------------|\n| Knowledge freshness | Changes weekly+ | Stable for months | Core stable, edges change |\n| Query volume | < 100k/mo | > 100k/mo | Mixed workloads |\n| Budget | < $10k/yr | $15k+/yr acceptable | $20k+/yr |\n| Accuracy need | General (90%+) | Domain-critical (95%+) | Tiered by use case |\n\n## Risk Matrix\n| Risk | Probability | Impact | Mitigation |\n|------|------------|--------|------------|\n| RAG retrieval degradation | Medium | High | Automated eval pipeline |\n| Fine-tuning knowledge drift | High | Medium | Quarterly retraining schedule |\n| RAG latency spikes | Low | Medium | Cache frequent queries |\n\n## Confidence Assessment\n- High confidence: Cost, accuracy (Grade A-B evidence, multiple sources)\n- Medium confidence: Latency (limited P99 data, Grade B-C)\n- Low confidence: Maintenance (mostly anecdotal, Grade C — recommend internal benchmarking)\n\n*Source list: 23 references graded and available in appendix.*",
      issues: [
        "Could include a time-to-implement comparison",
      ],
      strengths: [
        "Explicit weighting makes recommendation transparent",
        "Token-efficient: 16,800 tokens for comprehensive report",
        "23 diverse sources with quality grading",
        "Decision framework covers multiple audience scenarios",
        "Risk matrix with probability and mitigation",
        "Confidence assessment highlights where to invest more research",
        "Feedback loops improved evidence quality measurably",
        "Full pipeline trace available for reproducibility",
      ],
    },
    {
      id: "analysis-only",
      label: "Analysis Without Data",
      requiredComponents: ["analysis-agent"],
      score: 12,
      agentResponse:
        "## Analysis Framework Applied\n\n**Cost Analysis:**\nEvidence: None provided. Cannot grade.\nFine-tuning likely involves GPU training costs. RAG likely involves vector database costs.\nConfidence: 0.15 — no quantitative data available.\n\n**Latency Analysis:**\nEvidence: None provided. Cannot grade.\nFine-tuning should match base model latency. RAG adds retrieval overhead.\nConfidence: 0.10 — theoretical reasoning only.\n\n**Accuracy Analysis:**\nEvidence: None provided. Cannot grade.\nBoth approaches should improve over base model.\nConfidence: 0.10 — no benchmarks available.\n\n**Maintenance Analysis:**\nEvidence: None provided. Cannot grade.\nConfidence: 0.05.\n\n**Overall:** Framework is ready but has no data to analyze. All conclusions are speculative. Need search results to produce meaningful analysis.",
      issues: [
        "No search data to analyze — framework runs empty",
        "All confidence scores near zero",
        "Theoretical reasoning without evidence",
        "Produces a structured nothing",
        "Cannot detect bias without sources to evaluate",
      ],
      strengths: [
        "Honest about evidence gaps",
        "Framework structure is sound and ready for data",
      ],
    },
  ],
  principles: [
    {
      id: "agent-specialization",
      title: "Specialize Agents, Not Prompts",
      description:
        "Each agent should excel at one thing. A search agent searches, an analyst analyzes, a synthesizer writes. Combining all three into one agent creates a mediocre generalist that wastes tokens on irrelevant instructions.",
      linkedComponents: ["search-agent", "analysis-agent", "synthesis-agent"],
    },
    {
      id: "context-isolation-saves-tokens",
      title: "Isolation Is Efficiency",
      description:
        "Without context isolation, every agent receives every piece of data. A search agent does not need the synthesis template. Isolation reduced token usage by 54% in this pipeline.",
      linkedComponents: ["context-isolation", "inter-agent-messaging"],
    },
    {
      id: "feedback-loops-fill-gaps",
      title: "Feedback Loops Beat Single-Pass",
      description:
        "Allowing the analysis agent to request follow-up searches and the synthesis agent to fact-check claims produces higher confidence than a single pass through the pipeline.",
      linkedComponents: ["inter-agent-messaging", "search-agent", "analysis-agent"],
    },
    {
      id: "aggregate-dont-concatenate",
      title: "Aggregate, Don't Concatenate",
      description:
        "The final output should be a synthesized deliverable, not a concatenation of agent outputs. Result aggregation with conflict resolution and confidence weighting produces actionable recommendations.",
      linkedComponents: ["result-aggregation", "synthesis-agent"],
    },
  ],
};
