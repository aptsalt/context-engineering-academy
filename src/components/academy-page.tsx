import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Eye,
  ClipboardCheck,
  Database,
  Network,
  Wrench,
  Lock,
  Gamepad2,
} from "lucide-react";
import type { Academy } from "@/lib/academies";

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

export function AcademyPage({ academy }: { academy: Academy }) {
  const isComingSoon = academy.status === "coming-soon";

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
              Context Engineering Academy
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              All Academies
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pt-8 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Academies
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium text-foreground">
            {academy.shortTitle}
          </span>
        </div>

        {/* Header */}
        <header className="pt-8 pb-12 border-b border-border">
          <div className="flex items-start gap-5">
            <div
              className={`flex-shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center ${colorMap[academy.color] ?? colorMap["chart-1"]}`}
            >
              {iconMap[academy.icon]}
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${badgeColorMap[academy.color] ?? badgeColorMap["chart-1"]}`}
                >
                  {academy.modules.length} modules
                </span>
                {academy.hasPlayground && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-border text-foreground/70">
                    + Playground
                  </span>
                )}
                {isComingSoon && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-yellow-500/15 text-yellow-600 border border-yellow-500/40">
                    Coming Soon
                  </span>
                )}
                {academy.status === "live" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-green-500/15 text-green-600 border border-green-500/40">
                    Live
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {academy.title}
              </h1>
              <p className="text-foreground/70 text-lg italic">
                &ldquo;{academy.tagline}&rdquo;
              </p>
              <p className="text-foreground/70 leading-relaxed max-w-2xl">
                {academy.description}
              </p>
            </div>
          </div>
        </header>

        {/* Modules list */}
        <section className="py-12">
          <h2 className="text-lg font-bold tracking-tight mb-6 text-foreground">
            Modules
          </h2>
          <div className="space-y-3">
            {academy.modules.map((mod) => {
              const isLive = academy.status === "live";
              const href = isLive
                ? `/${academy.slug}#${mod.id}`
                : undefined;

              const content = (
                <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/30 transition-all group">
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-xs font-mono font-bold text-foreground/70 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                    {mod.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-foreground/60 mt-0.5">
                      {mod.subtitle}
                    </p>
                  </div>
                  {isComingSoon && (
                    <Lock className="w-4 h-4 text-foreground/30 flex-shrink-0" />
                  )}
                </div>
              );

              if (href) {
                return (
                  <a key={mod.id} href={href}>
                    {content}
                  </a>
                );
              }

              return (
                <div key={mod.id} className="opacity-60 cursor-default">
                  {content}
                </div>
              );
            })}
          </div>

          {/* Playground link */}
          {academy.hasPlayground && (
            <div className="mt-6">
              {academy.status === "live" ? (
                <Link
                  href="/playground"
                  className="flex items-center gap-4 p-5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/15 transition-all group"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-primary">
                      Interactive Playground
                    </h3>
                    <p className="text-xs text-foreground/60 mt-0.5">
                      Practice with 5 hands-on scenarios
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card opacity-50 cursor-default">
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4 text-foreground/40" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground/60">
                      Interactive Playground
                    </h3>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      Coming soon
                    </p>
                  </div>
                  <Lock className="w-4 h-4 text-foreground/30 flex-shrink-0" />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back to all academies
            </Link>
            <p className="text-xs text-muted-foreground/60">
              Built with Next.js, TypeScript & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
