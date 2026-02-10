"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  label: string;
}

export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 600;
    const startScore = animatedScore;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startScore + (score - startScore) * eased);
      setAnimatedScore(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 90) return { stroke: "#22c55e", text: "text-green-600", bg: "text-green-500/20" };
    if (s >= 70) return { stroke: "#10b981", text: "text-emerald-600", bg: "text-emerald-500/20" };
    if (s >= 50) return { stroke: "#eab308", text: "text-yellow-600", bg: "text-yellow-500/20" };
    if (s >= 30) return { stroke: "#f97316", text: "text-orange-600", bg: "text-orange-500/20" };
    return { stroke: "#ef4444", text: "text-red-600", bg: "text-red-500/20" };
  };

  const getScoreLabel = (s: number) => {
    if (s >= 90) return "Excellent";
    if (s >= 70) return "Good";
    if (s >= 50) return "Fair";
    if (s >= 30) return "Poor";
    return "Broken";
  };

  const colors = getColor(animatedScore);

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted/30"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold font-mono ${colors.text}`}>
            {animatedScore}
          </span>
          <span className="text-[9px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className={`text-sm font-semibold ${colors.text}`}>
          {getScoreLabel(animatedScore)}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
