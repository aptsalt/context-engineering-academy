import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const evalMethods = [
  {
    name: "Assertion-Based Evals",
    badge: "Deterministic",
    color: "text-green-600",
    border: "border-green-500/20",
    badgeClass: "bg-green-500/10 text-green-600 border-green-500/40",
    description:
      "Hard checks against LLM output: format validation, keyword presence, length constraints, schema compliance. The fastest and cheapest eval method — runs in milliseconds with zero LLM calls.",
    strengths: [
      "Deterministic — same input always gives same result",
      "Zero cost — no LLM calls needed",
      "Fast — runs in milliseconds",
      "Easy to debug when tests fail",
    ],
    limitations: [
      "Can't assess subjective quality",
      "Brittle for free-form text",
      "Misses semantically correct but differently worded responses",
    ],
  },
  {
    name: "Semantic Similarity",
    badge: "Embedding-Based",
    color: "text-blue-600",
    border: "border-blue-500/20",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/40",
    description:
      "Compare output embeddings against reference answer embeddings using cosine similarity. Catches semantically equivalent responses regardless of exact wording. Cheap and fast — one embedding call per evaluation.",
    strengths: [
      "Tolerant of rephrasing and word choice variation",
      "Cheap — only requires embedding calls, not LLM generation",
      "Good middle ground between exact match and LLM-as-judge",
      "Quantitative and reproducible",
    ],
    limitations: [
      "Doesn't understand nuance or factual correctness",
      "High similarity doesn't guarantee correctness",
      "Depends on embedding model quality",
    ],
  },
  {
    name: "LLM-as-Judge",
    badge: "Model-Graded",
    color: "text-purple-600",
    border: "border-purple-500/20",
    badgeClass: "bg-purple-500/10 text-purple-600 border-purple-500/40",
    description:
      "Use a strong LLM to evaluate another LLM's output against a rubric. The most flexible eval method — can assess nuanced quality dimensions like helpfulness, accuracy, and tone. Requires calibration to be reliable.",
    strengths: [
      "Evaluates subjective quality dimensions",
      "Flexible — adapts to any rubric or criteria",
      "Correlates well with human judgment when calibrated",
      "Scales to thousands of evaluations",
    ],
    limitations: [
      "Has systematic biases (verbosity, position, self-preference)",
      "Non-deterministic — scores vary between runs",
      "Expensive — requires LLM call per evaluation",
      "Requires careful calibration against human labels",
    ],
  },
];

const llmJudgeCode = `// LLM-as-Judge with calibration and bias mitigation
import { z } from "zod";

const JudgmentSchema = z.object({
  reasoning: z.string(),
  scores: z.object({
    accuracy: z.number().min(1).max(5),
    helpfulness: z.number().min(1).max(5),
    safety: z.number().min(1).max(5),
  }),
  overall: z.number().min(1).max(5),
});

type Judgment = z.infer<typeof JudgmentSchema>;

async function llmJudge(
  response: string,
  reference: string,
  rubric: string,
  calibrationExamples: { response: string; score: number }[],
): Promise<Judgment> {
  // Include calibration examples to anchor scoring
  const calibration = calibrationExamples
    .map((ex) => \`Response: "\${ex.response}" → Score: \${ex.score}/5\`)
    .join("\\n");

  const result = await llm.generate({
    model: "gpt-4o",
    temperature: 0, // Reduce variance between runs
    system: \`You are an expert evaluator. Score responses 1-5.

## Rubric
\${rubric}

## Calibration Examples (use these to anchor your scale)
\${calibration}

## Reference Answer
\${reference}

## Instructions
1. Write step-by-step reasoning BEFORE scoring
2. Score each dimension independently
3. Overall = weighted average (accuracy 40%, helpfulness 40%, safety 20%)
4. Output valid JSON matching the schema.\`,
    messages: [
      { role: "user", content: \`Evaluate this response:\\n"\${response}"\` },
    ],
  });

  return JudgmentSchema.parse(JSON.parse(result));
}`;

const combinedEvalCode = `// Combined eval pipeline: assertions + similarity + judge
interface EvalResult {
  assertions: { passed: boolean; failures: string[] };
  similarity: { score: number; threshold: number };
  judge: { overall: number; reasoning: string };
  finalScore: number;
  passed: boolean;
}

async function evaluate(
  response: string,
  testCase: EvalCase,
): Promise<EvalResult> {
  // Layer 1: Fast assertions (deterministic, free)
  const assertions = runAssertions(response, testCase.assertions);

  // Short-circuit: if assertions fail, skip expensive evals
  if (!assertions.passed) {
    return {
      assertions,
      similarity: { score: 0, threshold: 0.75 },
      judge: { overall: 0, reasoning: "Skipped — assertions failed" },
      finalScore: 0,
      passed: false,
    };
  }

  // Layer 2: Semantic similarity (cheap, fast)
  const similarity = await computeSimilarity(
    response,
    testCase.referenceAnswer,
  );

  // Layer 3: LLM-as-judge (expensive, nuanced)
  const judge = await llmJudge(
    response,
    testCase.referenceAnswer,
    testCase.rubric,
    CALIBRATION_SET,
  );

  // Weighted final score
  const finalScore =
    (assertions.passed ? 0.2 : 0) +
    similarity.score * 0.3 +
    (judge.overall / 5) * 0.5;

  return {
    assertions,
    similarity,
    judge,
    finalScore,
    passed: finalScore >= testCase.threshold,
  };
}`;

export function AutomatedEvals() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Automated evaluations are the backbone of a scalable eval system. They
          run on every change, catch regressions instantly, and provide
          quantitative signals for prompt iteration. The best eval systems{" "}
          <strong>layer multiple methods</strong> — assertions for hard
          requirements, semantic similarity for meaning, and LLM-as-judge for
          nuanced quality.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Each method has different cost, speed, and reliability tradeoffs. The
          key is knowing when to use each one and how to combine them into a
          pipeline that balances thoroughness with speed.
        </p>
      </div>

      {/* Eval Methods */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Three Layers of Automated Evaluation</h3>
        <div className="space-y-4">
          {evalMethods.map((method) => (
            <Card key={method.name} className={`bg-card/50 ${method.border}`}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={method.badgeClass}>
                    {method.badge}
                  </Badge>
                  <h4 className={`font-semibold text-sm ${method.color}`}>
                    {method.name}
                  </h4>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {method.description}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                      Strengths
                    </p>
                    <ul className="space-y-1.5">
                      {method.strengths.map((s) => (
                        <li key={s} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="text-green-600 mt-0.5 flex-shrink-0">+</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                      Limitations
                    </p>
                    <ul className="space-y-1.5">
                      {method.limitations.map((l) => (
                        <li key={l} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="text-red-600 mt-0.5 flex-shrink-0">-</span>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* LLM-as-Judge Code */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Implementing LLM-as-Judge</h3>
        <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg mb-4">
          <p className="text-sm text-foreground/90 leading-relaxed">
            The key to reliable LLM-as-judge is <strong>calibration</strong>.
            Provide concrete examples of what each score level looks like. Set
            temperature to 0 for reproducibility. Require step-by-step reasoning
            before scoring — this forces the judge to justify its evaluation and
            improves consistency.
          </p>
        </div>
        <CodeBlock code={llmJudgeCode} label="llm-as-judge.ts" />
      </div>

      {/* Combined Pipeline */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Combined Eval Pipeline</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          The most effective eval systems layer all three methods. Assertions run
          first as a fast gate — if they fail, skip the expensive LLM calls.
          Semantic similarity provides a cheap quality signal. LLM-as-judge adds
          nuanced evaluation for cases that pass the first two layers.
        </p>
        <CodeBlock code={combinedEvalCode} label="combined-eval-pipeline.ts" />
      </div>

      {/* Bias Awareness */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-4">Known LLM Judge Biases</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                bias: "Verbosity Bias",
                description: "Judges rate longer responses higher regardless of quality. A 500-word response often scores higher than a 100-word response even when the short one is better.",
                mitigation: "Include 'penalize unnecessary verbosity' in your rubric. Add calibration examples where concise answers score highest.",
              },
              {
                bias: "Position Bias",
                description: "In A/B comparisons, judges consistently prefer whichever option is presented first. This can skew comparative evaluations by 15-20%.",
                mitigation: "Randomize option ordering. Run each comparison twice with swapped positions. Average the results.",
              },
              {
                bias: "Self-Preference Bias",
                description: "GPT-4 judges rate GPT-4 outputs higher. Claude judges prefer Claude outputs. The judge model favors its own family's style.",
                mitigation: "Use a different model as judge than the one being evaluated. Or use multiple judge models and average.",
              },
              {
                bias: "Anchoring Bias",
                description: "If the judge sees a reference answer first, it anchors on that specific phrasing and penalizes valid alternatives.",
                mitigation: "Use rubric-based evaluation instead of reference comparison when possible. Define quality criteria abstractly.",
              },
            ].map((item) => (
              <div key={item.bias} className="bg-muted/20 rounded-lg p-4 border border-border/50">
                <p className="text-xs font-semibold text-foreground/80 mb-1">{item.bias}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {item.description}
                </p>
                <div className="bg-primary/5 rounded p-2 border border-primary/10">
                  <p className="text-xs text-primary font-medium">Mitigation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">The Eval Pipeline Formula</h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Start with <strong>assertions</strong> for format and content
            requirements. Add <strong>semantic similarity</strong> as a cheap
            quality check. Layer <strong>LLM-as-judge</strong> for nuanced
            evaluation with calibrated rubrics. Short-circuit early — if
            assertions fail, skip the expensive layers. This gives you
            thoroughness where it matters and speed where it doesn&apos;t.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
