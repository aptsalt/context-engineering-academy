import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const failureCategories = [
  {
    name: "Model Failures",
    color: "text-red-600",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    description:
      "The LLM itself produces incorrect output despite receiving good context. Includes hallucinations, reasoning errors, instruction non-compliance, and format violations.",
    debugApproach: [
      "Compare the model's input (full context window) against its output",
      "Check if the answer contradicts information in the context",
      "Verify that instructions in the system prompt were followed",
      "Test with a different model to isolate model-specific issues",
    ],
    example:
      "Model claims the refund policy allows 90-day returns, but the RAG document clearly states 30 days. The context was correct; the model hallucinated.",
  },
  {
    name: "Context Failures",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    description:
      "The model produced a reasonable output given what it saw, but it saw the wrong information. Includes missing documents, irrelevant RAG results, stale data, and context overflow.",
    debugApproach: [
      "Inspect the exact context window contents at the time of generation",
      "Verify RAG retrieval quality — were the right documents retrieved?",
      "Check token counts — was the context window overflowing?",
      "Look for contradictions between retrieved documents",
    ],
    example:
      "Agent gives outdated pricing. Trace shows the RAG system retrieved a 2023 pricing document instead of the current 2025 version. The model answered correctly based on what it saw.",
  },
  {
    name: "Tool Failures",
    color: "text-blue-600",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    description:
      "A tool returns incorrect data, times out, or fails silently. The agent continues with bad or missing data, producing a subtly wrong response.",
    debugApproach: [
      "Check tool span: what input did the tool receive? What did it return?",
      "Look for empty or null tool responses that weren't flagged as errors",
      "Verify tool response latency — did it timeout?",
      "Compare tool output against ground truth data",
    ],
    example:
      "Agent says 'you have no open orders' because the database tool returned an empty array due to a permissions error it didn't surface. The trace shows tool.success=true but results=0.",
  },
  {
    name: "Orchestration Failures",
    color: "text-purple-600",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    description:
      "The agent's planning or routing logic made a poor decision. Wrong tool selected, unnecessary steps taken, infinite loops, or premature termination.",
    debugApproach: [
      "Examine the plan span: what strategy did the agent choose and why?",
      "Count the number of steps — is it reasonable for this query?",
      "Look for repeated tool calls that suggest a retry loop",
      "Check if the agent terminated before completing all necessary steps",
    ],
    example:
      "Agent routes a complex billing question to the FAQ search tool instead of the account lookup tool, returning a generic answer instead of the user's specific billing data.",
  },
];

const debugWorkflowSteps = [
  {
    step: 1,
    title: "Start from the trace",
    description:
      "Pull up the trace for the failing request using its trace ID. The trace tree gives you the full execution path.",
  },
  {
    step: 2,
    title: "Identify the failing span",
    description:
      "Walk the trace tree. Which span produced the first incorrect output? Was it a planning step, an LLM call, or a tool execution?",
  },
  {
    step: 3,
    title: "Inspect inputs and outputs",
    description:
      "For the failing span, examine what went in (context, parameters) and what came out (response, tool result). The bug is in the gap between expected and actual.",
  },
  {
    step: 4,
    title: "Classify the failure",
    description:
      "Is it a model failure (bad output given good context), context failure (bad context), tool failure (bad data), or orchestration failure (bad plan)?",
  },
  {
    step: 5,
    title: "Reproduce with replay",
    description:
      "Use the stored execution context (input, messages, tool results) to replay the exact same request. If you can reproduce it, you can fix it.",
  },
  {
    step: 6,
    title: "Fix and add a regression eval",
    description:
      "Apply the fix and add this case to your evaluation dataset. Future changes will be tested against this failure case.",
  },
];

const replayDebugCode = `// Store execution context for replay debugging
interface ExecutionSnapshot {
  traceId: string;
  input: string;
  systemPrompt: string;
  messages: Message[];
  toolResults: Record<string, unknown>;
  retrievedDocuments: Document[];
  modelConfig: { model: string; temperature: number };
  timestamp: number;
}

// Capture on every request (or sample in production)
async function captureSnapshot(
  traceId: string,
  context: AgentContext,
): Promise<void> {
  const snapshot: ExecutionSnapshot = {
    traceId,
    input: context.input,
    systemPrompt: context.systemPrompt,
    messages: context.messages,
    toolResults: context.toolResults,
    retrievedDocuments: context.retrievedDocs,
    modelConfig: {
      model: context.model,
      temperature: context.temperature,
    },
    timestamp: Date.now(),
  };

  // Store in debug database (TTL: 30 days)
  await debugStore.save(traceId, snapshot, { ttlDays: 30 });
}

// Replay a failing request with the exact same context
async function replayRequest(traceId: string): Promise<ReplayResult> {
  const snapshot = await debugStore.get(traceId);
  if (!snapshot) throw new Error(\`No snapshot for trace \${traceId}\`);

  // Reconstruct the exact context the model saw
  const replayResponse = await llm.generate({
    model: snapshot.modelConfig.model,
    temperature: snapshot.modelConfig.temperature,
    system: snapshot.systemPrompt,
    messages: snapshot.messages,
  });

  return {
    originalTraceId: traceId,
    replayTraceId: crypto.randomUUID(),
    originalOutput: snapshot.messages.at(-1)?.content,
    replayOutput: replayResponse.text,
    matched: replayResponse.text === snapshot.messages.at(-1)?.content,
  };
}`;

export function DebuggingFailures() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Debugging AI agents is fundamentally different from debugging
          traditional software. There are no stack traces for wrong answers, no
          breakpoints for hallucinations. The root cause often lies in{" "}
          <strong>what the model saw</strong>, not in the code that ran.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Non-determinism makes reproduction difficult — the same input can
          produce different outputs on each run. Without captured execution
          context, you cannot reliably investigate failures. This is why
          observability is a prerequisite for debugging, not an afterthought.
        </p>
      </div>

      {/* Failure Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          The Four Categories of Agent Failure
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Every agent failure falls into one of these categories. Classifying
          the failure type is the first step to fixing it — each category has a
          different debugging approach and different fix.
        </p>
        <div className="space-y-4">
          {failureCategories.map((category) => (
            <Card
              key={category.name}
              className={`bg-card/50 ${category.border}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base">
                  <Badge
                    variant="outline"
                    className={`${category.color} border-current`}
                  >
                    {category.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {category.description}
                </p>

                <div className={`${category.bg} rounded-lg p-4 border ${category.border}`}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    How to Debug
                  </p>
                  <ol className="space-y-1">
                    {category.debugApproach.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/90"
                      >
                        <span className="text-primary font-mono text-xs mt-0.5 flex-shrink-0">
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-muted/20 rounded-md px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">
                    Example:{" "}
                  </span>
                  <span className="text-xs text-foreground/90 italic">
                    {category.example}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Debugging Workflow */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          The 6-Step Debugging Workflow
        </h3>
        <div className="space-y-3">
          {debugWorkflowSteps.map((step) => (
            <div key={step.step} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono font-bold text-primary">
                {step.step}
              </span>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Replay Debugging */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Replay Debugging: Reproducing Non-Deterministic Failures
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The hardest part of debugging AI agents is that you can&apos;t just
          &quot;re-run it with the same input&quot; — the model might give a different
          (correct) answer the second time. Replay debugging solves this by
          capturing and storing the <strong>exact</strong> execution context so
          you can feed it back to the model later.
        </p>
        <CodeBlock
          code={replayDebugCode}
          label="Replay debugging: capture and replay execution context"
        />
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">
          The Debugging Mindset Shift
        </p>
        <p className="text-foreground/90 leading-relaxed">
          In traditional software, you debug the <strong>code</strong>. In AI
          agents, you debug the <strong>context</strong>. The model is usually
          capable of producing the right answer — the question is whether it
          received the right information. Every debugging session should start
          with: &quot;What did the model see when it made this decision?&quot;
        </p>
      </div>
    </div>
  );
}
