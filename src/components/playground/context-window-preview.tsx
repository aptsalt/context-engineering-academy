"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { ContextComponent } from "@/lib/playground-data";
import { Eye } from "lucide-react";

interface ContextWindowPreviewProps {
  components: ContextComponent[];
  enabledComponents: Set<string>;
  customerMessage: string;
}

export function ContextWindowPreview({
  components,
  enabledComponents,
  customerMessage,
}: ContextWindowPreviewProps) {
  const activeComponents = components.filter((c) =>
    enabledComponents.has(c.id),
  );

  const totalTokens = activeComponents.reduce((sum, c) => sum + c.tokens, 0);

  if (activeComponents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <Eye className="w-8 h-8 text-muted-foreground/30" />
        <p className="text-sm">Enable context components to see the assembled context window</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Raw context that would be sent to the LLM, assembled from enabled components.
        </p>
        <span className="text-[10px] font-mono text-muted-foreground">
          {totalTokens.toLocaleString()} tokens
        </span>
      </div>
      <ScrollArea className="h-[500px] rounded-lg border border-border bg-[#0d1117]">
        <div className="p-4 space-y-4 font-mono text-xs leading-relaxed">
          {activeComponents.map((component) => (
            <div key={component.id} className="group">
              <div
                className={`flex items-center gap-2 mb-2 ${component.color}`}
              >
                <div className={`w-2 h-2 rounded-full ${component.bgColor}`} />
                <span className="font-semibold text-[11px] uppercase tracking-wider">
                  {component.name}
                </span>
                <span className="text-[10px] opacity-50">
                  ({component.tokens} tokens)
                </span>
              </div>
              <div className={`pl-4 border-l-2 ${component.borderColor} group-hover:border-opacity-100 transition-all`}>
                <pre className="text-[#e6edf3]/70 whitespace-pre-wrap break-words">
                  {component.content}
                </pre>
              </div>
            </div>
          ))}

          {/* User message always shown */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-foreground/80">
              <div className="w-2 h-2 rounded-full bg-foreground/50" />
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                User Message
              </span>
            </div>
            <div className="pl-4 border-l-2 border-foreground/20">
              <pre className="text-[#e6edf3]/70 whitespace-pre-wrap">
                {customerMessage}
              </pre>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
