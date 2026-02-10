import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { multiAgentChapters } from "@/lib/multi-agent-data";
import { WhenMultiAgent } from "@/components/multi-agent/when-multi-agent";
import { OrchestrationPatterns } from "@/components/multi-agent/orchestration-patterns";
import { AgentCommunication } from "@/components/multi-agent/agent-communication";
import { SharedMemory } from "@/components/multi-agent/shared-memory";
import { TaskDecomposition } from "@/components/multi-agent/task-decomposition";
import { ErrorRecovery } from "@/components/multi-agent/error-recovery";
import { Frameworks } from "@/components/multi-agent/frameworks";
import { ProductionPatterns } from "@/components/multi-agent/production-patterns";
import { MultiAgentInteractiveExamples } from "@/components/multi-agent/interactive-examples";
import { MultiAgentAntiPatterns } from "@/components/multi-agent/anti-patterns";
import { MultiAgentBestPractices } from "@/components/multi-agent/best-practices";
import { MultiAgentResourcesSection } from "@/components/multi-agent/resources-section";
import { ReadingProgress } from "@/components/reading-progress";
import { BackToTop } from "@/components/back-to-top";
import {
  ArrowRight,
  BookOpen,
  Code2,
  AlertTriangle,
  Link as LinkIcon,
  Network,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Multi-Agent Orchestration: The Complete Guide",
  description:
    "Design, build, and orchestrate teams of specialized AI agents. 12 chapters, 7 interactive code examples, 6 anti-patterns, and production-ready patterns for multi-agent systems.",
};

const chapterComponents: Record<string, React.ComponentType> = {
  "when-multi-agent": WhenMultiAgent,
  "orchestration-patterns": OrchestrationPatterns,
  "agent-communication": AgentCommunication,
  "shared-memory": SharedMemory,
  "task-decomposition": TaskDecomposition,
  "error-recovery": ErrorRecovery,
  frameworks: Frameworks,
  "production-patterns": ProductionPatterns,
  "interactive-examples": MultiAgentInteractiveExamples,
  "anti-patterns": MultiAgentAntiPatterns,
  "best-practices": MultiAgentBestPractices,
  resources: MultiAgentResourcesSection,
};

export default function MultiAgentAcademyPage() {
  return (
    <>
      <ReadingProgress />
      <Nav
        chapters={multiAgentChapters.map((c) => ({ id: c.id, number: c.number, title: c.title }))}
        title="Multi-Agent Orchestration"
        playgroundHref="/multi-agent-orchestration-academy/playground"
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
                Multi-Agent
                <br />
                <span className="gradient-text">Orchestration</span>
                <br />
                <span className="text-muted-foreground">Academy</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Design, build, and orchestrate teams of specialized AI agents.
                From single-agent limits to production-grade multi-agent
                architectures — with interactive code examples.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#when-multi-agent"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  All Academies
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  12 Chapters
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
                  <Network className="w-3.5 h-3.5" />
                  5 Orchestration Patterns
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  5 Frameworks Compared
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <LinkIcon className="w-3.5 h-3.5" />
                  10 Resources
                </span>
              </div>
            </div>
          </header>

          {/* Chapters */}
          {multiAgentChapters.map((chapter) => {
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
                    Multi-Agent Orchestration Academy
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Built to learn, built to reference. Multi-agent orchestration
                    is the next evolution in building reliable AI systems — from
                    single agents to coordinated teams.
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
                    <Link
                      href="/context-engineering-academy"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Context Engineering Academy
                    </Link>
                    <a
                      href="#interactive-examples"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Code Examples
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
                  Sources: Anthropic, LangChain, CrewAI, Microsoft Research,
                  OpenAI, Andrew Ng, and the AI engineering community.
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
