import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const alertTiers = [
  {
    tier: "Critical",
    color: "text-red-600",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    action: "Page on-call engineer immediately",
    response: "< 5 minutes",
    examples: [
      "Error budget burn rate > 14.4x monthly budget (1-hour window)",
      "Zero successful requests for 5+ minutes (total outage)",
      "p99 latency exceeds 30 seconds for 10+ minutes",
      "LLM API returning 500s for all requests",
    ],
  },
  {
    tier: "Warning",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    action: "Notify team via Slack, investigate during business hours",
    response: "< 1 hour during business hours",
    examples: [
      "Error budget burn rate > 6x monthly budget (6-hour window)",
      "Hourly cost exceeds 2x the 7-day average",
      "Hallucination rate above 3% (detected via evals)",
      "Token usage trending upward 20%+ week-over-week",
    ],
  },
  {
    tier: "Info",
    color: "text-blue-600",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    action: "Log for review, include in weekly reports",
    response: "Review at next standup",
    examples: [
      "New model version deployed successfully",
      "Daily cost report summary",
      "Eval scores trending above baseline",
      "Rate limit approached but not exceeded",
    ],
  },
];

const anomalyPatterns = [
  {
    name: "Token Usage Drift",
    description:
      "Average input tokens per request gradually increasing over days/weeks. Usually caused by growing conversation histories, expanding system prompts, or RAG returning more chunks.",
    detection: "Compare 7-day rolling average against 30-day baseline. Alert on > 20% increase.",
    impact: "Cost increases linearly. Quality may degrade as context window fills. Eventually hits model limits.",
  },
  {
    name: "Latency Bimodality",
    description:
      "Latency distribution develops two peaks instead of one. Some requests complete in 1-2s while others take 10-15s. Often caused by tool timeouts or cache miss patterns.",
    detection: "Monitor the gap between p50 and p95. When p95 > 5x p50, investigate.",
    impact: "Inconsistent user experience. Slow requests may timeout at the client level.",
  },
  {
    name: "Silent Quality Degradation",
    description:
      "Success rate (non-error) stays high but eval-measured quality drops. The model is returning answers that don't throw errors but are subtly wrong or less helpful.",
    detection: "Run automated evals on 5-10% of production traffic. Track eval scores over time.",
    impact: "Users lose trust gradually. By the time you notice from feedback, many users have churned.",
  },
  {
    name: "Cost Spike from Retry Storms",
    description:
      "A tool or model intermittently fails, triggering retry logic. Each retry makes a full LLM call, multiplying cost. A single user request can generate 10-20 LLM calls.",
    detection: "Track retry count per request. Alert when any request exceeds 3 retries.",
    impact: "5-20x cost increase per affected request. Can exhaust rate limits, cascading to other users.",
  },
];

const incidentResponseCode = `// Agent-specific incident response playbook
interface IncidentPlaybook {
  symptom: string;
  severity: "critical" | "warning";
  steps: string[];
  escalation: string;
}

const playbooks: IncidentPlaybook[] = [
  {
    symptom: "Error rate exceeds SLO",
    severity: "critical",
    steps: [
      "Check LLM provider status page (OpenAI, Anthropic)",
      "Review error type breakdown — is it rate limits, timeouts, or 500s?",
      "If rate limits: enable fallback model routing",
      "If timeouts: check tool service health",
      "If 500s: check for recent deployment (prompt/model change)",
      "If no provider issue: check recent code/config changes",
    ],
    escalation: "If unresolved in 15 minutes, escalate to platform team",
  },
  {
    symptom: "Cost anomaly detected (2x+ hourly average)",
    severity: "warning",
    steps: [
      "Identify which model/feature is driving the spike",
      "Check for retry storms: look for requests with retries > 3",
      "Check for token usage spikes: was a system prompt changed?",
      "Check for traffic spikes: is it legitimate traffic or abuse?",
      "If abuse: enable per-user rate limiting",
      "If retry storm: fix the failing tool/model and reset",
    ],
    escalation: "If cost exceeds $500/hour, page finance + engineering lead",
  },
  {
    symptom: "Hallucination rate spike",
    severity: "warning",
    steps: [
      "Check if a new model version was deployed",
      "Verify RAG retrieval quality — are correct docs being returned?",
      "Check system prompt: was it recently modified?",
      "Review recent eval results for regression patterns",
      "If model change: rollback to previous model version",
      "If context issue: investigate RAG pipeline health",
    ],
    escalation: "If affects > 5% of requests, escalate to AI/ML team",
  },
];

// Automated incident detection
async function checkAgentHealth(
  metricsClient: MetricsClient,
): Promise<IncidentAlert[]> {
  const alerts: IncidentAlert[] = [];
  const now = Date.now();

  // Check error budget burn rate
  const errorRate1h = await metricsClient.query(
    "rate(agent.errors[1h]) / rate(agent.requests[1h])"
  );
  const monthlyBudget = 0.01; // 99% SLO = 1% error budget
  if (errorRate1h > monthlyBudget * 14.4) {
    alerts.push({
      type: "error_budget_fast_burn",
      severity: "critical",
      message: \`Error budget burning at \${(errorRate1h / monthlyBudget).toFixed(1)}x monthly rate\`,
      runbook: "https://wiki/runbooks/agent-error-budget",
      timestamp: now,
    });
  }

  // Check cost anomaly
  const hourlyCost = await metricsClient.query("sum(agent.cost_usd[1h])");
  const avgHourlyCost7d = await metricsClient.query(
    "avg_over_time(sum(agent.cost_usd[1h])[7d:])"
  );
  if (hourlyCost > avgHourlyCost7d * 2) {
    alerts.push({
      type: "cost_anomaly",
      severity: "warning",
      message: \`Hourly cost $\${hourlyCost.toFixed(2)} is \${(hourlyCost / avgHourlyCost7d).toFixed(1)}x the 7-day average\`,
      runbook: "https://wiki/runbooks/agent-cost",
      timestamp: now,
    });
  }

  return alerts;
}`;

const sloExample = {
  name: "Agent Response Quality SLO",
  target: "99.5% of requests complete successfully in < 10 seconds",
  errorBudget: "0.5% = ~3.6 hours of downtime per month",
  burnRates: [
    { window: "1 hour", threshold: "14.4x", action: "Page on-call", severity: "critical" },
    { window: "6 hours", threshold: "6x", action: "Slack alert", severity: "warning" },
    { window: "24 hours", threshold: "3x", action: "Ticket", severity: "info" },
  ],
};

export function ProductionMonitoring() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Production monitoring for AI agents requires a fundamentally different
          approach than traditional services. Agents fail in subtle ways —
          wrong answers, slowly degrading quality, invisible cost creep — that
          standard uptime checks will never catch.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The foundation is <strong>SLO-based alerting</strong>: define what
          &quot;good&quot; looks like (Service Level Objectives), measure against it
          continuously, and alert based on how fast you are consuming your
          error budget — not on individual errors.
        </p>
      </div>

      {/* SLO Example */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-3">SLO-Based Alerting</Badge>
          <h3 className="font-semibold text-sm mb-2">{sloExample.name}</h3>
          <p className="text-sm text-foreground/90 mb-1">
            <strong>Target:</strong> {sloExample.target}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Error budget:</strong> {sloExample.errorBudget}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">
                    Window
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">
                    Burn Rate
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">
                    Action
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody>
                {sloExample.burnRates.map((rate) => (
                  <tr key={rate.window} className="border-b border-border/50">
                    <td className="py-2 px-3 font-mono text-xs">{rate.window}</td>
                    <td className="py-2 px-3 font-mono text-xs text-primary">
                      {rate.threshold}
                    </td>
                    <td className="py-2 px-3 text-xs">{rate.action}</td>
                    <td className="py-2 px-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          rate.severity === "critical"
                            ? "text-red-600 border-red-500/40"
                            : rate.severity === "warning"
                              ? "text-yellow-600 border-yellow-500/40"
                              : "text-blue-600 border-blue-500/40"
                        }`}
                      >
                        {rate.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            A fast burn (14.4x) means you will exhaust your monthly error budget
            in about 1 hour if the rate continues. This pages immediately. A
            slow burn (6x) gives you 5 hours, warranting a Slack alert.
          </p>
        </CardContent>
      </Card>

      {/* Alert Tiers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Alert Severity Tiers</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The most important rule in alerting: if everything is critical,
          nothing is critical. Tier your alerts by severity, and make sure each
          tier has a clear response expectation and routing.
        </p>
        <div className="space-y-4">
          {alertTiers.map((tier) => (
            <Card key={tier.tier} className={`bg-card/50 ${tier.border}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    variant="outline"
                    className={`${tier.color} border-current`}
                  >
                    {tier.tier}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Response: {tier.response}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 mb-3">
                  <strong>Action:</strong> {tier.action}
                </p>
                <div className={`${tier.bg} rounded-lg p-3`}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Example Triggers
                  </p>
                  <ul className="space-y-1">
                    {tier.examples.map((example) => (
                      <li
                        key={example}
                        className="flex items-start gap-2 text-xs text-foreground/80"
                      >
                        <span className={tier.color}>&#9656;</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Common Anomaly Patterns in Agent Systems
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          These are the subtle failure modes that simple threshold alerts miss.
          Each requires a different detection strategy — often comparing current
          behavior against historical baselines rather than fixed thresholds.
        </p>
        <div className="space-y-3">
          {anomalyPatterns.map((pattern) => (
            <Card key={pattern.name} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">{pattern.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {pattern.description}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10">
                    <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
                      Detection
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pattern.detection}
                    </p>
                  </div>
                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                    <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider mb-1">
                      Impact
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pattern.impact}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Incident Response */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Agent-Specific Incident Response
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Every alert needs a runbook. For AI agents, runbooks must include
          checking the LLM provider status, examining recent prompt/model
          changes, and verifying context quality — not just checking server
          health.
        </p>
        <CodeBlock
          code={incidentResponseCode}
          label="Incident playbooks and automated health checks"
        />
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          The Post-Incident Review Question
        </p>
        <p className="text-foreground/90 leading-relaxed">
          Traditional post-mortems ask &quot;what code failed?&quot; Agent post-incident
          reviews need additional questions:{" "}
          <strong>What context did the agent see?</strong>{" "}
          <strong>Was it a model failure or a context failure?</strong>{" "}
          <strong>Would better observability have caught this earlier?</strong>{" "}
          Always add the failing case to your eval dataset.
        </p>
      </div>
    </div>
  );
}
