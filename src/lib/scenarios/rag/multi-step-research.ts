import type { PlaygroundScenario } from "@/lib/playground-data";

export const multiStepResearchScenario: PlaygroundScenario = {
  id: "multi-step-research",
  name: "Multi-Step Research",
  emphasis: "full-pipeline",
  emphasisLabel: "Agentic RAG Pipeline",
  meta: {
    title: "Agentic Research Scenario",
    description:
      "An agentic RAG system tackles a complex multi-step research question that requires decomposing the query, retrieving from multiple sources, verifying claims across documents, and synthesizing a coherent answer. Toggle components to see how agentic capabilities transform surface-level guesses into comprehensive, verified research.",
    infoCards: [
      { icon: "User", label: "Researcher", value: "Policy analyst investigating market trends" },
      { icon: "Search", label: "Sources", value: "Earnings reports, analyst notes, news articles" },
      { icon: "FileText", label: "Complexity", value: "Multi-hop reasoning across 3+ sources" },
    ],
  },
  customerMessage:
    "How has the shift to cloud computing affected the revenue mix and profit margins of the top 3 enterprise software companies over the past 3 years, and what does this suggest about the future of on-premise software?",
  inputLabel: "Researcher",
  recommendedBuildOrder: [
    "query-decomposition",
    "iterative-retrieval",
    "relevance-filtering",
    "cross-source-verification",
    "self-reflection",
    "answer-synthesis",
  ],
  components: [
    {
      id: "query-decomposition",
      name: "Query Decomposition",
      shortName: "Decompose",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 160,
      description: "Breaks complex multi-part questions into focused sub-queries that can be independently retrieved and answered.",
      content: `<query_decomposition>
## Original Query
"How has the shift to cloud computing affected the revenue mix and profit margins of the top 3 enterprise software companies over the past 3 years, and what does this suggest about the future of on-premise software?"

## Decomposed Sub-Queries
1. "Who are the top 3 enterprise software companies by revenue in 2024?"
   → Establishes scope (Microsoft, Salesforce, Oracle)
2. "Microsoft cloud revenue vs on-premise revenue breakdown 2022-2024"
   → Revenue mix data for company #1
3. "Salesforce cloud subscription revenue growth 2022-2024"
   → Revenue mix data for company #2
4. "Oracle cloud infrastructure and SaaS revenue vs license revenue 2022-2024"
   → Revenue mix data for company #3
5. "Enterprise software company profit margin trends cloud transition 2022-2024"
   → Margin impact across all three
6. "On-premise software market forecast and migration trends 2025-2027"
   → Future outlook sub-query

## Dependency Graph
Sub-query 1 → feeds into sub-queries 2, 3, 4
Sub-queries 2, 3, 4 → feed into sub-query 5
Sub-queries 5, 6 → feed into final synthesis
</query_decomposition>`,
    },
    {
      id: "iterative-retrieval",
      name: "Iterative Retrieval",
      shortName: "IterRetr",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 200,
      description: "Performs multiple rounds of retrieval, using results from earlier rounds to refine subsequent searches.",
      content: `<iterative_retrieval>
## Round 1: Identify top companies
Query: "Top 3 enterprise software companies by revenue 2024"
Retrieved: Gartner Magic Quadrant excerpt, Forbes enterprise rankings
→ Result: Microsoft ($227B), Salesforce ($34.9B), Oracle ($53B)

## Round 2: Revenue breakdowns (3 parallel retrievals)
Query 2a: "Microsoft Intelligent Cloud segment revenue FY2022-FY2024"
Retrieved: Microsoft 10-K filings, earnings transcripts
→ Cloud: $60B→$75B→$96B | On-prem licensing declined 8% YoY

Query 2b: "Salesforce subscription and support revenue 2022-2024"
Retrieved: Salesforce annual reports, investor presentations
→ Subscription: 93%→94%→95% of total revenue | Professional services flat

Query 2c: "Oracle cloud revenue vs license revenue FY2022-FY2024"
Retrieved: Oracle earnings reports, analyst coverage
→ Cloud: $11.4B→$17.1B→$24.1B (+111%) | License: $6.1B→$5.8B→$5.3B (-13%)

## Round 3: Margin analysis (informed by Round 2 results)
Query: "Cloud transition impact on operating margins Microsoft Salesforce Oracle 2022-2024"
Retrieved: Comparative margin analysis, Morgan Stanley research note
→ Microsoft: 42%→43%→45% | Salesforce: 2%→17%→20% | Oracle: 34%→35%→37%

## Round 4: Future outlook (informed by all prior rounds)
Query: "On-premise software market decline rate enterprise migration forecast"
Retrieved: Gartner forecast, IDC MarketScape report
→ On-prem declining ~10-15% annually, hybrid expected to persist in regulated industries
</iterative_retrieval>`,
    },
    {
      id: "self-reflection",
      name: "Self-Reflection",
      shortName: "Reflect",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 150,
      description: "Agent evaluates its own intermediate answers, identifies gaps, and triggers additional retrieval when confidence is low.",
      content: `<self_reflection>
## Reflection After Round 2
Assessment: "I have revenue breakdowns for all 3 companies, but I notice:
1. Microsoft's numbers are fiscal year (ending June) while Oracle's are calendar year — need to normalize
2. Salesforce is almost entirely cloud-native, so their 'shift' story is different — should I reframe?
3. I don't have margin data yet — the question specifically asks about profit margins"
→ Action: Trigger Round 3 retrieval for margin data, add note about fiscal year differences

## Reflection After Round 3
Assessment: "Margin data is now available, but:
1. Salesforce's margin jump (2% → 20%) is partly due to layoffs and cost restructuring, not purely cloud economics — need to flag this nuance
2. I should verify Oracle's cloud growth claim seems unusually high at 111% — cross-reference needed
3. Future outlook data is still missing"
→ Action: Trigger Round 4 for outlook, flag Salesforce margin caveat, verify Oracle figures

## Reflection After Round 4
Assessment: "I have comprehensive data across all sub-queries. Remaining gaps:
- No data on specific customer migration timelines
- Regulated industries (healthcare, finance) have different on-prem trajectories
- Confidence is HIGH for revenue data, MEDIUM for margin analysis, MEDIUM for future projections"
→ Action: Proceed to synthesis with confidence levels noted
</self_reflection>`,
    },
    {
      id: "cross-source-verification",
      name: "Cross-Source Verification",
      shortName: "Verify",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 170,
      description: "Validates claims by checking for agreement across multiple independent sources before including them in the answer.",
      content: `<cross_source_verification>
## Verification Matrix

### Claim: "Microsoft cloud revenue grew from $60B to $96B (2022-2024)"
- Source 1: Microsoft 10-K filing (FY2024) → $96.8B Intelligent Cloud ✓
- Source 2: Bloomberg earnings summary → $96.7B ✓
- Source 3: Morgan Stanley research note → ~$97B (rounded) ✓
→ Verdict: CONFIRMED (3/3 sources agree within rounding)

### Claim: "Oracle cloud revenue grew 111% over 3 years"
- Source 1: Oracle earnings report → Cloud revenue $24.1B in FY2024 ✓
- Source 2: Oracle investor presentation → $24.1B ✓
- Source 3: Analyst note → "approximately doubled" (less precise but directionally consistent) ✓
- Cross-check: $11.4B → $24.1B = 111.4% growth ✓ (math verified)
→ Verdict: CONFIRMED (computation verified, 3 sources aligned)

### Claim: "Salesforce margin improvement primarily due to cloud economics"
- Source 1: Salesforce earnings call → Credits restructuring and AI efficiency ✗
- Source 2: WSJ article → "Layoffs and cost cuts drove margin expansion" ✗
- Source 3: Morgan Stanley → "Mix of operating leverage and workforce optimization" ~
→ Verdict: PARTIALLY REFUTED — Margin improvement was NOT purely cloud economics. Must include restructuring context.

### Claim: "On-premise declining 10-15% annually"
- Source 1: Gartner forecast (2024) → 12% decline projected ✓
- Source 2: IDC report → "10-14% annual decline in traditional licensing" ✓
- Source 3: Flexera State of IT report → "11% YoY decline in on-prem spend" ✓
→ Verdict: CONFIRMED (3 sources, range is consistent)
</cross_source_verification>`,
    },
    {
      id: "relevance-filtering",
      name: "Relevance Filtering",
      shortName: "Filter",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 130,
      description: "Removes retrieved content that is off-topic, outdated, or contradicted by more authoritative sources.",
      content: `<relevance_filtering>
## Filtering Rules Applied
1. Temporal filter: Only include data from 2022-2024 (discard older reports)
2. Source authority: Prefer primary sources (10-K filings) over secondary (blog posts)
3. Topical relevance: Must directly address cloud revenue, margins, or on-prem outlook
4. Contradiction handling: When sources conflict, prefer more recent and more authoritative

## Documents Filtered OUT
- Blog post: "Why Cloud is the Future" (2021) — outdated, opinion piece
- Reddit discussion: Enterprise software predictions — unverified, anecdotal
- AWS re:Invent keynote transcript — about AWS, not enterprise software companies
- Salesforce marketing whitepaper — promotional, not objective financial data
- Oracle press release Q1 2022 — outside 3-year scope when annualized differently
- Microsoft Azure pricing page — about pricing, not revenue/margins

## Documents Retained (12 of 23 retrieved)
- 3 annual reports (10-K filings) — primary financial data
- 2 Gartner/IDC forecasts — authoritative market projections
- 3 earnings call transcripts — management commentary
- 2 analyst research notes (Morgan Stanley, Goldman Sachs) — expert analysis
- 2 news articles (WSJ, Bloomberg) — verified reporting

## Impact
Filtering removed 11 of 23 retrieved documents (48%), dramatically reducing noise and preventing the inclusion of outdated or promotional content.
</relevance_filtering>`,
    },
    {
      id: "answer-synthesis",
      name: "Answer Synthesis",
      shortName: "Synthesis",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 140,
      description: "Combines verified findings from all sub-queries into a coherent, well-structured research report with confidence levels.",
      content: `<answer_synthesis>
## Synthesis Strategy
- Structure: Executive summary → Company-by-company analysis → Cross-cutting trends → Future outlook
- Tone: Analytical, evidence-based, suitable for a policy analyst audience
- Citations: Inline with source type and date
- Confidence levels: Tag each section (HIGH/MEDIUM/LOW)
- Caveats: Explicitly state limitations and assumptions

## Synthesis Rules
1. Lead with the direct answer to the original question
2. Support with specific numbers from verified sources
3. Address each sub-query in a logical order
4. Flag where sources disagreed and explain resolution
5. Separate observations (data-backed) from projections (model-based)
6. End with actionable implications, not just data

## Output Format
- Executive Summary (3-4 sentences answering the core question)
- Revenue Mix Shift (company-by-company with 3-year data)
- Margin Impact (with caveats about confounding factors)
- Future of On-Premise (projection with confidence band)
- Limitations and Suggested Follow-Up Research

## Quality Check
Before final output, verify:
☑ All numbers cross-referenced
☑ Salesforce margin caveat included
☑ Fiscal year normalization noted
☑ No unverified claims from filtered-out sources
</answer_synthesis>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Surface-Level Guess",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Cloud computing has definitely changed things for big software companies. Companies like Microsoft and Salesforce have moved to the cloud and are making more money from subscriptions now. Profit margins are probably improving because cloud is more efficient. On-premise software is declining and will probably go away eventually.\n\nThe top companies are doing well with cloud, and on-premise is becoming less important over time.",
      issues: [
        "No specific data — entirely vague generalizations",
        "Doesn't identify which 3 companies or provide revenue figures",
        "Claims margins are 'probably improving' with no evidence",
        "Oversimplifies on-prem decline without nuance",
        "No sources, no timeframe specifics, no actionable insights",
      ],
      strengths: [],
    },
    {
      id: "decomposition-only",
      label: "Structured Questions",
      requiredComponents: ["query-decomposition"],
      score: 15,
      agentResponse:
        "To answer your question about cloud computing's impact on enterprise software companies, I would need to research the following:\n\n1. Identify the top 3 enterprise software companies by revenue\n2. Analyze each company's cloud vs. on-premise revenue split over 2022-2024\n3. Compare profit margin trends across these companies\n4. Review market forecasts for on-premise software\n\nHowever, I don't have access to the specific financial data needed to answer these sub-questions. I'd recommend consulting recent earnings reports, Gartner forecasts, and analyst coverage for detailed figures.",
      issues: [
        "Identifies the right questions but cannot answer any of them",
        "No retrieval capability — just defers to the user",
        "Essentially an outline, not a research answer",
        "No data, no sources, no conclusions",
      ],
      strengths: [
        "Correctly decomposes the multi-part question",
        "Identifies relevant source types",
        "Shows understanding of what data is needed",
      ],
    },
    {
      id: "decomposition-retrieval",
      label: "Data Retrieved",
      requiredComponents: ["query-decomposition", "iterative-retrieval"],
      score: 40,
      agentResponse:
        "Based on my research, the top 3 enterprise software companies are Microsoft ($227B revenue), Salesforce ($34.9B), and Oracle ($53B).\n\n**Microsoft:** Cloud revenue grew from $60B to $96B (FY2022-FY2024). On-premise licensing declined approximately 8% year over year.\n\n**Salesforce:** Subscription revenue accounts for 93-95% of total revenue, growing steadily. Professional services revenue remained flat.\n\n**Oracle:** Cloud revenue nearly doubled from $11.4B to $24.1B, while traditional license revenue declined from $6.1B to $5.3B.\n\n**Margins:** Microsoft operating margins improved from 42% to 45%. Salesforce saw a dramatic jump from 2% to 20%. Oracle margins grew from 34% to 37%.\n\n**On-premise outlook:** Market analysts project 10-15% annual decline in on-premise spending, though hybrid deployments will persist.\n\nNote: Some of these figures may be from different fiscal year calendars.",
      issues: [
        "No source citations for any figures",
        "Salesforce margin jump presented without the restructuring context",
        "Doesn't explain Microsoft's fiscal year vs. calendar year difference",
        "No confidence levels on projections",
        "Missing nuance about regulated industries retaining on-prem",
        "Retrieved data but didn't verify or filter",
      ],
      strengths: [
        "Specific numerical data for all 3 companies",
        "3-year trend data as requested",
        "Covers revenue mix AND margins",
        "Addresses on-prem future outlook",
        "Notes fiscal year caveat (but doesn't resolve it)",
      ],
    },
    {
      id: "decomposition-retrieval-filtering",
      label: "Filtered Results",
      requiredComponents: ["query-decomposition", "iterative-retrieval", "relevance-filtering"],
      score: 55,
      agentResponse:
        "Based on primary financial filings and authoritative market research:\n\n**Top 3 Enterprise Software Companies (by 2024 revenue):** Microsoft ($227B), Oracle ($53B), Salesforce ($34.9B).\n\n**Revenue Mix Shift (2022-2024):**\n- Microsoft: Intelligent Cloud grew from $60B to $96.8B; on-premise licensing declining ~8% annually\n- Oracle: Cloud revenue surged from $11.4B to $24.1B (+111%); license revenue fell from $6.1B to $5.3B (-13%)\n- Salesforce: Already 93-95% subscription-based; cloud-native from inception\n\n**Profit Margins:**\n- Microsoft: 42% → 45% operating margin (steady improvement)\n- Salesforce: 2% → 20% (significant expansion)\n- Oracle: 34% → 37% (gradual improvement)\n\n**On-Premise Outlook:** Projected 10-14% annual decline in traditional licensing spend. Hybrid deployments expected to persist in regulated industries.\n\nSources consulted include company 10-K filings, Gartner forecasts, and earnings call transcripts.",
      issues: [
        "Salesforce margin jump still lacks restructuring context",
        "No inline citations — mentions source types but not specifics",
        "Oracle 111% claim not explicitly verified",
        "Doesn't distinguish observations from projections",
        "Missing confidence levels",
      ],
      strengths: [
        "Filtered out promotional and outdated content",
        "Based on primary sources (10-K filings)",
        "Clean, structured presentation",
        "Covers all parts of the original question",
        "Mentions regulated industries nuance",
      ],
    },
    {
      id: "decomposition-retrieval-filtering-verification",
      label: "Verified",
      requiredComponents: ["query-decomposition", "iterative-retrieval", "relevance-filtering", "cross-source-verification"],
      score: 70,
      agentResponse:
        "Based on cross-verified data from 10-K filings, analyst reports, and market research:\n\n**Revenue Mix Shift (2022-2024) — Verified across 3 sources each:**\n\n*Microsoft:* Intelligent Cloud segment grew from $60B to $96.8B (FY2022-FY2024). On-premise licensing declining ~8% annually. [Verified: 10-K, Bloomberg, Morgan Stanley]\n\n*Oracle:* Cloud revenue surged from $11.4B to $24.1B (+111%, verified computation). License revenue fell $6.1B to $5.3B (-13%). [Verified: earnings reports, investor presentations, analyst coverage]\n\n*Salesforce:* Subscription revenue consistent at 93-95% of total. Cloud-native company, so the 'shift' narrative is less applicable. [Verified: annual reports, investor presentations]\n\n**Profit Margins — With Caveats:**\n- Microsoft: 42% → 45% — cloud-driven operating leverage [Verified]\n- Salesforce: 2% → 20% — **Important caveat**: Margin expansion was significantly driven by workforce restructuring and cost cuts, not purely cloud economics [Sources disagree — earnings call credits restructuring; WSJ highlights layoffs]\n- Oracle: 34% → 37% — gradual improvement from cloud mix shift [Verified]\n\n**On-Premise Outlook:**\nProjected 10-15% annual decline (Gartner: 12%, IDC: 10-14%, Flexera: 11%). Hybrid deployments will persist in regulated industries (healthcare, financial services).\n\nNote: Microsoft reports on a June fiscal year; Oracle and Salesforce on different calendars. Figures are aligned to nearest comparable periods.",
      issues: [
        "Self-reflection gaps not surfaced (what the agent doesn't know)",
        "No confidence levels per section",
        "Missing synthesis — presents data but limited interpretation",
        "No explicit 'future implications' conclusion as requested",
      ],
      strengths: [
        "Every major claim verified across multiple sources",
        "Salesforce margin caveat correctly identified and explained",
        "Oracle 111% growth mathematically verified",
        "Source disagreements transparently noted",
        "Fiscal year normalization acknowledged",
        "Regulated industry nuance included",
      ],
    },
    {
      id: "all-minus-synthesis",
      label: "Reflected & Verified",
      requiredComponents: ["query-decomposition", "iterative-retrieval", "self-reflection", "cross-source-verification", "relevance-filtering"],
      score: 82,
      agentResponse:
        "**Cross-Verified Research Findings** (Confidence: HIGH for revenue data, MEDIUM for margin causation, MEDIUM for projections)\n\n**Revenue Mix Shift (2022-2024):**\n\n*Microsoft* [HIGH confidence — 3 sources verified]: Intelligent Cloud grew $60B → $96.8B. On-premise licensing declining ~8% YoY. Cloud now represents ~42% of total revenue, up from ~35%.\n\n*Oracle* [HIGH confidence — 3 sources, math verified]: Cloud revenue: $11.4B → $24.1B (+111%). License: $6.1B → $5.3B (-13%). Cloud went from ~18% to ~38% of total revenue.\n\n*Salesforce* [HIGH confidence]: Subscription at 93-95% of total. Already cloud-native — the 'transition' framing doesn't apply. Growth was 18% → 11% (slowing but still strong).\n\n**Profit Margins** [MEDIUM confidence — confounding factors]:\n- Microsoft: 42% → 45% — cloud operating leverage is the primary driver\n- Salesforce: 2% → 20% — **Caveat**: Driven significantly by 2023 restructuring (10% workforce reduction) and cost optimization, not purely cloud economics\n- Oracle: 34% → 37% — gradual improvement correlating with cloud mix shift\n\n**On-Premise Outlook** [MEDIUM confidence — projection-based]:\n- 10-15% annual decline in traditional licensing (3 sources agree on range)\n- Hybrid will persist in regulated industries due to compliance requirements\n- Complete on-prem elimination unlikely before 2030\n\n**Known Gaps:** No data on specific customer migration timelines. Regulated industry trajectories may differ significantly from aggregate projections. Fiscal year differences between companies partially normalized but not perfectly aligned.",
      issues: [
        "Data-heavy but lacks interpretive synthesis",
        "Doesn't directly answer 'what does this suggest about the future'",
        "Missing executive summary and actionable conclusions",
        "No structured recommendations for the researcher",
      ],
      strengths: [
        "Confidence levels on every section",
        "Self-reflection caught the Salesforce margin issue",
        "Known gaps explicitly stated",
        "Fiscal year normalization attempted",
        "All claims cross-verified",
        "Filtered to authoritative sources only",
        "Honest about projection uncertainty",
      ],
    },
    {
      id: "all",
      label: "Comprehensive Verified Answer",
      requiredComponents: ["query-decomposition", "iterative-retrieval", "self-reflection", "cross-source-verification", "relevance-filtering", "answer-synthesis"],
      score: 95,
      agentResponse:
        "**Executive Summary**\nThe top 3 enterprise software companies (Microsoft, Oracle, Salesforce) have dramatically shifted toward cloud revenue over 2022-2024, with cloud segments growing 40-111% while on-premise licensing declined 8-13%. Operating margins improved across all three, though the drivers differ. On-premise software is declining 10-15% annually but will persist in regulated industries through at least 2030.\n\n---\n\n**Revenue Mix Shift (2022-2024)** [Confidence: HIGH]\n\n| Company | Cloud Revenue Growth | On-Prem Trend | Cloud % of Revenue |\n|---------|---------------------|---------------|-------------------|\n| Microsoft | $60B → $96.8B (+61%) | -8% YoY | 35% → 42% |\n| Oracle | $11.4B → $24.1B (+111%) | -13% over 3yr | 18% → 38% |\n| Salesforce | $31.1B → $33.2B (+7%) | N/A (cloud-native) | 93% → 95% |\n\nSources: Company 10-K filings, verified against Bloomberg and Morgan Stanley research.\n\n**Margin Impact** [Confidence: MEDIUM — confounding factors exist]\n- Microsoft: 42% → 45% — driven by cloud operating leverage\n- Salesforce: 2% → 20% — **significant caveat**: 2023 restructuring (10% workforce reduction) was a major factor, not purely cloud economics [Sources: WSJ, earnings call]\n- Oracle: 34% → 37% — correlates with cloud mix shift\n\n**What This Suggests About On-Premise Software** [Confidence: MEDIUM]\n1. **Decline is structural, not cyclical** — all 3 companies show accelerating cloud growth and declining license revenue\n2. **But extinction is not imminent** — Gartner, IDC, and Flexera all project on-prem declining 10-15% annually, implying meaningful revenue through 2030+\n3. **Hybrid is the reality** — regulated industries (healthcare, financial services) will maintain on-prem for compliance, creating a long tail\n4. **Margin improvement is real but nuanced** — cloud economics do improve margins long-term, but the Salesforce case shows cost restructuring can be a confounding factor\n\n**Limitations & Suggested Follow-Up**\n- Fiscal year calendars differ (Microsoft: June, Oracle/Salesforce: January/February) — figures aligned to nearest comparable periods\n- No customer-level migration timeline data available\n- Regulated industry trajectories warrant separate analysis\n- SAP and Adobe could provide additional data points as companies #4 and #5\n\nAll revenue figures verified across 3+ independent sources. Projections are based on Gartner and IDC forecasts.",
      issues: [
        "Could include visual charts for the data table",
      ],
      strengths: [
        "Complete executive summary answering the core question directly",
        "Data table format for easy comparison",
        "Every section tagged with confidence level",
        "Salesforce margin caveat properly contextualized",
        "Four distinct forward-looking conclusions with reasoning",
        "Explicit limitations and suggested follow-up research",
        "All claims verified across 3+ sources",
        "Fiscal year normalization acknowledged",
        "Actionable for a policy analyst audience",
        "Demonstrates full agentic RAG pipeline value",
      ],
    },
    {
      id: "retrieval-only",
      label: "Unstructured Dump",
      requiredComponents: ["iterative-retrieval"],
      score: 20,
      agentResponse:
        "I found the following information across multiple retrieval rounds:\n\nMicrosoft's Intelligent Cloud segment revenue was $96.8B in FY2024. Salesforce total revenue was $34.9B. Oracle cloud revenue was $24.1B. Microsoft cloud was $60B in FY2022. Oracle license revenue declined. Salesforce is mostly subscription-based. Gartner says on-prem is declining. Operating margins: Microsoft 45%, Salesforce 20%, Oracle 37%. IDC projects 10-14% decline.\n\nThere are also some results about AWS pricing and a Reddit thread about enterprise software, but I'm including everything I found.",
      issues: [
        "Raw data dump without structure or narrative",
        "Includes irrelevant results (AWS pricing, Reddit)",
        "No verification — numbers could be wrong",
        "No analysis or synthesis",
        "No confidence levels or source citations",
        "Mixes relevant and irrelevant content",
      ],
      strengths: [
        "Did retrieve actual data points",
        "Multiple rounds of retrieval executed",
      ],
    },
  ],
  principles: [
    {
      id: "decompose-complex-queries",
      title: "Decompose Before You Retrieve",
      description:
        "Complex questions that require multiple data points cannot be answered with a single retrieval. Query decomposition turns one impossible query into six achievable ones, with a dependency graph that ensures each sub-query builds on prior results.",
      linkedComponents: ["query-decomposition", "iterative-retrieval"],
    },
    {
      id: "verify-dont-trust",
      title: "Verify, Don't Trust",
      description:
        "Cross-source verification caught that Salesforce's margin expansion was not purely cloud economics — earnings calls and news articles told different stories. In research, a single source is a hypothesis. Three agreeing sources are evidence.",
      linkedComponents: ["cross-source-verification", "relevance-filtering"],
    },
    {
      id: "reflect-to-improve",
      title: "Self-Reflection Closes Gaps",
      description:
        "The agent's self-reflection identified missing margin data, fiscal year mismatches, and the need to verify Oracle's 111% claim — issues that would have degraded the final answer if left unchecked. Agentic RAG systems that reflect produce research, not data dumps.",
      linkedComponents: ["self-reflection", "iterative-retrieval"],
    },
    {
      id: "synthesis-is-the-product",
      title: "Synthesis Is the Product",
      description:
        "Raw data is not research. The jump from score 82 to 95 came entirely from synthesis — an executive summary, structured comparison table, confidence levels, and actionable conclusions. The same data, organized differently, becomes dramatically more useful.",
      linkedComponents: ["answer-synthesis"],
    },
  ],
};
