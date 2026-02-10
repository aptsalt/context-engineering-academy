"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContextComponent } from "@/lib/playground-data";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface ContextTogglePanelProps {
  components: ContextComponent[];
  enabledComponents: Set<string>;
  onToggle: (id: string) => void;
}

export function ContextTogglePanel({
  components,
  enabledComponents,
  onToggle,
}: ContextTogglePanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Context Components
        </p>
        <p className="text-[10px] text-muted-foreground">
          {enabledComponents.size}/{components.length} active
        </p>
      </div>
      {components.map((component) => {
        const isEnabled = enabledComponents.has(component.id);
        return (
          <button
            key={component.id}
            onClick={() => onToggle(component.id)}
            className="w-full text-left"
          >
            <Card
              className={`transition-all duration-300 cursor-pointer ${
                isEnabled
                  ? `${component.borderColor} bg-card/80 shadow-sm`
                  : "border-border/50 bg-card/30 opacity-60 hover:opacity-80"
              }`}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isEnabled
                          ? `${component.bgColor} shadow-[0_0_8px_rgba(255,255,255,0.1)]`
                          : "bg-muted"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isEnabled ? component.color : "text-muted-foreground"
                      }`}
                    >
                      {component.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        isEnabled ? component.color + " border-current" : ""
                      }`}
                    >
                      ~{component.tokens} tokens
                    </Badge>
                    {isEnabled ? (
                      <ToggleRight className={`w-4 h-4 ${component.color}`} />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-4.5">
                  {component.description}
                </p>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
