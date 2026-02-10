import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const embeddingModels = [
  {
    name: "OpenAI text-embedding-3-large",
    dimensions: "3072 (configurable)",
    strengths: "Best general-purpose model. Matryoshka support allows dimension reduction without re-embedding.",
    weaknesses: "Proprietary, requires API calls, cost scales with volume.",
    cost: "~$0.13 per 1M tokens",
    color: "text-green-600",
    border: "border-green-500/20",
  },
  {
    name: "Cohere embed-v3",
    dimensions: "1024",
    strengths: "Strong multilingual support. Built-in input types (search_document, search_query) improve retrieval.",
    weaknesses: "Proprietary. Slightly behind OpenAI on English-only benchmarks.",
    cost: "~$0.10 per 1M tokens",
    color: "text-blue-600",
    border: "border-blue-500/20",
  },
  {
    name: "BGE-large-en-v1.5 (BAAI)",
    dimensions: "1024",
    strengths: "Open-source. Competitive with proprietary models. Can be self-hosted for zero marginal cost.",
    weaknesses: "English-only. Requires GPU for fast inference. Slightly lower quality than commercial options.",
    cost: "Free (self-hosted)",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
  },
  {
    name: "Jina embeddings-v3",
    dimensions: "1024 (configurable)",
    strengths: "Supports 8K token input. Task-specific adapters for retrieval, classification, separation.",
    weaknesses: "Newer model, less battle-tested in production. Requires API or self-hosting.",
    cost: "~$0.02 per 1M tokens",
    color: "text-purple-600",
    border: "border-purple-500/20",
  },
  {
    name: "Nomic embed-text-v1.5",
    dimensions: "768 (configurable)",
    strengths: "Fully open-source with open training data. Long context (8K tokens). Matryoshka support.",
    weaknesses: "Lower dimensions may reduce precision for very large indices.",
    cost: "Free (self-hosted)",
    color: "text-cyan-600",
    border: "border-cyan-500/20",
  },
];

const vectorDatabases = [
  {
    name: "Pinecone",
    type: "Managed SaaS",
    strengths: "Fully managed, serverless option, excellent scaling, hybrid search support.",
    bestFor: "Teams that want zero infrastructure management. Production workloads at scale.",
    consideration: "Vendor lock-in. No self-hosted option. Cost scales with stored vectors.",
  },
  {
    name: "Weaviate",
    type: "Open-source / Managed",
    strengths: "Native hybrid search (dense + BM25), modular architecture, GraphQL API, multi-tenancy.",
    bestFor: "Hybrid search use cases. Teams wanting open-source with managed cloud option.",
    consideration: "Higher memory usage than some alternatives. Learning curve for module system.",
  },
  {
    name: "Chroma",
    type: "Open-source",
    strengths: "Simplest API. In-memory for development, persistent for production. Python-native.",
    bestFor: "Prototyping and development. Small to medium datasets. Python-first teams.",
    consideration: "Less mature for very large-scale production. Fewer enterprise features.",
  },
  {
    name: "Qdrant",
    type: "Open-source / Managed",
    strengths: "Rust-based (fast). Rich filtering. Payload storage. gRPC + REST APIs.",
    bestFor: "Performance-critical applications. Complex filtering requirements.",
    consideration: "Smaller community than Pinecone/Weaviate. Newer managed cloud offering.",
  },
  {
    name: "pgvector (PostgreSQL)",
    type: "Extension",
    strengths: "Uses existing Postgres infrastructure. ACID transactions. Familiar SQL interface.",
    bestFor: "Teams already on PostgreSQL who want vector search without a new database.",
    consideration: "Slower than purpose-built vector DBs at scale. Limited to 2000 dimensions. HNSW index tuning required.",
  },
];

const distanceMetrics = [
  {
    name: "Cosine Similarity",
    description: "Measures the angle between two vectors, ignoring magnitude. Most common for text embeddings because document length doesn't affect similarity.",
    formula: "cos(A,B) = (A . B) / (|A| * |B|)",
    range: "-1 to 1 (1 = identical)",
    when: "Default for text embeddings. Use when document length varies.",
  },
  {
    name: "Euclidean Distance (L2)",
    description: "Measures the straight-line distance between two points in vector space. Sensitive to magnitude — longer documents have larger vectors.",
    formula: "d(A,B) = sqrt(sum((Ai - Bi)^2))",
    range: "0 to infinity (0 = identical)",
    when: "When vectors are normalized. Image embeddings. Clustering tasks.",
  },
  {
    name: "Dot Product (Inner Product)",
    description: "Measures both angle and magnitude. Higher values indicate greater similarity. Fastest to compute but affected by vector magnitude.",
    formula: "A . B = sum(Ai * Bi)",
    range: "-infinity to infinity",
    when: "When magnitude matters (e.g., importance weighting). Fastest option for normalized vectors.",
  },
];

export function Embeddings() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Embeddings</strong> are the bridge between human-readable text
          and machine-searchable vectors. An embedding model converts a text
          chunk into a dense vector of floating-point numbers that captures its
          semantic meaning. <strong>Vector databases</strong> store and index
          these vectors for fast similarity search at scale.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Your choice of embedding model determines the quality of your vector
          space — and therefore the quality of retrieval. Your choice of vector
          database determines the operational characteristics: latency, scale,
          cost, and features.
        </p>
      </div>

      {/* Key Rule */}
      <Card className="bg-card/50 border-red-500/20">
        <CardContent className="pt-6">
          <Badge className="mb-3 bg-red-500/10 text-red-600 border-red-500/40">
            Critical Rule
          </Badge>
          <p className="text-sm text-foreground/90 leading-relaxed">
            <strong>Never mix embedding models in the same index.</strong> If you
            embed documents with Model A and query with Model B, the vector
            spaces won&apos;t align and similarity scores become meaningless.
            When you change embedding models, you must re-embed your entire
            corpus. Version your indices to enable rollback.
          </p>
        </CardContent>
      </Card>

      {/* Embedding Models */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Embedding Models Compared</h3>
        <div className="space-y-3">
          {embeddingModels.map((model) => (
            <Card key={model.name} className={`bg-card/50 ${model.border}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className={`${model.color} border-current text-xs flex-shrink-0`}>
                    {model.dimensions}d
                  </Badge>
                  <h4 className="font-semibold text-sm">{model.name}</h4>
                  <span className="ml-auto text-xs text-muted-foreground font-mono flex-shrink-0">
                    {model.cost}
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-green-600 font-semibold mb-1">Strengths</p>
                    <p className="text-xs text-muted-foreground">{model.strengths}</p>
                  </div>
                  <div>
                    <p className="text-xs text-yellow-600 font-semibold mb-1">Trade-offs</p>
                    <p className="text-xs text-muted-foreground">{model.weaknesses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Choosing Dimensions */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Choosing Embedding Dimensions</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Higher dimensions capture more nuance but cost more to store and
            search. Modern models with <strong>Matryoshka embeddings</strong>{" "}
            (OpenAI, Nomic) let you truncate vectors to smaller dimensions
            after generation without re-embedding. This enables a key
            optimization:
          </p>
          <div className="bg-[#0d1117] rounded-md p-4 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">{`// Matryoshka: generate at full dims, store at reduced dims
const fullEmbedding = await embed(text); // 3072 dimensions
const reduced = fullEmbedding.slice(0, 1024); // Use first 1024

// Quality vs. cost tradeoff:
// 3072d → best quality, highest storage cost
// 1536d → ~99% quality, 50% storage savings
// 1024d → ~97% quality, 66% storage savings
//  256d → ~90% quality, 92% storage savings`}</div>
          <p className="text-xs text-muted-foreground mt-3">
            Start with full dimensions, measure quality, then reduce until you find the smallest
            dimension that meets your accuracy requirements.
          </p>
        </CardContent>
      </Card>

      {/* Vector Databases */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Vector Databases Compared</h3>
        <div className="space-y-3">
          {vectorDatabases.map((db) => (
            <Card key={db.name} className="bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  {db.name}
                  <Badge variant="secondary" className="text-xs">
                    {db.type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-green-600 font-semibold mb-1">Strengths</p>
                    <p className="text-xs text-muted-foreground">{db.strengths}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-semibold mb-1">Best For</p>
                    <p className="text-xs text-muted-foreground">{db.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-yellow-600 font-semibold mb-1">Considerations</p>
                    <p className="text-xs text-muted-foreground">{db.consideration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Distance Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Distance Metrics</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Distance metrics define how similarity is measured between vectors.
          The choice of metric affects both accuracy and performance.
        </p>
        <div className="space-y-3">
          {distanceMetrics.map((metric) => (
            <Card key={metric.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">{metric.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {metric.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs font-mono bg-muted/30 px-2 py-1 rounded">
                    {metric.formula}
                  </span>
                  <span className="text-xs bg-muted/30 px-2 py-1 rounded">
                    Range: {metric.range}
                  </span>
                </div>
                <div className="bg-muted/20 rounded-md px-4 py-2 mt-2">
                  <span className="text-xs text-muted-foreground">Use when: </span>
                  <span className="text-xs text-foreground/90">{metric.when}</span>
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
          The most common mistake teams make is choosing an embedding model
          based on generic benchmarks (MTEB leaderboard) without testing on
          their own data. A model that ranks #1 on general benchmarks may rank
          #5 on your domain-specific queries. Always benchmark 2-3 models on a
          representative sample of your actual queries before committing.
        </p>
      </div>
    </div>
  );
}
