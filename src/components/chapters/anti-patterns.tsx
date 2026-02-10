import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { antiPatterns } from "@/lib/data";

const severityColor = {
  critical: "bg-red-500/10 text-red-600 border-red-500/40",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
};

const severityBorder = {
  critical: "border-red-500/20",
  high: "border-orange-500/20",
  medium: "border-yellow-500/20",
};

export function AntiPatterns() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Knowing what <strong>not</strong> to do is as important as knowing
          what to do. These are the most common failure modes in context-
          engineered systems, as documented by Anthropic, DeepMind, and
          Microsoft research.
        </p>
      </div>

      {/* Severity Legend */}
      <div className="flex gap-3">
        {(["critical", "high", "medium"] as const).map((sev) => (
          <Badge key={sev} variant="outline" className={severityColor[sev]}>
            {sev.charAt(0).toUpperCase() + sev.slice(1)}
          </Badge>
        ))}
      </div>

      <div className="space-y-4">
        {antiPatterns.map((pattern) => (
          <Card
            key={pattern.name}
            className={`bg-card/50 ${severityBorder[pattern.severity]}`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge
                  variant="outline"
                  className={severityColor[pattern.severity]}
                >
                  {pattern.severity}
                </Badge>
                {pattern.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/90 leading-relaxed">
                {pattern.description}
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                    Cause
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pattern.cause}
                  </p>
                </div>

                <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/10">
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
                    Symptom
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pattern.symptom}
                  </p>
                </div>

                <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                    Fix
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pattern.fix}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
