"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ScenarioPrinciple, ContextComponent } from "@/lib/playground-data";

interface PrinciplesPanelProps {
  principles: ScenarioPrinciple[];
  components: ContextComponent[];
  enabledComponents: Set<string>;
}

export function PrinciplesPanel({
  principles,
  components,
  enabledComponents,
}: PrinciplesPanelProps) {
  const componentMap = new Map(components.map((c) => [c.id, c]));

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Key context engineering principles demonstrated by this scenario. Linked
        components light up as you enable them.
      </p>
      <div className="space-y-3">
        {principles.map((principle) => {
          const linkedEnabled = principle.linkedComponents.filter((id) =>
            enabledComponents.has(id),
          );
          const allLinkedEnabled =
            principle.linkedComponents.length > 0 &&
            linkedEnabled.length === principle.linkedComponents.length;

          return (
            <Card
              key={principle.id}
              className={`transition-all duration-300 ${
                allLinkedEnabled
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/50 bg-card/30"
              }`}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4
                    className={`text-sm font-semibold ${
                      allLinkedEnabled ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {principle.title}
                  </h4>
                  {allLinkedEnabled && (
                    <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
                  {principle.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {principle.linkedComponents.map((componentId) => {
                    const component = componentMap.get(componentId);
                    if (!component) return null;
                    const isEnabled = enabledComponents.has(componentId);
                    return (
                      <span
                        key={componentId}
                        className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border transition-all duration-300 ${
                          isEnabled
                            ? `${component.color} ${component.borderColor} bg-card/80`
                            : "text-muted-foreground/50 border-border/30 bg-transparent"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            isEnabled ? component.bgColor : "bg-muted/50"
                          }`}
                        />
                        {component.shortName}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
