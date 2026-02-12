import Link from "next/link";
import {
  BookOpen,
  Brain,
  Eye,
  ClipboardCheck,
  Database,
  Network,
  Wrench,
  ArrowRight,
  Sparkles,
  Play,
  Building2,
  GitBranch,
  Layers,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { academies } from "@/lib/academies";

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="w-6 h-6" />,
  eye: <Eye className="w-6 h-6" />,
  "clipboard-check": <ClipboardCheck className="w-6 h-6" />,
  database: <Database className="w-6 h-6" />,
  network: <Network className="w-6 h-6" />,
  wrench: <Wrench className="w-6 h-6" />,
};

const colorMap: Record<string, string> = {
  "chart-1": "bg-chart-1/15 text-chart-1 border-chart-1/30",
  "chart-2": "bg-chart-2/15 text-chart-2 border-chart-2/30",
  "chart-3": "bg-chart-3/15 text-chart-3 border-chart-3/30",
  "chart-4": "bg-chart-4/15 text-chart-4 border-chart-4/30",
  "chart-5": "bg-chart-5/15 text-chart-5 border-chart-5/30",
};

const badgeColorMap: Record<string, string> = {
  "chart-1": "bg-chart-1/20 text-chart-1 border-chart-1/40",
  "chart-2": "bg-chart-2/20 text-chart-2 border-chart-2/40",
  "chart-3": "bg-chart-3/20 text-chart-3 border-chart-3/40",
  "chart-4": "bg-chart-4/20 text-chart-4 border-chart-4/40",
  "chart-5": "bg-chart-5/20 text-chart-5 border-chart-5/40",
};

const borderColorMap: Record<string, string> = {
  "chart-1": "border-chart-1/25 hover:border-chart-1/45",
  "chart-2": "border-chart-2/25 hover:border-chart-2/45",
  "chart-3": "border-chart-3/25 hover:border-chart-3/45",
  "chart-4": "border-chart-4/25 hover:border-chart-4/45",
  "chart-5": "border-chart-5/25 hover:border-chart-5/45",
};

const playgroundBtnMap: Record<string, string> = {
  "chart-1": "bg-chart-1/15 text-chart-1 border-chart-1/30 hover:bg-chart-1/25 hover:border-chart-1/50",
  "chart-2": "bg-chart-2/15 text-chart-2 border-chart-2/30 hover:bg-chart-2/25 hover:border-chart-2/50",
  "chart-3": "bg-chart-3/15 text-chart-3 border-chart-3/30 hover:bg-chart-3/25 hover:border-chart-3/50",
  "chart-4": "bg-chart-4/15 text-chart-4 border-chart-4/30 hover:bg-chart-4/25 hover:border-chart-4/50",
  "chart-5": "bg-chart-5/15 text-chart-5 border-chart-5/30 hover:bg-chart-5/25 hover:border-chart-5/50",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Top navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              LLM/Agent Engineering Academy
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="#academies"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Academies
            </a>
            <a
              href="#enterprise"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Enterprise
            </a>
            <a
              href="https://github.com/aptsalt/context-engineering-academy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Hero */}
        <header className="pt-16 md:pt-12 pb-12 hero-glow">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary/60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-medium text-primary">
                Free & Open Source — 6 Academies
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              LLM/Agent Engineering{" "}
              <span className="gradient-text">Academy</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Master every layer of the AI agent stack. Six focused academies
              covering context engineering, observability, evals, RAG,
              multi-agent orchestration, and tool design — each with modules and
              interactive playgrounds.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#academies"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Academies
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        {/* Academies grid */}
        <section id="academies" className="pb-24 scroll-mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Academies</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose an academy to start learning
              </p>
            </div>
            <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full border border-border bg-muted/30">
              {academies.length} academies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {academies.map((academy) => (
              <div
                key={academy.slug}
                className={`group relative rounded-2xl border bg-card p-7 shadow-sm hover:shadow-md transition-all duration-200 ${borderColorMap[academy.color] ?? "border-border"}`}
              >
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  {academy.status === "live" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-600/10 text-green-700 border border-green-600/25">
                      <Sparkles className="w-3 h-3" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-600/10 text-yellow-700 border border-yellow-600/25">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorMap[academy.color] ?? colorMap["chart-1"]}`}
                  >
                    {iconMap[academy.icon]}
                  </div>

                  {/* Title — clickable link to academy */}
                  <div>
                    <Link
                      href={`/${academy.slug}`}
                      className="font-bold text-base tracking-tight text-foreground hover:text-primary transition-colors inline-block"
                    >
                      {academy.shortTitle}
                      <ArrowRight className="w-3.5 h-3.5 inline ml-1.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                    </Link>
                    <p className="text-sm text-foreground/70 mt-1 italic">
                      &ldquo;{academy.tagline}&rdquo;
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                    {academy.description}
                  </p>

                  {/* Meta — modules badge + playground button */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <Link
                      href={`/${academy.slug}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all active:scale-95 hover:opacity-80 ${badgeColorMap[academy.color] ?? badgeColorMap["chart-1"]}`}
                    >
                      <BookOpen className="w-3 h-3" />
                      {academy.modules.length} Modules
                    </Link>
                    {academy.hasPlayground && (
                      <Link
                        href={`/${academy.slug}/playground`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all active:scale-95 ${playgroundBtnMap[academy.color] ?? playgroundBtnMap["chart-1"]}`}
                      >
                        <Play className="w-3 h-3" />
                        Playground
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enterprise Section */}
        <section id="enterprise" className="pb-24 scroll-mt-12">
          <div className="rounded-3xl border border-primary/15 bg-card shadow-sm p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Enterprise Edition
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] mb-3">
                Your codebase.{" "}
                <span className="gradient-text">Your examples.</span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Every enterprise spends separately on AI upskilling and internal
                onboarding. We merge them. Your engineers learn context
                engineering, RAG, evals, and agent patterns — using your actual
                codebase, products, and production incidents as the examples.
              </p>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="rounded-xl border border-border bg-background/50 p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-chart-1/15 border border-chart-1/25 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-chart-1" />
                </div>
                <h3 className="font-bold text-sm">1. Connect Your Repo</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Point the API at your GitHub org, internal docs, support
                  tickets, and incident reports. We ingest and index everything.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background/50 p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-chart-2/15 border border-chart-2/25 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-chart-2" />
                </div>
                <h3 className="font-bold text-sm">2. Auto-Contextualize</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every module&apos;s code examples, playground scenarios, and
                  anti-patterns are regenerated using your domain. Generic
                  becomes specific.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background/50 p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-chart-4/15 border border-chart-4/25 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-chart-4" />
                </div>
                <h3 className="font-bold text-sm">3. Track & Measure</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dashboard for team progress, skill gaps, and ROI. Your
                  engineers learn AI patterns AND your product domain
                  simultaneously.
                </p>
              </div>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                {
                  icon: <Zap className="w-4 h-4" />,
                  title: "2x ROI",
                  desc: "One program replaces separate AI training + internal onboarding",
                },
                {
                  icon: <Shield className="w-4 h-4" />,
                  title: "Self-hosted",
                  desc: "Your code never leaves your infrastructure",
                },
                {
                  icon: <GitBranch className="w-4 h-4" />,
                  title: "API-first",
                  desc: "Embed in your existing LMS or run standalone",
                },
                {
                  icon: <Building2 className="w-4 h-4" />,
                  title: "Open core",
                  desc: "Free academy forever. Enterprise features for teams",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/30 p-4"
                >
                  <div className="mt-0.5 text-primary">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/aptsalt/context-engineering-academy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Star on GitHub
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#academies"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Try the Free Academy
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold tracking-tight">
                LLM/Agent Engineering Academy
              </p>
              <p className="text-xs text-muted-foreground">
                Sources: Anthropic, LangChain, Andrej Karpathy, Tobi Lutke,
                Gartner, arXiv, and the AI engineering community.
              </p>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Built with Next.js, TypeScript & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
