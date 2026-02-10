import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const analogies = [
  {
    traditional: "CPU",
    ai: "LLM",
    description: "The processing unit that executes instructions and generates output.",
  },
  {
    traditional: "RAM",
    ai: "Context Window",
    description:
      "Working memory — limited capacity, holds the data actively being processed.",
  },
  {
    traditional: "File System / Disk",
    ai: "Retrieval Systems (RAG)",
    description:
      "Persistent storage. Data must be loaded into RAM/context before it can be used.",
  },
  {
    traditional: "System Calls",
    ai: "Tool Calls / APIs",
    description:
      "Interface between the processing unit and external resources.",
  },
  {
    traditional: "Long-Running Apps",
    ai: "AI Agents",
    description:
      "Programs that persist, make sequential decisions, and operate over extended periods.",
  },
  {
    traditional: "OS Scheduler",
    ai: "Context Engineer",
    description:
      "Manages what data occupies the limited working memory at each step.",
  },
];

export function OsAnalogy() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Andrej Karpathy proposed a powerful mental model:{" "}
          <strong>LLMs are a new kind of operating system</strong>. Just as an
          OS manages what data fits in a CPU&apos;s RAM, context engineering manages
          what information fits in an LLM&apos;s context window.
        </p>
      </div>

      {/* Visual Diagram */}
      <Card className="bg-card/50 border-primary/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">The Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                    Traditional OS
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">
                    LLM System
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {analogies.map((row) => (
                  <tr key={row.traditional} className="border-b border-border/50">
                    <td className="py-3 px-4 font-mono text-sm">
                      {row.traditional}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-primary">
                      {row.ai}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Context Window as RAM */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="text-2xl mb-2">💾</div>
            <h3 className="font-semibold mb-2">RAM is Limited</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Just like RAM, the context window has a fixed capacity (128K,
              200K, or even 1M tokens). You can&apos;t load everything at once —
              you must strategically decide what occupies this space at each
              moment.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold mb-2">Page In, Page Out</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Like an OS swapping memory pages, context engineering involves
              loading relevant data in (RAG retrieval) and swapping old data out
              (compaction/summarization) to keep the working set optimal.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          Karpathy&apos;s 1960s Analogy
        </p>
        <p className="text-foreground/90 leading-relaxed text-sm">
          Karpathy sees the current moment as similar to the 1960s era of
          mainframe computers — powerful centralized machines that users connect
          to via simple terminals. We&apos;re in the early days of learning how to
          build an &ldquo;operating system&rdquo; around LLMs, and context
          engineering is the core discipline of that effort.
        </p>
      </div>
    </div>
  );
}
