"use client";

import type { ContextComponent } from "@/lib/playground-data";
import { ArrowDown, Cpu, MessageSquare } from "lucide-react";

interface AssemblyPipelineProps {
  components: ContextComponent[];
  enabledComponents: Set<string>;
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-2">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-px h-4 bg-border" />
        <ArrowDown className="w-3.5 h-3.5 text-border" />
      </div>
    </div>
  );
}

export function AssemblyPipeline({
  components,
  enabledComponents,
}: AssemblyPipelineProps) {
  const totalTokens = components
    .filter((c) => enabledComponents.has(c.id))
    .reduce((sum, c) => sum + c.tokens, 0);

  const maxTokens = components.reduce((sum, c) => sum + c.tokens, 0);
  const activeCount = components.filter((c) => enabledComponents.has(c.id)).length;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Visual representation of how context is assembled before being sent to
        the LLM.
      </p>

      <div className="space-y-2">
        {/* Source nodes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {components.map((component) => {
            const isEnabled = enabledComponents.has(component.id);
            return (
              <div
                key={component.id}
                className={`relative rounded-lg border p-3 transition-all duration-300 ${
                  isEnabled
                    ? `${component.borderColor} bg-card/80 shadow-sm`
                    : "border-border/30 bg-card/20 opacity-40"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isEnabled ? component.bgColor : "bg-muted"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isEnabled ? component.color : "text-muted-foreground"
                    }`}
                  >
                    {component.shortName}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {isEnabled ? `${component.tokens} tokens` : "disabled"}
                </p>
                {isEnabled && (
                  <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${component.bgColor} animate-pulse`} />
                )}
              </div>
            );
          })}
        </div>

        <FlowArrow />

        {/* Assembly step */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${activeCount > 0 ? "bg-primary/60 animate-pulse" : "bg-muted/50"}`} />
              <span className="text-sm font-semibold text-primary">
                Context Assembly
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {activeCount} / {components.length} components
            </span>
          </div>
          <div className="flex items-center gap-0.5 flex-wrap">
            {components.map((component) => {
              const isEnabled = enabledComponents.has(component.id);
              return (
                <div
                  key={component.id}
                  className={`h-3 rounded transition-all duration-500 ${
                    isEnabled ? component.bgColor + " opacity-70" : "bg-muted/20"
                  }`}
                  style={{
                    width: isEnabled
                      ? `${Math.max((component.tokens / maxTokens) * 100, 8)}%`
                      : "8%",
                  }}
                  title={`${component.name}: ${isEnabled ? component.tokens + " tokens" : "disabled"}`}
                />
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Total: {totalTokens.toLocaleString()} tokens assembled + user message
          </p>
        </div>

        <FlowArrow />

        {/* LLM node */}
        <div className="rounded-lg border border-border bg-card/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-foreground/50" />
              <span className="text-sm font-semibold">LLM</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {totalTokens > 0
                ? `Processing ${totalTokens.toLocaleString()} tokens`
                : "Awaiting context"}
            </span>
          </div>
        </div>

        <FlowArrow />

        {/* Output node */}
        <div
          className={`rounded-lg border p-4 transition-all duration-300 ${
            activeCount > 0
              ? "border-green-500/40 bg-green-500/5"
              : "border-red-500/40 bg-red-500/5"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare
                className={`w-4 h-4 ${
                  activeCount > 0 ? "text-green-500/70" : "text-red-500/70"
                }`}
              />
              <span className="text-sm font-semibold">Agent Response</span>
            </div>
            <span
              className={`text-xs ${
                activeCount > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {activeCount > 0
                ? `Quality: ${activeCount} component${activeCount > 1 ? "s" : ""} informing output`
                : "No context provided"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
