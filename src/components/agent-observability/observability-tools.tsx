import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tools = [
  {
    name: "LangSmith",
    company: "LangChain",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Production monitoring and debugging platform from the LangChain team. Deep integration with LangChain and LangGraph, but works with any framework via the LangSmith SDK. Strong trace visualization with a playground for prompt iteration.",
    features: [
      "Trace visualization with span-level detail",
      "Prompt playground for iteration and testing",
      "Dataset management for evaluations",
      "Online evaluation runners",
      "Human annotation queues",
      "Comparison views for A/B testing prompts",
    ],
    pricing: "Free tier (5K traces/mo), Plus ($39/seat/mo), Enterprise (custom)",
    bestFor: "Teams already using LangChain/LangGraph, or needing strong eval integration.",
    url: "https://smith.langchain.com",
  },
  {
    name: "Arize Phoenix",
    company: "Arize AI",
    color: "text-orange-600",
    border: "border-orange-500/20",
    description:
      "Open-source observability platform built specifically for LLM applications. Strong focus on trace visualization, retrieval analysis, and evaluation. Runs locally or in the cloud. Great for debugging RAG systems.",
    features: [
      "Open-source (Apache 2.0) — self-host anywhere",
      "Trace and span visualization",
      "Retrieval (RAG) quality analysis",
      "Embedding drift detection",
      "LLM evaluation framework",
      "OpenTelemetry-native instrumentation",
    ],
    pricing: "Free (open-source self-hosted), Phoenix Cloud (free tier + paid plans)",
    bestFor: "Teams wanting open-source with RAG debugging, or needing on-premise deployment.",
    url: "https://phoenix.arize.com",
  },
  {
    name: "Langfuse",
    company: "Langfuse",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Open-source LLM observability and analytics platform. Framework-agnostic with SDKs for Python and TypeScript. Includes prompt management, cost tracking, and evaluation features. Can be self-hosted.",
    features: [
      "Open-source (MIT) — full self-hosting support",
      "Framework-agnostic SDK (works with any LLM provider)",
      "Prompt management and versioning",
      "Cost tracking with model pricing tables",
      "Evaluation and scoring pipelines",
      "Session and user-level analytics",
    ],
    pricing: "Free (self-hosted or cloud free tier), Pro ($59/mo), Team ($119/mo)",
    bestFor: "Teams wanting open-source with strong cost tracking and prompt management.",
    url: "https://langfuse.com",
  },
  {
    name: "Braintrust",
    company: "Braintrust",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "End-to-end platform combining evaluations, logging, and prompt playground. Strong focus on eval-driven development with built-in scoring functions. Also serves as an AI proxy for cost optimization.",
    features: [
      "Eval framework with built-in scoring functions",
      "Production logging and tracing",
      "Prompt playground with side-by-side comparison",
      "AI proxy with caching and fallbacks",
      "Dataset management for golden test sets",
      "CI/CD integration for automated eval runs",
    ],
    pricing: "Free tier, Pro ($25/seat/mo), Enterprise (custom)",
    bestFor: "Teams focused on eval-driven development and needing a unified eval + monitoring platform.",
    url: "https://braintrust.dev",
  },
  {
    name: "Helicone",
    company: "Helicone",
    color: "text-cyan-600",
    border: "border-cyan-500/20",
    description:
      "Proxy-based observability that requires just one line of code to integrate. Routes your LLM API calls through Helicone's gateway, automatically capturing cost, latency, and usage metrics without SDK changes.",
    features: [
      "One-line integration (URL swap)",
      "Automatic cost and latency tracking",
      "Request/response logging",
      "Rate limiting and caching at the proxy layer",
      "User-level analytics and cost attribution",
      "Prompt threat detection",
    ],
    pricing: "Free tier (100K requests/mo), Growth ($100/mo), Enterprise (custom)",
    bestFor: "Teams wanting instant observability with minimal code changes.",
    url: "https://helicone.ai",
  },
  {
    name: "OpenTelemetry + Custom Stack",
    company: "CNCF (Open Standard)",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Build your own observability stack using the OpenTelemetry standard. Use OTEL SDKs for instrumentation and export to any backend — Jaeger, Grafana Tempo, Honeycomb, Datadog, or custom storage. Maximum flexibility, but requires more setup.",
    features: [
      "Vendor-neutral standard — no lock-in",
      "Works with any observability backend",
      "OpenLLMetry provides auto-instrumentation for LLM frameworks",
      "Full control over what you trace and store",
      "Integrates with existing infrastructure",
      "Semantic conventions for GenAI (emerging standard)",
    ],
    pricing: "Free (open standard) — backend costs vary",
    bestFor: "Teams with existing observability infrastructure, or needing full control over data.",
    url: "https://opentelemetry.io",
  },
];

const comparisonDimensions = [
  {
    dimension: "Open Source",
    values: ["No", "Yes (Apache 2.0)", "Yes (MIT)", "No", "No", "Yes (CNCF)"],
  },
  {
    dimension: "Self-Hostable",
    values: ["No", "Yes", "Yes", "No", "No", "Yes"],
  },
  {
    dimension: "Tracing",
    values: ["Strong", "Strong", "Strong", "Good", "Basic", "Excellent"],
  },
  {
    dimension: "Evals",
    values: ["Strong", "Good", "Good", "Excellent", "Basic", "Manual"],
  },
  {
    dimension: "Cost Tracking",
    values: ["Good", "Basic", "Strong", "Good", "Excellent", "Manual"],
  },
  {
    dimension: "Setup Effort",
    values: ["Low", "Low", "Low", "Low", "Minimal", "High"],
  },
];

export function ObservabilityTools() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          The agent observability ecosystem has matured rapidly. From open-source
          platforms to managed services, there are now dedicated tools for every
          aspect of LLM monitoring. Here is a comprehensive comparison of the
          leading options.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The right tool depends on your constraints: team size, budget, existing
          infrastructure, and whether you need self-hosting. Most teams start
          with one managed platform and add OpenTelemetry as they scale.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="space-y-4">
        {tools.map((tool) => (
          <Card key={tool.name} className={`bg-card/50 ${tool.border}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <Badge
                  variant="outline"
                  className={`${tool.color} border-current`}
                >
                  {tool.company}
                </Badge>
                {tool.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Key Features
                </p>
                <ul className="grid gap-1.5 md:grid-cols-2">
                  {tool.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-foreground/90"
                    >
                      <span className={`${tool.color} mt-0.5`}>&#9656;</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-muted/20 rounded-md px-3 py-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Pricing:{" "}
                  </span>
                  <span className="text-xs text-foreground/80">
                    {tool.pricing}
                  </span>
                </div>
                <div className="bg-primary/5 rounded-md px-3 py-2">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    Best For:{" "}
                  </span>
                  <span className="text-xs text-foreground/80">
                    {tool.bestFor}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card className="bg-card/50 border-primary/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">Quick Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs">
                    Dimension
                  </th>
                  {tools.map((tool) => (
                    <th
                      key={tool.name}
                      className={`text-left py-3 px-3 font-semibold text-xs ${tool.color}`}
                    >
                      {tool.name.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonDimensions.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border/50"
                  >
                    <td className="py-2.5 px-3 font-medium text-xs">
                      {row.dimension}
                    </td>
                    {row.values.map((value, i) => (
                      <td
                        key={i}
                        className="py-2.5 px-3 text-muted-foreground text-xs"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Decision Guide */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          How to Choose
        </p>
        <ul className="text-sm text-foreground/80 leading-relaxed space-y-2">
          <li>
            <strong>Starting out?</strong> Pick Langfuse (open-source, generous
            free tier) or Helicone (one-line setup).
          </li>
          <li>
            <strong>Using LangChain/LangGraph?</strong> LangSmith has the
            deepest integration and best trace UI for these frameworks.
          </li>
          <li>
            <strong>Need evals + monitoring?</strong> Braintrust combines both
            in one platform, reducing tool sprawl.
          </li>
          <li>
            <strong>Enterprise with existing infra?</strong> OpenTelemetry +
            your existing backend (Datadog, Grafana) avoids adding another
            vendor.
          </li>
          <li>
            <strong>Privacy/compliance requirements?</strong> Langfuse or
            Phoenix can be self-hosted in your own infrastructure.
          </li>
        </ul>
      </div>
    </div>
  );
}
