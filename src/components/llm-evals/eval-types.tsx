import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const evalTypes = [
  {
    name: "Functional Evals",
    color: "text-green-600",
    border: "border-green-500/20",
    badge: "bg-green-500/10 text-green-600 border-green-500/40",
    description:
      "Verify that the output meets hard requirements — correct format, contains required fields, follows instructions. These are the LLM equivalent of unit tests.",
    examples: [
      "Output is valid JSON matching a schema",
      "Response contains all required sections",
      "Generated SQL query is syntactically valid",
      "Classification output is one of the allowed labels",
    ],
    when: "Always. Functional evals are the minimum baseline for any LLM application. They're fast, deterministic, and catch the most obvious failures.",
    code: `// Functional eval: check format and content
expect(output).toMatchSchema(responseSchema);
expect(output.sections).toContain("summary");
expect(output.length).toBeLessThan(maxTokens);`,
  },
  {
    name: "Quality Evals",
    color: "text-blue-600",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/40",
    description:
      "Assess subjective quality dimensions — helpfulness, clarity, accuracy, tone, completeness. These typically use LLM-as-judge or human reviewers with rubrics.",
    examples: [
      "Is the summary accurate and complete?",
      "Does the response match the requested tone?",
      "Are the generated instructions easy to follow?",
      "Does the answer cite relevant sources?",
    ],
    when: "For any user-facing output where quality matters. Use LLM-as-judge for fast iteration, human eval for calibration and high-stakes decisions.",
    code: `// Quality eval: LLM-as-judge with rubric
const score = await judge.evaluate({
  criteria: ["accuracy", "helpfulness", "clarity"],
  rubric: qualityRubric,
  response: output,
  reference: goldenAnswer,
});`,
  },
  {
    name: "Safety Evals",
    color: "text-red-600",
    border: "border-red-500/20",
    badge: "bg-red-500/10 text-red-600 border-red-500/40",
    description:
      "Test for harmful, biased, or inappropriate outputs. Includes adversarial testing (jailbreaks, prompt injection), bias detection, PII leakage, and content policy compliance.",
    examples: [
      "Response doesn't contain PII from training data",
      "Output doesn't generate harmful instructions",
      "System resists prompt injection attempts",
      "Responses don't exhibit demographic bias",
    ],
    when: "Before any public deployment. Run adversarial evals during development and continuously in production. Required for regulated industries.",
    code: `// Safety eval: adversarial test suite
const adversarialInputs = loadAdversarialSuite();
for (const input of adversarialInputs) {
  const output = await model.generate(input);
  expect(output).not.toMatch(harmfulPatterns);
  expect(output).toPassContentPolicy();
}`,
  },
  {
    name: "Regression Evals",
    color: "text-purple-600",
    border: "border-purple-500/20",
    badge: "bg-purple-500/10 text-purple-600 border-purple-500/40",
    description:
      "Compare current output quality against a known baseline. Detect when changes to prompts, models, or retrieval systems cause quality to drop on previously-passing cases.",
    examples: [
      "Score on existing test suite after prompt change",
      "Before/after comparison on model version upgrade",
      "Quality delta after RAG index rebuild",
      "Performance check after temperature adjustment",
    ],
    when: "On every change to any component of the LLM pipeline — prompts, models, retrieval, post-processing. Gate deployments on regression results.",
    code: `// Regression eval: compare against baseline
const baseline = await loadBaseline("v2.3");
const current = await runEvalSuite(newPrompt);
const regressions = findRegressions(baseline, current);
assert(regressions.length < threshold);`,
  },
  {
    name: "Comparative Evals",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/40",
    description:
      "Evaluate two or more variants side-by-side. Used for A/B testing prompts, comparing models, or evaluating system architecture changes. Requires careful methodology to avoid position bias.",
    examples: [
      "Prompt A vs Prompt B on the same test suite",
      "GPT-4o vs Claude Sonnet for a specific use case",
      "RAG pipeline v1 vs v2 on retrieval quality",
      "Single-shot vs chain-of-thought on reasoning tasks",
    ],
    when: "When choosing between alternatives. Run before committing to a prompt change, model switch, or architecture decision. Randomize ordering to avoid position bias.",
    code: `// Comparative eval: head-to-head comparison
const results = await compareVariants({
  variants: [promptA, promptB],
  dataset: evalCases,
  judge: llmJudge,
  randomizeOrder: true, // Avoid position bias
});
console.log(results.winner, results.pValue);`,
  },
];

export function EvalTypes() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Not all evals are created equal. Each type serves a different purpose,
          runs at a different cadence, and catches a different class of failure.
          A robust eval strategy <strong>layers multiple types</strong> to
          cover the full spectrum of quality dimensions.
        </p>
      </div>

      {/* Eval Pyramid */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            The Eval Pyramid — Layer Your Evaluations
          </p>
          <div className="space-y-2">
            {[
              { name: "Safety Evals", pct: 15, color: "bg-red-500", desc: "Run on every deployment" },
              { name: "Quality Evals (LLM-as-Judge)", pct: 25, color: "bg-blue-500", desc: "Run nightly or per-PR" },
              { name: "Regression Evals", pct: 25, color: "bg-purple-500", desc: "Run on every change" },
              { name: "Functional Evals (Assertions)", pct: 35, color: "bg-green-500", desc: "Run on every PR" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-48 text-xs text-muted-foreground truncate">
                  {item.name}
                </span>
                <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-36 text-xs text-muted-foreground text-right">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Functional evals form the base — they are fast, cheap, and catch the most common
            failures. Each layer above adds more coverage at higher cost and latency.
          </p>
        </CardContent>
      </Card>

      {/* Eval Type Cards */}
      <div className="space-y-4">
        {evalTypes.map((evalType) => (
          <Card key={evalType.name} className={`bg-card/50 ${evalType.border}`}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className={evalType.badge}>
                  {evalType.name}
                </Badge>
              </div>

              <p className="text-sm text-foreground/90 leading-relaxed">
                {evalType.description}
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                    Examples
                  </p>
                  <ul className="space-y-1.5">
                    {evalType.examples.map((ex) => (
                      <li key={ex} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                        <span className="text-primary mt-0.5">-</span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                    When to Use
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {evalType.when}
                  </p>
                </div>

                <div className="bg-[#0d1117] rounded-lg p-4 border border-border/50">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                    Code Pattern
                  </p>
                  <pre className="text-xs text-[#e6edf3]/80 leading-relaxed whitespace-pre-wrap font-mono">
                    {evalType.code}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Choosing Your Eval Mix</h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Start with <strong>functional evals</strong> — they are the fastest to
            build and catch the most common failures. Add{" "}
            <strong>regression evals</strong> as soon as you have a baseline.
            Layer in <strong>quality evals</strong> for user-facing outputs.
            Add <strong>safety evals</strong> before public deployment. Use{" "}
            <strong>comparative evals</strong> when making architectural decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
