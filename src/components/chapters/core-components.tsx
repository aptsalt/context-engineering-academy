import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const components = [
  {
    number: 1,
    name: "System Prompts & Instructions",
    color: "text-green-600",
    border: "border-green-500/20",
    description:
      "Define the agent's role, behavior rules, and guidelines. The foundational layer of context that shapes all subsequent interactions.",
    example: `Role: Customer service agent for Acme Corp
Guidelines: Be concise, verify identity first
Escalation: Refunds over $100 → human agent`,
    tip: 'Find the "Goldilocks zone" — specific enough to guide, flexible enough for judgment.',
  },
  {
    number: 2,
    name: "Tool Definitions",
    color: "text-red-600",
    border: "border-red-500/20",
    description:
      "Descriptions of capabilities the model can invoke — APIs, database queries, file operations, web searches. Each tool definition consumes context tokens.",
    example: `get_account(customer_id: string)
  → Returns account details, orders, status
process_refund(order_id: string, reason: string)
  → Issues refund, returns confirmation`,
    tip: "Keep under 30 tools. Use clear, non-overlapping descriptions. If a human can't tell which tool to use, the model can't either.",
  },
  {
    number: 3,
    name: "Few-Shot Examples",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    description:
      "Concrete input/output demonstrations that establish the expected format and behavior. One of the most powerful context engineering tools.",
    example: `Input: "Jane Doe, 28, engineer at Meta"
Output: {"name":"Jane Doe","age":28,...}

Input: "Bob Lee - 42 - CTO @ Stripe"
Output: {"name":"Bob Lee","age":42,...}`,
    tip: "2-3 examples usually suffice. Ensure examples cover edge cases and different input formats.",
  },
  {
    number: 4,
    name: "Conversation History",
    color: "text-blue-600",
    border: "border-blue-500/20",
    description:
      "The running record of user messages, assistant responses, and tool call results. The fastest-growing component of context — requires active management.",
    example: `User: "What's my account balance?"
Assistant: [calls get_account("user_123")]
Tool: {"balance": 1500, "currency": "USD"}
Assistant: "Your balance is $1,500."`,
    tip: "Implement compaction before you hit the wall. Summarize history at 80% capacity, preserving key decisions and facts.",
  },
  {
    number: 5,
    name: "Retrieved Documents (RAG)",
    color: "text-purple-600",
    border: "border-purple-500/20",
    description:
      "External knowledge pulled in at runtime via vector search. The primary mechanism for providing facts the model wasn't trained on.",
    example: `[Source 1: Refund Policy v3.2]
Refunds must be requested within 30 days.
Digital products: store credit only.
Physical products: original payment method.`,
    tip: "Set minimum relevance thresholds (0.7+). Use reranking. Instruct the model to cite sources by number.",
  },
  {
    number: 6,
    name: "Memory (Short & Long Term)",
    color: "text-cyan-600",
    border: "border-cyan-500/20",
    description:
      "Persistent information across sessions. Short-term: current task state. Long-term: user preferences, past interactions, learned facts stored in vector DBs or files.",
    example: `Short-term (scratchpad):
  Current task: Researching auth options
  Findings so far: JWT preferred for APIs...

Long-term (persistent):
  User prefers: TypeScript, Tailwind, Supabase
  Past issue: Had billing error on 2025-03-15`,
    tip: "Use scratchpads for task state. Store long-term memory in vector databases with expiration for stale data.",
  },
];

export function CoreComponents() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Context isn&apos;t just the prompt. It&apos;s{" "}
          <strong>everything the model sees</strong> before generating a
          response. These 6 components make up the full context budget that you
          need to manage.
        </p>
      </div>

      {/* Visual: Context Window Budget */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Context Window Budget (128K tokens example)
          </p>
          <div className="space-y-2">
            {[
              { name: "System Prompt", pct: 5, color: "bg-green-500" },
              { name: "Tool Definitions", pct: 8, color: "bg-red-500" },
              { name: "Few-Shot Examples", pct: 4, color: "bg-yellow-500" },
              { name: "Conversation History", pct: 45, color: "bg-blue-500" },
              { name: "RAG Documents", pct: 25, color: "bg-purple-500" },
              { name: "Memory", pct: 8, color: "bg-cyan-500" },
              { name: "Headroom (for response)", pct: 5, color: "bg-muted" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-36 text-xs text-muted-foreground truncate">
                  {item.name}
                </span>
                <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-8 text-xs font-mono text-muted-foreground text-right">
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Conversation history is typically the largest consumer. This is why
            compaction and summarization are critical.
          </p>
        </CardContent>
      </Card>

      {/* Component Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {components.map((comp) => (
          <Card key={comp.name} className={`bg-card/50 ${comp.border}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-3">
                <Badge variant="outline" className={`${comp.color} border-current text-xs`}>
                  {comp.number}
                </Badge>
                <h3 className="font-semibold text-sm">{comp.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {comp.description}
              </p>
              <div className="bg-[#0d1117] rounded-md p-3 font-mono text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap mb-3">
                {comp.example}
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary text-xs">Tip:</span>
                <p className="text-xs text-muted-foreground">{comp.tip}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
