import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const versioningStrategy = [
  {
    aspect: "Schema Versioning",
    description:
      "When you change a tool's parameters (add required fields, remove fields, change types), you must version the schema. Clients that depend on the old schema will break otherwise.",
    approach: "Semantic versioning: major for breaking changes, minor for additions, patch for fixes. Include version in tool name or metadata.",
    example: "search_orders_v2 (adds date_range param) coexists with search_orders_v1 during migration",
  },
  {
    aspect: "Deprecation Workflow",
    description:
      "Before removing a tool, mark it as deprecated. Emit warnings in responses. Set a sunset date. Remove only after all clients have migrated.",
    approach: "Phase 1: Mark deprecated (still works, logs warnings). Phase 2: Return deprecation notice in output. Phase 3: Remove after sunset date.",
    example: "Tool returns: { data: {...}, _deprecated: 'Use search_orders_v2 instead. Sunset: 2025-03-01' }",
  },
  {
    aspect: "Backward Compatibility",
    description:
      "New optional parameters should have defaults. New response fields should be additive (never remove existing fields in a minor version).",
    approach: "Adding optional params is a minor change. Making params required or removing fields is a major change. Use z.default() liberally.",
    example: "Adding optional 'date_range' param with default('all') is backward-compatible",
  },
];

const monitoringMetrics = [
  {
    category: "Latency",
    metrics: [
      { name: "p50 latency", target: "< 500ms", description: "Median tool execution time" },
      { name: "p95 latency", target: "< 2s", description: "95th percentile — catches slow outliers" },
      { name: "p99 latency", target: "< 5s", description: "99th percentile — worst case scenarios" },
    ],
    alertOn: "p95 > 3s for 5 minutes",
  },
  {
    category: "Error Rate",
    metrics: [
      { name: "Error rate", target: "< 1%", description: "Percentage of tool calls that fail" },
      { name: "Validation error rate", target: "< 5%", description: "Model sending invalid params" },
      { name: "Timeout rate", target: "< 0.5%", description: "Calls exceeding timeout threshold" },
    ],
    alertOn: "Error rate > 5% for 2 minutes",
  },
  {
    category: "Usage",
    metrics: [
      { name: "Calls/minute", target: "Varies", description: "Tool invocation volume for capacity planning" },
      { name: "Tokens/call", target: "< 500", description: "Context tokens consumed per tool interaction" },
      { name: "Cost/call", target: "< $0.01", description: "Total cost including API calls and compute" },
    ],
    alertOn: "Cost/hour > 2x baseline",
  },
];

const deploymentPatterns = [
  {
    name: "Sidecar Pattern",
    description:
      "MCP server runs alongside the main application as a separate process. Communicates via stdio or local network. Simple to deploy and manage.",
    useCase: "Local development, desktop applications, single-tenant deployments",
    pros: ["Simple setup", "No network overhead", "Process isolation"],
    cons: ["Not horizontally scalable", "Tied to host lifecycle"],
  },
  {
    name: "Service Pattern",
    description:
      "MCP server deployed as an independent service with its own lifecycle, scaling, and monitoring. Accessed via SSE transport over HTTP.",
    useCase: "Multi-tenant platforms, cloud deployments, shared tool infrastructure",
    pros: ["Independent scaling", "Shared across clients", "Standard deployment"],
    cons: ["Network latency", "Auth complexity", "More infrastructure"],
  },
  {
    name: "Gateway Pattern",
    description:
      "A central MCP gateway aggregates multiple MCP servers behind a single endpoint. Handles routing, auth, rate limiting, and tool selection centrally.",
    useCase: "Enterprise deployments with many tool servers, multi-team environments",
    pros: ["Centralized governance", "Unified auth", "Tool selection at gateway"],
    cons: ["Single point of failure", "Added latency", "Complex to operate"],
  },
];

const scalingConsiderations = [
  {
    topic: "Stateless Tool Servers",
    description:
      "Design tool servers to be stateless where possible. Store session state externally (Redis, database). This enables horizontal scaling — add more instances behind a load balancer.",
  },
  {
    topic: "Connection Pooling",
    description:
      "Tools that connect to databases or APIs should use connection pools. A tool server handling 100 concurrent requests should not open 100 database connections.",
  },
  {
    topic: "Caching Tool Results",
    description:
      "Cache frequently requested, slowly changing data. A tool that fetches company policies does not need to hit the database on every call. Use TTL-based caching with cache invalidation.",
  },
  {
    topic: "Rate Limiting by Tool",
    description:
      "Different tools have different cost profiles. A search tool is cheap; a payment processing tool is expensive and rate-sensitive. Apply per-tool rate limits that match the underlying service constraints.",
  },
  {
    topic: "Graceful Degradation",
    description:
      "When a tool server is overloaded, shed load gracefully. Return cached results, queue requests, or return a 'service busy' error with retry guidance — never drop requests silently.",
  },
];

const registryDesign = [
  {
    field: "name",
    description: "Unique tool identifier",
    example: "search_orders",
  },
  {
    field: "version",
    description: "Semantic version of the tool schema",
    example: "2.1.0",
  },
  {
    field: "owner",
    description: "Team or individual responsible",
    example: "commerce-team",
  },
  {
    field: "status",
    description: "Lifecycle state",
    example: "active | deprecated | sunset",
  },
  {
    field: "description",
    description: "Model-facing description for tool selection",
    example: "Search orders by email, date, or status...",
  },
  {
    field: "schema",
    description: "Zod schema for input validation",
    example: "z.object({ query: z.string(), ... })",
  },
  {
    field: "metrics",
    description: "Real-time usage and performance data",
    example: "{ calls_24h: 15420, p95_ms: 340, error_rate: 0.2% }",
  },
  {
    field: "dependencies",
    description: "External services this tool requires",
    example: "['postgres', 'stripe-api']",
  },
];

export function ProductionTools() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Production tool architecture goes beyond writing individual tools. It
          encompasses <strong>versioning</strong> (so tools can evolve without
          breaking clients), <strong>monitoring</strong> (so you know when tools
          degrade), <strong>scaling</strong> (so tools handle production load),
          and <strong>governance</strong> (so your tool registry stays
          manageable).
        </p>
      </div>

      {/* Versioning */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Versioning Strategy</h3>
        <div className="space-y-3">
          {versioningStrategy.map((item) => (
            <Card key={item.aspect} className="bg-card/50">
              <CardContent className="pt-4 pb-4">
                <h4 className="font-semibold text-sm mb-2">{item.aspect}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-muted/20 rounded-md px-3 py-2">
                    <span className="text-xs text-muted-foreground">
                      Approach:{" "}
                    </span>
                    <span className="text-xs text-foreground/90">
                      {item.approach}
                    </span>
                  </div>
                  <div className="bg-primary/5 rounded-md px-3 py-2 border border-primary/10">
                    <span className="text-xs text-primary">Example: </span>
                    <span className="text-xs text-foreground/80">
                      {item.example}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monitoring */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Monitoring & Observability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Track these metrics per tool. Each category has different targets
            and alert thresholds.
          </p>
          <div className="space-y-6">
            {monitoringMetrics.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {cat.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Alert on: <code className="text-primary/80">{cat.alertOn}</code>
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {cat.metrics.map((metric) => (
                    <div
                      key={metric.name}
                      className="p-3 rounded-lg bg-muted/10 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground/90">
                          {metric.name}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {metric.target}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Patterns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Deployment Patterns</h3>
        <div className="space-y-3">
          {deploymentPatterns.map((pattern) => (
            <Card key={pattern.name} className="bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{pattern.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pattern.description}
                </p>
                <div className="bg-muted/20 rounded-md px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    Best for:{" "}
                  </span>
                  <span className="text-xs text-foreground/90">
                    {pattern.useCase}
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-1">
                    {pattern.pros.map((pro) => (
                      <div
                        key={pro}
                        className="flex items-center gap-2 text-xs text-foreground/90"
                      >
                        <span className="text-green-600">+</span>
                        {pro}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {pattern.cons.map((con) => (
                      <div
                        key={con}
                        className="flex items-center gap-2 text-xs text-foreground/90"
                      >
                        <span className="text-red-600">-</span>
                        {con}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scaling */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Scaling Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scalingConsiderations.map((item) => (
              <div key={item.topic} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{item.topic}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Registry */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <Badge variant="secondary">Governance</Badge>
            Tool Registry Design
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A tool registry is the source of truth for all available tools.
            Each entry should include metadata for discovery, governance, and
            operations.
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {registryDesign.map((field) => (
              <div
                key={field.field}
                className="flex items-start gap-2 p-2 rounded-md bg-muted/10"
              >
                <code className="text-xs font-mono text-primary shrink-0 mt-0.5">
                  {field.field}
                </code>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {field.description}
                  </p>
                  <code className="text-[10px] text-foreground/50 font-mono">
                    {field.example}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          Tools are <strong>infrastructure</strong>, not just code. They need
          the same operational discipline as any production service: versioning,
          monitoring, alerting, capacity planning, and governance. A tool that
          works in demos but has no monitoring, no versioning, and no ownership
          is technical debt waiting to become an incident.
        </p>
      </div>
    </div>
  );
}
