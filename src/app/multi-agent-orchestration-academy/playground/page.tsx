import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundClient } from "@/components/playground/playground-client";
import { multiAgentScenarios } from "@/lib/scenarios/multi-agent";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Multi-Agent Orchestration Playground",
  description:
    "Interactive playground with 3 scenarios to experiment with multi-agent orchestration components. Toggle task decomposition, agent roles, communication protocols, and more to see how coordinated agent teams outperform single agents.",
};

export default function MultiAgentPlaygroundPage() {
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
            href="/multi-agent-orchestration-academy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Multi-Agent Orchestration
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
                Multi-Agent Orchestration{" "}
                <span className="gradient-text">Playground</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                3 scenarios exploring multi-agent orchestration patterns. Toggle
                components on and off to see how coordination transforms agent
                team performance.
              </p>
            </div>
          </div>
        </header>

        <PlaygroundClient scenarios={multiAgentScenarios} />
      </div>
    </main>
  );
}
