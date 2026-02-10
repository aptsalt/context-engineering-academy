"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ContextTogglePanel } from "@/components/playground/context-toggle-panel";
import { TokenCounter } from "@/components/playground/token-counter";
import { AgentOutput } from "@/components/playground/agent-output";
import { ContextWindowPreview } from "@/components/playground/context-window-preview";
import { AssemblyPipeline } from "@/components/playground/assembly-pipeline";
import { PrinciplesPanel } from "@/components/playground/principles-panel";
import { findBestResponse } from "@/lib/playground-data";
import type { PlaygroundScenario } from "@/lib/playground-data";
import { RotateCcw, Zap, Play } from "lucide-react";

interface ContextPlaygroundProps {
  scenario: PlaygroundScenario;
}

export function ContextPlayground({ scenario }: ContextPlaygroundProps) {
  const [enabledComponents, setEnabledComponents] = useState<Set<string>>(
    new Set(),
  );
  const [activeTab, setActiveTab] = useState<"output" | "context" | "pipeline" | "principles">(
    "output",
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevScenarioId = useRef(scenario.id);

  useEffect(() => {
    if (prevScenarioId.current !== scenario.id) {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      setIsAnimating(false);
      setEnabledComponents(new Set());
      setActiveTab("output");
      prevScenarioId.current = scenario.id;
    }
  }, [scenario.id]);

  const handleToggle = useCallback((id: string) => {
    setEnabledComponents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleStartEmpty = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    setEnabledComponents(new Set());
  }, []);

  const handleEnableAll = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    setEnabledComponents(new Set(scenario.recommendedBuildOrder));
  }, [scenario.recommendedBuildOrder]);

  const handleBuildOrder = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }

    setEnabledComponents(new Set());
    setActiveTab("output");
    setIsAnimating(true);

    let step = 0;
    const addNext = () => {
      if (step < scenario.recommendedBuildOrder.length) {
        const componentId = scenario.recommendedBuildOrder[step];
        setEnabledComponents((prev) => {
          const next = new Set(prev);
          next.add(componentId);
          return next;
        });
        step++;
        animationRef.current = setTimeout(addNext, 800);
      } else {
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = setTimeout(addNext, 400);
  }, [scenario.recommendedBuildOrder]);

  const response = findBestResponse(enabledComponents, scenario.responses);

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartEmpty}
          disabled={isAnimating}
          className="gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEnableAll}
          disabled={isAnimating}
          className="gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          Enable All
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleBuildOrder}
          disabled={isAnimating}
          className="gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          {isAnimating ? "Building..." : "Recommended Build Order"}
        </Button>
      </div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left panel */}
        <div className="space-y-6">
          <TokenCounter
            components={scenario.components}
            enabledComponents={enabledComponents}
          />
          <ContextTogglePanel
            components={scenario.components}
            enabledComponents={enabledComponents}
            onToggle={handleToggle}
          />
        </div>

        {/* Right panel */}
        <div>
          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as "output" | "context" | "pipeline" | "principles")
            }
          >
            <TabsList>
              <TabsTrigger value="output">Agent Output</TabsTrigger>
              <TabsTrigger value="context">Context Window</TabsTrigger>
              <TabsTrigger value="pipeline">Assembly Pipeline</TabsTrigger>
              <TabsTrigger value="principles">Principles</TabsTrigger>
            </TabsList>

            <TabsContent value="output" className="mt-4">
              <AgentOutput
                response={response}
                customerMessage={scenario.customerMessage}
                inputLabel={scenario.inputLabel}
              />
            </TabsContent>

            <TabsContent value="context" className="mt-4">
              <ContextWindowPreview
                components={scenario.components}
                enabledComponents={enabledComponents}
                customerMessage={scenario.customerMessage}
              />
            </TabsContent>

            <TabsContent value="pipeline" className="mt-4">
              <AssemblyPipeline
                components={scenario.components}
                enabledComponents={enabledComponents}
              />
            </TabsContent>

            <TabsContent value="principles" className="mt-4">
              <PrinciplesPanel
                principles={scenario.principles}
                components={scenario.components}
                enabledComponents={enabledComponents}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
