import type { PlaygroundScenario } from "@/lib/playground-data";

export const knowledgeBaseQaScenario: PlaygroundScenario = {
  id: "knowledge-base-qa",
  name: "Knowledge Base Q&A",
  emphasis: "full-pipeline",
  emphasisLabel: "Full RAG Pipeline",
  meta: {
    title: "RAG Scenario",
    description:
      "A company knowledge base Q&A system answers employee questions about policies, benefits, and procedures. Each RAG component you enable improves retrieval accuracy and answer quality. Watch how the pipeline evolves from hallucinated guesses to precise, sourced answers.",
    infoCards: [
      { icon: "User", label: "User", value: "Employee asking HR policy question" },
      { icon: "FileText", label: "Knowledge Base", value: "2,400 policy documents" },
      { icon: "Search", label: "Query", value: "Remote work policy for international employees" },
    ],
  },
  customerMessage:
    "What is our company's policy on remote work for international employees?",
  inputLabel: "User",
  recommendedBuildOrder: [
    "doc-chunking",
    "embedding-model",
    "vector-search",
    "reranker",
    "query-expansion",
    "source-attribution",
  ],
  components: [
    {
      id: "doc-chunking",
      name: "Document Chunking",
      shortName: "Chunking",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 180,
      description: "Splits policy documents into semantically meaningful chunks with overlap for context preservation.",
      content: `<chunking_config>
## Chunking Strategy
- Method: Recursive character splitting with semantic boundaries
- Chunk size: 512 tokens with 64-token overlap
- Boundary detection: Prefer splitting at section headers, paragraph breaks, and list items
- Metadata preserved per chunk:
  - source_document: "HR-Policy-Manual-v4.2.pdf"
  - section: "Section 7: Remote Work & International Employment"
  - page_numbers: [42, 43, 44]
  - last_updated: "2024-11-15"
  - policy_id: "HR-RW-2024-007"

## Active Chunks (top 3 retrieved)
Chunk 1 (page 42): "Remote work for international employees is governed by the International Remote Work Framework (IRWF). Employees residing outside their country of hire must obtain approval from both their direct manager and the Global Mobility team before beginning remote work..."
Chunk 2 (page 43): "Tax implications vary by jurisdiction. Employees working remotely from a country for more than 183 days in a calendar year may trigger permanent establishment risks. The company provides tax advisory services through our partner firm, GlobalTax Associates..."
Chunk 3 (page 44): "Equipment and stipend: International remote workers receive the standard home office stipend ($1,500/year) plus an additional international connectivity allowance ($600/year). VPN access is mandatory for all international remote connections..."
</chunking_config>`,
    },
    {
      id: "embedding-model",
      name: "Embedding Model",
      shortName: "Embeddings",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 150,
      description: "Converts text into dense vector representations for semantic similarity matching.",
      content: `<embedding_config>
## Model: text-embedding-3-large (OpenAI)
- Dimensions: 3072 (reduced to 1024 via Matryoshka)
- Max input: 8,191 tokens
- Similarity metric: Cosine similarity

## Query Embedding
Input: "What is our company's policy on remote work for international employees?"
→ Vector: [0.0234, -0.0891, 0.1245, ..., 0.0567] (1024-dim)

## Semantic Matching Results
- "International Remote Work Framework" → similarity: 0.92
- "Remote work equipment policy" → similarity: 0.87
- "Tax implications for cross-border workers" → similarity: 0.84
- "General remote work guidelines" → similarity: 0.79
- "Office relocation procedures" → similarity: 0.61 (less relevant)
- "Vacation and PTO policy" → similarity: 0.34 (not relevant)

## Key Insight
Dense embeddings capture semantic meaning: "international employees" matches "cross-border workers" and "country of hire" even without keyword overlap.
</embedding_config>`,
    },
    {
      id: "vector-search",
      name: "Vector Search",
      shortName: "VecSearch",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 200,
      description: "Retrieves the most semantically relevant chunks from the vector store using approximate nearest neighbor search.",
      content: `<vector_search>
## Search Configuration
- Vector DB: Pinecone (p2 pod, us-east-1)
- Index: "company-knowledge-base"
- Namespace: "hr-policies"
- Top-K: 10 candidates retrieved
- Filter: { "department": "HR", "status": "active", "version": "current" }

## Retrieved Results (top 10, pre-reranking)
1. [score: 0.92] HR-RW-2024-007, chunk 3 — "Remote work for international employees is governed by the IRWF..."
2. [score: 0.87] HR-RW-2024-007, chunk 5 — "Equipment and stipend: International remote workers receive..."
3. [score: 0.84] HR-TAX-2024-012, chunk 1 — "Tax implications vary by jurisdiction. Employees working remotely..."
4. [score: 0.82] HR-RW-2024-007, chunk 4 — "Approval process: Submit Form IRW-1 to Global Mobility at least 30 days..."
5. [score: 0.79] HR-RW-2024-003, chunk 1 — "General remote work guidelines apply to all domestic employees..."
6. [score: 0.76] HR-BEN-2024-008, chunk 2 — "International employees are eligible for the Global Benefits Package..."
7. [score: 0.72] HR-COMP-2024-005, chunk 7 — "Compensation adjustments for geographic relocation..."
8. [score: 0.68] HR-RW-2024-007, chunk 6 — "Time zone requirements: Overlap minimum of 4 hours with team core hours..."
9. [score: 0.61] HR-SEC-2024-001, chunk 3 — "VPN requirements for remote access from international locations..."
10. [score: 0.58] HR-VISA-2024-002, chunk 1 — "Visa sponsorship and work authorization requirements..."

## Note
Results 5 and 7 are related but not directly answering the question. Reranking is needed to prioritize relevance.
</vector_search>`,
    },
    {
      id: "reranker",
      name: "Reranker",
      shortName: "Reranker",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 160,
      description: "Cross-encoder reranking model that scores query-document pairs for fine-grained relevance.",
      content: `<reranker>
## Model: Cohere Rerank v3
- Input: Query + 10 candidate chunks from vector search
- Output: Re-scored and reordered results with relevance scores

## Reranked Results (top 5 after filtering)
1. [relevance: 0.97] HR-RW-2024-007, chunk 3 — IRWF framework overview and approval requirements
2. [relevance: 0.94] HR-RW-2024-007, chunk 4 — Approval process: Form IRW-1, 30-day advance notice
3. [relevance: 0.91] HR-TAX-2024-012, chunk 1 — Tax implications and 183-day rule
4. [relevance: 0.88] HR-RW-2024-007, chunk 5 — Equipment stipend and connectivity allowance
5. [relevance: 0.83] HR-RW-2024-007, chunk 6 — Time zone overlap requirements

## Filtered Out (below 0.70 threshold)
- "General remote work guidelines" — domestic-only, not relevant to international
- "Compensation adjustments for relocation" — about permanent relocation, not remote work
- "Visa sponsorship requirements" — about immigration, not remote work policy

## Impact
Reranking promoted the approval process chunk from position 4 to position 2 and removed 5 irrelevant results that vector search returned.
</reranker>`,
    },
    {
      id: "query-expansion",
      name: "Query Expansion",
      shortName: "QueryExp",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 140,
      description: "Generates multiple query reformulations to improve recall and catch documents with different terminology.",
      content: `<query_expansion>
## Original Query
"What is our company's policy on remote work for international employees?"

## Expanded Queries (generated via LLM)
1. "International Remote Work Framework IRWF policy guidelines"
2. "Cross-border remote work approval process requirements"
3. "Tax implications working remotely from another country 183-day rule"
4. "International employee home office equipment stipend allowance"
5. "Global Mobility team remote work application procedure"

## Hypothetical Document Embedding (HyDE)
"The company's International Remote Work Framework (IRWF) allows employees to work remotely from countries outside their country of hire, subject to manager and Global Mobility team approval. Employees must submit Form IRW-1 at least 30 days in advance. Tax implications apply after 183 days, and international workers receive additional stipends."

## Additional Chunks Retrieved via Expansion
- HR-MOB-2024-003, chunk 2 — "Global Mobility team contact and submission portal..." (new)
- HR-RW-2024-007, chunk 7 — "Country-specific restrictions: certain jurisdictions are prohibited..." (new)

## Impact
Query expansion found 2 additional relevant chunks that the original query missed, including critical information about country-specific restrictions.
</query_expansion>`,
    },
    {
      id: "source-attribution",
      name: "Source Attribution",
      shortName: "Sources",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 120,
      description: "Grounds every claim in the response to a specific source document with page numbers and confidence scores.",
      content: `<source_attribution>
## Attribution Rules
- Every factual claim MUST cite its source document and page number
- Use inline citations: [Source: DOC-ID, p.XX]
- Confidence scoring per claim:
  - HIGH (>0.90): Direct quote or paraphrase from single source
  - MEDIUM (0.70-0.90): Synthesized from multiple sources
  - LOW (<0.70): Inferred — flag as "based on available information"
- If no source supports a claim, explicitly state: "I could not find documentation for this"

## Source Map for This Query
- IRWF overview → [HR-RW-2024-007, p.42] confidence: HIGH
- Approval process → [HR-RW-2024-007, p.43] confidence: HIGH
- Tax 183-day rule → [HR-TAX-2024-012, p.1] confidence: HIGH
- Stipend amounts → [HR-RW-2024-007, p.44] confidence: HIGH
- Country restrictions → [HR-RW-2024-007, p.45] confidence: MEDIUM
- Time zone requirements → [HR-RW-2024-007, p.44] confidence: HIGH

## Anti-Hallucination Check
Query asks about "international employees" — ensure response does NOT include domestic remote work policies (HR-RW-2024-003) as they have different rules.
</source_attribution>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Hallucinated",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Sure! Our company allows remote work for international employees. Generally, you just need manager approval and you can work from anywhere. Most companies allow this for up to 6 months. You should check with HR for more details.",
      issues: [
        "Completely fabricated answer with no source material",
        "Claims '6 months' with no basis — actual policy uses 183-day tax rule",
        "No mention of Global Mobility team, Form IRW-1, or IRWF",
        "No source citations — impossible to verify",
        "Could expose company to legal/tax liability if employee follows this advice",
      ],
      strengths: [],
    },
    {
      id: "chunking-only",
      label: "Raw Chunks",
      requiredComponents: ["doc-chunking"],
      score: 15,
      agentResponse:
        "Based on available documents:\n\n\"Remote work for international employees is governed by the International Remote Work Framework (IRWF). Employees residing outside their country of hire must obtain approval from both their direct manager and the Global Mobility team before beginning remote work...\"\n\n\"Tax implications vary by jurisdiction. Employees working remotely from a country for more than 183 days in a calendar year may trigger permanent establishment risks...\"\n\n\"Equipment and stipend: International remote workers receive the standard home office stipend ($1,500/year) plus an additional international connectivity allowance ($600/year)...\"",
      issues: [
        "Dumps raw chunks without synthesis or organization",
        "No semantic understanding — just returns text fragments",
        "Missing approval process details (Form IRW-1, 30-day notice)",
        "No ranking of information by relevance",
        "No source citations or page numbers",
      ],
      strengths: [
        "Contains actual policy text, not hallucinated content",
        "Chunks are from the correct policy document",
      ],
    },
    {
      id: "chunking-embedding",
      label: "Semantic Match",
      requiredComponents: ["doc-chunking", "embedding-model"],
      score: 30,
      agentResponse:
        "Based on our policy documents, international remote work is governed by the International Remote Work Framework (IRWF). You need approval from your manager and the Global Mobility team. There are tax implications if you work from another country for more than 183 days.\n\nYou also get a home office stipend and connectivity allowance for working internationally.",
      issues: [
        "Vague summary — missing specific amounts, forms, and timelines",
        "No mention of Form IRW-1 or 30-day advance requirement",
        "Doesn't mention country-specific restrictions",
        "No source citations",
        "Missing time zone overlap requirements",
      ],
      strengths: [
        "Semantically matched relevant content",
        "Correctly identifies IRWF as the governing framework",
        "Mentions the 183-day tax rule",
        "Coherent narrative rather than raw chunks",
      ],
    },
    {
      id: "chunking-embedding-vector",
      label: "Retrieved",
      requiredComponents: ["doc-chunking", "embedding-model", "vector-search"],
      score: 50,
      agentResponse:
        "Our international remote work policy is governed by the International Remote Work Framework (IRWF), policy HR-RW-2024-007.\n\nKey points:\n- You need approval from your direct manager and the Global Mobility team\n- Submit Form IRW-1 at least 30 days before starting international remote work\n- Tax implications: Working from another country for more than 183 days may trigger permanent establishment risks\n- You'll receive the standard home office stipend ($1,500/year) plus an international connectivity allowance ($600/year)\n- VPN access is mandatory for all international remote connections\n\nI'd also recommend checking the general remote work guidelines and compensation adjustment policies for additional context.",
      issues: [
        "Recommends checking domestic policy (not applicable to international)",
        "Mentions compensation adjustments (about relocation, not remote work)",
        "Missing time zone overlap requirements",
        "Missing country-specific restrictions",
        "No formal source citations with page numbers",
      ],
      strengths: [
        "Cites the correct policy ID (HR-RW-2024-007)",
        "Includes specific details: Form IRW-1, 30-day notice, stipend amounts",
        "Mentions 183-day tax rule",
        "Structured response with clear bullet points",
        "Includes VPN requirement from security policy",
      ],
    },
    {
      id: "chunking-embedding-vector-reranker",
      label: "Reranked",
      requiredComponents: ["doc-chunking", "embedding-model", "vector-search", "reranker"],
      score: 65,
      agentResponse:
        "Our international remote work policy is managed under the International Remote Work Framework (IRWF), documented in HR-RW-2024-007.\n\n**Approval Process:**\n- Obtain approval from both your direct manager and the Global Mobility team\n- Submit Form IRW-1 at least 30 days before your intended start date\n\n**Tax & Compliance:**\n- Working from another country for more than 183 days in a calendar year may trigger permanent establishment risks\n- The company provides tax advisory services through GlobalTax Associates\n\n**Benefits & Equipment:**\n- Standard home office stipend: $1,500/year\n- International connectivity allowance: $600/year (additional)\n- VPN access is mandatory\n\n**Schedule:**\n- Minimum 4-hour overlap with your team's core hours required\n\nPlease reach out to the Global Mobility team for your specific situation.",
      issues: [
        "Missing country-specific restrictions (some jurisdictions prohibited)",
        "No formal source citations with page numbers",
        "Doesn't mention the Global Benefits Package eligibility",
        "Could be more specific about the tax advisory process",
      ],
      strengths: [
        "Irrelevant results filtered out (domestic policy, relocation)",
        "Well-structured with clear categories",
        "Includes time zone overlap requirement",
        "Mentions tax advisory services",
        "Actionable next step (contact Global Mobility)",
      ],
    },
    {
      id: "chunking-embedding-vector-reranker-expansion",
      label: "Expanded",
      requiredComponents: ["doc-chunking", "embedding-model", "vector-search", "reranker", "query-expansion"],
      score: 80,
      agentResponse:
        "Here is a comprehensive overview of our international remote work policy under the International Remote Work Framework (IRWF), policy HR-RW-2024-007.\n\n**Approval Process:**\n- Obtain approval from both your direct manager and the Global Mobility team\n- Submit Form IRW-1 through the Global Mobility portal at least 30 days in advance\n\n**Tax & Compliance:**\n- Working from another country for more than 183 days/year may create permanent establishment risks\n- The company provides tax advisory through GlobalTax Associates — contact Global Mobility to set up a consultation\n\n**Country Restrictions:**\n- Certain jurisdictions are prohibited due to regulatory or sanctions compliance — check the restricted countries list with Global Mobility before applying\n\n**Benefits & Equipment:**\n- Standard home office stipend: $1,500/year\n- International connectivity allowance: $600/year (additional)\n- VPN access is mandatory for all international connections\n\n**Schedule Requirements:**\n- Minimum 4-hour overlap with your team's core hours\n\nWould you like me to help you start the Form IRW-1 submission process?",
      issues: [
        "No inline source citations with page numbers",
        "Doesn't explicitly state confidence level per claim",
        "Missing information about the Global Benefits Package",
      ],
      strengths: [
        "Query expansion found country-specific restrictions (missed by basic search)",
        "Includes Global Mobility portal detail from expanded queries",
        "Comprehensive coverage of all policy aspects",
        "Proactive offer to help with next steps",
        "Well-organized with clear section headers",
      ],
    },
    {
      id: "all",
      label: "Precise Sourced Answer",
      requiredComponents: ["doc-chunking", "embedding-model", "vector-search", "reranker", "query-expansion", "source-attribution"],
      score: 95,
      agentResponse:
        "Here is our international remote work policy, fully sourced from the current policy documents.\n\n**Approval Process** [Source: HR-RW-2024-007, pp.42-43]\n- International remote work is governed by the International Remote Work Framework (IRWF)\n- You need approval from both your direct manager and the Global Mobility team\n- Submit Form IRW-1 through the Global Mobility portal at least 30 days in advance\n\n**Tax & Compliance** [Source: HR-TAX-2024-012, p.1]\n- Working from another country for more than 183 days in a calendar year may trigger permanent establishment risks\n- The company provides tax advisory services through GlobalTax Associates — contact Global Mobility to arrange a consultation\n\n**Country Restrictions** [Source: HR-RW-2024-007, p.45]\n- Certain jurisdictions are prohibited due to regulatory or sanctions compliance\n- Check the restricted countries list with Global Mobility before submitting Form IRW-1\n\n**Benefits & Equipment** [Source: HR-RW-2024-007, p.44]\n- Standard home office stipend: $1,500/year\n- International connectivity allowance: $600/year (additional)\n- VPN access is mandatory for all international connections\n\n**Schedule** [Source: HR-RW-2024-007, p.44]\n- Minimum 4-hour overlap with your team's core hours is required\n\nAll information above has HIGH confidence (direct policy citations). I could not find specific documentation on whether the international remote work policy differs for contractors vs. full-time employees — you may want to confirm this with Global Mobility.\n\nWould you like help starting your Form IRW-1 application?",
      issues: [
        "Could proactively link to the Global Mobility portal",
      ],
      strengths: [
        "Every claim cited with document ID and page number",
        "Confidence levels stated — explicitly flags what is NOT documented",
        "Country restrictions included (found via query expansion)",
        "Irrelevant domestic policies excluded (via reranking)",
        "Anti-hallucination: openly states limitation about contractor policy",
        "Actionable next step offered",
        "Complete coverage of approval, tax, restrictions, benefits, and schedule",
        "Production-ready response suitable for an internal knowledge base",
      ],
    },
    {
      id: "embedding-only",
      label: "Semantic Only",
      requiredComponents: ["embedding-model"],
      score: 10,
      agentResponse:
        "I found some semantically related content about remote work and international employment, but I don't have properly chunked documents to retrieve from. The embedding model can match concepts like 'international employees' to 'cross-border workers,' but without a retrieval pipeline, I can only tell you that related content exists in the knowledge base.\n\nPlease try searching the HR portal directly or contact the Global Mobility team.",
      issues: [
        "Embeddings without documents to embed are useless",
        "Cannot retrieve or present any actual policy content",
        "Deflects entirely to manual search",
        "No actionable information provided",
        "Demonstrates that embeddings alone are not a RAG pipeline",
      ],
      strengths: [
        "Honest about its limitations",
        "Correctly identifies semantic matching capability",
      ],
    },
  ],
  principles: [
    {
      id: "retrieval-before-generation",
      title: "Retrieve Before You Generate",
      description:
        "Without retrieval, LLMs hallucinate confidently. The jump from score 5 to 50 comes entirely from actually retrieving documents. Every RAG system must solve retrieval quality before optimizing generation.",
      linkedComponents: ["doc-chunking", "embedding-model", "vector-search"],
    },
    {
      id: "precision-over-recall",
      title: "Reranking Trades Recall for Precision",
      description:
        "Vector search retrieves broadly (high recall, lower precision). The reranker filters aggressively, removing domestic-only policies and relocation documents that would confuse the answer. In knowledge-base Q&A, wrong context is worse than missing context.",
      linkedComponents: ["vector-search", "reranker"],
    },
    {
      id: "query-matters",
      title: "The Query Is Half the Battle",
      description:
        "Query expansion found country-specific restrictions that the original query missed entirely. Users rarely phrase questions in the same language as the documents. Bridging that gap is what separates a good RAG system from a mediocre one.",
      linkedComponents: ["query-expansion", "embedding-model"],
    },
    {
      id: "trust-through-citation",
      title: "Citations Build Trust",
      description:
        "Source attribution transforms a helpful answer into a verifiable one. In enterprise settings, employees need to know WHICH policy, WHICH page, and HOW confident the system is. Without citations, RAG is just a fancier way to hallucinate.",
      linkedComponents: ["source-attribution"],
    },
  ],
};
