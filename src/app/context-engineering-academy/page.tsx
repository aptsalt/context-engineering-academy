import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { chapters } from "@/lib/data";
import { WhatIsIt } from "@/components/chapters/what-is-it";
import { OsAnalogy } from "@/components/chapters/os-analogy";
import { VsPromptEngineering } from "@/components/chapters/vs-prompt-engineering";
import { CoreComponents } from "@/components/chapters/core-components";
import { FourStrategies } from "@/components/chapters/four-strategies";
import { Techniques } from "@/components/chapters/techniques";
import { AntiPatterns } from "@/components/chapters/anti-patterns";
import { InteractiveExamples } from "@/components/chapters/interactive-examples";
import { BestPractices } from "@/components/chapters/best-practices";
import { ResourcesSection } from "@/components/chapters/resources-section";
import { PlaygroundTeaser } from "@/components/chapters/playground-teaser";
import { ReadingProgress } from "@/components/reading-progress";
import { BackToTop } from "@/components/back-to-top";
import {
  ArrowRight,
  BookOpen,
  Code2,
  AlertTriangle,
  Link as LinkIcon,
  Gamepad2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Context Engineering: The Complete Guide",
  description:
    "Master the art and science of context engineering for LLMs and AI agents. 11 chapters, 7 interactive code examples, 6 anti-patterns, and a hands-on playground.",
};

const chapterComponents: Record<string, React.ComponentType> = {
  "what-is-it": WhatIsIt,
  "os-analogy": OsAnalogy,
  "vs-prompt-engineering": VsPromptEngineering,
  "core-components": CoreComponents,
  "four-strategies": FourStrategies,
  techniques: Techniques,
  "anti-patterns": AntiPatterns,
  "interactive-examples": InteractiveExamples,
  "best-practices": BestPractices,
  resources: ResourcesSection,
  playground: PlaygroundTeaser,
};

export default function CoursePage() {
  return (
    <>
      <ReadingProgress />
      <Nav
        chapters={chapters.map((c) => ({ id: c.id, number: c.number, title: c.title }))}
        title="Context Engineering"
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
                Context
                <br />
                <span className="gradient-text">Engineering</span>
                <br />
                <span className="text-muted-foreground">Academy</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Master the art and science of filling the context window with
                just the right information. From fundamentals to production
                patterns — with interactive code examples.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Try the Playground
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#what-is-it"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  Start Learning
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  11 Chapters
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
                  10+ Resources
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Interactive Playground
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
                    Context Engineering Academy
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Built to learn, built to reference. Context engineering is
                    the core discipline of building reliable AI systems.
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
                      href="/playground"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Interactive Playground
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
                  Sources: Anthropic, LangChain, Andrej Karpathy, Tobi Lutke,
                  Gartner, arXiv, and the AI engineering community.
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
