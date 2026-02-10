import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const failureModes = [
  {
    mode: "Agent Output Failure",
    description: "Agent produces malformed, incomplete, or hallucinated output that doesn't match the expected schema.",
    frequency: "Common (5-15% of calls)",
    impact: "Downstream agents receive garbage input, producing cascading failures.",
  },
  {
    mode: "Rate Limiting / Throttling",
    description: "LLM API returns 429 (rate limit) or 529 (overloaded). Multiple agents hitting the same API amplifies this.",
    frequency: "Common during burst traffic",
    impact: "Pipeline stalls. Without backoff, aggressive retries worsen the problem.",
  },
  {
    mode: "Context Overflow",
    description: "Agent's input exceeds the model's context window limit, causing the API call to fail entirely.",
    frequency: "Occasional in long-running tasks",
    impact: "Agent cannot function. No output produced.",
  },
  {
    mode: "Deadlock / Circular Wait",
    description: "Agent A waits for Agent B's output, but Agent B is waiting for Agent A. Pipeline hangs indefinitely.",
    frequency: "Rare if DAG is validated",
    impact: "Complete pipeline freeze with no error message.",
  },
  {
    mode: "Orchestrator Failure",
    description: "The orchestrator itself fails — hallucinating a bad plan, crashing mid-coordination, or exceeding its own context limit.",
    frequency: "Uncommon but catastrophic",
    impact: "All progress lost if no checkpointing. Entire pipeline fails.",
  },
];

const recoveryPatterns = [
  {
    name: "Retry with Exponential Backoff",
    badge: "Essential",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Automatically retry failed agent calls with increasing delays between attempts. The simplest and most effective error handling pattern. Handles transient failures (rate limits, network issues) without code changes.",
    implementation: [
      "Set max retries per agent (typically 2-3)",
      "Initial delay: 1 second, then 2s, 4s, 8s (exponential)",
      "Add jitter (random 0-1s) to prevent thundering herd",
      "Log each retry attempt with the error for debugging",
      "After max retries, fall through to fallback strategy",
    ],
    when: "Every agent call in production. This should be your baseline error handling.",
  },
  {
    name: "Fallback Agents",
    badge: "Reliability",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "For critical pipeline steps, define an alternative agent that can produce acceptable (if lower quality) output when the primary agent fails. Trade quality for reliability.",
    implementation: [
      "Identify critical pipeline steps where failure is unacceptable",
      "Define a fallback agent: simpler model, fewer tools, more constrained prompt",
      "Fallback activates only after primary exhausts all retries",
      "Fallback output is tagged so downstream agents know it's degraded",
      "Monitor fallback activation rate — if too high, fix the primary agent",
    ],
    when: "Production pipelines where partial output is better than no output. Critical business workflows.",
  },
  {
    name: "Circuit Breaker",
    badge: "Protection",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "If an agent fails repeatedly, stop calling it entirely for a cooldown period. Prevents wasting tokens and time on a consistently failing agent. Borrowed from microservice architecture.",
    implementation: [
      "Track failure rate per agent in a sliding window (e.g., last 10 calls)",
      "If failure rate exceeds threshold (e.g., 50%), open the circuit",
      "While open: all calls to that agent immediately return the fallback",
      "After cooldown period (e.g., 60 seconds), allow one test call",
      "If test succeeds, close the circuit. If it fails, extend cooldown.",
    ],
    when: "High-throughput systems processing many tasks. When a downstream API or model is experiencing sustained outages.",
  },
  {
    name: "Checkpoint & Resume",
    badge: "Durability",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Persist intermediate results after each pipeline step. On failure, resume from the last successful checkpoint instead of restarting the entire pipeline.",
    implementation: [
      "After each agent completes, save its output to a durable store (DB, S3)",
      "Each checkpoint includes: task ID, step name, output, timestamp",
      "On pipeline failure, query checkpoints for the failing task",
      "Resume execution from the step after the last successful checkpoint",
      "Expired checkpoints are cleaned up after a configurable TTL",
    ],
    when: "Long-running pipelines (5+ steps), expensive operations (research, code generation), any pipeline where losing progress is costly.",
  },
  {
    name: "Graceful Degradation",
    badge: "Resilience",
    color: "text-red-600",
    border: "border-red-500/20",
    description:
      "When non-critical agents fail, continue the pipeline with reduced functionality rather than failing entirely. Return partial results with clear indicators of what's missing.",
    implementation: [
      "Classify each agent as critical (must succeed) or optional (nice to have)",
      "If an optional agent fails, skip it and continue the pipeline",
      "Mark the skipped step in the output so consumers know what's missing",
      "Collect all partial results and return them with a completeness score",
      "Example: code review skipped but code + tests still produced",
    ],
    when: "User-facing applications where some output is better than an error. Pipelines with optional enhancement steps (formatting, spell-checking, optimization).",
  },
];

const errorHandlingChecklist = [
  "Every agent call is wrapped in try/catch with structured error logging",
  "Retries with exponential backoff on all LLM API calls (2-3 attempts)",
  "Timeouts on every agent call (30-120 seconds depending on task complexity)",
  "Schema validation (Zod) on agent outputs before passing downstream",
  "Fallback agents defined for all critical pipeline steps",
  "Checkpointing after each successful pipeline step",
  "Circuit breaker on agents with high failure rates",
  "Graceful degradation for non-critical agents",
  "Deadlock detection via DAG validation before execution",
  "Pipeline-level timeout to catch undetected hangs",
];

export function ErrorRecovery() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          In a multi-agent system, failures are <strong>multiplicative</strong>,
          not additive. If each agent has a 90% success rate, a 5-agent pipeline
          succeeds only 59% of the time (0.9^5). Production multi-agent systems
          need defense in depth: retries, fallbacks, circuit breakers, and
          graceful degradation at every level.
        </p>
      </div>

      {/* Failure Math Callout */}
      <Card className="bg-card/50 border-red-500/20">
        <CardContent className="pt-6">
          <Badge variant="outline" className="text-red-600 border-red-500/40 mb-3">
            The Reliability Math
          </Badge>
          <div className="grid gap-3 md:grid-cols-4 mt-3">
            {[
              { agents: 2, rate: "81%" },
              { agents: 3, rate: "73%" },
              { agents: 5, rate: "59%" },
              { agents: 8, rate: "43%" },
            ].map((row) => (
              <div key={row.agents} className="bg-muted/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{row.rate}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {row.agents} agents @ 90% each
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Pipeline success rate = (individual agent success rate) ^ (number of
            agents). This is why error handling isn&apos;t optional in multi-agent
            systems — it&apos;s the difference between a 59% and 99% success rate.
          </p>
        </CardContent>
      </Card>

      {/* Common Failure Modes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Common Failure Modes</h3>
        <div className="space-y-3">
          {failureModes.map((mode) => (
            <Card key={mode.mode} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm mb-2">{mode.mode}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {mode.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500/40">
                      Frequency
                    </Badge>
                    <span className="text-xs text-muted-foreground">{mode.frequency}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs text-red-600 border-red-500/40">
                      Impact
                    </Badge>
                    <span className="text-xs text-muted-foreground">{mode.impact}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recovery Patterns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recovery Patterns</h3>
        <div className="space-y-4">
          {recoveryPatterns.map((pattern) => (
            <Card key={pattern.name} className={`bg-card/50 ${pattern.border}`}>
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
                    Implementation
                  </p>
                  <ol className="space-y-1">
                    {pattern.implementation.map((step, i) => (
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

                <div className="bg-muted/20 rounded-md px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">Use when: </span>
                  <span className="text-xs text-foreground/90">{pattern.when}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Error Handling Checklist
        </h3>
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {errorHandlingChecklist.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded border border-primary/30 bg-primary/5 flex items-center justify-center mt-0.5">
                    <span className="text-xs text-primary font-mono">{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground/90">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          The goal is not to prevent all failures — that&apos;s impossible with
          LLMs. The goal is to make failures <strong>recoverable</strong>. A
          well-designed multi-agent system fails gracefully: it retries,
          falls back, checkpoints progress, and returns partial results rather
          than nothing. The user should rarely see a raw error.
        </p>
      </div>
    </div>
  );
}
