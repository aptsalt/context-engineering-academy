import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const errorCategories = [
  {
    category: "Validation Errors",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "The model sent invalid parameters — wrong type, missing required field, value out of range. These are the most common tool errors.",
    retryable: true,
    example: "ZodError: amount must be a positive number (received -50)",
    strategy: "Return field-level error details and let the model self-correct. The model is usually excellent at fixing parameter errors when given clear feedback.",
  },
  {
    category: "Not Found Errors",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "The requested resource does not exist — invalid ID, wrong table name, deleted record.",
    retryable: true,
    example: "No order found with ID 'ORD-9999'. Valid format: ORD-XXXX.",
    strategy: "Return what valid IDs or resources look like. If possible, suggest an alternative (e.g., list similar records).",
  },
  {
    category: "Permission Errors",
    color: "text-red-600",
    border: "border-red-500/20",
    description:
      "The tool does not have permission to perform the requested action — restricted path, insufficient API scope.",
    retryable: false,
    example: "Permission denied: cannot access /etc/passwd. Allowed: /workspace/*",
    strategy: "Return a clear denial. Do NOT suggest workarounds that bypass security. Mark as non-retryable.",
  },
  {
    category: "Transient Errors",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Temporary failures — network timeouts, rate limits, service unavailability. The operation might succeed if retried.",
    retryable: true,
    example: "Service temporarily unavailable. Retry in 5 seconds.",
    strategy: "Implement automatic retry with exponential backoff. If all retries fail, return a structured error with estimated recovery time.",
  },
];

const retryPattern = {
  steps: [
    {
      name: "Classify the error",
      description: "Determine if the error is transient (retry) or permanent (fail fast). Rate limits, timeouts, and 503s are transient. Auth failures, 404s, and validation errors are permanent.",
    },
    {
      name: "Apply exponential backoff",
      description: "Wait 1s, then 2s, then 4s between retries. Add random jitter (0-500ms) to prevent thundering herd. Cap at 3-5 retries maximum.",
    },
    {
      name: "Circuit breaker on repeated failures",
      description: "If a tool fails 5 times in 60 seconds, trip the circuit breaker. Return instant failure for the next 30 seconds instead of waiting for timeouts.",
    },
    {
      name: "Fallback response",
      description: "When all retries fail and the circuit is open, return a graceful fallback: cached data, a degraded response, or an explicit 'service unavailable' message.",
    },
  ],
};

const circuitBreakerStates = [
  {
    state: "Closed",
    color: "text-green-600",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    description: "Normal operation. Tool calls execute as usual. Failure count is tracked.",
  },
  {
    state: "Open",
    color: "text-red-600",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    description: "Failure threshold exceeded. All calls fail immediately with a cached error. No execution attempts.",
  },
  {
    state: "Half-Open",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    description: "After cooldown, one test call is allowed. If it succeeds, circuit closes. If it fails, circuit reopens.",
  },
];

const errorResponseDesign = [
  {
    field: "success",
    type: "boolean",
    purpose: "Lets the model (and your code) quickly determine if the tool call worked.",
  },
  {
    field: "error.code",
    type: "string",
    purpose: "Machine-readable error category: VALIDATION_ERROR, NOT_FOUND, PERMISSION_DENIED, TIMEOUT.",
  },
  {
    field: "error.message",
    type: "string",
    purpose: "Human-readable explanation the model can relay to the user or use for self-correction.",
  },
  {
    field: "error.retryable",
    type: "boolean",
    purpose: "Tells the model whether to retry or give up. Prevents infinite retry loops.",
  },
  {
    field: "error.suggestion",
    type: "string?",
    purpose: "Specific guidance: 'Available tables: users, orders' or 'Try again in 5 seconds.'",
  },
];

export function ErrorHandling() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Tools call external APIs, query databases, and interact with
          services that can fail. <strong>Error handling</strong> determines
          whether a tool failure crashes the agent, confuses the model, or gets
          handled gracefully with a recovery path.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The key principle: <em>never return raw errors to the model</em>.
          Stack traces waste tokens, expose internals, and confuse the model.
          Instead, return structured error objects that tell the model exactly
          what went wrong and what to do next.
        </p>
      </div>

      {/* Error Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Error Categories</h3>
        <div className="space-y-3">
          {errorCategories.map((cat) => (
            <Card key={cat.category} className={`bg-card/50 ${cat.border}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className={`font-semibold text-sm ${cat.color}`}>
                    {cat.category}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      cat.retryable
                        ? "text-green-600 border-green-500/40"
                        : "text-red-600 border-red-500/40"
                    }`}
                  >
                    {cat.retryable ? "Retryable" : "Non-retryable"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {cat.description}
                </p>
                <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/80 mb-3">
                  {cat.example}
                </div>
                <div className="bg-muted/20 rounded-md px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    Strategy:{" "}
                  </span>
                  <span className="text-xs text-foreground/90">
                    {cat.strategy}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Structured Error Response */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Designing Error Responses for Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Every tool should return a consistent error structure. These fields
            give the model everything it needs to handle the failure
            intelligently.
          </p>
          <div className="space-y-2">
            {errorResponseDesign.map((field) => (
              <div
                key={field.field}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/10 border border-border/50"
              >
                <code className="text-xs font-mono text-primary shrink-0 mt-0.5">
                  {field.field}
                </code>
                <div className="flex-1">
                  <Badge variant="outline" className="text-xs mb-1">
                    {field.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {field.purpose}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Retry Pattern */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <Badge variant="secondary">Pattern</Badge>
            Retry with Exponential Backoff
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retryPattern.steps.map((step, i) => (
              <div key={step.name} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-sm">{step.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Circuit Breaker */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Circuit Breaker Pattern</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A circuit breaker prevents a failing tool from consuming resources on
          doomed requests. It has three states:
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {circuitBreakerStates.map((state) => (
            <Card key={state.state} className={`bg-card/50 ${state.border}`}>
              <CardContent className="pt-6">
                <div
                  className={`w-10 h-10 rounded-lg ${state.bg} border ${state.border} flex items-center justify-center mb-3`}
                >
                  <span className={`text-sm font-bold ${state.color}`}>
                    {state.state[0]}
                  </span>
                </div>
                <h4 className={`font-semibold text-sm mb-2 ${state.color}`}>
                  {state.state}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {state.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          The model cannot debug your infrastructure. When a tool fails, the
          model needs <strong>actionable information</strong>, not stack traces.
          Every error response should answer three questions: What happened?
          Can I retry? What should I do instead? If your errors answer these
          three questions, the model can recover from most failures without
          human intervention.
        </p>
      </div>
    </div>
  );
}
