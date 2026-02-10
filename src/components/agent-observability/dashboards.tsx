import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const dashboardRows = [
  {
    name: "Health & Availability",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "The first row every engineer looks at. Answers: 'Is the agent working right now?' If any panel is red, investigate immediately.",
    panels: [
      {
        title: "Request Rate (RPM)",
        query: "rate(agent.requests[5m])",
        why: "A sudden drop means something is broken upstream. A spike means unexpected traffic or a retry storm.",
        alertRule: "< 50% of baseline for 5 minutes",
      },
      {
        title: "Error Rate by Type",
        query: "rate(agent.errors[5m]) by (error_type)",
        why: "Not just 'errors happened' but which type: rate limits, timeouts, tool failures, or model errors. Each has a different fix.",
        alertRule: "> 5% error rate sustained for 10 minutes",
      },
      {
        title: "Latency Distribution (p50/p95/p99)",
        query: "histogram_quantile([0.5, 0.95, 0.99], agent.latency)",
        why: "p50 tells you the typical experience. p99 tells you the worst experience. If p99 diverges from p50, you have outlier issues.",
        alertRule: "p99 > 15s for 10 minutes",
      },
      {
        title: "Active Agent Sessions",
        query: "count(active_sessions)",
        why: "Track concurrency. If sessions spike, you may hit rate limits or exhaust your API quota.",
        alertRule: "Informational — no alert needed",
      },
    ],
  },
  {
    name: "Quality & Correctness",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "The hardest row to build but the most important. Answers: 'Are the agent's responses actually good?' Requires eval pipelines on sampled traffic.",
    panels: [
      {
        title: "Tool Call Success Rate by Tool",
        query: "rate(agent.tool_calls{success=true}[5m]) by (tool_name)",
        why: "If one specific tool is failing while others are fine, the problem is localized. Drill down by tool name.",
        alertRule: "Any tool drops below 90% success for 15 minutes",
      },
      {
        title: "Eval-Flagged Hallucination Rate",
        query: "rate(agent.eval{result=hallucination}[1h])",
        why: "Automated evals on sampled production traffic detect hallucinations. A rising rate means the model or context quality is degrading.",
        alertRule: "> 3% hallucination rate over 1 hour",
      },
      {
        title: "Completion Rate",
        query: "rate(agent.completed[5m]) / rate(agent.started[5m])",
        why: "What percentage of requests get a full response? Low completion means early terminations, timeouts, or context window overflows.",
        alertRule: "Below 95% completion rate",
      },
      {
        title: "User Feedback Score",
        query: "avg(agent.user_feedback) by (feature)",
        why: "Thumbs up/down or star ratings from users. The ground truth signal for quality, but sparse and delayed.",
        alertRule: "Trend detection — alert on significant drops",
      },
    ],
  },
  {
    name: "Cost & Efficiency",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Answers: 'How much is the agent costing, and where is the money going?' Essential for budget planning and catching runaway costs before the bill arrives.",
    panels: [
      {
        title: "Cost per Hour by Model",
        query: "sum(agent.cost_usd[1h]) by (model)",
        why: "Identifies which models dominate your spend. If GPT-4o cost suddenly spikes, a prompt change may have increased token usage.",
        alertRule: "Hourly cost > 2x the 7-day average",
      },
      {
        title: "Tokens per Request (Input vs Output)",
        query: "avg(agent.tokens) by (type)",
        why: "Rising input tokens = growing context. Rising output tokens = verbosity. Both directly increase cost.",
        alertRule: "Average input tokens grows > 20% week-over-week",
      },
      {
        title: "Cost per User (Top 10)",
        query: "topk(10, sum(agent.cost_usd[24h]) by (user_id))",
        why: "Power users (or abuse) can dominate your spend. Set per-user budgets and catch outliers early.",
        alertRule: "Any user exceeds daily budget cap",
      },
      {
        title: "Cost per Feature",
        query: "sum(agent.cost_usd[24h]) by (feature)",
        why: "Which features are expensive? A search feature using GPT-4o might be 10x costlier than one using GPT-4o-mini with no quality difference.",
        alertRule: "Feature cost exceeds allocated budget",
      },
    ],
  },
];

const layoutPrinciples = [
  {
    principle: "Top-to-bottom severity",
    description:
      "Health at the top (first thing you see), quality in the middle, cost at the bottom. In an incident, you read top-down.",
  },
  {
    principle: "Every panel answers one question",
    description:
      "If you can't articulate what question a panel answers, delete it. 'What is our current error rate by type?' is good. 'Various metrics' is not.",
  },
  {
    principle: "Alert thresholds visible on panels",
    description:
      "Draw horizontal lines on charts at your SLO thresholds. This makes it instantly clear when a metric is approaching danger.",
  },
  {
    principle: "Time range consistency",
    description:
      "All panels should use the same time range. A mismatch between a 5-minute error rate and a 24-hour cost total creates confusion.",
  },
  {
    principle: "Drill-down links on every panel",
    description:
      "Clicking an error rate panel should take you to filtered traces for those errors. Dashboards are for detection; traces are for investigation.",
  },
  {
    principle: "No more than 3 dashboards per team",
    description:
      "An overview dashboard, a debugging dashboard, and a cost dashboard. More than that and nobody looks at any of them.",
  },
];

export function Dashboards() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          A well-designed dashboard is the command center for your agent in
          production. It should answer three questions at a glance:{" "}
          <strong>Is it working?</strong> <strong>Is it correct?</strong>{" "}
          <strong>Is it affordable?</strong>
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The difference between a useful dashboard and a vanity dashboard is
          actionability. Every panel should either tell you things are fine, or
          tell you exactly where to look when they are not. If a metric has
          never triggered an investigation, it does not belong on the dashboard.
        </p>
      </div>

      {/* Dashboard Layout */}
      <div className="space-y-6">
        {dashboardRows.map((row) => (
          <Card key={row.name} className={`bg-card/50 ${row.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge
                  variant="outline"
                  className={`${row.color} border-current`}
                >
                  Row
                </Badge>
                {row.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {row.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {row.panels.map((panel) => (
                  <div
                    key={panel.title}
                    className="bg-muted/10 rounded-lg p-4 border border-border/30"
                  >
                    <h4 className="font-semibold text-sm mb-1.5">
                      {panel.title}
                    </h4>
                    <div className="bg-[#0d1117] rounded-md p-2 font-mono text-[10px] text-[#e6edf3]/60 mb-2">
                      {panel.query}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {panel.why}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
                        Alert:
                      </span>
                      <span className="text-[10px] text-foreground/60 font-mono">
                        {panel.alertRule}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Layout Principles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Dashboard Design Principles
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {layoutPrinciples.map((principle) => (
            <Card key={principle.principle} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-1.5">
                  {principle.principle}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Simulated Dashboard Preview */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Example: Agent Health Overview
          </p>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Requests/min", value: "142", status: "normal" },
              { label: "Error Rate", value: "1.8%", status: "normal" },
              { label: "p50 Latency", value: "1.2s", status: "normal" },
              { label: "p99 Latency", value: "8.4s", status: "warning" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`bg-muted/20 rounded-lg p-3 border ${
                  stat.status === "warning"
                    ? "border-yellow-500/40"
                    : "border-border/30"
                }`}
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p
                  className={`text-lg font-mono font-bold ${
                    stat.status === "warning"
                      ? "text-yellow-600"
                      : "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[
              { time: "14:00", rpm: 130, bar: 65 },
              { time: "14:05", rpm: 145, bar: 73 },
              { time: "14:10", rpm: 142, bar: 71 },
              { time: "14:15", rpm: 155, bar: 78 },
              { time: "14:20", rpm: 138, bar: 69 },
              { time: "14:25", rpm: 148, bar: 74 },
            ].map((point) => (
              <div key={point.time} className="flex items-center gap-3">
                <span className="w-12 text-[10px] font-mono text-muted-foreground">
                  {point.time}
                </span>
                <div className="flex-1 h-4 bg-muted/10 rounded overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded"
                    style={{ width: `${point.bar}%` }}
                  />
                </div>
                <span className="w-10 text-[10px] font-mono text-muted-foreground text-right">
                  {point.rpm}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            A healthy dashboard at a glance: stable request rate, low error
            rate, acceptable p50, and a p99 that deserves investigation (shown
            in yellow).
          </p>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          The One-Dashboard Rule
        </p>
        <p className="text-foreground/90 leading-relaxed">
          If your team has to look at more than one dashboard to answer
          &quot;is the agent healthy?&quot;, you have too many dashboards. Start with a
          single overview that covers health, quality, and cost. Only split into
          separate dashboards when the single view becomes too crowded to be
          useful at a glance.
        </p>
      </div>
    </div>
  );
}
