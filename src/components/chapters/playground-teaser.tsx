import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlaygroundTeaser() {
  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-foreground/90">
        Put theory into practice. This interactive playground lets you build a
        context window piece by piece and see how each component affects an AI
        agent&apos;s response quality across 5 different scenarios.
      </p>

      <Link href="/playground" className="block group">
        <Card className="bg-card/50 border-primary/30 hover:border-primary/60 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/40 text-xs"
                  >
                    Interactive
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    5 Scenarios
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  Context Engineering Playground
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Toggle 6 context components across 5 scenarios — customer
                  support, code review, data extraction, research analysis, and
                  content writing. Each scenario teaches a different context
                  engineering skill: prompt grammar, token efficiency,
                  first-try accuracy, and anti-pattern avoidance.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "System", color: "bg-green-500" },
                    { name: "Tools", color: "bg-red-500" },
                    { name: "Few-Shot", color: "bg-yellow-500" },
                    { name: "History", color: "bg-blue-500" },
                    { name: "RAG", color: "bg-purple-500" },
                    { name: "Memory", color: "bg-cyan-500" },
                  ].map((c) => (
                    <span
                      key={c.name}
                      className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${c.color}`}
                      />
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors text-xl shrink-0">
                &rarr;
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
