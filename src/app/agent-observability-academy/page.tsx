import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { chapters } from "@/lib/agent-observability-data";
import { WhatIsObservability } from "@/components/agent-observability/what-is-observability";
import { TracingFundamentals } from "@/components/agent-observability/tracing-fundamentals";
import { StructuredLogging } from "@/components/agent-observability/structured-logging";
import { MetricsKpis } from "@/components/agent-observability/metrics-kpis";
import { DebuggingFailures } from "@/components/agent-observability/debugging-failures";
import { ObservabilityTools } from "@/components/agent-observability/observability-tools";
import { Dashboards } from "@/components/agent-observability/dashboards";
import { ProductionMonitoring } from "@/components/agent-observability/production-monitoring";
import { CostTracking } from "@/components/agent-observability/cost-tracking";
import { InteractiveExamples } from "@/components/agent-observability/interactive-examples";
import { AntiPatterns } from "@/components/agent-observability/anti-patterns";
import { BestPractices } from "@/components/agent-observability/best-practices";
import { ResourcesSection } from "@/components/agent-observability/resources-section";
import { ReadingProgress } from "@/components/reading-progress";
import { BackToTop } from "@/components/back-to-top";
import {
  ArrowRight,
  BookOpen,
  Code2,
  AlertTriangle,
  Link as LinkIcon,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Agent Observability Academy: The Complete Guide",
  description:
    "Master tracing, debugging, and monitoring AI agents in production. 13 chapters covering structured logging, metrics, dashboards, cost tracking, and production monitoring — with interactive code examples.",
};

const chapterComponents: Record<string, React.ComponentType> = {
  "what-is-observability": WhatIsObservability,
  "tracing-fundamentals": TracingFundamentals,
  "structured-logging": StructuredLogging,
  "metrics-kpis": MetricsKpis,
  "debugging-failures": DebuggingFailures,
  "observability-tools": ObservabilityTools,
  dashboards: Dashboards,
  "production-monitoring": ProductionMonitoring,
  "cost-tracking": CostTracking,
  "interactive-examples": InteractiveExamples,
  "anti-patterns": AntiPatterns,
  "best-practices": BestPractices,
  resources: ResourcesSection,
};

export default function AgentObservabilityPage() {
  return (
    <>
      <ReadingProgress />
      <Nav
        chapters={chapters.map((c) => ({
          id: c.id,
          number: c.number,
          title: c.title,
        }))}
        title="Agent Observability"
        playgroundHref="/agent-observability-academy/playground"
      />
      <main className="lg:pl-72">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Hero */}
          <header className="pt-16 pb-16 border-b border-border/50 hero-glow">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary/60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs font-medium text-primary">
                  The Complete Guide — 2025 Edition
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                Agent
                <br />
                <span className="gradient-text">Observability</span>
                <br />
                <span className="text-muted-foreground">Academy</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                You can&apos;t fix what you can&apos;t see. Learn how to trace,
                debug, and monitor AI agents in production — from structured
                logging to real-time dashboards and cost tracking.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#what-is-observability"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#interactive-examples"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  Code Examples
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  13 Chapters
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <Code2 className="w-3.5 h-3.5" />
                  7 Code Examples
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  6 Anti-Patterns
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <LinkIcon className="w-3.5 h-3.5" />
                  10 Resources
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <Eye className="w-3.5 h-3.5" />
                  6 Tool Comparisons
                </span>
              </div>
            </div>
          </header>

          {/* Chapters */}
          {chapters.map((chapter) => {
            const Component = chapterComponents[chapter.id];
            return (
              <Section
                key={chapter.id}
                id={chapter.id}
                number={chapter.number}
                title={chapter.title}
                subtitle={chapter.subtitle}
              >
                {Component ? <Component /> : null}
              </Section>
            );
          })}

          {/* Footer */}
          <footer className="py-16 border-t border-border/50">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold tracking-tight">
                    Agent Observability Academy
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Built to learn, built to reference. Agent observability is
                    the foundation of reliable AI systems in production.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Links
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      All Academies
                    </Link>
                    <a
                      href="#interactive-examples"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Code Examples
                    </a>
                    <a
                      href="#anti-patterns"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Anti-Patterns
                    </a>
                    <a
                      href="#best-practices"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Best Practices
                    </a>
                    <a
                      href="#resources"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Resources
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-xs text-muted-foreground/60">
                  Sources: Honeycomb, LangChain, Anthropic, Arize AI, Langfuse,
                  OpenTelemetry, and the AI engineering community.
                </p>
                <p className="text-xs text-muted-foreground/40">
                  Built with Next.js, TypeScript & Tailwind CSS
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>
      <BackToTop />
    </>
  );
}
