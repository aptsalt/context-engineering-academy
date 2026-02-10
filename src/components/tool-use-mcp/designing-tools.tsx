import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const namingRules = [
  {
    rule: "Use verb_noun format",
    good: "search_orders, create_ticket, get_user",
    bad: "handle_data, process, doStuff",
    why: "The verb tells the model what action to take. The noun tells it what entity is affected. Together they communicate intent unambiguously.",
  },
  {
    rule: "Be specific, not generic",
    good: "list_open_tickets, get_order_by_id",
    bad: "get_items, fetch_data, query",
    why: "Generic names force the model to rely on descriptions alone. Specific names provide instant signal for tool selection.",
  },
  {
    rule: "Avoid overlapping names",
    good: "search_orders (by query), get_order (by ID)",
    bad: "find_orders, search_orders, lookup_orders",
    why: "Overlapping names cause the model to pick randomly between near-identical tools. Each tool name should be clearly distinguishable.",
  },
  {
    rule: "Use consistent conventions",
    good: "get_ (read), create_ (write), update_ (modify), delete_ (remove)",
    bad: "Mixing get_, fetch_, retrieve_, find_, lookup_ for reads",
    why: "Consistent prefixes create a predictable vocabulary. The model learns that get_ always means read, create_ always means write.",
  },
];

const descriptionAnatomy = [
  {
    part: "What it does",
    example: "Retrieves order details including items, status, and shipping info.",
    required: true,
  },
  {
    part: "When to use it",
    example: "Use when the user asks about a specific order and has an order ID.",
    required: true,
  },
  {
    part: "When NOT to use it",
    example: "Do not use for searching orders — use search_orders instead.",
    required: false,
  },
  {
    part: "What it returns",
    example: "Returns order status, item list, shipping address, and payment info.",
    required: true,
  },
  {
    part: "Edge cases",
    example: "Returns an error if the order ID is invalid or the order was deleted.",
    required: false,
  },
];

const parameterDesign = [
  {
    title: "Add descriptions to every parameter",
    code: `// Good: description explains format and purpose
{
  order_id: {
    type: "string",
    description: "Order ID in format 'ORD-1234'"
  }
}

// Bad: no description
{
  id: { type: "string" }
}`,
  },
  {
    title: "Use enums for constrained values",
    code: `// Good: model can only pick valid values
{
  status: {
    type: "string",
    enum: ["open", "closed", "pending"],
    description: "Filter by ticket status"
  }
}

// Bad: model has to guess valid values
{
  status: { type: "string" }
}`,
  },
  {
    title: "Set bounds on numbers and arrays",
    code: `// Good: clear boundaries
{
  limit: {
    type: "number",
    minimum: 1,
    maximum: 100,
    default: 10,
    description: "Max results to return (1-100)"
  },
  tags: {
    type: "array",
    items: { type: "string" },
    maxItems: 10,
    description: "Filter by tags (max 10)"
  }
}`,
  },
  {
    title: "Mark required vs optional clearly",
    code: `{
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "Search query (required)"
    },
    page: {
      type: "number",
      description: "Page number (optional, default: 1)"
    }
  },
  required: ["query"]
}`,
  },
];

const granularitySpectrum = [
  {
    level: "Too Fine",
    example: "open_db_connection, write_sql_query, execute_query, parse_results, close_connection",
    problem: "Forces the model to orchestrate low-level steps it shouldn't need to know about. 5 tool calls instead of 1.",
    verdict: "bad",
  },
  {
    level: "Just Right",
    example: "search_orders(query, filters) - handles connection, query, parsing internally",
    problem: "One tool call, one logical action. Internal complexity is hidden behind a clean interface.",
    verdict: "good",
  },
  {
    level: "Too Coarse",
    example: "manage_database(action, table, data, query, filters, sort, limit, offset, join, ...)",
    problem: "Swiss-army-knife tool with 15 parameters. Model has to figure out which combination to use. Errors are hard to diagnose.",
    verdict: "bad",
  },
];

export function DesigningTools() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Tool design is API design for AI models.</strong> The same
          principles that make APIs developer-friendly — clear naming, good
          documentation, typed schemas — make tools model-friendly. But there are
          unique considerations: models read descriptions literally, can&apos;t ask
          clarifying questions, and will creatively misuse ambiguous interfaces.
        </p>
      </div>

      {/* Naming Conventions */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Naming Conventions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {namingRules.map((rule) => (
              <div key={rule.rule} className="space-y-2">
                <h4 className="font-semibold text-sm">{rule.rule}</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                    <p className="text-xs font-semibold text-green-600 mb-1">
                      Good
                    </p>
                    <code className="text-xs text-foreground/80 font-mono">
                      {rule.good}
                    </code>
                  </div>
                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                    <p className="text-xs font-semibold text-red-600 mb-1">
                      Bad
                    </p>
                    <code className="text-xs text-foreground/80 font-mono">
                      {rule.bad}
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rule.why}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description Anatomy */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <Badge variant="secondary">Critical</Badge>
            Anatomy of a Good Tool Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Tool descriptions are the model&apos;s only guide for choosing and
            using your tools. A good description has these parts:
          </p>
          <div className="space-y-3">
            {descriptionAnatomy.map((part) => (
              <div
                key={part.part}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/10 border border-border/50"
              >
                <div className="flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={
                      part.required
                        ? "text-primary border-primary/30"
                        : "text-muted-foreground border-border"
                    }
                  >
                    {part.required ? "Required" : "Helpful"}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{part.part}</h4>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    &ldquo;{part.example}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parameter Design */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Parameter Design</h3>
        <div className="space-y-4">
          {parameterDesign.map((item) => (
            <Card key={item.title} className="bg-card/50">
              <CardContent className="pt-4 pb-4">
                <h4 className="font-semibold text-sm mb-3">{item.title}</h4>
                <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">
                  {item.code}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tool Granularity */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Tool Granularity — Finding the Right Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Each tool should represent one logical action at the right level of
            abstraction. Too fine forces unnecessary orchestration. Too coarse
            creates a confusing mega-tool.
          </p>
          <div className="space-y-3">
            {granularitySpectrum.map((item) => (
              <div
                key={item.level}
                className={`p-4 rounded-lg border ${
                  item.verdict === "good"
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-red-500/5 border-red-500/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={
                      item.verdict === "good"
                        ? "text-green-600 border-green-500/40"
                        : "text-red-600 border-red-500/40"
                    }
                  >
                    {item.level}
                  </Badge>
                </div>
                <code className="text-xs text-foreground/80 font-mono block mb-2">
                  {item.example}
                </code>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.problem}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Output Formatting */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          The Output Rule
        </p>
        <p className="text-foreground/90 leading-relaxed">
          Tool outputs go back into the context window. Every unnecessary field,
          every raw API dump, every untruncated list competes for the model&apos;s
          attention and eats your token budget. <strong>Return only what the
          model needs to formulate its response</strong> — typically 10-20% of
          the raw data. A well-designed tool output is the highest-leverage
          context optimization you can make.
        </p>
      </div>
    </div>
  );
}
