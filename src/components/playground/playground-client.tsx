"use client";

import { useState } from "react";
import { ScenarioSelector } from "@/components/playground/scenario-selector";
import { ContextPlayground } from "@/components/playground/context-playground";
import type { PlaygroundScenario, ScenarioMeta } from "@/lib/playground-data";
import {
  User,
  Package,
  CreditCard,
  Code,
  FileText,
  Search,
  PenTool,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

const iconMap = {
  User,
  Package,
  CreditCard,
  Code,
  FileText,
  Search,
  PenTool,
  AlertTriangle,
} as const;

function ScenarioCard({ meta }: { meta: ScenarioMeta }) {
  return (
    <div className="mb-8 rounded-xl border border-border/50 bg-card/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">{meta.title}</h2>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {meta.description}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {meta.infoCards.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <div
              key={card.label}
              className="flex items-center gap-2.5 rounded-lg bg-muted/30 px-3 py-2"
            >
              <Icon className="w-3.5 h-3.5 text-primary/60 shrink-0" />
              <div>
                <p className="text-xs font-medium">{card.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PlaygroundClientProps {
  scenarios: PlaygroundScenario[];
}

export function PlaygroundClient({ scenarios }: PlaygroundClientProps) {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) ?? scenarios[0];

  return (
    <>
      <ScenarioSelector
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelect={setActiveScenarioId}
      />
      <ScenarioCard meta={activeScenario.meta} />
      <ContextPlayground scenario={activeScenario} />
    </>
  );
}
