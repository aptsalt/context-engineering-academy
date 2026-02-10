import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { quotes } from "@/lib/agent-observability-data";

const pillars = [
  {
    name: "Traces",
    color: "text-blue-600",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    description:
      "The full execution path of an agent request — from user input through LLM calls, tool executions, and sub-agent invocations to final output. Traces show you the 'what happened' of every request.",
    example: "User query -> Plan (200ms) -> Search tool (800ms) -> LLM synthesis (1.2s) -> Response",
  },
  {
    name: "Metrics",
    color: "text-green-600",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    description:
      "Quantitative measurements aggregated over time — latency distributions, token usage, error rates, costs. Metrics show you the 'how is it performing' across all requests.",
    example: "p50 latency: 1.2s | p99: 8.4s | error rate: 2.3% | cost/req: $0.04",
  },
  {
    name: "Logs",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    description:
      "Structured event records with context — decisions made, tools selected, errors encountered. Logs show you the 'why did it do that' for individual events.",
    example: '{"traceId":"abc-123","event":"tool.selected","tool":"search","reason":"query matched knowledge_base pattern","confidence":0.87}',
  },
];

const blindSpots = [
  {
    title: "Hallucination in the middle of a chain",
    description:
      "The LLM hallucinates a fact in step 2 of a 5-step execution. Steps 3-5 build on this false premise. Without tracing, the final output looks wrong, but you can't tell which step introduced the error.",
  },
  {
    title: "Silent tool failures",
    description:
      "A tool returns an empty result instead of throwing an error. The agent continues with no data, producing a vague or generic response. Without observability, this looks like a model quality issue, not a tool failure.",
  },
  {
    title: "Context window overflow",
    description:
      "The agent's conversation history grows past the effective attention window. The model starts ignoring earlier instructions. Performance degrades gradually — no error, no crash, just silently worse outputs.",
  },
  {
    title: "Cost spikes from retry loops",
    description:
      "A tool validation failure triggers a retry loop. The agent makes 15 LLM calls for a single user request, consuming $2 in tokens instead of the expected $0.04. Without cost tracking, this goes unnoticed until the bill arrives.",
  },
];

export function WhatIsObservability() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Agent observability</strong> is the ability to understand what
          your AI agent is doing, why it made specific decisions, and how it
          performs — without deploying new code. It goes far beyond traditional
          logging.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Traditional software is deterministic: the same input produces the
          same output, and a stack trace tells you exactly where things broke.
          AI agents are <em>non-deterministic</em>: the same input can produce
          different outputs, failures are often subtle (wrong answer, not crash),
          and the root cause might be in the <em>context</em> the model saw, not
          in the code.
        </p>
      </div>

      {/* Key Difference */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-3">Why It&apos;s Different</Badge>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Traditional Software Monitoring
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Errors throw exceptions with stack traces</li>
                <li>Same input always produces same output</li>
                <li>Failures are binary: works or crashes</li>
                <li>Response time is the main performance metric</li>
                <li>Debugging = reading code + stack trace</li>
              </ul>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Agent Observability
              </p>
              <ul className="text-xs text-foreground/80 space-y-1.5 leading-relaxed">
                <li>Failures are often subtle (wrong answer, not crash)</li>
                <li>Same input can produce different outputs each time</li>
                <li>Quality exists on a spectrum, not binary</li>
                <li>Latency, tokens, cost, and correctness all matter</li>
                <li>Debugging = understanding what the model <em>saw</em></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          When an AI agent produces a bad result, the question isn&apos;t
          &ldquo;what line of code failed?&rdquo; — it&apos;s{" "}
          <strong>&ldquo;what did the model see when it made that decision?&rdquo;</strong>{" "}
          Agent observability gives you the tools to answer that question.
        </p>
      </div>

      {/* Three Pillars */}
      <div>
        <h3 className="text-lg font-semibold mb-4">The Three Pillars</h3>
        <div className="space-y-4">
          {pillars.map((pillar) => (
            <Card key={pillar.name} className={`bg-card/50 ${pillar.border}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className={`${pillar.color} border-current`}>
                    {pillar.name}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {pillar.description}
                </p>
                <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/80 leading-relaxed">
                  {pillar.example}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Blind Spots */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Common Blind Spots Without Observability</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {blindSpots.map((spot) => (
            <Card key={spot.title} className="bg-card/50 border-red-500/10">
              <CardContent className="pt-5 pb-5">
                <h4 className="font-semibold text-sm text-red-600 mb-2">{spot.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {spot.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quotes */}
      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map((quote) => (
          <Card key={quote.author} className="bg-card/50">
            <CardContent className="pt-6">
              <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold">{quote.author}</p>
                <p className="text-xs text-muted-foreground">{quote.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
