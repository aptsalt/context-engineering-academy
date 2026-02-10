"use client";

import type { ContextComponent } from "@/lib/playground-data";

interface TokenCounterProps {
  components: ContextComponent[];
  enabledComponents: Set<string>;
}

export function TokenCounter({ components, enabledComponents }: TokenCounterProps) {
  const maxTokens = components.reduce((sum, c) => sum + c.tokens, 0);
  const activeComponents = components.filter((c) =>
    enabledComponents.has(c.id),
  );
  const usedTokens = activeComponents.reduce((sum, c) => sum + c.tokens, 0);
  const usagePct = maxTokens > 0 ? Math.round((usedTokens / maxTokens) * 100) : 0;

  return (
    <div className="space-y-3 rounded-lg border border-border/50 bg-card/30 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Token Usage
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold font-mono">
            {usedTokens.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">
            / {maxTokens.toLocaleString()} ({usagePct}%)
          </span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="h-7 bg-muted/20 rounded-lg overflow-hidden flex border border-border/30">
        {components.map((component) => {
          const isEnabled = enabledComponents.has(component.id);
          const widthPct = maxTokens > 0 ? (component.tokens / maxTokens) * 100 : 0;
          return (
            <div
              key={component.id}
              className={`h-full transition-all duration-500 relative group ${
                isEnabled ? component.bgColor + " opacity-80" : "bg-transparent"
              }`}
              style={{ width: `${widthPct}%` }}
              title={`${component.name}: ${component.tokens} tokens`}
            >
              {isEnabled && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-mono font-bold text-white drop-shadow-sm">
                    {component.tokens}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {components.map((component) => {
          const isEnabled = enabledComponents.has(component.id);
          return (
            <div
              key={component.id}
              className={`flex items-center gap-1.5 transition-opacity ${
                isEnabled ? "opacity-100" : "opacity-30"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${component.bgColor}`} />
              <span className="text-[10px] text-muted-foreground">
                {component.shortName}
              </span>
              {isEnabled && (
                <span className="text-[9px] font-mono text-muted-foreground/60">
                  {component.tokens}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
