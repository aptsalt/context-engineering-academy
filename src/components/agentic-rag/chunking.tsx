import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const chunkingStrategies = [
  {
    name: "Fixed-Size Splitting",
    badge: "Basic",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Split text into chunks of a fixed character or token count. The simplest approach but the lowest quality.",
    pros: ["Fast and deterministic", "Easy to implement", "Predictable chunk sizes"],
    cons: [
      "Splits mid-sentence and mid-paragraph",
      "Destroys semantic coherence",
      "No awareness of document structure",
    ],
    bestFor: "Quick prototyping when chunk quality doesn't matter yet.",
    example: `// Fixed-size: chunk every 500 characters
const chunks = [];
for (let i = 0; i < text.length; i += 500) {
  chunks.push(text.slice(i, i + 500));
}`,
  },
  {
    name: "Recursive Character Splitting",
    badge: "Recommended",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Split on a hierarchy of separators (paragraphs > sentences > words), trying the largest separator first and falling back to smaller ones.",
    pros: [
      "Respects paragraph and sentence boundaries",
      "Configurable separator hierarchy",
      "Good balance of quality and simplicity",
    ],
    cons: [
      "Still uses a fixed target chunk size",
      "May not respect semantic boundaries perfectly",
      "Overlap can duplicate content",
    ],
    bestFor: "Production RAG systems. The default choice for most use cases.",
    example: `const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ["\\n\\n", "\\n", ". ", " ", ""],
});`,
  },
  {
    name: "Semantic Chunking",
    badge: "Advanced",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Use embeddings to find natural breakpoints. Embed each sentence, then split where the cosine similarity between consecutive sentences drops below a threshold.",
    pros: [
      "Chunks align with topic boundaries",
      "Variable chunk sizes that match content",
      "No arbitrary size limits",
    ],
    cons: [
      "Requires embedding every sentence (slow for large corpora)",
      "Needs a similarity threshold to tune",
      "More complex to implement",
    ],
    bestFor: "When document structure varies widely and topic coherence is critical.",
    example: `// Embed each sentence, split on topic shifts
const embeddings = await embedBatch(sentences);
const breakpoints = [];
for (let i = 1; i < embeddings.length; i++) {
  const sim = cosineSimilarity(embeddings[i-1], embeddings[i]);
  if (sim < threshold) breakpoints.push(i);
}`,
  },
  {
    name: "Agentic Chunking",
    badge: "Cutting Edge",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Use an LLM to determine chunk boundaries. The model reads through the document and decides where semantically complete units begin and end.",
    pros: [
      "Highest semantic coherence",
      "Handles complex document structures",
      "Can add chunk-level summaries",
    ],
    cons: [
      "Expensive — requires LLM calls per document",
      "Slow for large corpora",
      "Non-deterministic chunking",
    ],
    bestFor: "Small, high-value document collections where chunk quality directly impacts revenue (legal, medical, financial).",
    example: `// LLM decides chunk boundaries
const chunks = await llm.generate({
  system: \`Split this document into semantically complete
chunks. Each chunk should cover one topic or concept.
Return as JSON array with summary per chunk.\`,
  messages: [{ role: "user", content: document }],
});`,
  },
  {
    name: "Document-Aware Splitting",
    badge: "Specialized",
    color: "text-cyan-600",
    border: "border-cyan-500/20",
    description:
      "Use document format-specific parsers (Markdown headers, HTML tags, PDF sections, code AST) to split at structural boundaries.",
    pros: [
      "Respects actual document structure",
      "Headers become natural chunk boundaries",
      "Preserves hierarchical context",
    ],
    cons: [
      "Requires format-specific parsers",
      "Sections may exceed target chunk size",
      "Doesn't work for unstructured text",
    ],
    bestFor: "Structured documents like docs sites, wikis, codebases, and technical manuals.",
    example: `// Split Markdown by headers
const splitter = new MarkdownTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 100,
});
// Preserves: # Title → ## Section → ### Subsection`,
  },
];

const chunkSizeExperiments = [
  { size: "128 tokens", precision: "High", recall: "Low", bestFor: "Exact fact lookup" },
  { size: "256 tokens", precision: "High", recall: "Medium", bestFor: "QA, chatbots" },
  { size: "512 tokens", precision: "Medium", recall: "Medium", bestFor: "General purpose" },
  { size: "1024 tokens", precision: "Medium", recall: "High", bestFor: "Summarization" },
  { size: "2048 tokens", precision: "Low", recall: "High", bestFor: "Document-level context" },
];

export function Chunking() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Chunking</strong> is the process of splitting documents into
          smaller pieces for indexing and retrieval. It is the most
          under-appreciated step in the RAG pipeline — and the one with the
          highest ROI when done right. Poor chunking creates{" "}
          <em>&ldquo;chunk soup&rdquo;</em> — incoherent fragments that poison
          retrieval quality.
        </p>
      </div>

      {/* The Overlap Principle */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-3">Critical Concept</Badge>
          <h3 className="font-semibold mb-2">Chunk Overlap: The Single Highest-ROI Improvement</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Without overlap, information at chunk boundaries is split between two
            chunks. Neither chunk has the complete thought, so retrieval misses
            it. A 10-20% overlap (e.g., 100-200 tokens for 1000-token chunks)
            ensures boundary information appears in at least one complete chunk.
          </p>
          <div className="bg-[#0d1117] rounded-md p-4 font-mono text-xs text-[#e6edf3]/80 leading-relaxed">
            <div className="text-muted-foreground mb-2">// Without overlap:</div>
            <div className="text-red-600">Chunk 1: &quot;...The refund policy requires cust&quot;</div>
            <div className="text-red-600">Chunk 2: &quot;omers to submit within 30 days...&quot;</div>
            <div className="text-muted-foreground mt-3 mb-2">// With 200-char overlap:</div>
            <div className="text-green-600">Chunk 1: &quot;...The refund policy requires customers to submit within 30 days.&quot;</div>
            <div className="text-green-600">Chunk 2: &quot;The refund policy requires customers to submit within 30 days. Digital products...&quot;</div>
          </div>
        </CardContent>
      </Card>

      {/* Chunking Strategies */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Chunking Strategies Compared</h3>
        <div className="space-y-4">
          {chunkingStrategies.map((strategy) => (
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

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                      Pros
                    </p>
                    <ul className="space-y-1">
                      {strategy.pros.map((pro) => (
                        <li key={pro} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-green-600 mt-0.5">+</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                      Cons
                    </p>
                    <ul className="space-y-1">
                      {strategy.cons.map((con) => (
                        <li key={con} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-red-600 mt-0.5">-</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">
                  {strategy.example}
                </div>

                <div className="bg-muted/20 rounded-md px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">Best for: </span>
                  <span className="text-xs text-foreground/90">{strategy.bestFor}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chunk Size Experiments */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Chunk Size vs. Retrieval Quality</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Smaller chunks are more precise (match specific facts) but have
            lower recall (miss surrounding context). Larger chunks provide more
            context but are less precise. There is no universal optimum — it
            depends on your use case.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Chunk Size
                  </th>
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Precision
                  </th>
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Recall
                  </th>
                  <th className="text-left py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {chunkSizeExperiments.map((row) => (
                  <tr key={row.size} className="border-b border-border/30">
                    <td className="py-2.5 pr-4 text-xs font-mono">{row.size}</td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.precision}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {row.recall}
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

      {/* Metadata Preservation */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          Metadata Preservation
        </p>
        <p className="text-foreground/90 leading-relaxed">
          Every chunk should carry metadata: <strong>source document title</strong>,{" "}
          <strong>section header</strong>, <strong>page number</strong>,{" "}
          <strong>chunk index</strong>, and <strong>last updated date</strong>.
          Without metadata, you can&apos;t filter by recency, can&apos;t
          attribute sources, and can&apos;t implement document versioning. The
          parent-child pattern — index small chunks for precise retrieval but
          return the parent chunk for context — gives you the best of both
          worlds.
        </p>
      </div>
    </div>
  );
}
