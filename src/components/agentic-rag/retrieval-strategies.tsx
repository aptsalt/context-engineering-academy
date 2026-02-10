import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const strategies = [
  {
    name: "Dense Retrieval (Vector Search)",
    badge: "Foundation",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Encode queries and documents into dense vectors using embedding models, then find nearest neighbors in vector space. The core of modern RAG systems.",
    howItWorks: [
      "Embed the query into the same vector space as documents",
      "Use Approximate Nearest Neighbor (ANN) algorithms (HNSW, IVF) for fast search",
      "Return top-k documents ranked by cosine similarity or dot product",
    ],
    strengths: "Captures semantic meaning — 'car' matches 'automobile'. Handles paraphrases and conceptual queries well.",
    weaknesses: "Poor at exact keyword matching ('error code E-4012'). Requires quality embedding models. ANN search is approximate, not exact.",
  },
  {
    name: "Sparse Retrieval (BM25 / TF-IDF)",
    badge: "Classic",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Traditional keyword-based retrieval using term frequency statistics. BM25 is the modern standard — it weighs term frequency, document length, and inverse document frequency.",
    howItWorks: [
      "Tokenize query and documents into terms",
      "Score each document based on term overlap (BM25 formula)",
      "Rank by score — exact keyword matches rank highest",
    ],
    strengths: "Excellent for exact terms: error codes, product IDs, names, acronyms. Fast, deterministic, explainable. No embedding model needed.",
    weaknesses: "No semantic understanding — 'car' doesn't match 'automobile'. Misses paraphrases and conceptual queries entirely.",
  },
  {
    name: "Hybrid Search (Dense + Sparse)",
    badge: "Recommended",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Combine dense and sparse retrieval to get the best of both worlds: semantic understanding from vectors AND exact keyword matching from BM25.",
    howItWorks: [
      "Run dense retrieval (vector search) to get ranked list A",
      "Run sparse retrieval (BM25) to get ranked list B",
      "Fuse the two lists using Reciprocal Rank Fusion (RRF) or weighted scoring",
      "Return the merged, fused results",
    ],
    strengths: "Consistently outperforms either approach alone in benchmarks. Catches both semantic and keyword matches. Handles diverse query types.",
    weaknesses: "Requires maintaining two indices (vector + inverted). Slightly higher latency. Need to tune fusion weights.",
  },
];

const rerankers = [
  {
    name: "Cohere Rerank",
    type: "API",
    description: "Commercial cross-encoder reranker. Supports 100+ languages. Simple API: pass query + documents, get reranked scores.",
    performance: "~25% precision improvement over vector search alone",
  },
  {
    name: "ColBERT (v2)",
    type: "Open-source",
    description: "Late interaction model — encodes query and document tokens separately, then computes fine-grained similarity. Faster than traditional cross-encoders.",
    performance: "Near cross-encoder quality at 100x the speed",
  },
  {
    name: "BGE Reranker (BAAI)",
    type: "Open-source",
    description: "Open-source cross-encoder reranker. Multiple sizes (small, base, large) for speed/quality tradeoff. Can be self-hosted.",
    performance: "Competitive with commercial options on English benchmarks",
  },
  {
    name: "FlashRank",
    type: "Open-source",
    description: "Ultra-lightweight reranker designed for low-latency applications. Under 100MB model size. Runs on CPU.",
    performance: "Lower quality but <10ms latency. Good for real-time applications.",
  },
];

const advancedTechniques = [
  {
    name: "Maximal Marginal Relevance (MMR)",
    description:
      "Balances relevance with diversity. Without MMR, your top-5 results might be five near-identical chunks about the same subtopic, missing other relevant information.",
    formula: "MMR = arg max [lambda * Sim(doc, query) - (1-lambda) * max(Sim(doc, selected_docs))]",
    tip: "Lambda = 0.5 is a good default. Higher lambda favors relevance, lower favors diversity.",
  },
  {
    name: "Contextual Compression",
    description:
      "After retrieval, extract only the relevant sentences from each chunk. A 500-token chunk might contain only 50 tokens of information relevant to the query.",
    formula: "retrieve(topK=10) -> compress(each chunk) -> filter(empty results) -> return",
    tip: "Use an LLM or extraction model to pull relevant sentences. Reduces context window usage by 60-80%.",
  },
  {
    name: "Multi-Query Retrieval",
    description:
      "Generate multiple reformulations of the user's query, retrieve for each, and merge results. Captures different aspects of the query's intent.",
    formula: "query -> [query_v1, query_v2, query_v3] -> retrieve each -> deduplicate -> fuse",
    tip: "Use an LLM to generate 3-5 query variants. Deduplicate results by document ID before returning.",
  },
  {
    name: "Parent Document Retrieval",
    description:
      "Index small chunks for precise matching, but return the larger parent chunk (or full document section) for generation context.",
    formula: "query -> match(small_chunks) -> return(parent_chunks)",
    tip: "Store child-to-parent mapping in metadata. Small chunks (128 tokens) for retrieval, parent chunks (512-1024 tokens) for context.",
  },
];

export function RetrievalStrategies() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Retrieval</strong> is the most impactful stage of the RAG
          pipeline. If you retrieve the wrong documents, no amount of prompt
          engineering will fix the generated answer. There are three fundamental
          retrieval approaches, and the best production systems combine them.
        </p>
      </div>

      {/* Retrieval Strategies */}
      <div className="space-y-4">
        {strategies.map((strategy) => (
          <Card key={strategy.name} className={`bg-card/50 ${strategy.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge variant="outline" className={`${strategy.color} border-current text-xs`}>
                  {strategy.badge}
                </Badge>
                {strategy.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {strategy.description}
              </p>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  How It Works
                </p>
                <ol className="space-y-1">
                  {strategy.howItWorks.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                    Strengths
                  </p>
                  <p className="text-xs text-muted-foreground">{strategy.strengths}</p>
                </div>
                <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
                    Weaknesses
                  </p>
                  <p className="text-xs text-muted-foreground">{strategy.weaknesses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reciprocal Rank Fusion */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-3">Core Algorithm</Badge>
          <h3 className="font-semibold mb-2">Reciprocal Rank Fusion (RRF)</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            RRF merges two ranked lists into a single list by scoring each
            document based on its rank in both lists. It&apos;s the standard
            fusion algorithm for hybrid search because it&apos;s simple,
            effective, and doesn&apos;t require score calibration between the
            two retrieval methods.
          </p>
          <div className="bg-[#0d1117] rounded-md p-4 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">{`// Reciprocal Rank Fusion
function rrf(rankings: Map<string, number>[], k = 60): Map<string, number> {
  const scores = new Map<string, number>();

  for (const ranking of rankings) {
    for (const [docId, rank] of ranking) {
      const current = scores.get(docId) ?? 0;
      scores.set(docId, current + 1 / (k + rank));
    }
  }

  return scores; // Sort by score descending for final ranking
}

// k = 60 is the standard constant from the original paper
// Higher k reduces the impact of top-ranked documents`}</div>
        </CardContent>
      </Card>

      {/* Reranking */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Reranking: The Precision Pass</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          First-stage retrieval (vector search, BM25) is optimized for speed —
          scanning millions of documents in milliseconds. But speed comes at the
          cost of precision. A <strong>reranker</strong> is a cross-encoder model
          that reads the query and each document together, producing a much more
          accurate relevance score. The pattern: <strong>retrieve broadly
          (top-20), rerank for precision (top-5)</strong>.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {rerankers.map((reranker) => (
            <Card key={reranker.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm">{reranker.name}</h4>
                  <Badge variant="secondary" className="text-xs">{reranker.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {reranker.description}
                </p>
                <p className="text-xs font-mono text-primary">{reranker.performance}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Advanced Techniques */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Advanced Retrieval Techniques</h3>
        <div className="space-y-3">
          {advancedTechniques.map((tech) => (
            <Card key={tech.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">{tech.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {tech.description}
                </p>
                <div className="bg-[#0d1117] rounded-md p-2 font-mono text-xs text-[#e6edf3]/70 mb-2">
                  {tech.formula}
                </div>
                <div className="bg-muted/20 rounded-md px-3 py-2">
                  <span className="text-xs text-primary">Tip: </span>
                  <span className="text-xs text-muted-foreground">{tech.tip}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          The retrieval pipeline should be: <strong>hybrid search</strong> (cast
          a wide net) then <strong>reranking</strong> (sort by true relevance)
          then <strong>MMR diversity</strong> (avoid redundancy) then{" "}
          <strong>relevance threshold</strong> (drop irrelevant results). Each
          layer tightens precision. Skipping any layer is the primary cause of
          poor RAG quality in production.
        </p>
      </div>
    </div>
  );
}
