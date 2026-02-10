import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { multiAgentBestPractices } from "@/lib/multi-agent-data";

export function MultiAgentBestPractices() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Production-ready guidelines distilled from Anthropic, LangChain,
          Microsoft Research, CrewAI, and teams running multi-agent systems at
          scale. These practices prevent the anti-patterns described in the
          previous section.
        </p>
      </div>

      <div className="space-y-6">
        {multiAgentBestPractices.map((category) => (
          <Card key={category.category} className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="text-primary"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">The Guiding Principle</h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            A multi-agent system should be{" "}
            <strong>the simplest architecture that achieves your quality bar</strong>.
            Every additional agent adds latency, cost, and failure surface. If
            you can&apos;t measure a concrete quality improvement from splitting an
            agent, keep it as one. The best multi-agent system is one where
            every agent earns its place through measurable improvement.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            — Anthropic, Building Effective Agents
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
