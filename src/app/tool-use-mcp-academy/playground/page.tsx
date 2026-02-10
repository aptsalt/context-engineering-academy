import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundClient } from "@/components/playground/playground-client";
import { toolUseScenarios } from "@/lib/scenarios/tool-use";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Tool Use & MCP Playground",
  description:
    "Interactive playground with 3 scenarios to experiment with tool design, MCP servers, and tool selection strategies. Toggle components on and off to see how they affect tool call accuracy.",
};

export default function ToolUseMcpPlaygroundPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Academies
          </Link>
          <span className="text-border">/</span>
          <Link
            href="/tool-use-mcp-academy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tool Use &amp; MCP
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-medium">Playground</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
              13
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Tool Use &amp; MCP{" "}
                <span className="gradient-text">Playground</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                3 scenarios exploring tool design, MCP servers, and tool
                selection at scale. Toggle components on and off to see how they
                affect tool call accuracy.
              </p>
            </div>
          </div>
        </header>

        <PlaygroundClient scenarios={toolUseScenarios} />
      </div>
    </main>
  );
}
