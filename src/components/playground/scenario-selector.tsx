"use client";

import { Badge } from "@/components/ui/badge";
import type { PlaygroundScenario, ScenarioEmphasis } from "@/lib/playground-data";

interface ScenarioSelectorProps {
  scenarios: PlaygroundScenario[];
  activeScenarioId: string;
  onSelect: (id: string) => void;
}

const emphasisColors: Record<ScenarioEmphasis, string> = {
  "full-pipeline": "bg-primary/10 text-primary border-primary/30",
  "prompt-grammar": "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
  "fewer-retries": "bg-green-500/10 text-green-600 border-green-500/40",
  "token-efficiency": "bg-purple-500/10 text-purple-600 border-purple-500/40",
  "anti-patterns": "bg-red-500/10 text-red-600 border-red-500/40",
};

export function ScenarioSelector({
  scenarios,
  activeScenarioId,
  onSelect,
}: ScenarioSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Choose a Scenario
        </p>
        <p className="text-[10px] text-muted-foreground">
          {scenarios.length} scenarios available
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {scenarios.map((scenario, index) => {
          const isActive = scenario.id === activeScenarioId;
          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario.id)}
              className={`text-left rounded-lg border p-3 transition-all duration-200 ${
                isActive
                  ? "border-primary/50 bg-primary/5 shadow-sm ring-1 ring-primary/20"
                  : "border-border/50 bg-card/30 hover:border-border hover:bg-card/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-muted-foreground/60">
                  {index + 1}
                </span>
                <span
                  className={`text-xs font-medium truncate ${
                    isActive ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {scenario.name}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] px-1.5 py-0 h-4 ${emphasisColors[scenario.emphasis]}`}
              >
                {scenario.emphasisLabel}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
