import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bestPractices } from "@/lib/agent-observability-data";

export function BestPractices() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Production-ready observability guidelines distilled from SRE
          practices, LLM platform teams, and the observability community.
          These are the standards every agent system should meet before going
          to production.
        </p>
      </div>

      <div className="space-y-6">
        {bestPractices.map((category) => (
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
            At any point in time, you should be able to answer three questions
            about your agent: <strong>Is it working correctly?</strong>{" "}
            <strong>How much is it costing?</strong>{" "}
            <strong>Where are the bottlenecks?</strong> If you cannot answer all
            three from your observability data within 60 seconds, your
            observability stack has gaps.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            — Adapted from SRE best practices applied to AI systems
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
