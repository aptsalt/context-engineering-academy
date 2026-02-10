import type { Metadata } from "next";
import Link from "next/link";
import { PlaygroundClient } from "@/components/playground/playground-client";
import { ragScenarios } from "@/lib/scenarios/rag";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Agentic RAG Playground",
  description:
    "Interactive playground with 3 RAG scenarios. Toggle chunking, embeddings, reranking, and more to see how each component improves retrieval quality and answer accuracy.",
};

export default function AgenticRagPlaygroundPage() {
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
            href="/agentic-rag-academy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Agentic RAG
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-medium">Playground</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
              RAG
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Agentic RAG{" "}
                <span className="gradient-text">Playground</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                3 scenarios exploring RAG pipeline components. Toggle chunking,
                embeddings, reranking, and more to see how each component
                improves retrieval quality.
              </p>
            </div>
          </div>
        </header>

        <PlaygroundClient scenarios={ragScenarios} />
      </div>
    </main>
  );
}
