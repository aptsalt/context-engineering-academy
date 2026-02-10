import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { quotes } from "@/lib/tool-use-mcp-data";

const problemsBeforeMCP = [
  {
    problem: "N x M Integration Problem",
    description:
      "Every AI application needed custom code for every data source. 5 AI apps and 5 tools meant 25 separate integrations to build and maintain.",
  },
  {
    problem: "No Discovery Mechanism",
    description:
      "Tools were hardcoded. There was no way for a client to ask a server 'What tools do you have?' — you had to know the API in advance.",
  },
  {
    problem: "Inconsistent Schemas",
    description:
      "Every tool server defined parameters differently. No standard for describing tool inputs, outputs, or error formats.",
  },
  {
    problem: "No Capability Negotiation",
    description:
      "Clients couldn't check if a server supported the features they needed. Version mismatches caused silent failures.",
  },
];

const architectureComponents = [
  {
    name: "MCP Hosts",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "Applications that want to access tools and data via MCP. Examples: Claude Desktop, IDE extensions, custom AI applications. The host creates and manages MCP client instances.",
    examples: "Claude Desktop, Cursor, Zed, Windsurf, custom apps",
  },
  {
    name: "MCP Clients",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Protocol clients that maintain 1:1 connections with MCP servers. Each client connects to one server and handles the JSON-RPC communication protocol. Created by hosts.",
    examples: "Built into the host — one client per server connection",
  },
  {
    name: "MCP Servers",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "Lightweight programs that expose tools, resources, and prompts through the standard MCP protocol. Each server typically wraps one data source or service.",
    examples: "GitHub server, PostgreSQL server, filesystem server, Slack server",
  },
];

const primitives = [
  {
    name: "Tools",
    description:
      "Functions the model can call. Each tool has a name, description, and parameter schema. The server defines them; the model invokes them through the client.",
    controlledBy: "Model-initiated",
    badge: "Core",
    example: "search_issues, run_query, send_message",
  },
  {
    name: "Resources",
    description:
      "Data sources the client can read, like files or database records. Resources are identified by URIs and can be watched for changes. Better than tools for frequently accessed read-only data.",
    controlledBy: "Application-initiated",
    badge: "Core",
    example: "file:///config.json, db://users/123, git://repo/main",
  },
  {
    name: "Prompts",
    description:
      "Reusable prompt templates that the server provides. Useful for standardized interactions — the server knows the best way to phrase requests for its domain.",
    controlledBy: "User-initiated",
    badge: "Optional",
    example: "summarize_pr, explain_error, generate_migration",
  },
];

const protocolLifecycle = [
  {
    phase: "Initialize",
    description:
      "Client sends 'initialize' with its protocol version and capabilities. Server responds with its own version, capabilities, and server info. Both sides learn what the other supports.",
  },
  {
    phase: "Capability Discovery",
    description:
      "Client queries available tools (tools/list), resources (resources/list), and prompts (prompts/list). Server returns schemas for each. Client now knows everything the server offers.",
  },
  {
    phase: "Operation",
    description:
      "Client calls tools (tools/call), reads resources (resources/read), or renders prompts (prompts/get). Server executes and returns results. Notifications flow both ways for events like resource changes.",
  },
  {
    phase: "Shutdown",
    description:
      "Either side can close the connection cleanly. The transport layer (stdio pipe or SSE connection) is closed gracefully.",
  },
];

const transports = [
  {
    name: "stdio (Standard I/O)",
    description:
      "Communication over stdin/stdout. The client launches the server as a child process. Simple, secure (no network exposure), and the default for local tools.",
    useCase: "Local development, desktop apps, CLI tools",
    pros: ["No network setup", "Secure by default", "Simple debugging"],
  },
  {
    name: "SSE (Server-Sent Events)",
    description:
      "HTTP-based transport using Server-Sent Events for server-to-client messages and HTTP POST for client-to-server messages. Enables remote servers.",
    useCase: "Remote servers, cloud deployments, shared tools",
    pros: ["Works over network", "Firewall-friendly (HTTP)", "Scalable"],
  },
];

export function McpIntro() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          The <strong>Model Context Protocol (MCP)</strong> is an open standard
          that defines how AI applications connect to external tools and data
          sources. Released by Anthropic in November 2024, MCP replaces the
          fragmented landscape of custom tool integrations with a single,
          universal protocol.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Think of it like USB-C for AI: before MCP, every AI app needed custom
          connectors for every tool. With MCP, you build one server and it works
          with every MCP-compatible client — Claude Desktop, Cursor, Zed,
          Windsurf, and any custom application.
        </p>
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

      {/* Problem Before MCP */}
      <Card className="bg-card/50 border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <Badge
              variant="outline"
              className="text-red-600 border-red-500/40"
            >
              Before MCP
            </Badge>
            The Problem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {problemsBeforeMCP.map((item) => (
              <div
                key={item.problem}
                className="bg-red-500/5 rounded-lg p-4 border border-red-500/10"
              >
                <h4 className="font-semibold text-sm text-red-600 mb-1">
                  {item.problem}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Architecture */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Architecture</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          MCP uses a client-server architecture with three layers: hosts that
          run AI applications, clients that manage protocol connections, and
          servers that expose capabilities.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {architectureComponents.map((comp) => (
            <Card
              key={comp.name}
              className={`bg-card/50 ${comp.border}`}
            >
              <CardContent className="pt-6">
                <h4
                  className={`font-semibold text-sm mb-2 ${comp.color}`}
                >
                  {comp.name}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {comp.description}
                </p>
                <div className="flex items-start gap-2">
                  <span className="text-primary text-xs">Examples:</span>
                  <p className="text-xs text-muted-foreground">
                    {comp.examples}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Primitives */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">The Three MCP Primitives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            MCP servers expose three types of capabilities. Each has a different
            control flow — understanding who initiates each is key.
          </p>
          <div className="space-y-3">
            {primitives.map((prim) => (
              <div
                key={prim.name}
                className="p-4 rounded-lg bg-muted/10 border border-border/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {prim.badge}
                  </Badge>
                  <h4 className="font-semibold text-sm">{prim.name}</h4>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {prim.controlledBy}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {prim.description}
                </p>
                <code className="text-xs text-foreground/70 font-mono">
                  {prim.example}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Lifecycle */}
      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Protocol Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {protocolLifecycle.map((step, i) => (
              <div key={step.phase} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-sm">{step.phase}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transports */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Transport Layers</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {transports.map((transport) => (
            <Card key={transport.name} className="bg-card/50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-2">{transport.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {transport.description}
                </p>
                <div className="bg-muted/20 rounded-md px-3 py-2 mb-3">
                  <span className="text-xs text-muted-foreground">
                    Best for:{" "}
                  </span>
                  <span className="text-xs text-foreground/90">
                    {transport.useCase}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {transport.pros.map((pro) => (
                    <Badge
                      key={pro}
                      variant="outline"
                      className="text-xs text-green-600 border-green-500/40"
                    >
                      {pro}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          MCP turns the N x M integration problem into N + M. Instead of every
          AI app building custom connectors for every tool, tool authors build
          one MCP server and app developers add one MCP client. A new tool
          instantly works with every MCP-compatible application.
        </p>
      </div>
    </div>
  );
}
