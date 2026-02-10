import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const threatModel = [
  {
    threat: "Prompt Injection via Tool Inputs",
    severity: "critical",
    description:
      "An attacker crafts user input that causes the model to generate malicious tool parameters — SQL injection, command injection, or path traversal.",
    example: "User: 'Search for '); DROP TABLE users; --'",
    mitigation: "Validate all tool inputs with Zod schemas. Use parameterized queries for SQL. Never pass model-generated strings directly to shell commands or eval().",
  },
  {
    threat: "Data Exfiltration via Tool Results",
    severity: "critical",
    description:
      "A compromised or poorly designed tool returns sensitive internal data (API keys, session tokens, credentials) that the model then includes in its response to the user.",
    example: "Tool returns raw API response containing internal_api_key field",
    mitigation: "Filter tool outputs at the boundary. Define explicit response types that include only user-facing fields. Strip sensitive data before returning to the model.",
  },
  {
    threat: "Privilege Escalation",
    severity: "high",
    description:
      "A tool runs with the application's full permissions. The model (or a prompt injection) exploits this to access resources the user should not have access to.",
    example: "File tool with no path restrictions reads /etc/passwd",
    mitigation: "Apply least privilege: read-only DB connections for read tools, scoped API keys, sandboxed file access. Create separate service accounts per tool category.",
  },
  {
    threat: "Denial of Service via Tool Abuse",
    severity: "high",
    description:
      "The model enters an infinite retry loop, calls a tool thousands of times, or triggers expensive operations that consume resources or rack up API costs.",
    example: "Model retries a failing API call 500 times in a loop",
    mitigation: "Set per-tool rate limits, maximum retries (3-5), execution timeouts (5-30s), and per-session cost budgets. Use circuit breakers for external services.",
  },
  {
    threat: "Tool Confusion Attack",
    severity: "medium",
    description:
      "An attacker tricks the model into calling the wrong tool by carefully crafting input that matches one tool's description more closely than the intended tool.",
    example: "Input crafted to trigger delete_account instead of get_account_info",
    mitigation: "Require confirmation for destructive operations. Use distinct, non-overlapping tool descriptions. Implement undo/soft-delete instead of hard deletes.",
  },
];

const severityColor = {
  critical: "bg-red-500/10 text-red-600 border-red-500/40",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
};

const validationLayers = [
  {
    layer: "Schema Validation (Zod)",
    description:
      "Validate types, constraints, enums, and patterns on every parameter before execution. Catch malformed inputs at the gate.",
    code: `const params = SearchSchema.parse(rawParams);
// Throws ZodError with field-level details`,
    level: 1,
  },
  {
    layer: "Input Sanitization",
    description:
      "Escape or reject inputs that could be interpreted as commands. Prevent SQL injection, shell injection, and path traversal.",
    code: `// Parameterized query — NOT string interpolation
const result = await db.query(
  "SELECT * FROM orders WHERE id = $1",
  [params.orderId]
);`,
    level: 2,
  },
  {
    layer: "Path Normalization",
    description:
      "Resolve and validate file paths to prevent directory traversal. Reject paths outside the allowed directory.",
    code: `const resolved = path.resolve(WORKSPACE, filePath);
if (!resolved.startsWith(WORKSPACE)) {
  throw new Error("Path traversal detected");
}`,
    level: 3,
  },
  {
    layer: "Command Allowlisting",
    description:
      "Maintain an explicit list of allowed commands. Reject anything not on the list. Never use a blocklist — attackers will find what you missed.",
    code: `const ALLOWED = new Set(["ls", "cat", "grep"]);
if (!ALLOWED.has(command)) {
  return { error: "Command not allowed" };
}`,
    level: 4,
  },
];

const permissionModels = [
  {
    level: "Read-Only",
    icon: "R",
    color: "text-green-600",
    border: "border-green-500/20",
    tools: ["search_knowledge_base", "get_user_profile", "list_orders"],
    description: "Safe to auto-execute. Cannot modify state. Uses read-only database connections and API keys with read scopes.",
  },
  {
    level: "Write with Confirmation",
    icon: "W",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    tools: ["create_ticket", "update_status", "add_comment"],
    description: "Creates or modifies data. Returns a preview and requires explicit confirmation before executing. Idempotent where possible.",
  },
  {
    level: "Destructive (Human Required)",
    icon: "D",
    color: "text-red-600",
    border: "border-red-500/20",
    tools: ["delete_account", "process_refund", "send_mass_email"],
    description: "Irreversible actions. Always requires human approval in the loop. Cannot be auto-confirmed. Logged with full audit trail.",
  },
];

const auditLogFields = [
  { field: "timestamp", description: "When the tool was called (ISO 8601)" },
  { field: "tool_name", description: "Which tool was invoked" },
  { field: "parameters", description: "Input parameters (sanitized — no secrets)" },
  { field: "result_status", description: "success | error | timeout | denied" },
  { field: "duration_ms", description: "How long the execution took" },
  { field: "caller_id", description: "Which user/session triggered the call" },
  { field: "model_id", description: "Which model made the tool call" },
  { field: "cost_tokens", description: "Tokens consumed for this tool interaction" },
];

export function Security() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Tools give the model <strong>real-world agency</strong> — the ability
          to read files, query databases, send messages, and execute commands.
          This power requires a security model that assumes the model&apos;s
          outputs are <em>untrusted user input</em>.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The model can be manipulated via prompt injection, can hallucinate
          incorrect parameters, or can misunderstand ambiguous requests. Every
          tool interaction must pass through validation, sandboxing, and
          permission checks before execution.
        </p>
      </div>

      {/* Threat Model */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Threat Model</h3>
        <div className="space-y-3">
          {threatModel.map((threat) => (
            <Card
              key={threat.threat}
              className={`bg-card/50 ${
                severityColor[threat.severity as keyof typeof severityColor]
                  ? `border-${threat.severity === "critical" ? "red" : threat.severity === "high" ? "orange" : "yellow"}-500/20`
                  : ""
              }`}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className={
                      severityColor[
                        threat.severity as keyof typeof severityColor
                      ]
                    }
                  >
                    {threat.severity}
                  </Badge>
                  <h4 className="font-semibold text-sm">{threat.threat}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {threat.description}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                    <p className="text-xs font-semibold text-red-600 mb-1">
                      Example
                    </p>
                    <code className="text-xs text-muted-foreground font-mono">
                      {threat.example}
                    </code>
                  </div>
                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                    <p className="text-xs font-semibold text-green-600 mb-1">
                      Mitigation
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {threat.mitigation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Validation Layers */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Defense in Depth: Validation Layers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Each layer catches a different class of attack. All four should be
            applied to tools that interact with system resources.
          </p>
          <div className="space-y-4">
            {validationLayers.map((layer) => (
              <div key={layer.layer} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
                  {layer.level}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{layer.layer}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1 mb-2">
                    {layer.description}
                  </p>
                  <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">
                    {layer.code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Model */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Permission Model</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Classify every tool into a permission tier based on its potential
          impact. Each tier has different execution policies.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {permissionModels.map((level) => (
            <Card key={level.level} className={`bg-card/50 ${level.border}`}>
              <CardContent className="pt-6">
                <div
                  className={`w-10 h-10 rounded-lg bg-card border ${level.border} flex items-center justify-center mb-3`}
                >
                  <span className={`text-sm font-bold ${level.color}`}>
                    {level.icon}
                  </span>
                </div>
                <h4 className={`font-semibold text-sm mb-2 ${level.color}`}>
                  {level.level}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {level.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {level.tools.map((tool) => (
                    <Badge
                      key={tool}
                      variant="outline"
                      className="text-[10px] font-mono"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Audit Logging */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <Badge variant="secondary">Required</Badge>
            Audit Logging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Every tool call should be logged in an append-only audit trail.
            This is essential for debugging, security investigations, cost
            tracking, and compliance.
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {auditLogFields.map((field) => (
              <div
                key={field.field}
                className="flex items-start gap-2 p-2 rounded-md bg-muted/10"
              >
                <code className="text-xs font-mono text-primary shrink-0">
                  {field.field}
                </code>
                <p className="text-xs text-muted-foreground">
                  {field.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          Treat every tool call as if it came from an untrusted external user —
          because in a real sense, it did. The model&apos;s outputs are
          influenced by user input, training data, and potentially adversarial
          prompts. <strong>Validate, scope, sandbox, and audit</strong> every
          tool interaction. The security boundary is not between the user and
          the model — it is between the model and your tools.
        </p>
      </div>
    </div>
  );
}
