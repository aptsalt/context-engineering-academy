import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { ragChapters } from "@/lib/agentic-rag-data";
import { RagFundamentals } from "@/components/agentic-rag/rag-fundamentals";
import { Chunking } from "@/components/agentic-rag/chunking";
import { Embeddings } from "@/components/agentic-rag/embeddings";
import { RetrievalStrategies } from "@/components/agentic-rag/retrieval-strategies";
import { AgenticPatterns } from "@/components/agentic-rag/agentic-patterns";
import { QueryRouting } from "@/components/agentic-rag/query-routing";
import { RagEvaluation } from "@/components/agentic-rag/rag-evaluation";
import { ProductionRag } from "@/components/agentic-rag/production-rag";
import { AdvancedPatterns } from "@/components/agentic-rag/advanced-patterns";
import { RagAntiPatterns } from "@/components/agentic-rag/anti-patterns";
import { RagInteractiveExamples } from "@/components/agentic-rag/interactive-examples";
import { RagBestPractices } from "@/components/agentic-rag/best-practices";
import { RagResourcesSection } from "@/components/agentic-rag/resources-section";
import { ReadingProgress } from "@/components/reading-progress";
import { BackToTop } from "@/components/back-to-top";
import {
  ArrowRight,
  BookOpen,
  Code2,
  AlertTriangle,
  Link as LinkIcon,
  Database,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Agentic RAG Academy: The Complete Guide",
  description:
    "Go beyond naive RAG. 13 chapters covering fundamentals, chunking, embeddings, retrieval, agentic patterns, evaluation, and production architecture — with interactive code examples.",
};

const chapterComponents: Record<string, React.ComponentType> = {
  "rag-fundamentals": RagFundamentals,
  chunking: Chunking,
  embeddings: Embeddings,
  "retrieval-strategies": RetrievalStrategies,
  "agentic-patterns": AgenticPatterns,
  "query-routing": QueryRouting,
  "rag-evaluation": RagEvaluation,
  "production-rag": ProductionRag,
  "advanced-patterns": AdvancedPatterns,
  "rag-anti-patterns": RagAntiPatterns,
  "rag-interactive-examples": RagInteractiveExamples,
  "rag-best-practices": RagBestPractices,
  "rag-resources": RagResourcesSection,
};

export default function AgenticRagAcademyPage() {
  return (
    <>
      <ReadingProgress />
      <Nav
        chapters={ragChapters.map((c) => ({
          id: c.id,
          number: c.number,
          title: c.title,
        }))}
        title="Agentic RAG"
        playgroundHref="/agentic-rag-academy/playground"
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
                Agentic
                <br />
                <span className="gradient-text">RAG</span>
                <br />
                <span className="text-muted-foreground">Academy</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Go beyond naive RAG. Master agentic retrieval patterns — from
                chunking and embeddings to self-correcting retrieval, query
                planning, and production-grade architecture.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#rag-fundamentals"
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
                  <Database className="w-3.5 h-3.5" />
                  5 Vector DB Comparisons
                </span>
              </div>
            </div>
          </header>

          {/* Chapters */}
          {ragChapters.map((chapter) => {
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
                    Agentic RAG Academy
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Built to learn, built to reference. Agentic RAG is the
                    bridge between knowledge stored in documents and reliable
                    AI-generated answers.
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
                      href="#rag-interactive-examples"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Code Examples
                    </a>
                    <a
                      href="#rag-best-practices"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Best Practices
                    </a>
                    <a
                      href="#rag-resources"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Resources
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-xs text-muted-foreground/60">
                  Sources: LlamaIndex, LangChain, Pinecone, Weaviate, arXiv
                  (Self-RAG, CRAG, RAGAS, RAPTOR, Graph RAG), and the RAG
                  engineering community.
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
