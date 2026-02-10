import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundClient } from "@/components/playground/playground-client";
import { scenarios } from "@/lib/scenarios";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Context Engineering Playground",
  description:
    "Interactive playground with 5 scenarios to experiment with context engineering components. Toggle system prompts, tools, RAG, memory, and more to see how they affect AI agent responses.",
};

export default function PlaygroundPage() {
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
            href="/context-engineering-academy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Context Engineering
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-medium">Playground</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
              11
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Context Engineering{" "}
                <span className="gradient-text">Playground</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                5 scenarios exploring different context engineering skills.
                Toggle components on and off to see how they affect agent
                response quality.
              </p>
            </div>
          </div>
        </header>

        <PlaygroundClient scenarios={scenarios} />
      </div>
    </main>
  );
}
