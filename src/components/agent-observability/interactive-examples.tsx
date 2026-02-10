"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { codeExamples } from "@/lib/agent-observability-data";

export function InteractiveExamples() {
  const [activeExample, setActiveExample] = useState(codeExamples[0].id);
  const [showGood, setShowGood] = useState<Record<string, boolean>>({});

  const toggleView = (id: string) => {
    setShowGood((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const current = codeExamples.find((e) => e.id === activeExample) ?? codeExamples[0];

  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          See agent observability in action. Each example shows a{" "}
          <strong className="text-red-600">bad pattern</strong> and its{" "}
          <strong className="text-green-600">observable fix</strong>. Toggle
          between them to understand the difference.
        </p>
      </div>

      {/* Example Selector */}
      <div className="flex flex-wrap gap-2">
        {codeExamples.map((example) => (
          <Button
            key={example.id}
            variant={activeExample === example.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveExample(example.id)}
            className="text-xs"
          >
            {example.title}
          </Button>
        ))}
      </div>

      {/* Active Example */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Badge variant="secondary">{current.category}</Badge>
            {current.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{current.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle Button */}
          <div className="flex items-center gap-3">
            <Button
              variant={!showGood[current.id] ? "default" : "outline"}
              size="sm"
              onClick={() => toggleView(current.id)}
              className={
                !showGood[current.id]
                  ? "bg-red-500/20 text-red-600 hover:bg-red-500/30 border border-red-500/40"
                  : ""
              }
            >
              Bad Pattern
            </Button>
            <Button
              variant={showGood[current.id] ? "default" : "outline"}
              size="sm"
              onClick={() => toggleView(current.id)}
              className={
                showGood[current.id]
                  ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 border border-green-500/40"
                  : ""
              }
            >
              Observable Fix
            </Button>
          </div>

          {/* Code Display */}
          {!showGood[current.id] ? (
            <div className="space-y-3">
              <CodeBlock
                code={current.bad.code}
                label={current.bad.label}
              />
              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                <p className="text-xs font-semibold text-red-600 mb-1">
                  Why this fails
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.bad.explanation}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <CodeBlock
                code={current.good.code}
                label={current.good.label}
              />
              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                <p className="text-xs font-semibold text-green-600 mb-1">
                  Why this works
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.good.explanation}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference: All Examples */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Examples Quick Reference</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {codeExamples.map((example) => (
            <Card
              key={example.id}
              className={`bg-card/50 cursor-pointer transition-colors hover:border-primary/30 ${
                activeExample === example.id ? "border-primary/50" : ""
              }`}
              onClick={() => {
                setActiveExample(example.id);
                setShowGood((prev) => ({ ...prev, [example.id]: false }));
              }}
            >
              <CardContent className="pt-4 pb-4">
                <Badge variant="outline" className="text-xs mb-2">
                  {example.category}
                </Badge>
                <h4 className="font-semibold text-sm">{example.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {example.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
