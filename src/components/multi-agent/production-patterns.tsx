import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scalingPatterns = [
  {
    name: "Queue-Based Orchestration",
    badge: "Scalability",
    color: "text-blue-600",
    description:
      "Decouple agent execution from request handling using message queues. Each agent polls a queue for tasks, processes them, and publishes results. Enables horizontal scaling — add more agent workers when load increases.",
    howItWorks: [
      "Incoming tasks are published to a task queue (Redis, SQS, Kafka)",
      "Agent workers poll their designated queue for tasks",
      "Each worker processes one task at a time with isolated context",
      "Results are published to an output queue or stored in shared state",
      "The orchestrator coordinates by publishing and consuming queue messages",
    ],
    benefit: "Scale each agent type independently. Add more 'researcher' workers during peak research demand without scaling the entire system.",
  },
  {
    name: "Agent Pool with Load Balancing",
    badge: "Performance",
    color: "text-green-600",
    description:
      "Maintain a pool of pre-initialized agents that can handle tasks immediately. A load balancer distributes incoming subtasks across available agents, preventing any single agent from becoming a bottleneck.",
    howItWorks: [
      "Initialize a pool of N agents per role at startup",
      "Each agent in the pool is pre-configured with system prompt and tools",
      "Load balancer assigns incoming subtasks to idle agents",
      "Agents return to the pool after completing their task",
      "Pool size auto-scales based on queue depth and latency metrics",
    ],
    benefit: "Eliminates cold-start latency. Agents are ready to work immediately, reducing per-task overhead from seconds to milliseconds.",
  },
  {
    name: "Tiered Model Selection",
    badge: "Cost Optimization",
    color: "text-yellow-600",
    description:
      "Not every agent needs the most powerful (and expensive) model. Route simple subtasks to smaller, cheaper models and reserve large models for complex reasoning and decision-making.",
    howItWorks: [
      "Classify each subtask by complexity: low, medium, high",
      "Low-complexity tasks route to small models (GPT-4o-mini, Claude Haiku)",
      "Medium tasks use standard models (GPT-4o, Claude Sonnet)",
      "High-complexity tasks get the strongest model (Claude Opus, GPT-4.5)",
      "The orchestrator itself can use a mid-tier model for routing decisions",
    ],
    benefit: "Reduce costs by 60-80% without quality degradation. Most subtasks in a pipeline don't need the strongest model.",
  },
];

const monitoringMetrics = [
  {
    metric: "Pipeline Success Rate",
    description: "Percentage of end-to-end pipeline executions that complete without error. Target: >95% for production.",
    formula: "successful_completions / total_attempts",
    alertThreshold: "Below 90% triggers investigation",
  },
  {
    metric: "Agent-Level Success Rate",
    description: "Success rate per individual agent. Identifies which specific agent is the weak link in the pipeline.",
    formula: "agent_successes / agent_total_calls",
    alertThreshold: "Any agent below 85% triggers alert",
  },
  {
    metric: "Orchestration Overhead Ratio",
    description: "Tokens spent on coordination (routing, summarizing, decision-making) vs actual task work. High overhead means your architecture is too complex.",
    formula: "orchestration_tokens / total_tokens",
    alertThreshold: "Above 30% means simplify your architecture",
  },
  {
    metric: "End-to-End Latency (P95)",
    description: "95th percentile of total pipeline duration. Helps identify outliers caused by slow agents, retries, or deadlocks.",
    formula: "time(pipeline_end - pipeline_start) at P95",
    alertThreshold: "3x median latency triggers investigation",
  },
  {
    metric: "Token Cost per Task",
    description: "Total token spend across all agents for a single task. Track this per task type to identify expensive patterns.",
    formula: "sum(all_agent_tokens) per task",
    alertThreshold: "20% increase from baseline triggers review",
  },
  {
    metric: "Retry Rate",
    description: "How often agent calls need retries. High retry rates indicate systemic issues with prompts, tools, or model selection.",
    formula: "retry_attempts / total_calls",
    alertThreshold: "Above 10% triggers prompt/tool review",
  },
];

const deploymentStrategies = [
  {
    strategy: "Blue-Green Agent Deployment",
    description:
      "Run two versions of your agent pipeline simultaneously. Route traffic to the 'blue' (current) version while testing 'green' (new). Switch traffic when green is validated.",
    steps: [
      "Deploy new agent configurations to 'green' environment",
      "Run evaluation suite against green with production-like traffic",
      "Compare quality metrics between blue and green",
      "If green passes, switch traffic. If not, green gets reverted.",
      "Keep blue running for instant rollback if issues emerge",
    ],
  },
  {
    strategy: "Canary Releases per Agent",
    description:
      "Update one agent at a time, routing a small percentage of traffic to the new version. Monitor for regressions before rolling out fully.",
    steps: [
      "Update a single agent (e.g., researcher) to a new version",
      "Route 5% of traffic to the new version, 95% to the old",
      "Monitor quality and latency metrics for the canary",
      "Gradually increase canary traffic: 5% -> 25% -> 50% -> 100%",
      "Rollback to old version if any metric degrades",
    ],
  },
  {
    strategy: "Feature Flags for Agent Capabilities",
    description:
      "Use feature flags to enable or disable specific agent capabilities (new tools, prompt changes, model upgrades) without redeploying.",
    steps: [
      "Wrap new agent capabilities in feature flags",
      "Enable flags for internal testing first",
      "Gradually roll out to production users by percentage",
      "Kill switch: disable any flag instantly if issues arise",
      "Track metrics per flag to measure capability impact",
    ],
  },
];

const observabilityStack = [
  {
    layer: "Tracing",
    description: "End-to-end trace of every pipeline execution, showing which agents ran, in what order, what they produced, and how long each took.",
    tools: "LangSmith, Langfuse, Phoenix, Braintrust",
  },
  {
    layer: "Logging",
    description: "Structured logs for every agent call: input tokens, output tokens, model used, latency, success/failure, retry count.",
    tools: "Structured JSON logs, ELK stack, Datadog",
  },
  {
    layer: "Metrics",
    description: "Aggregated dashboards showing pipeline success rates, per-agent metrics, cost trends, and latency distributions.",
    tools: "Grafana, Datadog, custom dashboards",
  },
  {
    layer: "Alerting",
    description: "Automated alerts when metrics cross thresholds: success rate drops, latency spikes, cost anomalies, or agent-specific failures.",
    tools: "PagerDuty, Opsgenie, Slack webhooks",
  },
];

export function ProductionPatterns() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Getting a multi-agent system working in development is the easy part.
          Getting it to work <strong>reliably at scale</strong> in production
          requires careful attention to scaling, monitoring, deployment
          strategies, and cost management. These patterns separate toy demos
          from production systems.
        </p>
      </div>

      {/* Scaling Patterns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Scaling Patterns</h3>
        <div className="space-y-4">
          {scalingPatterns.map((pattern) => (
            <Card key={pattern.name} className="bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <Badge variant="outline" className={`${pattern.color} border-current`}>
                    {pattern.badge}
                  </Badge>
                  <span className={pattern.color}>{pattern.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pattern.description}
                </p>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    How It Works
                  </p>
                  <ol className="space-y-1">
                    {pattern.howItWorks.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-4 rounded-r-lg">
                  <p className="text-xs font-semibold text-primary mb-1">Key Benefit</p>
                  <p className="text-sm text-foreground/90">{pattern.benefit}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monitoring Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Key Metrics to Monitor
        </h3>
        <div className="space-y-3">
          {monitoringMetrics.map((metric) => (
            <Card key={metric.metric} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">{metric.metric}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {metric.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-500/40">
                      Formula
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{metric.formula}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500/40">
                      Alert
                    </Badge>
                    <span className="text-xs text-muted-foreground">{metric.alertThreshold}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Deployment Strategies */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Deployment Strategies
        </h3>
        <div className="space-y-4">
          {deploymentStrategies.map((strategy) => (
            <Card key={strategy.strategy} className="bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{strategy.strategy}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
                <ol className="space-y-1">
                  {strategy.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Observability Stack */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Observability Stack
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {observabilityStack.map((layer) => (
            <Card key={layer.layer} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm text-primary mb-2">{layer.layer}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {layer.description}
                </p>
                <div className="bg-muted/30 rounded-md px-3 py-2">
                  <span className="text-xs text-muted-foreground">Tools: </span>
                  <span className="text-xs text-foreground/80">{layer.tools}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">The Production Readiness Checklist</h3>
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">
            Before deploying a multi-agent system to production, verify:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>Every agent call has retry logic, timeouts, and fallback strategies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>Pipeline results are checkpointed after each step</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>End-to-end tracing is enabled for every pipeline execution</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>Dashboards show per-agent success rate, latency, and token cost</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">5.</span>
              <span>Alerts fire on pipeline success rate drops and cost anomalies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">6.</span>
              <span>You can roll back individual agents without redeploying the pipeline</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
