import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundClient } from "@/components/playground/playground-client";
import { observabilityScenarios } from "@/lib/scenarios/observability";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Agent Observability Playground",
  description:
    "Interactive playground with 3 scenarios to experiment with observability components. Toggle structured logging, tracing, metrics, alerting, and more to see how they affect your debugging ability.",
};

export default function ObservabilityPlaygroundPage() {
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
            href="/agent-observability-academy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Agent Observability
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-medium">Playground</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Agent Observability{" "}
                <span className="gradient-text">Playground</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                3 scenarios exploring observability for AI agents in production.
                Toggle logging, tracing, metrics, and alerting to see how they
                improve your ability to debug and fix production issues.
              </p>
            </div>
          </div>
        </header>

        <PlaygroundClient scenarios={observabilityScenarios} />
      </div>
    </main>
  );
}
