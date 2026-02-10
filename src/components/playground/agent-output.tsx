"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "@/components/playground/score-gauge";
import type { PlaygroundResponse } from "@/lib/playground-data";

interface AgentOutputProps {
  response: PlaygroundResponse;
  customerMessage: string;
  inputLabel?: string;
}

function TypewriterText({ text, speed = 8 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const prevText = useRef(text);

  useEffect(() => {
    if (text === prevText.current && displayed === text) return;
    prevText.current = text;
    setDisplayed("");
    setIsComplete(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return (
    <span>
      {displayed.split(/(\[.*?\])/).map((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <span
              key={index}
              className="inline-block bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5 text-xs font-mono text-red-600 my-1"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
      {!isComplete && <span className="typewriter-cursor" />}
    </span>
  );
}

export function AgentOutput({ response, customerMessage, inputLabel = "Customer" }: AgentOutputProps) {
  return (
    <div className="space-y-4">
      {/* Score Gauge + Label */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <ScoreGauge score={response.score} label={response.label} />
        <Badge variant="outline" className="text-xs h-fit">
          {response.requiredComponents.length === 0
            ? "No components"
            : `${response.requiredComponents.length} component${response.requiredComponents.length > 1 ? "s" : ""}`}
        </Badge>
      </div>

      {/* Chat bubbles */}
      <div className="space-y-3">
        {/* Customer message */}
        <div className="flex justify-end">
          <div className="max-w-[85%] bg-blue-500/20 border border-blue-500/40 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-xs font-semibold text-blue-600 mb-1">{inputLabel}</p>
            <p className="text-sm leading-relaxed">{customerMessage}</p>
          </div>
        </div>

        {/* Agent response */}
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold text-primary">AI Agent</p>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                {response.label}
              </Badge>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              <TypewriterText text={response.agentResponse} />
            </div>
          </div>
        </div>
      </div>

      {/* Issues & Strengths */}
      <div className="grid gap-3 md:grid-cols-2">
        {response.issues.length > 0 && (
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="py-3 px-4">
              <p className="text-xs font-semibold text-red-600 mb-2">
                Issues ({response.issues.length})
              </p>
              <ul className="space-y-1">
                {response.issues.map((issue, index) => (
                  <li
                    key={index}
                    className="text-xs text-muted-foreground flex items-start gap-1.5"
                  >
                    <span className="text-red-600 mt-0.5 shrink-0">&times;</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {response.strengths.length > 0 && (
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="py-3 px-4">
              <p className="text-xs font-semibold text-green-600 mb-2">
                Strengths ({response.strengths.length})
              </p>
              <ul className="space-y-1">
                {response.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="text-xs text-muted-foreground flex items-start gap-1.5"
                  >
                    <span className="text-green-600 mt-0.5 shrink-0">&check;</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
