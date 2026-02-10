import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ragasMetrics = [
  {
    name: "Faithfulness",
    color: "text-green-600",
    border: "border-green-500/20",
    measures: "Is the answer grounded in the retrieved context?",
    how: "Decompose the answer into atomic claims. For each claim, check if it can be inferred from the provided context. Score = (supported claims) / (total claims).",
    range: "0 to 1 (1 = every claim is supported)",
    catches: "Hallucination — the model generating facts not present in any retrieved document.",
    diagnostic: "Low faithfulness with high context recall = generation problem. The model has the right context but fabricates beyond it.",
  },
  {
    name: "Answer Relevancy",
    color: "text-blue-600",
    border: "border-blue-500/20",
    measures: "Does the answer actually address the question?",
    how: "Generate N questions from the answer using an LLM. Compute the mean cosine similarity between these generated questions and the original question. Higher similarity = more relevant answer.",
    range: "0 to 1 (1 = answer perfectly addresses the question)",
    catches: "Off-topic answers — the model using retrieved context to generate an answer about something adjacent but not what was asked.",
    diagnostic: "Low relevancy with high faithfulness = the retrieved context was relevant to a different aspect than what the user asked about.",
  },
  {
    name: "Context Precision",
    color: "text-purple-600",
    border: "border-purple-500/20",
    measures: "Are the top-ranked retrieved documents actually relevant?",
    how: "For each retrieved document, check if it is relevant to the ground truth answer. Weight by rank position — relevant documents ranked higher contribute more to the score.",
    range: "0 to 1 (1 = all relevant docs ranked at the top)",
    catches: "Noisy retrieval — irrelevant documents ranked above relevant ones, wasting context window space.",
    diagnostic: "Low precision = retrieval is returning too many irrelevant documents. Improve your reranking or relevance thresholds.",
  },
  {
    name: "Context Recall",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    measures: "Did we retrieve all the documents needed to answer correctly?",
    how: "Decompose the ground truth answer into claims. For each claim, check if it can be attributed to any retrieved document. Score = (attributed claims) / (total ground truth claims).",
    range: "0 to 1 (1 = all needed information was retrieved)",
    catches: "Missing retrieval — relevant documents exist in the index but were not retrieved for this query.",
    diagnostic: "Low recall with high precision = you are retrieving well but not enough. Increase topK or use query expansion.",
  },
];

const evalPipeline = [
  {
    step: 1,
    name: "Build a Golden Dataset",
    description:
      "Create 50-200 question-answer pairs with ground truth answers. Include easy, medium, and hard questions. Cover edge cases and common failure modes.",
    tips: [
      "Start with real user questions from production logs",
      "Have domain experts write ground truth answers",
      "Include questions with no answer in the corpus (to test abstention)",
      "Version your dataset and grow it over time",
    ],
  },
  {
    step: 2,
    name: "Run the RAG Pipeline",
    description:
      "For each question in the golden dataset, run your full RAG pipeline and capture: the generated answer, retrieved context documents, and any intermediate outputs.",
    tips: [
      "Log the full pipeline trace (query, retrieved docs, reranked docs, answer)",
      "Capture latency and token usage per step",
      "Run in a reproducible environment (same model version, same index)",
    ],
  },
  {
    step: 3,
    name: "Score with RAGAS Metrics",
    description:
      "Compute faithfulness, answer relevancy, context precision, and context recall for each question. Aggregate across the full dataset.",
    tips: [
      "Set target thresholds: faithfulness > 0.85, relevancy > 0.80",
      "Break down scores by question category to find systematic weaknesses",
      "Track metrics over time to detect regressions",
    ],
  },
  {
    step: 4,
    name: "Diagnose and Iterate",
    description:
      "Use the metric breakdown to identify whether problems are in retrieval or generation. Fix the weakest link first.",
    tips: [
      "Low context precision/recall = fix retrieval (chunking, embeddings, search)",
      "Low faithfulness = fix generation (prompt, model, or add citation requirements)",
      "Low relevancy = fix query transformation or system prompt",
    ],
  },
];

const otherFrameworks = [
  {
    name: "TruLens",
    description: "Open-source RAG evaluation with feedback functions for groundedness, relevance, and toxicity. Integrates with LlamaIndex and LangChain.",
    bestFor: "Teams already using LlamaIndex or LangChain who want quick integration.",
  },
  {
    name: "DeepEval",
    description: "Pytest-like framework for LLM evaluation. Supports RAG-specific metrics, unit tests for LLM outputs, and CI/CD integration.",
    bestFor: "Teams wanting to run RAG evals in CI/CD pipelines alongside unit tests.",
  },
  {
    name: "Phoenix (Arize)",
    description: "Observability platform with RAG-specific tracing, evaluation, and debugging. Visualize retrieval quality and identify failure patterns.",
    bestFor: "Production monitoring and debugging of RAG systems at scale.",
  },
  {
    name: "promptfoo",
    description: "CLI-based eval framework. Define test cases in YAML, run against multiple RAG configurations, compare results side-by-side.",
    bestFor: "A/B testing different RAG configurations (chunking sizes, models, topK values).",
  },
];

export function RagEvaluation() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          You cannot improve what you cannot measure. RAG evaluation requires
          separating <strong>retrieval quality</strong> from{" "}
          <strong>generation quality</strong> — a wrong answer could stem from
          bad retrieval (wrong documents) or bad generation (hallucination
          despite good documents). The <strong>RAGAS</strong> framework provides
          four metrics that isolate each failure mode.
        </p>
      </div>

      {/* Why eval matters */}
      <Card className="bg-card/50 border-red-500/20">
        <CardContent className="pt-6">
          <Badge className="mb-3 bg-red-500/10 text-red-600 border-red-500/40">
            The Problem
          </Badge>
          <h3 className="font-semibold mb-2">Why &ldquo;Vibes-Based&rdquo; Evaluation Fails</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Manual spot-checking creates a dangerous illusion of quality. A
            change that improves 10 queries but silently breaks 50 others goes
            undetected. Without systematic evaluation, you cannot tell if a new
            chunking strategy, embedding model, or prompt change actually
            improved your system. Evaluation is not optional — it is the
            foundation of reliable RAG.
          </p>
        </CardContent>
      </Card>

      {/* RAGAS Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-2">The Four RAGAS Metrics</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          RAGAS (Retrieval Augmented Generation Assessment) decomposes RAG
          quality into four orthogonal dimensions. Together, they tell you
          exactly where your system is failing.
        </p>
        <div className="space-y-4">
          {ragasMetrics.map((metric) => (
            <Card key={metric.name} className={`bg-card/50 ${metric.border}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <Badge
                    variant="outline"
                    className={`${metric.color} border-current text-xs`}
                  >
                    {metric.name}
                  </Badge>
                  {metric.measures}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    How It&apos;s Computed
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {metric.how}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs bg-muted/30 px-2 py-1 rounded">
                    Range: {metric.range}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                    <p className="text-xs font-semibold text-red-600 mb-1">
                      What It Catches
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.catches}
                    </p>
                  </div>
                  <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10">
                    <p className="text-xs font-semibold text-blue-600 mb-1">
                      Diagnostic Signal
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.diagnostic}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Diagnostic Matrix */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Diagnostic Matrix: Where Is the Problem?</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Symptom
                  </th>
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Metrics
                  </th>
                  <th className="text-left py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Fix
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    symptom: "Hallucinated facts",
                    metrics: "Low faithfulness, high context recall",
                    fix: "Improve generation prompt. Add citation requirements. Use a more capable model.",
                  },
                  {
                    symptom: "Off-topic answers",
                    metrics: "Low relevancy, high faithfulness",
                    fix: "Improve query transformation or retrieval strategy. The model answers what it has, not what was asked.",
                  },
                  {
                    symptom: "Missing information",
                    metrics: "Low context recall, high precision",
                    fix: "Increase topK. Use query expansion or decomposition. Check if documents exist in the index.",
                  },
                  {
                    symptom: "Noisy retrieval",
                    metrics: "Low context precision, high recall",
                    fix: "Add reranking. Raise relevance thresholds. Improve chunking quality.",
                  },
                  {
                    symptom: "Total failure",
                    metrics: "Low across all metrics",
                    fix: "Fundamental pipeline issue. Check embedding model, chunking strategy, and index freshness.",
                  },
                ].map((row) => (
                  <tr key={row.symptom} className="border-b border-border/30">
                    <td className="py-2.5 pr-4 text-xs font-medium">
                      {row.symptom}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.metrics}
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {row.fix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Eval Pipeline */}
      <div>
        <h3 className="text-lg font-semibold mb-4">The RAG Evaluation Pipeline</h3>
        <div className="space-y-4">
          {evalPipeline.map((item) => (
            <Card key={item.step} className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/30 text-xs"
                  >
                    Step {item.step}
                  </Badge>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {item.description}
                </p>
                <ul className="space-y-1.5">
                  {item.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-xs text-foreground/80"
                    >
                      <span className="text-primary mt-0.5">&#9656;</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Frameworks */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Evaluation Frameworks</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {otherFrameworks.map((framework) => (
            <Card key={framework.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">
                  {framework.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {framework.description}
                </p>
                <div className="bg-muted/20 rounded-md px-3 py-2">
                  <span className="text-xs text-primary">Best for: </span>
                  <span className="text-xs text-muted-foreground">
                    {framework.bestFor}
                  </span>
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
          The single most impactful thing you can do for your RAG system is
          build a golden evaluation dataset of 50-100 questions with ground
          truth answers. Run RAGAS metrics after every change. Set minimum
          thresholds (faithfulness &gt; 0.85) and block deployments that
          regress. This is the RAG equivalent of unit tests — and like unit
          tests, the earlier you start, the more pain you avoid.
        </p>
      </div>
    </div>
  );
}
