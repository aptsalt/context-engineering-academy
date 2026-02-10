import { Card, CardContent } from "@/components/ui/card";

const comparisons = [
  {
    dimension: "Scope",
    prompt: "Single interaction / message",
    context: "Entire information system across multiple interactions",
  },
  {
    dimension: "Focus",
    prompt: "How you ask the question",
    context: "What information the model sees",
  },
  {
    dimension: "Time Horizon",
    prompt: "One-shot, stateless",
    context: "Multi-turn, stateful, persistent",
  },
  {
    dimension: "Components",
    prompt: "Prompt text, instructions",
    context: "System prompts + RAG + tools + memory + history + structured data",
  },
  {
    dimension: "Skill Type",
    prompt: "Copywriting / wording",
    context: "Systems engineering / architecture",
  },
  {
    dimension: "Failure Mode",
    prompt: "Bad phrasing → bad output",
    context: "Missing/wrong context → wrong decisions",
  },
  {
    dimension: "When It Matters",
    prompt: "Simple Q&A, single tasks",
    context: "Agents, multi-step workflows, production systems",
  },
];

export function VsPromptEngineering() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Prompt engineering is a <strong>subset</strong> of context engineering.
          Asking ChatGPT to write an email is prompt engineering. Building a
          customer service platform that maintains conversation history, accesses
          account data, and remembers past tickets — that&apos;s context engineering.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-3 px-4 font-semibold">Dimension</th>
              <th className="text-left py-3 px-4 font-semibold text-orange-600">
                Prompt Engineering
              </th>
              <th className="text-left py-3 px-4 font-semibold text-primary">
                Context Engineering
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row) => (
              <tr key={row.dimension} className="border-t border-border/50">
                <td className="py-3 px-4 font-medium">{row.dimension}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.prompt}</td>
                <td className="py-3 px-4 text-foreground/90">{row.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Example */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/50 border-orange-500/20">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-3">
              Prompt Engineering
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-[#e6edf3] leading-relaxed">
              <p className="text-muted-foreground">{`// A single, static prompt`}</p>
              <p className="mt-2">{`"Write a professional email`}</p>
              <p>{` declining the meeting invitation`}</p>
              <p>{` with a polite tone."`}</p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              One-shot. No tools, no memory, no retrieval. The prompt IS the
              entire context.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              Context Engineering
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-[#e6edf3] leading-relaxed space-y-1">
              <p className="text-green-600">{`System prompt (role + rules)`}</p>
              <p className="text-blue-600">{`+ Calendar data (retrieved)`}</p>
              <p className="text-yellow-600">{`+ Email thread history (memory)`}</p>
              <p className="text-purple-600">{`+ User preferences (long-term)`}</p>
              <p className="text-red-600">{`+ send_email tool (capability)`}</p>
              <p className="text-cyan-600">{`+ Previous meeting notes (RAG)`}</p>
              <p className="text-muted-foreground mt-2">{`→ LLM generates contextual response`}</p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Dynamic system. Multiple data sources assembled at runtime. The
              prompt is just one piece.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Not a Replacement — an Evolution</p>
        <p className="text-foreground/90 leading-relaxed text-sm">
          Some argue prompt engineering is now <em>more important than ever</em>{" "}
          — &ldquo;it is so important that it is now being rebranded as context
          engineering.&rdquo; Context engineering doesn&apos;t replace prompt
          engineering; it encompasses it as one component of a larger system.
          Your system prompt still matters — but it&apos;s now 10% of the picture,
          not 100%.
        </p>
      </div>
    </div>
  );
}
