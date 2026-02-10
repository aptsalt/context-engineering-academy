import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ragQuotes } from "@/lib/agentic-rag-data";

const pipelineSteps = [
  {
    number: 1,
    name: "Indexing",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Split documents into chunks, generate embeddings for each chunk, and store them in a vector database with metadata.",
    details: [
      "Load documents (PDFs, HTML, Markdown, databases)",
      "Split into semantically meaningful chunks",
      "Generate vector embeddings for each chunk",
      "Store vectors + metadata in a vector database",
    ],
  },
  {
    number: 2,
    name: "Retrieval",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "When a query arrives, embed it, search the vector database for similar chunks, and return the top-k most relevant results.",
    details: [
      "Embed the user query into the same vector space",
      "Search the vector index for nearest neighbors",
      "Apply filters (metadata, relevance threshold)",
      "Optionally rerank results for precision",
    ],
  },
  {
    number: 3,
    name: "Generation",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Inject the retrieved chunks into the LLM's context window alongside the user query, and generate a grounded response.",
    details: [
      "Format retrieved chunks with source attribution",
      "Construct a prompt with context + query",
      "Generate a response grounded in the sources",
      "Optionally verify faithfulness of the answer",
    ],
  },
];

const ragVsFineTuning = [
  {
    aspect: "Knowledge updates",
    rag: "Instant — update the index",
    fineTuning: "Requires retraining the model",
  },
  {
    aspect: "Source attribution",
    rag: "Natural — can cite sources",
    fineTuning: "Not possible — knowledge is in weights",
  },
  {
    aspect: "Cost",
    rag: "Per-query retrieval + generation",
    fineTuning: "High upfront training, cheap inference",
  },
  {
    aspect: "Hallucination",
    rag: "Reduced (but not eliminated)",
    fineTuning: "Common — model confabulates",
  },
  {
    aspect: "Best for",
    rag: "Factual QA, documentation, support",
    fineTuning: "Style, format, behavior changes",
  },
];

export function RagFundamentals() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Retrieval-Augmented Generation (RAG)</strong> is a technique
          that gives LLMs access to external knowledge at inference time. Instead
          of relying solely on what the model memorized during training, RAG
          retrieves relevant documents and injects them into the context window
          before generation.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The term was coined by{" "}
          <strong>Patrick Lewis et al. at Meta AI in 2020</strong>. The core
          insight: LLMs are powerful reasoning engines, but their parametric
          knowledge is static, incomplete, and prone to hallucination. RAG
          decouples <em>knowledge storage</em> (the retrieval index) from{" "}
          <em>knowledge reasoning</em> (the LLM), making both independently
          improvable.
        </p>
      </div>

      {/* Why Naive RAG Fails */}
      <Card className="bg-card/50 border-red-500/20">
        <CardContent className="pt-6">
          <Badge className="mb-3 bg-red-500/10 text-red-600 border-red-500/40">
            The Problem
          </Badge>
          <h3 className="font-semibold mb-2">Why Naive RAG Fails</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Most teams start with &ldquo;naive RAG&rdquo; — embed documents, retrieve
            top-k, stuff into prompt, generate. This works for demos but fails
            in production for predictable reasons:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                issue: "Poor chunking",
                detail: "Splits mid-sentence, destroys context, creates incoherent fragments",
              },
              {
                issue: "No relevance filtering",
                detail: "Returns all top-k results even when none are relevant, injecting noise",
              },
              {
                issue: "Missing reranking",
                detail: "First-stage vector search is fast but imprecise — wrong docs rank high",
              },
              {
                issue: "No faithfulness check",
                detail: "Model hallucinates beyond the retrieved context with no verification",
              },
            ].map((item) => (
              <div
                key={item.issue}
                className="bg-red-500/5 rounded-lg p-3 border border-red-500/10"
              >
                <p className="text-xs font-semibold text-red-600 mb-1">
                  {item.issue}
                </p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* The RAG Pipeline */}
      <div>
        <h3 className="text-lg font-semibold mb-4">The RAG Pipeline</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Every RAG system follows three stages. The quality of each stage
          compounds — poor indexing guarantees poor retrieval, which guarantees
          poor generation.
        </p>
        <div className="space-y-4">
          {pipelineSteps.map((step) => (
            <Card key={step.name} className={`bg-card/50 ${step.border}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Badge
                    variant="outline"
                    className={`${step.color} border-current text-xs`}
                  >
                    Stage {step.number}
                  </Badge>
                  <h4 className="font-semibold text-sm">{step.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {step.description}
                </p>
                <ul className="space-y-1.5">
                  {step.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-xs text-foreground/80"
                    >
                      <span className={`${step.color} mt-0.5`}>&#9656;</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* RAG vs Fine-Tuning */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">RAG vs. Fine-Tuning: When to Use Each</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Aspect
                  </th>
                  <th className="text-left py-2 pr-4 text-xs text-green-600 font-semibold uppercase tracking-wider">
                    RAG
                  </th>
                  <th className="text-left py-2 text-xs text-yellow-600 font-semibold uppercase tracking-wider">
                    Fine-Tuning
                  </th>
                </tr>
              </thead>
              <tbody>
                {ragVsFineTuning.map((row) => (
                  <tr key={row.aspect} className="border-b border-border/30">
                    <td className="py-2.5 pr-4 text-xs font-medium">
                      {row.aspect}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.rag}
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {row.fineTuning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            <strong>Rule of thumb:</strong> Use RAG when the model needs to
            access specific, updatable facts. Use fine-tuning when you need to
            change the model&apos;s behavior, style, or output format. In many
            production systems, you use both — fine-tune for behavior, RAG for
            knowledge.
          </p>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          RAG doesn&apos;t eliminate hallucination — it reduces it by grounding
          the model in retrieved evidence. The gap between a demo RAG system and
          a production RAG system is the difference between &ldquo;it works on
          my 10 test questions&rdquo; and &ldquo;it works reliably on 10,000
          diverse user queries.&rdquo; Closing that gap requires systematic
          chunking, retrieval, evaluation, and iteration.
        </p>
      </div>

      {/* Quotes */}
      <div className="grid gap-4 md:grid-cols-3">
        {ragQuotes.map((quote) => (
          <Card key={quote.author} className="bg-card/50">
            <CardContent className="pt-6">
              <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold">{quote.author}</p>
                <p className="text-xs text-muted-foreground">{quote.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
