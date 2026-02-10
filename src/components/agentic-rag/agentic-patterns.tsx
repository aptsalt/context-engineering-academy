import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const agenticPatterns = [
  {
    name: "Self-RAG",
    badge: "Foundation",
    color: "text-green-600",
    border: "border-green-500/20",
    paper: "Asai et al., 2023",
    description:
      "Self-RAG trains the model to emit special reflection tokens that control the retrieval-generation loop. The model decides IF it needs retrieval, evaluates document relevance, generates with grounding, and self-assesses whether the answer is supported by the sources.",
    howItWorks: [
      "Given a query, the model emits a [RETRIEVE] or [NO_RETRIEVE] token to decide if external knowledge is needed",
      "If retrieving, the model evaluates each document with [RELEVANT] or [IRRELEVANT] tokens",
      "The model generates a response using only relevant documents",
      "A [SUPPORTED] or [NOT_SUPPORTED] self-assessment token verifies grounding",
      "If not supported, the pipeline retries with refined retrieval",
    ],
    keyBenefit: "30-50% reduction in hallucination compared to naive RAG. The model learns when NOT to retrieve, avoiding unnecessary latency.",
    tradeoff: "Requires fine-tuning the model to emit reflection tokens, or prompt engineering to simulate them. Adds 2-3 LLM calls per query.",
  },
  {
    name: "Corrective RAG (CRAG)",
    badge: "Reliability",
    color: "text-blue-600",
    border: "border-blue-500/20",
    paper: "Yan et al., 2024",
    description:
      "CRAG adds a lightweight retrieval evaluator between the retrieval and generation stages. It scores document relevance and triggers one of three actions: use the documents (correct), refine the knowledge (ambiguous), or fall back to web search (incorrect).",
    howItWorks: [
      "Retrieve documents using standard RAG pipeline",
      "A retrieval evaluator scores each document's relevance to the query",
      "If confidence is HIGH: use documents directly for generation",
      "If confidence is MEDIUM: extract key sentences via knowledge refinement",
      "If confidence is LOW: discard documents and fall back to web search",
    ],
    keyBenefit: "Prevents the model from generating answers based on irrelevant context. The web search fallback handles knowledge gaps gracefully.",
    tradeoff: "Adds latency for the evaluation step. Web search fallback requires internet access and introduces external dependency.",
  },
  {
    name: "Adaptive RAG",
    badge: "Dynamic",
    color: "text-purple-600",
    border: "border-purple-500/20",
    paper: "Jeong et al., 2024",
    description:
      "Adaptive RAG classifies incoming queries by complexity and routes them to different retrieval strategies. Simple factual questions skip retrieval entirely, moderate questions use single-step RAG, and complex questions trigger multi-step agentic retrieval.",
    howItWorks: [
      "A query complexity classifier categorizes the question (simple / moderate / complex)",
      "Simple queries (e.g., 'What year was X founded?') go directly to the LLM — no retrieval needed",
      "Moderate queries use standard single-step RAG with reranking",
      "Complex queries trigger iterative multi-step retrieval with query decomposition",
      "The system dynamically allocates compute based on query difficulty",
    ],
    keyBenefit: "Reduces average latency by 40-60% by avoiding unnecessary retrieval for simple questions. Allocates more compute to questions that need it.",
    tradeoff: "Requires training or prompt-engineering a reliable query classifier. Misclassification can send complex queries down the simple path.",
  },
  {
    name: "Agentic RAG (Tool-Based)",
    badge: "Architecture",
    color: "text-cyan-600",
    border: "border-cyan-500/20",
    paper: "LlamaIndex / LangChain",
    description:
      "The agent treats retrieval as a tool it can call. Instead of a fixed pipeline, the LLM decides when to search, what to search for, and when it has enough information to answer. The retriever is one tool among many.",
    howItWorks: [
      "The agent has access to tools: vector_search, web_search, sql_query, knowledge_graph, etc.",
      "Given a query, the agent reasons about what information it needs",
      "It calls the appropriate retrieval tool with a refined search query",
      "It evaluates the results and decides if more retrieval is needed",
      "It can chain multiple retrieval calls, combining results before answering",
    ],
    keyBenefit: "Maximum flexibility — the agent can combine multiple data sources, refine queries iteratively, and handle novel question types without pipeline changes.",
    tradeoff: "More expensive (multiple LLM calls). Harder to debug and evaluate. Requires good tool descriptions and reliable function calling.",
  },
];

const comparisonTable = [
  {
    pattern: "Naive RAG",
    retrieval: "Always, single-step",
    evaluation: "None",
    correction: "None",
    latency: "Low",
    quality: "Low-Medium",
  },
  {
    pattern: "Self-RAG",
    retrieval: "Conditional (model decides)",
    evaluation: "Relevance + faithfulness tokens",
    correction: "Retry with rephrased query",
    latency: "Medium-High",
    quality: "High",
  },
  {
    pattern: "CRAG",
    retrieval: "Always, single-step",
    evaluation: "External evaluator",
    correction: "Web search fallback",
    latency: "Medium",
    quality: "High",
  },
  {
    pattern: "Adaptive RAG",
    retrieval: "Complexity-based routing",
    evaluation: "Query classifier",
    correction: "Route to correct pipeline",
    latency: "Low-High (varies)",
    quality: "High",
  },
  {
    pattern: "Agentic RAG",
    retrieval: "Multi-step, tool-based",
    evaluation: "Agent reasoning",
    correction: "Iterative refinement",
    latency: "High",
    quality: "Highest",
  },
];

export function AgenticPatterns() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Agentic RAG</strong> moves beyond the fixed
          retrieve-then-generate pipeline. Instead of blindly retrieving for
          every query, agentic patterns let the system decide{" "}
          <em>when</em> to retrieve, <em>what</em> to retrieve, and{" "}
          <em>whether</em> the retrieved context is good enough to generate a
          faithful answer. These patterns are the difference between demo-quality
          and production-quality RAG.
        </p>
      </div>

      {/* Evolution diagram */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">The Evolution of RAG</h3>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {[
              { stage: "Naive RAG", desc: "Retrieve, stuff, generate", color: "border-red-500/40 bg-red-500/5" },
              { stage: "Advanced RAG", desc: "Hybrid search, reranking, filtering", color: "border-yellow-500/40 bg-yellow-500/5" },
              { stage: "Agentic RAG", desc: "Self-correcting, multi-step, adaptive", color: "border-green-500/40 bg-green-500/5" },
            ].map((item, i) => (
              <div
                key={item.stage}
                className={`flex-1 rounded-lg border p-4 ${item.color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    Stage {i + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold">{item.stage}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agentic Patterns */}
      <div className="space-y-4">
        {agenticPatterns.map((pattern) => (
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
                <span className="ml-auto text-xs text-muted-foreground font-normal">
                  {pattern.paper}
                </span>
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

              <div className="grid gap-3 md:grid-cols-2">
                <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                    Key Benefit
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pattern.keyBenefit}
                  </p>
                </div>
                <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/10">
                  <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-1">
                    Trade-off
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pattern.tradeoff}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Pattern Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  {["Pattern", "Retrieval", "Evaluation", "Correction", "Latency", "Quality"].map((header) => (
                    <th
                      key={header}
                      className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row) => (
                  <tr key={row.pattern} className="border-b border-border/30">
                    <td className="py-2.5 pr-4 text-xs font-medium">
                      {row.pattern}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.retrieval}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.evaluation}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.correction}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.latency}
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {row.quality}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          Start with naive RAG, measure with RAGAS, and add agentic layers only
          when evaluation shows they&apos;re needed. Self-RAG is worth the
          complexity for high-stakes applications (medical, legal, financial).
          CRAG is the best bang-for-buck upgrade for most production systems.
          Adaptive RAG pays off when your query distribution has high variance
          in complexity.
        </p>
      </div>
    </div>
  );
}
