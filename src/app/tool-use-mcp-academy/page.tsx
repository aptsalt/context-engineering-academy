import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { chapters } from "@/lib/tool-use-mcp-data";
import { ToolFundamentals } from "@/components/tool-use-mcp/tool-fundamentals";
import { DesigningTools } from "@/components/tool-use-mcp/designing-tools";
import { McpIntro } from "@/components/tool-use-mcp/mcp-intro";
import { BuildingMcpServers } from "@/components/tool-use-mcp/building-mcp-servers";
import { ToolSelection } from "@/components/tool-use-mcp/tool-selection";
import { ErrorHandling } from "@/components/tool-use-mcp/error-handling";
import { Security } from "@/components/tool-use-mcp/security";
import { ProductionTools } from "@/components/tool-use-mcp/production-tools";
import { InteractiveExamples } from "@/components/tool-use-mcp/interactive-examples";
import { ToolAntiPatterns } from "@/components/tool-use-mcp/anti-patterns";
import { ToolBestPractices } from "@/components/tool-use-mcp/best-practices";
import { ToolResourcesSection } from "@/components/tool-use-mcp/resources-section";
import { ReadingProgress } from "@/components/reading-progress";
import { BackToTop } from "@/components/back-to-top";
import {
  ArrowRight,
  BookOpen,
  Code2,
  AlertTriangle,
  Link as LinkIcon,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tool Use & MCP Academy — The Complete Guide",
  description:
    "Master tool design for AI agents and the Model Context Protocol. 12 chapters, 7 interactive code examples, 6 anti-patterns, and production best practices.",
};

const chapterComponents: Record<string, React.ComponentType> = {
  "tool-fundamentals": ToolFundamentals,
  "designing-tools": DesigningTools,
  "mcp-intro": McpIntro,
  "building-mcp-servers": BuildingMcpServers,
  "tool-selection": ToolSelection,
  "error-handling": ErrorHandling,
  security: Security,
  "production-tools": ProductionTools,
  "interactive-examples": InteractiveExamples,
  "anti-patterns": ToolAntiPatterns,
  "best-practices": ToolBestPractices,
  resources: ToolResourcesSection,
};

export default function ToolUseMcpAcademyPage() {
  return (
    <>
      <ReadingProgress />
      <Nav
        chapters={chapters.map((c) => ({
          id: c.id,
          number: c.number,
          title: c.title,
        }))}
        title="Tool Use & MCP"
        playgroundHref="/tool-use-mcp-academy/playground"
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
                  The Complete Guide — Tool Use & MCP
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                Tool Use
                <br />
                <span className="gradient-text">&amp; MCP</span>
                <br />
                <span className="text-muted-foreground">Academy</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Master tool design for AI agents and the Model Context Protocol.
                From function calling fundamentals to production MCP servers —
                give your agents the tools they need to act in the real world.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#tool-fundamentals"
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
                  <LinkIcon className="w-3.5 h-3.5" />
                  10 Resources
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <Wrench className="w-3.5 h-3.5" />
                  MCP Server Guide
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
                    Tool Use & MCP Academy
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Built to learn, built to reference. Tools are what give AI
                    agents the ability to act in the real world — design them
                    well.
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
                  Sources: Anthropic, MCP Specification, Claude Tool Use Docs,
                  LangChain, OpenAI, UC Berkeley Gorilla, and the AI engineering
                  community.
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
