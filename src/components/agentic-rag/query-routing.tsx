import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const routingPatterns = [
  {
    name: "Query Classification Router",
    badge: "Simple",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Classify the incoming query into categories and route each category to a specialized retrieval pipeline. The simplest and most reliable routing approach.",
    howItWorks: [
      "Define query categories: factual, analytical, comparison, how-to, opinion",
      "Use an LLM or lightweight classifier to categorize the incoming query",
      "Route each category to its optimal retrieval strategy",
      "Factual queries use vector search; analytical queries use SQL; comparisons use multi-query retrieval",
    ],
    example: `// Route by query type
const queryType = await classifier.classify(query);
switch (queryType) {
  case "factual":  return vectorSearch(query);
  case "analytical": return sqlQuery(query);
  case "comparison": return multiQueryRetrieval(query);
  case "how-to":  return docSearch(query);
}`,
  },
  {
    name: "Data Source Router",
    badge: "Multi-Source",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "When your knowledge spans multiple backends (vector store, SQL database, knowledge graph, API), route the query to the appropriate data source based on the type of information needed.",
    howItWorks: [
      "Register available data sources with their descriptions and capabilities",
      "LLM determines which data source(s) are needed for the query",
      "Route to one or more backends in parallel",
      "Merge results from multiple sources into a unified context",
    ],
    example: `const sources = [
  { name: "docs", desc: "Product docs and guides" },
  { name: "sql", desc: "User accounts and orders" },
  { name: "api", desc: "Real-time pricing data" },
];
// LLM picks: ["sql", "api"] for
// "What is user X's latest order total?"`,
  },
  {
    name: "Semantic Router",
    badge: "Fast",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Use embeddings to route queries without an LLM call. Pre-compute embeddings for example queries in each route, then match incoming queries to the nearest route by cosine similarity.",
    howItWorks: [
      "Define routes with 5-10 example utterances each",
      "Pre-compute embeddings for all example utterances",
      "When a query arrives, embed it and find the nearest route centroid",
      "Route to the matched pipeline — no LLM call needed, sub-10ms routing",
    ],
    example: `// Pre-compute route embeddings
const routes = {
  billing: embed(["refund", "invoice", "charge"]),
  technical: embed(["error", "bug", "crash"]),
  general: embed(["hello", "help", "info"]),
};
// Match query to nearest route centroid`,
  },
];

const decompositionStrategies = [
  {
    name: "Sequential Decomposition",
    description:
      "Break a complex query into a chain of sub-queries where each step depends on the previous result. Best for queries with logical dependencies.",
    example: `// "What is the market cap of the company that acquired Twitter?"
// Step 1: "Which company acquired Twitter?" → X Corp (Elon Musk)
// Step 2: "What is X Corp's market cap?" → (private company)
// Step 3: Synthesize answer from both steps`,
    bestFor: "Multi-hop reasoning questions that require chaining facts together.",
  },
  {
    name: "Parallel Decomposition",
    description:
      "Break a query into independent sub-queries that can be retrieved in parallel, then merge results. Best for comparison and multi-faceted questions.",
    example: `// "Compare Pinecone and Weaviate for a 10M doc use case"
// Parallel:
//   "Pinecone pricing for 10M documents"
//   "Weaviate pricing for 10M documents"
//   "Pinecone performance benchmarks at scale"
//   "Weaviate performance benchmarks at scale"`,
    bestFor: "Comparison questions, multi-faceted queries, questions covering multiple topics.",
  },
  {
    name: "Step-Back Prompting",
    description:
      "Instead of directly retrieving for a specific query, first generate a more general (abstracted) query, retrieve for that, then use the broader context to answer the specific question.",
    example: `// Specific: "Why did the 2008 financial crisis cause
//           Bear Stearns to collapse?"
// Step-back: "What were the causes and effects of the
//             2008 financial crisis on investment banks?"
// The broader retrieval provides more complete context`,
    bestFor: "Highly specific questions where relevant documents use more general language.",
  },
  {
    name: "HyDE (Hypothetical Document Embeddings)",
    description:
      "Generate a hypothetical answer to the query, embed that answer instead of the query, and use it for retrieval. The hypothetical answer is closer in embedding space to the actual documents.",
    example: `// Query: "How to handle rate limiting in APIs?"
// Generate hypothetical answer:
//   "Rate limiting can be handled using exponential
//    backoff with jitter. Common patterns include
//    the token bucket algorithm and sliding window..."
// Embed this hypothetical answer → better document matches`,
    bestFor: "Questions where the user's phrasing differs significantly from document language.",
  },
];

const multiStepPipeline = [
  {
    step: 1,
    name: "Query Analysis",
    description: "Classify complexity, identify intent, detect entities",
    output: "Query type + complexity score + entities",
  },
  {
    step: 2,
    name: "Route Selection",
    description: "Pick the right retrieval strategy and data sources",
    output: "Selected pipeline + data sources",
  },
  {
    step: 3,
    name: "Query Transformation",
    description: "Decompose, expand, or rephrase for better retrieval",
    output: "Optimized sub-queries",
  },
  {
    step: 4,
    name: "Parallel Retrieval",
    description: "Execute sub-queries across selected data sources",
    output: "Raw retrieved documents per sub-query",
  },
  {
    step: 5,
    name: "Result Fusion",
    description: "Merge, deduplicate, rerank, and filter results",
    output: "Final ranked context documents",
  },
  {
    step: 6,
    name: "Generation",
    description: "Generate answer with faithfulness self-check",
    output: "Grounded answer with citations",
  },
];

export function QueryRouting() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Not every query should hit the same retrieval pipeline.{" "}
          <strong>Query routing</strong> directs queries to the right retrieval
          strategy, while <strong>query decomposition</strong> breaks complex
          questions into focused sub-queries for better retrieval.
          Together, they form the &ldquo;planning&rdquo; layer of agentic RAG.
        </p>
      </div>

      {/* Routing Patterns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Routing Patterns</h3>
        <div className="space-y-4">
          {routingPatterns.map((pattern) => (
            <Card key={pattern.name} className={`bg-card/50 ${pattern.border}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <Badge
                    variant="outline"
                    className={`${pattern.color} border-current text-xs`}
                  >
                    {pattern.badge}
                  </Badge>
                  {pattern.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pattern.description}
                </p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    How It Works
                  </p>
                  <ol className="space-y-1">
                    {pattern.howItWorks.map((step, i) => (
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
                <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">
                  {pattern.example}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Query Decomposition */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Query Decomposition Strategies</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A single embedding cannot capture all dimensions of a complex,
          multi-faceted query. Decomposition breaks queries into focused
          sub-queries, each producing a targeted embedding that matches the
          right documents.
        </p>
        <div className="space-y-3">
          {decompositionStrategies.map((strategy) => (
            <Card key={strategy.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">{strategy.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {strategy.description}
                </p>
                <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/70 leading-relaxed whitespace-pre-wrap mb-2">
                  {strategy.example}
                </div>
                <div className="bg-muted/20 rounded-md px-3 py-2">
                  <span className="text-xs text-primary">Best for: </span>
                  <span className="text-xs text-muted-foreground">
                    {strategy.bestFor}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Multi-Step Pipeline */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">
            The Full Multi-Step Retrieval Pipeline
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            In a production agentic RAG system, query routing and
            decomposition are just two steps in a six-stage pipeline. Each
            stage transforms the query or its results to maximize answer
            quality.
          </p>
          <div className="space-y-3">
            {multiStepPipeline.map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/10 border border-border/50"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono font-bold text-primary">
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
                <div className="hidden md:block flex-shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    {item.output}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          Query routing and decomposition have the highest ROI for complex,
          multi-faceted questions. If your queries are simple factual lookups,
          they add unnecessary latency. Profile your query distribution first:
          if more than 30% of queries are multi-hop or comparative, invest in
          query planning. For the rest, a semantic router (no LLM call) is
          sufficient.
        </p>
      </div>
    </div>
  );
}
