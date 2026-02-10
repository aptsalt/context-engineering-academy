"use client";

import { FadeIn } from "@/components/fade-in";

export function Section({
  id,
  number,
  title,
  subtitle,
  children,
}: {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 py-16 border-b border-border/50">
      <FadeIn>
        <div className="flex items-start gap-4 mb-8">
          <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
            {number}
          </span>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={100}>
        {children}
      </FadeIn>
    </section>
  );
}
