import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { multiAgentResources } from "@/lib/multi-agent-data";

const typeColor: Record<string, string> = {
  blog: "bg-blue-500/10 text-blue-600 border-blue-500/40",
  paper: "bg-purple-500/10 text-purple-600 border-purple-500/40",
  repo: "bg-green-500/10 text-green-600 border-green-500/40",
  video: "bg-red-500/10 text-red-600 border-red-500/40",
  guide: "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
  docs: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
};

export function MultiAgentResourcesSection() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Essential documentation, research papers, repositories, and courses
          for mastering multi-agent orchestration.
        </p>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {multiAgentResources.map((resource) => (
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
                      <Badge variant="outline" className={typeColor[resource.type] ?? typeColor["blog"]}>
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

      {/* Learning Path Suggestion */}
      <Card className="bg-card/50 border-dashed">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-2">Recommended Learning Path</h3>
          <ol className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5 flex-shrink-0">1.</span>
              <span>
                Start with <strong className="text-foreground/90">Anthropic&apos;s Building Effective Agents</strong> for
                foundational principles on when and how to use multi-agent patterns.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5 flex-shrink-0">2.</span>
              <span>
                Take <strong className="text-foreground/90">Andrew Ng&apos;s Multi-Agent Systems course</strong> on
                DeepLearning.AI for hands-on experience with CrewAI.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5 flex-shrink-0">3.</span>
              <span>
                Read the <strong className="text-foreground/90">LangGraph Multi-Agent Guide</strong> to understand
                stateful graph-based orchestration patterns.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5 flex-shrink-0">4.</span>
              <span>
                Study <strong className="text-foreground/90">OpenAI Swarm&apos;s source code</strong> (under 500 lines)
                to understand the simplest possible multi-agent implementation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5 flex-shrink-0">5.</span>
              <span>
                Read the <strong className="text-foreground/90">academic surveys</strong> for comprehensive coverage
                of patterns, evaluation, and open research questions.
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
