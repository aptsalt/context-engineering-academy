export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const ragChapters: Chapter[] = [
  {
    id: "rag-fundamentals",
    number: 1,
    title: "RAG Fundamentals",
    subtitle: "Retrieval-Augmented Generation from first principles",
    icon: "book",
  },
  {
    id: "chunking",
    number: 2,
    title: "Chunking Strategies",
    subtitle: "Semantic, recursive, agentic chunking",
    icon: "scissors",
  },
  {
    id: "embeddings",
    number: 3,
    title: "Embeddings & Vector Databases",
    subtitle: "Choosing models and storage for your use case",
    icon: "database",
  },
  {
    id: "retrieval-strategies",
    number: 4,
    title: "Retrieval Strategies",
    subtitle: "Hybrid search, reranking, query expansion",
    icon: "search",
  },
  {
    id: "agentic-patterns",
    number: 5,
    title: "Agentic RAG Patterns",
    subtitle: "Self-RAG, corrective RAG, adaptive retrieval",
    icon: "brain",
  },
  {
    id: "query-routing",
    number: 6,
    title: "Query Routing & Planning",
    subtitle: "Multi-step retrieval with query decomposition",
    icon: "route",
  },
  {
    id: "rag-evaluation",
    number: 7,
    title: "Evaluating RAG Systems",
    subtitle: "Faithfulness, relevance, and answer quality",
    icon: "chart",
  },
  {
    id: "production-rag",
    number: 8,
    title: "Production RAG Architecture",
    subtitle: "Scaling, caching, and real-time indexing",
    icon: "server",
  },
  {
    id: "advanced-patterns",
    number: 9,
    title: "Advanced Patterns",
    subtitle: "Graph RAG, multimodal RAG, conversational RAG",
    icon: "sparkles",
  },
  {
    id: "rag-anti-patterns",
    number: 10,
    title: "Anti-Patterns & Failure Modes",
    subtitle: "The most common RAG mistakes and how to fix them",
    icon: "warning",
  },
  {
    id: "rag-interactive-examples",
    number: 11,
    title: "Interactive Code Examples",
    subtitle: "Naive vs. production RAG patterns side by side",
    icon: "code",
  },
  {
    id: "rag-best-practices",
    number: 12,
    title: "Best Practices Checklist",
    subtitle: "Production-ready guidelines for every RAG stage",
    icon: "check",
  },
  {
    id: "rag-resources",
    number: 13,
    title: "Resources & Further Reading",
    subtitle: "Papers, docs, and guides",
    icon: "book",
  },
];

export interface Quote {
  text: string;
  author: string;
  role: string;
}

export const ragQuotes: Quote[] = [
  {
    text: "RAG is not just a technique — it's a paradigm shift. Instead of cramming knowledge into model weights, you give the model a library card.",
    author: "Jerry Liu",
    role: "Co-founder & CEO, LlamaIndex",
  },
  {
    text: "The biggest mistake teams make with RAG is treating retrieval as a solved problem. Your RAG system is only as good as the retrieval step.",
    author: "Harrison Chase",
    role: "Co-founder & CEO, LangChain",
  },
  {
    text: "Vector search alone is not enough. The future of RAG is hybrid search combined with learned reranking — that's where the real accuracy gains come from.",
    author: "Bob van Luijt",
    role: "Co-founder & CEO, Weaviate",
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

export const ragCodeExamples: CodeExample[] = [
  {
    id: "naive-rag",
    title: "Naive RAG vs. Structured RAG",
    description: "The difference between dumping documents and structured retrieval",
    category: "RAG Pipeline",
    bad: {
      label: "Naive: stuff everything into the prompt",
      code: `// BAD: Dump all documents into context
async function askQuestion(question: string) {
  const allDocs = await db.collection("docs").find({}).toArray();

  const response = await llm.generate({
    system: "Answer the question using these docs.",
    messages: [
      {
        role: "user",
        content: \`Docs: \${allDocs.map((d) => d.text).join("\\n")}
                  Question: \${question}\`,
      },
    ],
  });

  return response;
}`,
      explanation:
        "Dumping all documents into the context wastes tokens, causes context rot, and often exceeds window limits. The model can't distinguish relevant from irrelevant content, leading to hallucination and degraded answers.",
    },
    good: {
      label: "Structured retrieval with relevance filtering",
      code: `// GOOD: Embed, retrieve, filter, generate
async function askQuestion(question: string) {
  // 1. Embed the query
  const queryEmbedding = await embedModel.embed(question);

  // 2. Retrieve top-k relevant chunks
  const results = await vectorDB.query({
    vector: queryEmbedding,
    topK: 5,
    filter: { status: "published" },
    includeMetadata: true,
  });

  // 3. Filter by relevance threshold
  const relevant = results.filter((r) => r.score >= 0.75);

  // 4. Format with source attribution
  const context = relevant
    .map((r, i) => \`[Source \${i + 1}: \${r.metadata.title}]\\n\${r.text}\`)
    .join("\\n\\n");

  // 5. Generate with grounded instructions
  const response = await llm.generate({
    system: \`Answer using ONLY the provided sources.
Cite sources by number. If unsure, say so.\`,
    messages: [
      { role: "user", content: \`Sources:\\n\${context}\\n\\nQ: \${question}\` },
    ],
  });

  return response;
}`,
      explanation:
        "Structured RAG embeds the query, retrieves only the top-k most relevant chunks, filters by a similarity threshold, and instructs the model to cite sources. This reduces hallucination and keeps token usage efficient.",
    },
  },
  {
    id: "chunking-strategy",
    title: "Chunking: Fixed vs. Semantic",
    description: "How you split documents determines retrieval quality",
    category: "Chunking",
    bad: {
      label: "Fixed-size character splitting",
      code: `// BAD: Blind character splitting
function chunkDocument(text: string): string[] {
  const chunks: string[] = [];
  const chunkSize = 500;

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
    // Splits mid-sentence, mid-word, mid-thought
    // "The refund policy requires cust" | "omers to submit..."
  }

  return chunks;
}`,
      explanation:
        "Fixed character splitting breaks sentences, paragraphs, and logical units. A chunk ending with 'The refund policy requires cust-' and the next starting with '-omers to submit...' destroys semantic meaning and makes retrieval unreliable.",
    },
    good: {
      label: "Recursive text splitting with overlap",
      code: `// GOOD: Semantic-aware recursive splitting
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ["\\n\\n", "\\n", ". ", " ", ""],
});

async function chunkDocument(text: string, metadata: DocMetadata) {
  const chunks = await splitter.createDocuments(
    [text],
    [metadata],
  );

  // Enrich each chunk with context
  return chunks.map((chunk, i) => ({
    content: chunk.pageContent,
    metadata: {
      ...chunk.metadata,
      chunkIndex: i,
      totalChunks: chunks.length,
      // Preserve parent doc context
      section: detectSection(chunk.pageContent),
    },
  }));
}`,
      explanation:
        "Recursive splitting tries paragraph breaks first, then sentences, then words. The 200-token overlap ensures context isn't lost at boundaries. Metadata enrichment preserves the chunk's position and parent document context for better retrieval.",
    },
  },
  {
    id: "hybrid-search",
    title: "Dense-Only vs. Hybrid Search",
    description: "Why vector search alone misses keyword-dependent queries",
    category: "Retrieval",
    bad: {
      label: "Vector search only",
      code: `// BAD: Dense retrieval only
async function search(query: string) {
  const embedding = await embed(query);

  // Vector search alone misses exact keyword matches
  // Query: "error code E-4012" → finds docs about "errors"
  // but misses the exact code E-4012
  const results = await vectorDB.query({
    vector: embedding,
    topK: 10,
  });

  return results;
}`,
      explanation:
        "Pure vector search is semantic — it finds conceptually similar content. But for exact terms like error codes, product IDs, or acronyms, it often returns conceptually related but factually wrong results. 'Error code E-4012' might match generic error handling docs.",
    },
    good: {
      label: "Hybrid search: dense + sparse + reranking",
      code: `// GOOD: Hybrid search with reranking
async function hybridSearch(query: string) {
  // 1. Dense retrieval (semantic similarity)
  const denseResults = await vectorDB.query({
    vector: await embed(query),
    topK: 20,
  });

  // 2. Sparse retrieval (BM25 keyword matching)
  const sparseResults = await bm25Index.search(query, { topK: 20 });

  // 3. Reciprocal Rank Fusion to merge results
  const fused = reciprocalRankFusion(denseResults, sparseResults, {
    k: 60, // RRF constant
  });

  // 4. Rerank with a cross-encoder for precision
  const reranked = await reranker.rerank({
    query,
    documents: fused.slice(0, 20),
    topK: 5,
  });

  return reranked;
}`,
      explanation:
        "Hybrid search combines semantic (dense) and keyword (sparse/BM25) retrieval, then fuses results with Reciprocal Rank Fusion. A cross-encoder reranker makes the final precision pass. This catches both conceptual matches and exact keyword hits.",
    },
  },
  {
    id: "self-rag",
    title: "One-Shot RAG vs. Self-RAG",
    description: "Letting the agent decide when and what to retrieve",
    category: "Agentic Patterns",
    bad: {
      label: "Always retrieve, never verify",
      code: `// BAD: Blind retrieve-then-generate
async function ragPipeline(query: string) {
  // Always retrieves, even for simple questions
  const docs = await vectorDB.query({
    vector: await embed(query),
    topK: 5,
  });

  // Never checks if retrieved docs are relevant
  // Never verifies the answer is grounded
  const answer = await llm.generate({
    messages: [
      {
        role: "user",
        content: \`Context: \${docs.map((d) => d.text).join("\\n")}
                  Question: \${query}\`,
      },
    ],
  });

  return answer; // Could hallucinate, no self-check
}`,
      explanation:
        "One-shot RAG always retrieves (even for questions the model already knows), never checks if retrieved documents are actually relevant, and never verifies the generated answer is grounded in the sources. This leads to unnecessary latency and undetected hallucinations.",
    },
    good: {
      label: "Self-RAG: retrieve, critique, regenerate",
      code: `// GOOD: Self-RAG with reflection tokens
async function selfRAG(query: string) {
  // Step 1: Decide if retrieval is needed
  const needsRetrieval = await llm.generate({
    system: "Determine if external knowledge is needed.",
    messages: [{ role: "user", content: query }],
  });

  let context = "";
  if (needsRetrieval.includes("[RETRIEVE]")) {
    const docs = await vectorDB.query({
      vector: await embed(query),
      topK: 5,
    });

    // Step 2: Check relevance of each document
    const relevant = await Promise.all(
      docs.map(async (doc) => {
        const check = await llm.generate({
          system: "Is this document relevant to the query? [RELEVANT] or [IRRELEVANT]",
          messages: [{ role: "user", content: \`Query: \${query}\\nDoc: \${doc.text}\` }],
        });
        return check.includes("[RELEVANT]") ? doc : null;
      }),
    );
    context = relevant.filter(Boolean).map((d) => d!.text).join("\\n\\n");
  }

  // Step 3: Generate with grounding check
  const answer = await llm.generate({
    system: \`Answer the query. If using sources, every claim
must be traceable to the provided context. End with a
[SUPPORTED] or [NOT_SUPPORTED] self-assessment.\`,
    messages: [
      { role: "user", content: \`Context: \${context}\\nQuery: \${query}\` },
    ],
  });

  // Step 4: If not supported, retry with more retrieval
  if (answer.includes("[NOT_SUPPORTED]")) {
    return selfRAG(rephrasedQuery(query)); // Retry
  }

  return answer;
}`,
      explanation:
        "Self-RAG (Asai et al., 2023) adds reflection tokens: the model decides IF it needs retrieval, checks each document's relevance, generates with a grounding self-assessment, and retries if the answer isn't supported. This reduces hallucination by 30-50% compared to naive RAG.",
    },
  },
  {
    id: "rag-eval",
    title: "No Evaluation vs. RAGAS Evaluation",
    description: "How to measure if your RAG system actually works",
    category: "Evaluation",
    bad: {
      label: "Vibes-based evaluation",
      code: `// BAD: "Looks good to me" evaluation
async function evaluateRAG(testQuestions: string[]) {
  for (const question of testQuestions) {
    const answer = await ragPipeline(question);
    console.log(\`Q: \${question}\`);
    console.log(\`A: \${answer}\`);
    // Engineer reads output, says "seems fine"
    // No metrics, no regression detection
  }
}`,
      explanation:
        "Manual spot-checking doesn't scale, misses edge cases, can't detect regressions, and provides no quantitative signal for improvement. A change that improves 10 queries but breaks 50 others goes undetected.",
    },
    good: {
      label: "RAGAS framework: systematic RAG evaluation",
      code: `// GOOD: RAGAS-based evaluation pipeline
interface RAGEvalResult {
  faithfulness: number;    // Is the answer grounded in context?
  answerRelevancy: number; // Does the answer address the question?
  contextPrecision: number; // Are retrieved docs relevant?
  contextRecall: number;   // Did we retrieve all needed docs?
}

async function evaluateRAG(
  testSet: { question: string; groundTruth: string }[],
): Promise<RAGEvalResult[]> {
  const results: RAGEvalResult[] = [];

  for (const { question, groundTruth } of testSet) {
    const { answer, contexts } = await ragPipelineWithContext(question);

    // Faithfulness: decompose answer into claims, check each
    const faithfulness = await scoreFaithfulness(answer, contexts);

    // Answer relevancy: generate questions from answer, compare
    const answerRelevancy = await scoreAnswerRelevancy(answer, question);

    // Context precision: are top-ranked docs actually relevant?
    const contextPrecision = await scoreContextPrecision(
      contexts, groundTruth,
    );

    // Context recall: does context cover all ground truth claims?
    const contextRecall = await scoreContextRecall(contexts, groundTruth);

    results.push({
      faithfulness,
      answerRelevancy,
      contextPrecision,
      contextRecall,
    });
  }

  return results;
}`,
      explanation:
        "RAGAS (Retrieval Augmented Generation Assessment) provides four core metrics that isolate whether problems are in retrieval or generation. Faithfulness catches hallucination, context precision/recall measure retrieval quality, and answer relevancy measures end-to-end quality.",
    },
  },
  {
    id: "query-decomposition",
    title: "Single Query vs. Query Decomposition",
    description: "Complex questions need to be broken into sub-queries",
    category: "Query Planning",
    bad: {
      label: "Send complex query as-is",
      code: `// BAD: Complex query sent directly to retrieval
async function answer(query: string) {
  // "Compare the pricing, features, and performance of
  //  Pinecone vs Weaviate vs Chroma for a 10M document
  //  production use case"
  //
  // A single embedding can't capture all 3 comparison axes
  const docs = await vectorDB.query({
    vector: await embed(query),
    topK: 5,
  });

  return llm.generate({
    messages: [{ role: "user", content: \`\${docs}\\n\${query}\` }],
  });
  // Result: vague answer missing key comparisons
}`,
      explanation:
        "A single embedding for a multi-faceted query captures only the dominant semantic theme. 'Compare pricing, features, and performance of X vs Y vs Z' gets embedded into one vector that can't simultaneously match pricing docs, feature docs, and benchmark docs for three different products.",
    },
    good: {
      label: "Decompose into focused sub-queries",
      code: `// GOOD: Decompose complex queries into sub-queries
async function decomposeAndRetrieve(query: string) {
  // Step 1: LLM decomposes the question
  const subQueries = await llm.generate({
    system: \`Decompose this complex question into 2-5
simple, focused sub-questions. Return as JSON array.\`,
    messages: [{ role: "user", content: query }],
  });
  // ["What is Pinecone's pricing for 10M docs?",
  //  "What is Weaviate's pricing for 10M docs?",
  //  "How does Pinecone perform at 10M scale?", ...]

  // Step 2: Retrieve for each sub-query in parallel
  const allResults = await Promise.all(
    JSON.parse(subQueries).map(async (subQ: string) => {
      const docs = await vectorDB.query({
        vector: await embed(subQ),
        topK: 3,
      });
      return { subQuery: subQ, docs };
    }),
  );

  // Step 3: Deduplicate and synthesize
  const uniqueDocs = deduplicateByContent(
    allResults.flatMap((r) => r.docs),
  );

  return llm.generate({
    system: \`Synthesize a comprehensive answer from these
sources. Address each aspect of the original question.\`,
    messages: [
      {
        role: "user",
        content: \`Sources:\\n\${formatDocs(uniqueDocs)}\\n\\nOriginal question: \${query}\`,
      },
    ],
  });
}`,
      explanation:
        "Query decomposition breaks complex questions into focused sub-queries, retrieves separately for each, deduplicates results, then synthesizes a comprehensive answer. Each sub-query produces a focused embedding that matches the right documents for that specific aspect.",
    },
  },
  {
    id: "production-caching",
    title: "No Cache vs. Semantic Caching",
    description: "Avoid redundant embedding and retrieval calls",
    category: "Production",
    bad: {
      label: "Every query hits the full pipeline",
      code: `// BAD: No caching — identical queries re-embed and re-retrieve
async function handleQuery(query: string) {
  // User asks "What is your refund policy?" 100 times/day
  // Each time: embed ($0.0001) + retrieve + LLM ($0.01)
  // = $1/day for ONE repeated question
  const embedding = await embedModel.embed(query);
  const docs = await vectorDB.query({ vector: embedding, topK: 5 });
  const answer = await llm.generate({
    messages: [{ role: "user", content: \`\${docs}\\n\${query}\` }],
  });
  return answer;
}`,
      explanation:
        "Without caching, every query — even identical ones — triggers the full embed-retrieve-generate pipeline. In production, common questions get asked hundreds of times daily, wasting compute and money on redundant work.",
    },
    good: {
      label: "Semantic cache with TTL",
      code: `// GOOD: Semantic caching for similar queries
interface CacheEntry {
  query: string;
  embedding: number[];
  answer: string;
  sources: string[];
  cachedAt: number;
}

const CACHE_TTL = 3600_000; // 1 hour
const SIMILARITY_THRESHOLD = 0.95;

async function handleQuery(query: string) {
  const queryEmbedding = await embedModel.embed(query);

  // Check semantic cache — find similar past queries
  const cached = await cacheDB.query({
    vector: queryEmbedding,
    topK: 1,
    filter: { cachedAt: { $gt: Date.now() - CACHE_TTL } },
  });

  if (cached[0] && cached[0].score >= SIMILARITY_THRESHOLD) {
    return { answer: cached[0].answer, cached: true };
  }

  // Cache miss — run full pipeline
  const docs = await vectorDB.query({
    vector: queryEmbedding,
    topK: 5,
  });
  const answer = await llm.generate({
    messages: [
      { role: "user", content: \`\${formatDocs(docs)}\\n\${query}\` },
    ],
  });

  // Store in cache for future hits
  await cacheDB.upsert({
    query,
    embedding: queryEmbedding,
    answer,
    sources: docs.map((d) => d.metadata.title),
    cachedAt: Date.now(),
  });

  return { answer, cached: false };
}`,
      explanation:
        "Semantic caching embeds incoming queries and checks if a semantically similar query was recently answered. A 0.95 similarity threshold catches paraphrases ('refund policy' vs 'how do I get a refund?'). TTL ensures stale answers expire. This can reduce RAG costs by 60-80% in production.",
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

export const ragAntiPatterns: AntiPattern[] = [
  {
    name: "Chunk Soup",
    icon: "soup",
    description:
      "Retrieved chunks are fragments of different documents mashed together without coherence, losing the logical flow of information.",
    cause:
      "Fixed-size character splitting that breaks mid-sentence, no overlap between chunks, no metadata preserving document structure or section hierarchy.",
    symptom:
      "Answers contain contradictory statements from different sources mixed together. The model stitches together unrelated fragments into plausible-sounding but incorrect answers.",
    fix: "Use recursive or semantic chunking that respects document boundaries. Add 10-20% overlap. Preserve parent document metadata and section headers in each chunk. Consider document-level summaries alongside chunk-level retrieval.",
    severity: "critical",
  },
  {
    name: "Embedding Mismatch",
    icon: "mismatch",
    description:
      "The embedding model's training domain doesn't match your document domain, causing poor semantic similarity scores for relevant documents.",
    cause:
      "Using a general-purpose embedding model (trained on web text) for specialized domains like medical, legal, or financial documents. The model's vector space doesn't capture domain-specific semantic relationships.",
    symptom:
      "Retrieval returns semantically adjacent but factually wrong documents. Medical queries about 'hypertension treatment' retrieve docs about 'stress management' because the general model conflates the concepts.",
    fix: "Benchmark multiple embedding models on YOUR data before committing. Use domain-specific models when available (e.g., PubMedBERT for medical). Fine-tune embeddings on domain-specific pairs. Test with MTEB or custom eval sets.",
    severity: "high",
  },
  {
    name: "Retrieval Hallucination",
    icon: "ghost",
    description:
      "The model generates confident answers that appear grounded in retrieved context but actually fabricate claims not present in any source document.",
    cause:
      "No faithfulness checking between the generated answer and retrieved sources. The model fills gaps in retrieved context with plausible-sounding but fabricated information, especially when context is partially relevant.",
    symptom:
      "Answers contain specific numbers, dates, or claims that sound authoritative but don't appear in any retrieved document. Users trust these answers because they're in a 'RAG system' that should be grounded.",
    fix: "Implement faithfulness scoring (RAGAS). Decompose answers into atomic claims and verify each against source documents. Instruct the model to say 'I don't have enough information' when context is insufficient. Add citation requirements.",
    severity: "critical",
  },
  {
    name: "Index Bloat",
    icon: "bloat",
    description:
      "The vector index contains outdated, duplicate, or irrelevant documents that dilute retrieval quality and increase costs.",
    cause:
      "No document lifecycle management. Old versions of documents coexist with new versions. Duplicate content from multiple ingestion runs. No garbage collection for deleted source documents.",
    symptom:
      "Retrieval returns outdated information alongside current data. Answers reference deprecated policies, old product features, or superseded documentation. Index costs grow linearly while quality degrades.",
    fix: "Implement document versioning with metadata filters. Use content hashing to prevent duplicate ingestion. Build a deletion pipeline that removes vectors when source documents are updated or removed. Schedule periodic index audits.",
    severity: "high",
  },
  {
    name: "Query Naivety",
    icon: "naive",
    description:
      "Sending user queries directly to the vector search without any transformation, assuming the user's phrasing will match document phrasing.",
    cause:
      "No query preprocessing, expansion, or decomposition. Users ask questions in natural language ('why is my bill so high?') while documents use formal language ('billing adjustment procedures').",
    symptom:
      "Poor retrieval recall — relevant documents exist in the index but aren't retrieved because the user's language doesn't semantically match the document language. Users report 'the system doesn't know things it should.'",
    fix: "Implement query transformation: HyDE (generate a hypothetical document, embed that instead), query expansion (add synonyms/related terms), query decomposition for complex questions, or step-back prompting to generalize specific queries.",
    severity: "high",
  },
  {
    name: "Context Window Stuffing",
    icon: "stuffing",
    description:
      "Retrieving too many chunks and stuffing them all into the context, exceeding the model's effective attention span even if within token limits.",
    cause:
      "Setting topK too high (20+) without reranking or relevance filtering. Assuming more context is better. Not understanding the 'lost in the middle' phenomenon where models ignore information in the middle of long contexts.",
    symptom:
      "Model ignores key information buried among irrelevant chunks. Answer quality actually degrades as you add more retrieved documents. Performance is worse with 20 chunks than with 5 well-chosen ones.",
    fix: "Retrieve broadly (top-20), then rerank to top-5. Set minimum similarity thresholds. Use contextual compression to extract only the relevant sentences from each chunk. Test answer quality at different topK values to find the optimum.",
    severity: "medium",
  },
];

export interface BestPractice {
  category: string;
  items: { title: string; description: string }[];
}

export const ragBestPractices: BestPractice[] = [
  {
    category: "Chunking & Indexing",
    items: [
      {
        title: "Match chunk size to your use case",
        description:
          "QA tasks work best with 256-512 token chunks. Summarization needs 1024-2048. Test chunk sizes on your actual queries — there is no universal optimum.",
      },
      {
        title: "Always use overlap between chunks",
        description:
          "10-20% overlap (e.g., 100 tokens for 500-token chunks) prevents information loss at chunk boundaries. This is the single highest-ROI chunking improvement.",
      },
      {
        title: "Preserve metadata in every chunk",
        description:
          "Include source document title, section header, page number, last updated date, and document type. Metadata enables filtering and improves answer attribution.",
      },
      {
        title: "Consider parent-child chunk hierarchies",
        description:
          "Index small chunks for precise retrieval but return their parent (larger) chunk for context. This gives you the best of both worlds: precise matching with sufficient context.",
      },
    ],
  },
  {
    category: "Retrieval Quality",
    items: [
      {
        title: "Use hybrid search (dense + sparse) by default",
        description:
          "Hybrid search catches both semantic and keyword matches. Research consistently shows it outperforms either approach alone, especially for mixed query types.",
      },
      {
        title: "Always add a reranking step",
        description:
          "First-stage retrieval (vector search) is fast but imprecise. A cross-encoder reranker (Cohere, ColBERT, BGE) re-scores results for the final top-k selection. This typically improves precision by 15-30%.",
      },
      {
        title: "Set minimum relevance thresholds",
        description:
          "Don't inject documents below a similarity threshold (e.g., 0.7). Irrelevant context is worse than no context — it actively misleads the model.",
      },
      {
        title: "Implement Maximal Marginal Relevance (MMR)",
        description:
          "MMR balances relevance with diversity in retrieved results. Without it, you get five near-identical chunks about the same subtopic while missing other relevant information.",
      },
    ],
  },
  {
    category: "Generation & Faithfulness",
    items: [
      {
        title: "Require source citations in every answer",
        description:
          "Instruct the model to cite which source each claim comes from (by number or title). This enables verification and naturally reduces hallucination because the model must ground each claim.",
      },
      {
        title: "Implement faithfulness checking",
        description:
          "Score generated answers against retrieved context using RAGAS faithfulness metric. Decompose answers into claims and verify each against sources. Flag answers with faithfulness below 0.8.",
      },
      {
        title: "Tell the model when to say 'I don't know'",
        description:
          "Explicitly instruct: 'If the provided sources don't contain enough information to answer, say so rather than guessing.' This simple instruction dramatically reduces hallucination.",
      },
      {
        title: "Separate retrieval evaluation from generation evaluation",
        description:
          "A wrong answer can stem from bad retrieval OR bad generation. Evaluate context precision/recall independently from answer faithfulness/relevancy to diagnose which stage is failing.",
      },
    ],
  },
  {
    category: "Production Operations",
    items: [
      {
        title: "Implement semantic caching",
        description:
          "Cache answers for semantically similar queries. In production, common questions get asked hundreds of times daily. Semantic caching can reduce RAG pipeline costs by 60-80%.",
      },
      {
        title: "Build an incremental indexing pipeline",
        description:
          "Don't re-index your entire corpus for every update. Use content hashing to detect changes, update only modified documents, and handle deletions. This keeps your index fresh without rebuilding from scratch.",
      },
      {
        title: "Monitor retrieval quality in production",
        description:
          "Track metrics like average relevance score, cache hit rate, retrieval latency (p50/p95/p99), and user feedback signals. Set alerts for relevance score drops.",
      },
      {
        title: "Version your embeddings",
        description:
          "When you change embedding models, you must re-embed your entire corpus. Version your indexes so you can roll back. Never mix embeddings from different models in the same index.",
      },
    ],
  },
  {
    category: "Agentic RAG Patterns",
    items: [
      {
        title: "Start with naive RAG, add agentic layers as needed",
        description:
          "Self-RAG, CRAG, and adaptive RAG add complexity and latency. Start simple. Add agentic retrieval only when evaluation shows naive RAG is insufficient for your queries.",
      },
      {
        title: "Use query routing for heterogeneous data sources",
        description:
          "If you have SQL databases, vector stores, and knowledge graphs, route queries to the right backend. An LLM classifier or keyword-based router can determine the best retrieval strategy per query.",
      },
      {
        title: "Implement corrective RAG for high-stakes applications",
        description:
          "For medical, legal, or financial RAG, add a document relevance check after retrieval and before generation. If retrieved docs aren't relevant enough, fall back to web search or escalate to a human.",
      },
      {
        title: "Set max retrieval iterations for agentic patterns",
        description:
          "Agentic RAG patterns that retry retrieval (Self-RAG, CRAG) need a circuit breaker. Set a maximum of 3 retrieval iterations to prevent infinite loops and runaway costs.",
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

export const ragResources: Resource[] = [
  {
    title: "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection",
    url: "https://arxiv.org/abs/2310.11511",
    type: "paper",
    source: "arXiv",
    description:
      "The foundational Self-RAG paper by Asai et al. Introduces reflection tokens that let the model decide when to retrieve and verify its own outputs.",
  },
  {
    title: "Corrective Retrieval Augmented Generation (CRAG)",
    url: "https://arxiv.org/abs/2401.15884",
    type: "paper",
    source: "arXiv",
    description:
      "Introduces a retrieval evaluator that scores document relevance and triggers corrective actions — knowledge refinement or web search fallback.",
  },
  {
    title: "RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval",
    url: "https://arxiv.org/abs/2401.18059",
    type: "paper",
    source: "arXiv",
    description:
      "Clusters and summarizes documents into a tree hierarchy, enabling retrieval at different levels of abstraction for both detailed and thematic queries.",
  },
  {
    title: "RAGAS: Automated Evaluation of Retrieval Augmented Generation",
    url: "https://arxiv.org/abs/2309.15217",
    type: "paper",
    source: "arXiv",
    description:
      "Defines the four core RAG evaluation metrics: faithfulness, answer relevancy, context precision, and context recall. The standard framework for RAG evaluation.",
  },
  {
    title: "LlamaIndex RAG Documentation",
    url: "https://docs.llamaindex.ai/en/stable/",
    type: "guide",
    source: "LlamaIndex",
    description:
      "Comprehensive documentation covering RAG pipeline components, chunking strategies, query engines, and agentic RAG patterns with LlamaIndex.",
  },
  {
    title: "LangChain RAG Tutorial",
    url: "https://python.langchain.com/docs/tutorials/rag/",
    type: "guide",
    source: "LangChain",
    description:
      "Step-by-step RAG tutorial covering document loading, splitting, embedding, retrieval, and generation with LangChain.",
  },
  {
    title: "Pinecone RAG Guide",
    url: "https://www.pinecone.io/learn/retrieval-augmented-generation/",
    type: "guide",
    source: "Pinecone",
    description:
      "Production-focused RAG guide from Pinecone covering architecture patterns, scaling considerations, and optimization strategies.",
  },
  {
    title: "Weaviate Hybrid Search",
    url: "https://weaviate.io/blog/hybrid-search-explained",
    type: "blog",
    source: "Weaviate",
    description:
      "Deep dive into hybrid search combining dense vectors with BM25 sparse retrieval, including Reciprocal Rank Fusion algorithms.",
  },
  {
    title: "Graph RAG: Unlocking LLM Discovery on Narrative Private Data",
    url: "https://arxiv.org/abs/2404.16130",
    type: "paper",
    source: "arXiv (Microsoft Research)",
    description:
      "Microsoft's Graph RAG approach that builds a knowledge graph from documents and uses community summaries for global question answering.",
  },
  {
    title: "Chunking Strategies for LLM Applications",
    url: "https://www.pinecone.io/learn/chunking-strategies/",
    type: "guide",
    source: "Pinecone",
    description:
      "Practical guide comparing fixed-size, recursive, semantic, and document-aware chunking strategies with benchmarks.",
  },
];
