"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export interface NavChapter {
  id: string;
  number: number;
  title: string;
}

interface NavProps {
  chapters: NavChapter[];
  title: string;
  subtitle?: string;
  playgroundHref?: string;
}

export function Nav({
  chapters,
  title,
  subtitle = "Academy — Home",
  playgroundHref = "/playground",
}: NavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            setVisitedSections((prev) => {
              const next = new Set(prev);
              next.add(entry.target.id);
              return next;
            });
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const chapter of chapters) {
      const el = document.getElementById(chapter.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [chapters]);

  const navigateChapter = useCallback(
    (direction: "next" | "prev") => {
      const currentIndex = chapters.findIndex((c) => c.id === activeSection);
      const nextIndex =
        direction === "next"
          ? Math.min(currentIndex + 1, chapters.length - 1)
          : Math.max(currentIndex - 1, 0);
      const target = document.getElementById(chapters[nextIndex].id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [activeSection, chapters],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        navigateChapter("next");
      } else if (e.key === "k" || e.key === "ArrowUp") {
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        navigateChapter("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateChapter]);

  const progressPct = Math.round((visitedSections.size / chapters.length) * 100);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          {mobileOpen ? (
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          ) : (
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {/* Sidebar nav */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 bg-card/95 backdrop-blur-md border-r border-border z-40 overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <Link href="/" className="block">
            <h2 className="text-lg font-bold tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </Link>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Progress
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {progressPct}%
            </span>
          </div>
          <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="px-3 pb-4 space-y-0.5">
          {chapters.map((chapter) => {
            const isActive = activeSection === chapter.id;
            const isVisited = visitedSections.has(chapter.id);
            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : isVisited
                      ? "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : isVisited
                        ? "bg-muted text-foreground/70"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isVisited && !isActive ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  ) : (
                    chapter.number
                  )}
                </span>
                <span className="truncate">{chapter.title}</span>
              </a>
            );
          })}
        </div>

        {/* Playground link */}
        {playgroundHref && (
          <div className="px-3 pb-4">
            <Link
              href={playgroundHref}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary/80 hover:text-primary hover:bg-primary/5 transition-colors border border-primary/10 hover:border-primary/20"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="font-medium">Open Playground</span>
            </Link>
          </div>
        )}

        {/* Keyboard shortcut hint */}
        <div className="px-6 pb-6">
          <p className="text-[10px] text-muted-foreground/50">
            Press <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">J</kbd> / <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">K</kbd> to navigate
          </p>
        </div>
      </nav>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
