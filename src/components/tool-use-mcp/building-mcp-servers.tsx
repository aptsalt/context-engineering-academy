import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const serverSteps = [
  {
    step: 1,
    title: "Initialize the Server",
    code: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
});`,
    explanation:
      "Create an McpServer instance with a name and version. The name helps clients identify your server; the version enables capability negotiation.",
  },
  {
    step: 2,
    title: "Define Tools with Zod Schemas",
    code: `import { z } from "zod";

server.tool(
  "search_issues",
  "Search GitHub issues by query, label, or status. " +
    "Returns up to 20 matching issues with title, status, and URL.",
  {
    query: z.string().describe("Search query string"),
    label: z.string().optional().describe("Filter by label name"),
    state: z.enum(["open", "closed", "all"]).default("open")
      .describe("Filter by issue state"),
    limit: z.number().int().min(1).max(50).default(20)
      .describe("Max results to return"),
  },
  async ({ query, label, state, limit }) => {
    const issues = await github.searchIssues({ query, label, state, limit });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            issues.map((issue) => ({
              number: issue.number,
              title: issue.title,
              state: issue.state,
              url: issue.html_url,
              labels: issue.labels.map((l) => l.name),
            })),
            null,
            2,
          ),
        },
      ],
    };
  },
);`,
    explanation:
      "server.tool() registers a tool with name, description, Zod schema for parameters, and an async handler. The SDK automatically validates inputs against the schema. Return content as an array of typed content blocks.",
  },
  {
    step: 3,
    title: "Define Resources",
    code: `server.resource(
  "repo-readme",
  "github://repo/README.md",
  { mimeType: "text/markdown" },
  async (uri) => {
    const content = await github.getFileContent("README.md");
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  },
);`,
    explanation:
      "Resources expose data the client can read without the model having to call a tool. URI-based addressing (github://repo/README.md) makes resources discoverable and cacheable.",
  },
  {
    step: 4,
    title: "Connect a Transport",
    code: `import { StdioServerTransport } from
  "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
await server.connect(transport);

// For remote servers, use SSE instead:
// import { SSEServerTransport } from
//   "@modelcontextprotocol/sdk/server/sse.js";
// app.get("/sse", (req, res) => {
//   const transport = new SSEServerTransport("/messages", res);
//   server.connect(transport);
// });`,
    explanation:
      "StdioServerTransport communicates over stdin/stdout — the client launches your server as a child process. For remote access, use SSEServerTransport over HTTP. The server logic is identical regardless of transport.",
  },
];

const realWorldExamples = [
  {
    name: "Database Query Server",
    tools: ["run_query", "list_tables", "describe_table"],
    description:
      "Exposes read-only SQL query execution with schema introspection. Uses parameterized queries to prevent injection. Returns column names and rows as structured data.",
    keyPattern: "Read-only connection, query validation, result truncation",
  },
  {
    name: "Git Repository Server",
    tools: ["search_code", "get_file", "list_branches", "get_diff"],
    description:
      "Provides code search, file reading, branch listing, and diff viewing for a git repository. Resources expose frequently accessed files like README and config.",
    keyPattern: "Resources for static files, tools for dynamic queries",
  },
  {
    name: "Notification Server",
    tools: ["send_email", "send_slack", "list_channels"],
    description:
      "Sends messages through email and Slack. Requires explicit confirmation for sends (returns preview first). Rate-limited to prevent spam.",
    keyPattern: "Confirmation step, rate limiting, audit logging",
  },
];

const testingStrategies = [
  {
    name: "MCP Inspector",
    description:
      "Official interactive testing tool. Connect your server and manually test each tool, view schemas, and verify error handling. Best for development and debugging.",
    command: "npx @modelcontextprotocol/inspector your-server.js",
  },
  {
    name: "Unit Tests with In-Memory Transport",
    description:
      "Create an InMemoryTransport pair for automated testing. Call tools programmatically and assert on responses. No external dependencies needed.",
    command: "vitest run --coverage",
  },
  {
    name: "Claude Desktop Integration",
    description:
      "Add your server to Claude Desktop's config for end-to-end testing. Verify the model can discover, select, and correctly use your tools in real conversations.",
    command: "Edit ~/Library/Application Support/Claude/claude_desktop_config.json",
  },
];

const configExample = `// claude_desktop_config.json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["path/to/my-server/dist/index.js"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}`;

export function BuildingMcpServers() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Building an MCP server means creating a program that exposes tools,
          resources, and prompts through the standard MCP protocol. The official
          TypeScript SDK handles protocol details — you focus on the tools
          themselves.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          An MCP server is typically a small, focused program: 100-500 lines for
          a well-scoped server. It wraps a single data source or service (GitHub,
          a database, Slack) and makes it available to any MCP client.
        </p>
      </div>

      {/* Step by Step */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">
          Building a Server, Step by Step
        </h3>
        {serverSteps.map((step) => (
          <Card key={step.step} className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
                  {step.step}
                </span>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-[#0d1117] rounded-md p-4 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {step.code}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.explanation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Claude Desktop Config */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <Badge variant="secondary">Config</Badge>
            Connecting to Claude Desktop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Add your server to Claude Desktop by editing the configuration file.
            Claude will automatically launch the server and discover its tools.
          </p>
          <div className="bg-[#0d1117] rounded-md p-4 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">
            {configExample}
          </div>
        </CardContent>
      </Card>

      {/* Real-World Examples */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Real-World Server Patterns</h3>
        <div className="space-y-3">
          {realWorldExamples.map((example) => (
            <Card key={example.name} className="bg-card/50">
              <CardContent className="pt-4 pb-4">
                <h4 className="font-semibold text-sm mb-1">{example.name}</h4>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {example.tools.map((tool) => (
                    <Badge
                      key={tool}
                      variant="outline"
                      className="text-xs font-mono"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {example.description}
                </p>
                <div className="bg-muted/20 rounded-md px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    Key pattern:{" "}
                  </span>
                  <span className="text-xs text-foreground/90">
                    {example.keyPattern}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testing */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Testing Your MCP Server</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testingStrategies.map((strategy) => (
              <div
                key={strategy.name}
                className="p-4 rounded-lg bg-muted/10 border border-border/50"
              >
                <h4 className="font-semibold text-sm mb-1">
                  {strategy.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {strategy.description}
                </p>
                <code className="text-xs text-primary/80 font-mono bg-primary/5 px-2 py-1 rounded">
                  {strategy.command}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          The best MCP servers are <strong>small and focused</strong>. A server
          that wraps GitHub with 5 well-designed tools is better than a
          &ldquo;universal&rdquo; server with 50 tools across 10 services. Clients
          can compose multiple focused servers. Each server should do one thing
          well.
        </p>
      </div>
    </div>
  );
}
