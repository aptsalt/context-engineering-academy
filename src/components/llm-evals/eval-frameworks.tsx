import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const frameworks = [
  {
    name: "promptfoo",
    badge: "Open Source",
    badgeClass: "bg-green-500/10 text-green-600 border-green-500/40",
    border: "border-green-500/20",
    description:
      "CLI-first eval framework that lets you define test cases in YAML, run evals against multiple providers, and compare results side-by-side. Excellent for prompt iteration and CI/CD integration.",
    features: [
      "YAML-based test case definition",
      "Multi-provider comparison (OpenAI, Anthropic, local models)",
      "Built-in assertion types (contains, similar, llm-rubric)",
      "CI/CD integration with GitHub Actions",
      "Web UI for viewing results",
      "Red-teaming and adversarial testing",
    ],
    bestFor: "Teams that want a fast, config-driven eval workflow. Best for prompt comparison and regression testing. Strongest CI/CD integration.",
    pricing: "Free and open-source. Cloud dashboard available.",
  },
  {
    name: "Braintrust",
    badge: "Enterprise",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/40",
    border: "border-blue-500/20",
    description:
      "Production-grade eval and observability platform with dataset management, experiment tracking, scoring functions, and real-time logging. Used by Scale AI, Notion, and Stripe.",
    features: [
      "Managed dataset storage and versioning",
      "Custom scoring functions in TypeScript/Python",
      "Experiment tracking with automatic comparison",
      "Real-time production logging and monitoring",
      "Human annotation workflows",
      "SDK for TypeScript, Python, and REST API",
    ],
    bestFor: "Teams that need end-to-end eval infrastructure. Best for organizations that want managed dataset management and production monitoring alongside evals.",
    pricing: "Free tier available. Paid plans for teams.",
  },
  {
    name: "LangSmith",
    badge: "LangChain Ecosystem",
    badgeClass: "bg-purple-500/10 text-purple-600 border-purple-500/40",
    border: "border-purple-500/20",
    description:
      "Tracing and evaluation platform from the LangChain team. Deep integration with LangChain/LangGraph, but works with any LLM framework. Strong tracing and debugging capabilities.",
    features: [
      "End-to-end tracing of LLM chains and agents",
      "Dataset management with annotation queues",
      "Built-in and custom evaluators",
      "Comparison experiments",
      "Online evaluation (production monitoring)",
      "Deep LangChain/LangGraph integration",
    ],
    bestFor: "Teams already using LangChain or LangGraph. Best for complex agent workflows that need detailed tracing alongside evaluation.",
    pricing: "Free tier for developers. Paid plans for teams.",
  },
  {
    name: "Custom Solution",
    badge: "Build Your Own",
    badgeClass: "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
    border: "border-yellow-500/20",
    description:
      "Build your own eval framework tailored to your specific needs. Full control over every aspect of the eval pipeline. Best when existing tools don't fit your workflow or you need deep integration with internal systems.",
    features: [
      "Complete control over eval logic",
      "Deep integration with your stack",
      "Custom scoring functions for domain-specific needs",
      "No vendor lock-in",
      "Custom reporting and dashboards",
      "Optimized for your specific use case",
    ],
    bestFor: "Teams with unique eval requirements, heavy compliance needs, or existing internal tooling. Best when you need full control and can invest engineering time.",
    pricing: "Engineering time. Typically 2-4 weeks for a basic framework.",
  },
];

const promptfooExample = `# promptfoo config: promptfooconfig.yaml
prompts:
  - id: current
    raw: "You are a helpful assistant. Answer: {{query}}"
  - id: candidate
    raw: |
      You are a customer support agent for Acme Corp.
      Answer the user's question accurately and concisely.
      If unsure, say so rather than guessing.
      Question: {{query}}

providers:
  - openai:gpt-4o
  - anthropic:messages:claude-sonnet-4-20250514

tests:
  - vars:
      query: "What is your refund policy?"
    assert:
      - type: contains
        value: "30 days"
      - type: llm-rubric
        value: "Response accurately describes the refund policy"
      - type: not-contains
        value: "I don't know"

  - vars:
      query: "How do I cancel my subscription?"
    assert:
      - type: contains
        value: "settings"
      - type: similar
        value: "Go to Settings > Subscription > Cancel"
        threshold: 0.7

  - vars:
      query: "Can I get a refund for a digital purchase?"
    assert:
      - type: llm-rubric
        value: "Response correctly states digital purchases are credit-only"
      - type: javascript
        value: "output.length < 500"`;

const braintrustExample = `// Braintrust eval with custom scoring
import { Eval } from "braintrust";

Eval("customer-support-qa", {
  data: () => loadDataset("datasets/support-evals.jsonl"),

  task: async (input) => {
    const response = await llm.generate({
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: input.query }],
    });
    return response;
  },

  scores: [
    // Built-in scorer: factual accuracy via LLM judge
    Factuality,

    // Custom scorer: check required content
    (args) => {
      const hasRequiredInfo = args.input.requiredKeywords
        .every((kw: string) => args.output.toLowerCase().includes(kw));
      return {
        name: "contains_required_info",
        score: hasRequiredInfo ? 1 : 0,
      };
    },

    // Custom scorer: response length check
    (args) => ({
      name: "conciseness",
      score: args.output.length < 500 ? 1 : args.output.length < 800 ? 0.5 : 0,
    }),
  ],
});`;

const customExample = `// Custom eval framework — minimal but effective
import { z } from "zod";

interface EvalConfig {
  name: string;
  dataset: string;
  evaluators: Evaluator[];
  thresholds: { overall: number; perCategory: Record<string, number> };
}

interface Evaluator {
  name: string;
  weight: number;
  evaluate: (input: string, output: string, expected?: string) => Promise<number>;
}

async function runEvalSuite(config: EvalConfig): Promise<EvalReport> {
  const dataset = await loadDataset(config.dataset);
  const results: EvalResult[] = [];

  for (const testCase of dataset) {
    const output = await generateResponse(testCase.input);
    const scores: Record<string, number> = {};

    for (const evaluator of config.evaluators) {
      scores[evaluator.name] = await evaluator.evaluate(
        testCase.input,
        output,
        testCase.expected,
      );
    }

    const overall = config.evaluators.reduce(
      (sum, ev) => sum + scores[ev.name] * ev.weight, 0
    );

    results.push({ testCase: testCase.id, scores, overall, output });
  }

  return generateReport(results, config.thresholds);
}`;

export function EvalFrameworks() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          You don&apos;t have to build your eval system from scratch. Several
          mature frameworks provide dataset management, scoring functions,
          CI/CD integration, and result visualization out of the box. The right
          choice depends on your stack, team size, and specific requirements.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The most important thing is to <em>start evaluating</em> — any
          framework is better than no framework. You can always migrate later.
          Pick the tool that has the lowest friction for your team today.
        </p>
      </div>

      {/* Framework Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Framework Comparison</h3>
        <div className="space-y-4">
          {frameworks.map((fw) => (
            <Card key={fw.name} className={`bg-card/50 ${fw.border}`}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={fw.badgeClass}>
                    {fw.badge}
                  </Badge>
                  <h4 className="font-semibold text-sm">{fw.name}</h4>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {fw.description}
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                      Key Features
                    </p>
                    <ul className="space-y-1.5">
                      {fw.features.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="text-primary mt-0.5 flex-shrink-0">-</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Best For
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {fw.bestFor}
                    </p>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                      Pricing
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {fw.pricing}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* promptfoo Example */}
      <div>
        <h3 className="text-lg font-semibold mb-4">promptfoo: Config-Driven Evals</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          promptfoo uses a YAML config to define prompts, providers, test cases,
          and assertions. Run with <code className="text-xs bg-muted/50 px-1 py-0.5 rounded">npx promptfoo eval</code> to
          compare prompts side-by-side across multiple models.
        </p>
        <CodeBlock code={promptfooExample} label="promptfooconfig.yaml" />
      </div>

      {/* Braintrust Example */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Braintrust: Programmatic Evals</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Braintrust provides a TypeScript/Python SDK for defining eval tasks with
          custom scoring functions. Results are tracked as experiments with
          automatic comparison against previous runs.
        </p>
        <CodeBlock code={braintrustExample} label="braintrust-eval.ts" />
      </div>

      {/* Custom Framework */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Custom: Build What You Need</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          A custom eval framework can be surprisingly simple — a dataset loader,
          a set of evaluators, and a report generator. Start minimal and add
          complexity as your needs grow.
        </p>
        <CodeBlock code={customExample} label="custom-eval-framework.ts" />
      </div>

      {/* Decision Guide */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">How to Choose</h3>
          <div className="space-y-3">
            {[
              {
                question: "Need fast prompt comparison in CI?",
                answer: "promptfoo — config-driven, CLI-first, excellent CI/CD integration.",
              },
              {
                question: "Need managed datasets and production monitoring?",
                answer: "Braintrust — end-to-end platform with experiment tracking and logging.",
              },
              {
                question: "Already using LangChain and need tracing?",
                answer: "LangSmith — deep integration with the LangChain ecosystem plus evaluation.",
              },
              {
                question: "Have unique requirements or compliance needs?",
                answer: "Custom solution — full control, no vendor lock-in, tailored to your workflow.",
              },
            ].map((item) => (
              <div key={item.question} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary text-xs font-bold">?</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{item.question}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
