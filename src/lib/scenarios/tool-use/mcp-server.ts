import type { PlaygroundScenario } from "@/lib/playground-data";

export const mcpServerScenario: PlaygroundScenario = {
  id: "mcp-server",
  name: "MCP Server Build",
  emphasis: "full-pipeline",
  emphasisLabel: "Full Pipeline",
  inputLabel: "Developer",
  meta: {
    title: "MCP Server Scenario",
    description:
      "Build an MCP server for a database management tool. Each component represents a layer of the server architecture. Toggle them on to see how the server evolves from a broken stub to a production-ready MCP server that Claude can use to query and manage databases.",
    infoCards: [
      { icon: "Code", label: "Protocol", value: "MCP (Model Context Protocol)" },
      { icon: "Package", label: "Server Type", value: "Database management" },
      { icon: "FileText", label: "Transport", value: "stdio + SSE" },
    ],
  },
  customerMessage:
    "List all tables in the production database, show me the schema for the users table, and find all users who signed up in the last 7 days.",
  recommendedBuildOrder: [
    "server-config",
    "tool-registration",
    "resource-handlers",
    "input-validation",
    "error-handling",
    "transport-layer",
  ],
  components: [
    {
      id: "server-config",
      name: "Server Config",
      shortName: "Config",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 220,
      description: "MCP server initialization, capabilities declaration, and metadata.",
      content: `<server_config>
## MCP Server Configuration

\`\`\`typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "database-manager",
  version: "1.0.0",
});

// Server metadata
const SERVER_INFO = {
  name: "database-manager",
  description: "MCP server for PostgreSQL database management",
  version: "1.0.0",
  capabilities: {
    tools: { listChanged: true },
    resources: { subscribe: true, listChanged: true },
  },
};

// Database connection config
const DB_CONFIG = {
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432"),
  database: process.env.DB_NAME ?? "production",
  user: process.env.DB_USER ?? "readonly",
  max_connections: 10,
  idle_timeout: 30000,
  query_timeout: 10000,
};
\`\`\`
</server_config>`,
    },
    {
      id: "tool-registration",
      name: "Tool Registration",
      shortName: "Tools",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 380,
      description: "Tool definitions registered with the MCP server using Zod schemas.",
      content: `<tool_registration>
## MCP Tool Registration

\`\`\`typescript
import { z } from "zod";

server.tool(
  "list_tables",
  "List all tables in the database with row counts and sizes",
  {},
  async () => {
    const tables = await db.query(\`
      SELECT tablename, n_live_tup as row_count
      FROM pg_stat_user_tables ORDER BY tablename
    \`);
    return { content: [{ type: "text", text: JSON.stringify(tables.rows, null, 2) }] };
  }
);

server.tool(
  "get_table_schema",
  "Get the column names, types, and constraints for a specific table",
  { table_name: z.string().describe("Name of the table to inspect") },
  async ({ table_name }) => {
    const schema = await db.query(\`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1 ORDER BY ordinal_position
    \`, [table_name]);
    return { content: [{ type: "text", text: JSON.stringify(schema.rows, null, 2) }] };
  }
);

server.tool(
  "query_table",
  "Execute a read-only SQL query against the database. Only SELECT statements are allowed.",
  {
    sql: z.string().describe("SELECT query to execute"),
    params: z.array(z.string()).optional().describe("Parameterized query values"),
    limit: z.number().default(100).describe("Max rows to return"),
  },
  async ({ sql, params, limit }) => {
    const result = await db.query(\`\${sql} LIMIT \${limit}\`, params);
    return { content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }] };
  }
);
\`\`\`
</tool_registration>`,
    },
    {
      id: "resource-handlers",
      name: "Resource Handlers",
      shortName: "Resources",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 300,
      description: "MCP resource endpoints exposing database schema and metadata as context.",
      content: `<resource_handlers>
## MCP Resource Handlers

\`\`\`typescript
// List available resources
server.resource(
  "db-schema",
  "db://schema/tables",
  async (uri) => {
    const tables = await db.query(\`
      SELECT tablename FROM pg_stat_user_tables ORDER BY tablename
    \`);
    const schemaInfo = [];
    for (const table of tables.rows) {
      const cols = await db.query(\`
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_name = $1
      \`, [table.tablename]);
      schemaInfo.push({
        table: table.tablename,
        columns: cols.rows,
      });
    }
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(schemaInfo, null, 2),
      }],
    };
  }
);

// Individual table resource
server.resource(
  "table-detail",
  new ResourceTemplate("db://tables/{tableName}", { list: undefined }),
  async (uri, { tableName }) => {
    const schema = await db.query(\`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns WHERE table_name = $1
    \`, [tableName]);
    const stats = await db.query(\`
      SELECT n_live_tup as rows, pg_total_relation_size($1) as size_bytes
      FROM pg_stat_user_tables WHERE relname = $1
    \`, [tableName]);
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({ schema: schema.rows, stats: stats.rows[0] }, null, 2),
      }],
    };
  }
);
\`\`\`
</resource_handlers>`,
    },
    {
      id: "input-validation",
      name: "Input Validation",
      shortName: "Validation",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 260,
      description: "SQL injection prevention, query allow-listing, and parameter sanitization.",
      content: `<input_validation>
## Query Validation & Security

\`\`\`typescript
const ALLOWED_OPERATIONS = ["SELECT"] as const;
const BLOCKED_KEYWORDS = ["DROP", "DELETE", "INSERT", "UPDATE", "ALTER", "TRUNCATE", "EXEC"];
const MAX_QUERY_LENGTH = 2000;

function validateQuery(sql: string): { valid: boolean; error?: string } {
  const trimmed = sql.trim().toUpperCase();

  if (sql.length > MAX_QUERY_LENGTH) {
    return { valid: false, error: \`Query exceeds max length of \${MAX_QUERY_LENGTH} chars\` };
  }

  if (!ALLOWED_OPERATIONS.some(op => trimmed.startsWith(op))) {
    return { valid: false, error: "Only SELECT queries are allowed" };
  }

  for (const keyword of BLOCKED_KEYWORDS) {
    if (trimmed.includes(keyword)) {
      return { valid: false, error: \`Blocked keyword detected: \${keyword}\` };
    }
  }

  return { valid: true };
}

// Table name validation (prevents injection in dynamic queries)
function validateTableName(name: string): boolean {
  return /^[a-z_][a-z0-9_]*$/.test(name) && name.length <= 63;
}

// Always use parameterized queries
// GOOD: db.query("SELECT * FROM users WHERE id = $1", [userId])
// BAD:  db.query(\`SELECT * FROM users WHERE id = \${userId}\`)
\`\`\`
</input_validation>`,
    },
    {
      id: "error-handling",
      name: "Error Handling",
      shortName: "Errors",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 280,
      description: "Structured MCP error responses with error codes and user-friendly messages.",
      content: `<error_handling>
## MCP Error Handling

\`\`\`typescript
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

// Wrap tool handlers with consistent error handling
function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<T> {
  try {
    return handler();
  } catch (error) {
    if (error instanceof McpError) throw error;

    if (error.code === "23505") {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "Duplicate key violation — record already exists"
      );
    }
    if (error.code === "42P01") {
      throw new McpError(
        ErrorCode.InvalidRequest,
        \`Table not found: \${error.message}\`
      );
    }
    if (error.code === "42703") {
      throw new McpError(
        ErrorCode.InvalidRequest,
        \`Column not found: \${error.message}\`
      );
    }
    if (error.message?.includes("timeout")) {
      throw new McpError(
        ErrorCode.InternalError,
        "Query timed out after 10 seconds. Try a simpler query or add LIMIT."
      );
    }

    throw new McpError(
      ErrorCode.InternalError,
      \`Database error: \${error.message}\`
    );
  }
}

// Connection health check
async function healthCheck(): Promise<{ healthy: boolean; latency: number }> {
  const start = Date.now();
  try {
    await db.query("SELECT 1");
    return { healthy: true, latency: Date.now() - start };
  } catch {
    return { healthy: false, latency: -1 };
  }
}
\`\`\`
</error_handling>`,
    },
    {
      id: "transport-layer",
      name: "Transport Layer",
      shortName: "Transport",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 200,
      description: "stdio and SSE transport setup for local and remote MCP connections.",
      content: `<transport_layer>
## MCP Transport Configuration

\`\`\`typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

// stdio transport — for local tools (Claude Desktop, CLI)
async function startStdio() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Database MCP server running on stdio");
}

// SSE transport — for remote/web connections
async function startSSE(port: number) {
  const app = express();

  app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
  });

  app.post("/messages", async (req, res) => {
    await transport.handlePostMessage(req, res);
  });

  app.listen(port, () => {
    console.error(\`Database MCP server running on SSE port \${port}\`);
  });
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await db.end();
  await server.close();
  process.exit(0);
});

// Start based on environment
const mode = process.env.MCP_TRANSPORT ?? "stdio";
if (mode === "sse") {
  startSSE(parseInt(process.env.PORT ?? "3001"));
} else {
  startStdio();
}
\`\`\`
</transport_layer>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Broken Server",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "I need to connect to a database but I don't have any server configuration or tools available. I can't list tables, read schemas, or run queries. The MCP server isn't set up.",
      issues: [
        "No server initialization — nothing to connect to",
        "No tools registered — Claude can't call anything",
        "No database connection config",
        "No transport — no way to communicate",
        "No error handling — would crash on first issue",
      ],
      strengths: [],
    },
    {
      id: "config-only",
      label: "Configured but Empty",
      requiredComponents: ["server-config"],
      score: 15,
      agentResponse:
        "The MCP server 'database-manager' is initialized and I can see it's configured to connect to a PostgreSQL database. However, no tools are registered — I cannot list tables, inspect schemas, or run queries. The server starts but has no capabilities.",
      issues: [
        "No tools registered — server has zero capabilities",
        "Cannot respond to any tool calls",
        "No resources exposed for context",
        "No error handling for database failures",
        "No transport — server can't receive messages",
      ],
      strengths: [
        "Server identity and version declared",
        "Database connection configured with environment variables",
        "Connection pooling settings defined",
      ],
    },
    {
      id: "config-tools",
      label: "Functional but Fragile",
      requiredComponents: ["server-config", "tool-registration"],
      score: 35,
      agentResponse:
        "Let me query the database.\n\nlist_tables()\n-> Found 12 tables: users, orders, products, sessions...\n\nget_table_schema({ table_name: \"users\" })\n-> Columns: id (uuid), email (varchar), name (varchar), created_at (timestamp)...\n\nquery_table({ sql: \"SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'\", limit: 100 })\n-> Found 23 users who signed up in the last 7 days.\n\nNote: I completed the queries but there's no input validation — a malicious query could modify data. Also, if the database connection fails, the server will crash.",
      issues: [
        "No SQL injection protection — DROP TABLE could slip through",
        "No error handling — server crashes on connection timeout",
        "No resource context — Claude can't browse schema proactively",
        "No transport setup — how does Claude connect?",
        "Raw SQL queries accepted without validation",
      ],
      strengths: [
        "All three required tools work (list, schema, query)",
        "Zod schemas validate tool parameters",
        "Parameterized query support in query_table",
        "Query results returned as structured JSON",
      ],
    },
    {
      id: "config-tools-resources",
      label: "Context-Rich",
      requiredComponents: ["server-config", "tool-registration", "resource-handlers"],
      score: 50,
      agentResponse:
        "Let me get the full database context first.\n\n[Reading resource: db://schema/tables]\n-> Full schema loaded: 12 tables with all column types\n\nWith the schema context, I can write precise queries:\n\nlist_tables() -> 12 tables (users has 45,000 rows)\n\nget_table_schema({ table_name: \"users\" })\n-> id (uuid, PK), email (varchar, unique), name (varchar), created_at (timestamptz), plan (varchar)\n\nquery_table({ sql: \"SELECT id, email, name, created_at FROM users WHERE created_at > NOW() - INTERVAL '7 days' ORDER BY created_at DESC\", limit: 100 })\n-> 23 recent signups, ordered by newest first\n\nThe resource context helped me select the right columns and know that created_at is a timestamptz.",
      issues: [
        "No SQL validation — could execute destructive queries",
        "No error handling — timeouts crash the server",
        "No transport configured — deployment not possible",
        "Query could include sensitive columns without masking",
      ],
      strengths: [
        "Resources provide schema context before querying",
        "Claude can browse database structure proactively",
        "More precise queries because column types are known",
        "Subscribable resources for schema change notifications",
      ],
    },
    {
      id: "config-tools-resources-validation",
      label: "Secure Queries",
      requiredComponents: ["server-config", "tool-registration", "resource-handlers", "input-validation"],
      score: 65,
      agentResponse:
        "Let me query the database with proper validation.\n\n[Reading resource: db://schema/tables]\n-> Schema loaded for all 12 tables\n\nlist_tables() -> 12 tables loaded\n\nget_table_schema({ table_name: \"users\" })\n-> Validation: table name 'users' matches /^[a-z_][a-z0-9_]*$/ - valid\n-> Schema returned with 8 columns\n\nquery_table({ sql: \"SELECT id, email, name, created_at FROM users WHERE created_at > NOW() - INTERVAL '7 days'\", limit: 50 })\n-> Validation: starts with SELECT - allowed\n-> Validation: no blocked keywords found\n-> Validation: query length 89 chars (under 2000 limit)\n-> 23 users found\n\nAll queries validated before execution. Destructive operations are blocked.",
      issues: [
        "No error handling for database connection failures",
        "No transport — server can't be deployed",
        "Timeout queries will crash the server",
        "No health check endpoint",
      ],
      strengths: [
        "SQL injection prevention via keyword blocking",
        "Only SELECT queries allowed",
        "Table names validated with regex",
        "Parameterized queries prevent injection",
        "Query length limits enforced",
      ],
    },
    {
      id: "config-tools-resources-validation-errors",
      label: "Resilient Server",
      requiredComponents: ["server-config", "tool-registration", "resource-handlers", "input-validation", "error-handling"],
      score: 80,
      agentResponse:
        "Database MCP server ready. Running health check...\n-> { healthy: true, latency: 3ms }\n\n[Reading resource: db://schema/tables] -> Schema loaded\n\nlist_tables() -> 12 tables\n\nget_table_schema({ table_name: \"users\" })\n-> Validated, schema returned\n\nget_table_schema({ table_name: \"nonexistent\" })\n-> McpError(InvalidRequest, \"Table not found: nonexistent\")\n-> Error returned to Claude gracefully, server continues running\n\nquery_table({ sql: \"SELECT id, email, name, created_at FROM users WHERE created_at > NOW() - INTERVAL '7 days'\", limit: 50 })\n-> Validated (SELECT only, no blocked keywords)\n-> 23 users returned\n\nquery_table({ sql: \"DROP TABLE users\" })\n-> Blocked: \"Only SELECT queries are allowed\"\n-> McpError returned, server stable\n\nAll errors handled with MCP error codes. Server remains stable under invalid inputs.",
      issues: [
        "No transport layer — can't deploy to Claude Desktop or web",
        "Missing graceful shutdown handler",
      ],
      strengths: [
        "Health check verifies database connectivity",
        "PostgreSQL error codes mapped to MCP error codes",
        "Timeout protection on long-running queries",
        "Server remains stable after errors",
        "Destructive queries blocked with clear error messages",
        "Connection pool prevents resource exhaustion",
      ],
    },
    {
      id: "all",
      label: "Production MCP Server",
      requiredComponents: ["server-config", "tool-registration", "resource-handlers", "input-validation", "error-handling", "transport-layer"],
      score: 95,
      agentResponse:
        "Database MCP server v1.0.0 started on stdio transport.\nHealth check: { healthy: true, latency: 2ms }\n\nProcessing request: \"List tables, show users schema, find recent signups\"\n\n[1/3] list_tables()\n-> 12 tables returned with row counts\n-> users: 45,230 rows | orders: 128,500 rows | products: 3,200 rows\n\n[2/3] get_table_schema({ table_name: \"users\" })\n-> Input validated: table name matches pattern\n-> 8 columns: id (uuid, PK), email (varchar, unique), name (varchar), created_at (timestamptz), plan (varchar, default 'free'), avatar_url (text, nullable), last_login (timestamptz), metadata (jsonb)\n\n[3/3] query_table({ sql: \"SELECT id, email, name, plan, created_at FROM users WHERE created_at > NOW() - INTERVAL '7 days' ORDER BY created_at DESC\", limit: 50 })\n-> Validated: SELECT only, no blocked keywords, 147 chars\n-> 23 users found, newest first\n-> Query completed in 45ms\n\nAll 3 operations completed successfully. Server stable, connection pool at 2/10 active connections. Graceful shutdown handler registered.",
      issues: ["Could add query result caching for repeated schema lookups"],
      strengths: [
        "Complete MCP server: config, tools, resources, validation, errors, transport",
        "stdio + SSE transport options for local and remote use",
        "SQL injection prevention with keyword blocking and parameterized queries",
        "PostgreSQL error codes mapped to MCP error codes",
        "Health check and connection pool monitoring",
        "Graceful shutdown with resource cleanup",
        "Resource subscriptions for schema change notifications",
        "Production-ready with environment variable configuration",
      ],
    },
    {
      id: "tools-only",
      label: "Floating Tools",
      requiredComponents: ["tool-registration"],
      score: 10,
      agentResponse:
        "I have tools registered but no server to host them.\n\nlist_tables() -> Connection refused. No database configuration found.\nget_table_schema({ table_name: \"users\" }) -> Error: db is not defined\n\nThe tools are defined with proper Zod schemas but there's no server config to connect to a database, no error handling for failures, and no transport to receive requests.",
      issues: [
        "Tools exist but can't connect to anything",
        "No database connection configuration",
        "No error handling — raw errors crash the process",
        "No transport — can't receive MCP requests",
        "No resources — Claude has no context about the database",
      ],
      strengths: [
        "Tool schemas are properly typed with Zod",
        "Tool names follow clear conventions",
      ],
    },
  ],
  principles: [
    {
      id: "layered-architecture",
      title: "Layer by Layer",
      description: "An MCP server is built in layers: config (identity), tools (capabilities), resources (context), validation (security), errors (resilience), transport (connectivity). Each layer depends on the ones below it.",
      linkedComponents: ["server-config", "tool-registration", "resource-handlers", "transport-layer"],
    },
    {
      id: "security-is-not-optional",
      title: "Security Is Not Optional",
      description: "Without input validation, an MCP server is a SQL injection vector. The model can be prompt-injected into sending destructive queries. Validation and error handling are required layers, not nice-to-haves.",
      linkedComponents: ["input-validation", "error-handling"],
    },
    {
      id: "resources-provide-context",
      title: "Resources Provide Context",
      description: "MCP resources give the model schema awareness before it writes queries. Without resources, the model guesses column names and types. With resources, it writes precise, correct SQL on the first attempt.",
      linkedComponents: ["resource-handlers", "tool-registration"],
    },
    {
      id: "transport-completes-the-loop",
      title: "Transport Completes the Loop",
      description: "A server with perfect tools but no transport is useless. stdio connects to local clients (Claude Desktop), SSE enables remote access. The transport layer is what makes the server reachable.",
      linkedComponents: ["transport-layer", "server-config"],
    },
  ],
};
