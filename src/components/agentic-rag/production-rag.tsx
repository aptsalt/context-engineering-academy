import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scalingStrategies = [
  {
    name: "Semantic Caching",
    badge: "Cost Reduction",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Cache answers for semantically similar queries. Common questions get asked hundreds of times daily in production — semantic caching catches paraphrases that exact-match caching misses.",
    howItWorks: [
      "Embed the incoming query",
      "Search the cache index for queries with similarity > 0.95",
      "If a cache hit with valid TTL exists, return the cached answer",
      "On cache miss, run the full RAG pipeline",
      "Store the query embedding, answer, and sources in the cache with a TTL",
    ],
    impact: "60-80% cost reduction in production. Reduces average latency from 2-5s to <100ms for cache hits.",
    consideration: "Set appropriate TTL (1-24 hours). Invalidate cache when source documents change. Monitor cache hit rate.",
  },
  {
    name: "Incremental Indexing",
    badge: "Freshness",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Instead of re-indexing the entire corpus when documents change, detect changes and update only the affected vectors. Keeps the index fresh without full rebuilds.",
    howItWorks: [
      "Hash each document's content at ingestion time",
      "On update, compare content hashes to detect which documents changed",
      "Delete old vectors for changed documents",
      "Re-chunk, re-embed, and upsert only the changed documents",
      "Handle deletions by removing vectors for deleted source documents",
    ],
    impact: "Index updates go from hours (full re-index) to minutes (incremental). Source freshness improves from daily to near real-time.",
    consideration: "Maintain a document-to-vector mapping for deletion. Use content hashing, not timestamps, to detect changes.",
  },
  {
    name: "Tiered Retrieval",
    badge: "Performance",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Use multiple retrieval tiers: a fast, approximate first pass (HNSW) followed by an exact re-scoring pass. For extremely large indices, add a pre-filter stage using metadata.",
    howItWorks: [
      "Tier 1: Metadata pre-filter (namespace, date range, document type) — milliseconds",
      "Tier 2: ANN search (HNSW) on filtered subset — 10-50ms for millions of vectors",
      "Tier 3: Cross-encoder reranking on top-20 results — 50-200ms",
      "Tier 4: Contextual compression to extract relevant sentences — 100-500ms",
    ],
    impact: "Handles 100M+ vector indices with sub-second latency. Each tier narrows the search space for the next.",
    consideration: "Profile each tier's latency. Set timeouts. Use async/parallel where possible. The reranking tier is usually the bottleneck.",
  },
];

const indexingArchitecture = [
  {
    component: "Document Watcher",
    description: "Monitors source systems (S3, databases, wikis, git repos) for changes. Emits events for created, updated, and deleted documents.",
    tech: "Change Data Capture, webhooks, file watchers, cron polling",
  },
  {
    component: "Chunking Pipeline",
    description: "Receives raw documents, applies format-specific parsing, runs the chunking strategy, and enriches chunks with metadata.",
    tech: "LangChain splitters, LlamaIndex node parsers, custom parsers",
  },
  {
    component: "Embedding Service",
    description: "Batches chunks and generates embeddings. Rate-limited to respect API quotas. Supports multiple embedding models for A/B testing.",
    tech: "OpenAI API, Cohere, self-hosted models, batch processing",
  },
  {
    component: "Vector Store",
    description: "Stores vectors with metadata, supports ANN search, handles upserts and deletions. The primary retrieval backend.",
    tech: "Pinecone, Weaviate, Qdrant, pgvector",
  },
  {
    component: "Cache Layer",
    description: "Semantic cache for query-answer pairs. Exact cache for frequent identical queries. Invalidated on source document changes.",
    tech: "Redis, dedicated vector index, in-memory LRU",
  },
  {
    component: "Monitoring & Alerts",
    description: "Tracks indexing lag, retrieval latency (p50/p95/p99), cache hit rate, embedding costs, and RAGAS metric trends.",
    tech: "Prometheus, Grafana, Datadog, custom dashboards",
  },
];

const operationalMetrics = [
  { metric: "Retrieval Latency (p50)", target: "< 100ms", why: "User-perceived speed. p50 represents the typical experience." },
  { metric: "Retrieval Latency (p99)", target: "< 500ms", why: "Tail latency. Worst-case user experience. Set alerts here." },
  { metric: "Cache Hit Rate", target: "> 40%", why: "Higher = more cost savings. Below 20% means caching isn't helping." },
  { metric: "Index Freshness", target: "< 15 min lag", why: "Time between source document change and index update." },
  { metric: "Faithfulness Score", target: "> 0.85", why: "RAGAS faithfulness on production samples. Below 0.8 = hallucination risk." },
  { metric: "Context Precision", target: "> 0.75", why: "Are retrieved documents actually relevant? Tracks retrieval quality." },
  { metric: "Embedding Cost / 1K queries", target: "Budget-dependent", why: "Track cost per query to detect inefficiencies or budget overruns." },
  { metric: "Error Rate", target: "< 0.1%", why: "Failed retrievals, timeouts, or pipeline errors." },
];

const costOptimization = [
  {
    strategy: "Reduce embedding dimensions",
    saving: "50-92% storage",
    description: "Use Matryoshka embeddings to reduce from 3072d to 1024d or 256d with minimal quality loss. Measure before committing.",
  },
  {
    strategy: "Semantic caching",
    saving: "60-80% LLM cost",
    description: "Cache answers for similar queries. The highest-ROI optimization for production RAG systems with repeated query patterns.",
  },
  {
    strategy: "Batch embedding",
    saving: "30-50% embedding cost",
    description: "Batch chunks during indexing instead of embedding one at a time. Most APIs offer batch discounts or higher throughput.",
  },
  {
    strategy: "Tiered models",
    saving: "40-70% LLM cost",
    description: "Use a small, fast model (GPT-4o-mini, Claude Haiku) for simple queries and route complex queries to larger models.",
  },
  {
    strategy: "Contextual compression",
    saving: "30-60% token cost",
    description: "Extract only relevant sentences from retrieved chunks before sending to the LLM. Reduces input tokens significantly.",
  },
];

export function ProductionRag() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          The gap between a RAG demo and a production RAG system is{" "}
          <strong>operational engineering</strong>: caching, indexing pipelines,
          monitoring, cost optimization, and scaling. A system that works on 100
          test queries must work reliably on 100,000 diverse production queries
          per day — with predictable latency, cost, and quality.
        </p>
      </div>

      {/* Scaling Strategies */}
      <div className="space-y-4">
        {scalingStrategies.map((strategy) => (
          <Card key={strategy.name} className={`bg-card/50 ${strategy.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge
                  variant="outline"
                  className={`${strategy.color} border-current text-xs`}
                >
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
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
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
                    Impact
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {strategy.impact}
                  </p>
                </div>
                <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/10">
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-1">
                    Consideration
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {strategy.consideration}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Production Architecture */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Production Indexing Architecture</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A production RAG system is not just a vector database. It is a
            pipeline of components that must work together reliably.
          </p>
          <div className="space-y-3">
            {indexingArchitecture.map((item) => (
              <div
                key={item.component}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/10 border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.component}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
                <span className="hidden md:block text-[10px] font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded flex-shrink-0">
                  {item.tech}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operational Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Operational Metrics to Track</h3>
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Target
                    </th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operationalMetrics.map((row) => (
                    <tr key={row.metric} className="border-b border-border/30">
                      <td className="py-2.5 pr-4 text-xs font-medium">
                        {row.metric}
                      </td>
                      <td className="py-2.5 pr-4 text-xs font-mono text-primary">
                        {row.target}
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">
                        {row.why}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Optimization */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Cost Optimization Strategies</h3>
        <div className="space-y-3">
          {costOptimization.map((item) => (
            <Card key={item.strategy} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-sm">{item.strategy}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {item.saving}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          The three highest-ROI production investments are:{" "}
          <strong>(1) semantic caching</strong> — reduces cost and latency for
          repeated queries, <strong>(2) incremental indexing</strong> — keeps
          your knowledge base fresh, and{" "}
          <strong>(3) RAGAS monitoring</strong> — catches quality regressions
          before users do. Start with these three before optimizing anything
          else.
        </p>
      </div>
    </div>
  );
}
