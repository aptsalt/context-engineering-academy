import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const graphRag = {
  description:
    "Graph RAG (Microsoft Research, 2024) builds a knowledge graph from your documents and uses graph-based retrieval alongside vector search. It excels at global, thematic questions that require synthesizing information across many documents — a task where standard RAG fails.",
  howItWorks: [
    "Extract entities and relationships from documents using an LLM",
    "Build a knowledge graph connecting entities across the entire corpus",
    "Detect communities (clusters of related entities) using graph algorithms",
    "Generate summaries for each community at multiple levels of abstraction",
    "At query time, traverse the graph to retrieve relevant community summaries",
  ],
  strengths: [
    "Answers global questions ('What are the main themes across all documents?')",
    "Captures relationships that vector search misses",
    "Provides multi-hop reasoning paths",
    "Community summaries reduce context window usage",
  ],
  weaknesses: [
    "Expensive to build — requires many LLM calls for entity extraction",
    "Graph construction is slow for large corpora",
    "Requires maintenance as documents change",
    "Overkill for simple factual QA",
  ],
};

const multimodalRag = {
  description:
    "Multimodal RAG extends retrieval to images, tables, charts, and diagrams alongside text. Critical for domains where knowledge is encoded visually — technical documentation, medical imaging, financial reports with charts, and slide decks.",
  approaches: [
    {
      name: "Text-Only Extraction",
      description: "Convert images/tables to text descriptions, embed as text. Simple but lossy — complex diagrams lose information.",
      quality: "Low-Medium",
      cost: "Low",
    },
    {
      name: "Multimodal Embeddings",
      description: "Use models like CLIP or Jina CLIP to embed images and text into the same vector space. Query with text, retrieve images.",
      quality: "Medium",
      cost: "Medium",
    },
    {
      name: "Vision LLM Summarization",
      description: "Use GPT-4V or Claude to generate detailed descriptions of images/charts. Embed these rich descriptions alongside source images.",
      quality: "High",
      cost: "High",
    },
    {
      name: "Native Multimodal RAG",
      description: "Store images as-is and pass them directly to a multimodal LLM (GPT-4V, Claude) alongside text chunks in the context window.",
      quality: "Highest",
      cost: "Highest",
    },
  ],
};

const conversationalRag = {
  description:
    "Conversational RAG handles multi-turn conversations where follow-up questions reference previous context. The key challenge: 'Tell me more about that' requires resolving 'that' to the subject from the previous turn before retrieval.",
  challenges: [
    {
      name: "Coreference Resolution",
      description: "'What about their pricing?' — 'their' refers to a company mentioned 3 turns ago. The retrieval query must resolve the reference before embedding.",
      solution: "Rewrite the query to be standalone: 'What is [Company X] pricing?' using the conversation history.",
    },
    {
      name: "Context Accumulation",
      description: "Over multiple turns, the user builds up a complex information need. The final query only makes sense in context of the full conversation.",
      solution: "Maintain a running conversation summary. Use it to enrich each query with accumulated context.",
    },
    {
      name: "Topic Drift",
      description: "The user gradually shifts topics. The retrieval system must detect when the topic changes and avoid retrieving context from the old topic.",
      solution: "Track topic boundaries in the conversation. Reset retrieval context when a new topic begins.",
    },
  ],
  pipeline: [
    "Receive follow-up question in conversation context",
    "Rewrite the question as a standalone query using conversation history",
    "Retrieve using the standalone query (not the original follow-up)",
    "Generate answer with both retrieved context and conversation history",
    "Update conversation summary for the next turn",
  ],
};

const raptorPattern = {
  description:
    "RAPTOR (Recursive Abstractive Processing for Tree-Organized Retrieval) builds a hierarchical tree of document summaries. Leaf nodes are individual chunks, intermediate nodes are cluster summaries, and the root captures the full corpus theme.",
  levels: [
    { level: "Leaf", content: "Individual document chunks (original text)", granularity: "Most specific", bestFor: "Detailed factual questions" },
    { level: "Cluster", content: "Summaries of related chunks (5-10 chunks per cluster)", granularity: "Medium", bestFor: "Topic-level questions" },
    { level: "Section", content: "Summaries of related clusters", granularity: "Broad", bestFor: "Thematic questions" },
    { level: "Root", content: "Summary of the entire corpus", granularity: "Broadest", bestFor: "Global overview questions" },
  ],
};

const emergingPatterns = [
  {
    name: "Late Chunking",
    description: "Embed the full document first using a long-context embedding model, then split the embedding into chunk-level representations. Each chunk's embedding is contextualized by the full document.",
    status: "Emerging",
    color: "text-cyan-600",
  },
  {
    name: "Speculative RAG",
    description: "Generate multiple draft answers from different subsets of retrieved documents using a smaller model. A larger model then verifies and selects the best draft. Reduces hallucination while managing cost.",
    status: "Research",
    color: "text-purple-600",
  },
  {
    name: "RAG + Fine-Tuning Hybrid",
    description: "Fine-tune a model to be a better RAG consumer: follow citations more strictly, abstain when context is insufficient, and maintain output format. The fine-tuning improves RAG behavior, not knowledge.",
    status: "Production",
    color: "text-green-600",
  },
  {
    name: "Agentic Indexing",
    description: "Use an LLM agent to actively manage the index: identify knowledge gaps, suggest new documents to ingest, detect outdated content, and generate synthetic QA pairs for under-covered topics.",
    status: "Emerging",
    color: "text-yellow-600",
  },
];

export function AdvancedPatterns() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Beyond standard agentic RAG, advanced patterns tackle specialized
          challenges: retrieving over knowledge graphs, handling images and
          tables, maintaining multi-turn conversations, and building
          hierarchical document representations. These patterns address the
          long tail of RAG failures that basic pipelines cannot solve.
        </p>
      </div>

      {/* Graph RAG */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Graph RAG</h3>
        <Card className="bg-card/50 border-blue-500/20">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {graphRag.description}
            </p>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                How It Works
              </p>
              <ol className="space-y-1">
                {graphRag.howItWorks.map((step, i) => (
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
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                  Strengths
                </p>
                <ul className="space-y-1">
                  {graphRag.strengths.map((s) => (
                    <li
                      key={s}
                      className="text-xs text-muted-foreground flex items-start gap-1.5"
                    >
                      <span className="text-green-600 mt-0.5">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                  Weaknesses
                </p>
                <ul className="space-y-1">
                  {graphRag.weaknesses.map((w) => (
                    <li
                      key={w}
                      className="text-xs text-muted-foreground flex items-start gap-1.5"
                    >
                      <span className="text-red-600 mt-0.5">-</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RAPTOR */}
      <div>
        <h3 className="text-lg font-semibold mb-4">RAPTOR: Hierarchical Retrieval</h3>
        <Card className="bg-card/50 border-purple-500/20">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {raptorPattern.description}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Level
                    </th>
                    <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Content
                    </th>
                    <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Granularity
                    </th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Best For
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {raptorPattern.levels.map((row) => (
                    <tr key={row.level} className="border-b border-border/30">
                      <td className="py-2.5 pr-4 text-xs font-medium">
                        {row.level}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                        {row.content}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                        {row.granularity}
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">
                        {row.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multimodal RAG */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Multimodal RAG</h3>
        <Card className="bg-card/50 border-yellow-500/20">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {multimodalRag.description}
            </p>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Approaches (from simple to sophisticated)
              </p>
              <div className="space-y-3">
                {multimodalRag.approaches.map((approach) => (
                  <div
                    key={approach.name}
                    className="flex items-start gap-4 p-3 rounded-lg bg-muted/10 border border-border/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{approach.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {approach.description}
                      </p>
                    </div>
                    <div className="hidden md:flex flex-col gap-1 flex-shrink-0">
                      <span className="text-[10px] font-mono text-green-600 bg-green-500/10 px-2 py-0.5 rounded">
                        Quality: {approach.quality}
                      </span>
                      <span className="text-[10px] font-mono text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded">
                        Cost: {approach.cost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversational RAG */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Conversational RAG</h3>
        <Card className="bg-card/50 border-green-500/20">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {conversationalRag.description}
            </p>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Key Challenges
              </p>
              <div className="space-y-3">
                {conversationalRag.challenges.map((challenge) => (
                  <div
                    key={challenge.name}
                    className="rounded-lg border border-border/50 overflow-hidden"
                  >
                    <div className="p-3">
                      <p className="text-sm font-medium mb-1">{challenge.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="bg-green-500/5 border-t border-green-500/10 p-3">
                      <p className="text-xs text-green-600 font-semibold mb-1">
                        Solution
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {challenge.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Conversational RAG Pipeline
              </p>
              <ol className="space-y-1">
                {conversationalRag.pipeline.map((step, i) => (
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
          </CardContent>
        </Card>
      </div>

      {/* Emerging Patterns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Emerging Patterns</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {emergingPatterns.map((pattern) => (
            <Card key={pattern.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm">{pattern.name}</h4>
                  <Badge
                    variant="outline"
                    className={`${pattern.color} border-current text-xs`}
                  >
                    {pattern.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pattern.description}
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
          Advanced patterns solve real problems, but they add complexity.{" "}
          <strong>Graph RAG</strong> is worth it when you need cross-document
          synthesis (enterprise knowledge bases, research corpora).{" "}
          <strong>Multimodal RAG</strong> is essential when your knowledge
          includes images, charts, or tables.{" "}
          <strong>Conversational RAG</strong> is required for any chatbot. In
          every case, start with the simplest pattern that meets your needs and
          upgrade based on evaluation metrics, not intuition.
        </p>
      </div>
    </div>
  );
}
