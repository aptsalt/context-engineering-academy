import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ragResources } from "@/lib/agentic-rag-data";

const typeColor: Record<string, string> = {
  blog: "bg-blue-500/10 text-blue-600 border-blue-500/40",
  paper: "bg-purple-500/10 text-purple-600 border-purple-500/40",
  repo: "bg-green-500/10 text-green-600 border-green-500/40",
  video: "bg-red-500/10 text-red-600 border-red-500/40",
  guide: "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
};

export function RagResourcesSection() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Essential research papers, documentation, and guides for building
          production-grade RAG systems. These are the sources referenced
          throughout this academy.
        </p>
      </div>

      {/* Resources list */}
      <div className="space-y-3">
        {ragResources.map((resource) => (
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
                      <Badge
                        variant="outline"
                        className={typeColor[resource.type]}
                      >
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

      {/* Reading order suggestion */}
      <Card className="bg-card/50 border-dashed">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-2">Suggested Reading Order</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Start with the <strong>LangChain RAG Tutorial</strong> for hands-on
            basics. Read the <strong>RAGAS paper</strong> to understand
            evaluation. Then dive into <strong>Self-RAG</strong> and{" "}
            <strong>CRAG</strong> for agentic patterns. Finally, explore{" "}
            <strong>Graph RAG</strong> for advanced cross-document synthesis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
