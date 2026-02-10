"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CodeBlock({
  code,
  label,
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg border border-border bg-[#0d1117] overflow-hidden">
      {label && (
        <div className="px-4 py-2 bg-[#161b22] border-b border-border text-xs text-muted-foreground font-mono">
          {label}
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-[#e6edf3] font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}
