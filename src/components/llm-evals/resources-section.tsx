import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resources } from "@/lib/llm-evals-data";

const typeColor: Record<string, string> = {
  blog: "bg-blue-500/10 text-blue-600 border-blue-500/40",
  paper: "bg-purple-500/10 text-purple-600 border-purple-500/40",
  repo: "bg-green-500/10 text-green-600 border-green-500/40",
  video: "bg-red-500/10 text-red-600 border-red-500/40",
  guide: "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
  docs: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
};

export function ResourcesSection() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Essential tools, frameworks, blog posts, research papers, and guides
          for building production-grade LLM evaluation systems.
        </p>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="bg-card/50 transition-colors group-hover:border-primary/30">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="outline" className={typeColor[resource.type]}>
                        {resource.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {resource.source}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1"
                  >
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* Start Here */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-2">Where to Start</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you read one thing, read <strong>Hamel Husain&apos;s
            &ldquo;Your AI Product Needs Evals&rdquo;</strong> — it covers the
            why, what, and how of LLM evals in one comprehensive post. Then pick
            a framework (<strong>promptfoo</strong> for CLI-first,{" "}
            <strong>Braintrust</strong> for enterprise) and start with 20 test
            cases. You&apos;ll see immediate ROI.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
