import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const lifecycleSteps = [
  {
    step: 1,
    name: "Tool Definition",
    description:
      "You define tools with names, descriptions, and JSON Schema parameters. These definitions are injected into the model's context alongside the system prompt.",
    detail:
      "Each tool definition consumes context tokens. A tool with a complex schema can use 200-500 tokens just for its definition.",
  },
  {
    step: 2,
    name: "Model Decides to Call a Tool",
    description:
      "Based on the user's message and available tools, the model outputs a structured tool call instead of a text response. It selects the tool name and generates parameters.",
    detail:
      'The model returns a special "tool_use" content block with the tool name and arguments as JSON. It can also include text reasoning before the tool call.',
  },
  {
    step: 3,
    name: "Your Code Executes the Tool",
    description:
      "Your application receives the tool call, validates the parameters, executes the underlying function (API call, database query, etc.), and captures the result.",
    detail:
      "This is where validation, sandboxing, error handling, and logging happen. The model never executes code directly — your application is always in the loop.",
  },
  {
    step: 4,
    name: "Result Injected Back into Context",
    description:
      'The tool result is sent back to the model as a "tool_result" message. The model then generates its final response using both the original context and the tool output.',
    detail:
      "Tool results consume context tokens. A large result (raw API response) can waste thousands of tokens. Keep results minimal and structured.",
  },
];

const parallelToolExample = {
  description:
    "When a task requires multiple independent pieces of information, the model can emit multiple tool calls in a single response. Your application executes them concurrently and returns all results at once.",
  benefits: [
    "Reduces round trips between model and application",
    "Enables concurrent execution for faster total latency",
    "Natural fit for questions like 'Compare weather in NYC and London'",
    "Model reasons over all results together for a unified response",
  ],
};

const keyPrinciples = [
  {
    title: "The Model Never Executes Code",
    description:
      "Tool use is structured output — the model generates JSON describing what to call and with what parameters. Your application handles all execution. This is a fundamental security boundary.",
    color: "text-green-600",
    border: "border-green-500/20",
  },
  {
    title: "Tool Calls Are Another Turn in the Conversation",
    description:
      "A tool call creates a new message pair in the conversation: the assistant's tool_use message and the tool_result response. Both consume context tokens and persist in history.",
    color: "text-blue-600",
    border: "border-blue-500/20",
  },
  {
    title: "The Model Sees Tool Definitions as Context",
    description:
      "Every tool definition is serialized into the context window alongside the system prompt. 20 tools with complex schemas can consume 5,000-10,000 tokens before any conversation happens.",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
  },
  {
    title: "Tool Results Replace the Model's Knowledge",
    description:
      "When a tool returns data, the model treats it as ground truth. This is powerful (real-time data) but dangerous (if the tool returns wrong data, the model will confidently present it).",
    color: "text-red-600",
    border: "border-red-500/20",
  },
];

export function ToolFundamentals() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Tool use</strong> (also called function calling) is the
          mechanism that lets LLMs interact with the outside world. Instead of
          only generating text, the model can output structured requests to call
          functions you define — fetching real-time data, executing actions, and
          accessing systems the model has no direct connection to.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is what separates a chatbot from an agent. Without tools, a model
          can only reason over its training data and the text in its context
          window. With tools, it can check live databases, call APIs, read files,
          run code, and take actions in the real world.
        </p>
      </div>

      {/* How Tool Calling Works */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-3">The Tool Call Lifecycle</Badge>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Every tool interaction follows a 4-step lifecycle. Understanding this
            loop is essential — it determines where you add validation, error
            handling, and security controls.
          </p>
          <div className="space-y-4">
            {lifecycleSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono font-bold text-primary">
                  {step.step}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{step.name}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {step.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1 italic">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parallel Tool Calls */}
      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <Badge variant="secondary">Advanced</Badge>
            Parallel Tool Calls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {parallelToolExample.description}
          </p>
          <div className="bg-[#0d1117] rounded-md p-4 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap">
{`// Model emits two tool calls in one response:
[
  { tool: "get_weather", args: { city: "New York" } },
  { tool: "get_weather", args: { city: "London" } },
]

// Your app executes both concurrently:
const results = await Promise.all(
  toolCalls.map((call) => executeTool(call))
);

// Both results sent back → model gives unified answer`}
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {parallelToolExample.benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/90"
              >
                <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">
                  +
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Principles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Principles</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {keyPrinciples.map((principle) => (
            <Card
              key={principle.title}
              className={`bg-card/50 ${principle.border}`}
            >
              <CardContent className="pt-6">
                <h4
                  className={`font-semibold text-sm mb-2 ${principle.color}`}
                >
                  {principle.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {principle.description}
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
          Tool use is <strong>not</strong> code execution — it is structured
          output. The model generates JSON that describes a desired action, and
          your application decides whether and how to execute it. This
          distinction is the foundation of safe, reliable agent systems. You are
          always in the loop.
        </p>
      </div>
    </div>
  );
}
