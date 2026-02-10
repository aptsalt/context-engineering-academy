export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const chapters: Chapter[] = [
  {
    id: "why-evals",
    number: 1,
    title: "Why Evals Matter",
    subtitle: "The foundation of reliable AI products",
    icon: "target",
  },
  {
    id: "eval-types",
    number: 2,
    title: "Types of Evaluations",
    subtitle: "Functional, quality, safety, and regression evals",
    icon: "layers",
  },
  {
    id: "eval-datasets",
    number: 3,
    title: "Building Eval Datasets",
    subtitle: "Golden datasets, synthetic data, production sampling",
    icon: "database",
  },
  {
    id: "automated-evals",
    number: 4,
    title: "Automated Evaluations",
    subtitle: "LLM-as-judge, assertions, semantic similarity",
    icon: "bot",
  },
  {
    id: "human-evals",
    number: 5,
    title: "Human Evaluation",
    subtitle: "When and how to involve human reviewers",
    icon: "users",
  },
  {
    id: "eval-frameworks",
    number: 6,
    title: "Eval Frameworks",
    subtitle: "promptfoo, Braintrust, LangSmith, custom solutions",
    icon: "wrench",
  },
  {
    id: "regression-testing",
    number: 7,
    title: "Regression Testing for LLMs",
    subtitle: "Catch quality drops before they ship",
    icon: "shield",
  },
  {
    id: "eval-driven-dev",
    number: 8,
    title: "Eval-Driven Development",
    subtitle: "Write the eval first, then improve the prompt",
    icon: "code",
  },
  {
    id: "ci-cd",
    number: 9,
    title: "CI/CD for LLM Apps",
    subtitle: "Evals in your deployment pipeline",
    icon: "rocket",
  },
  {
    id: "interactive-examples",
    number: 10,
    title: "Interactive Examples",
    subtitle: "See eval patterns in action with live code",
    icon: "code",
  },
  {
    id: "anti-patterns",
    number: 11,
    title: "Anti-Patterns & Failure Modes",
    subtitle: "Common eval mistakes and how to avoid them",
    icon: "warning",
  },
  {
    id: "best-practices",
    number: 12,
    title: "Best Practices Checklist",
    subtitle: "Production-ready eval guidelines",
    icon: "check",
  },
  {
    id: "resources",
    number: 13,
    title: "Resources & Further Reading",
    subtitle: "Tools, blogs, papers, and guides",
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
    text: "Evals are the most underinvested part of the AI stack. If you don't have evals, you don't have a product — you have a demo.",
    author: "Hamel Husain",
    role: "AI Engineering Consultant",
  },
  {
    text: "The best teams I've seen treat evals as a first-class artifact. They write the eval before writing the prompt, the same way TDD works for software.",
    author: "Eugene Yan",
    role: "Senior Applied Scientist, Amazon",
  },
  {
    text: "Without evals, every prompt change is a leap of faith. With evals, it's an experiment with measurable outcomes.",
    author: "Jason Wei",
    role: "Research Scientist, OpenAI",
  },
  {
    text: "If you can't measure it, you can't improve it. The teams that ship the most reliable LLM products are the ones with the strongest eval suites.",
    author: "Simon Willison",
    role: "Creator of Datasette, AI Blogger",
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
    id: "llm-as-judge",
    title: "LLM-as-Judge Eval",
    description: "Using an LLM to grade another LLM's output",
    category: "Automated Eval",
    bad: {
      label: "Vague grading with no rubric",
      code: `// BAD: No rubric, no structure, unreliable scores
async function evalResponse(response: string) {
  const grade = await llm.generate({
    system: "Rate this response from 1-10.",
    messages: [
      { role: "user", content: response },
    ],
  });

  // Returns inconsistent scores, no reasoning
  // "7" one time, "I'd give it a 7/10" the next
  return grade;
}`,
      explanation:
        "Without a rubric, the judge LLM produces inconsistent scores. No structured output means parsing fails randomly. No reasoning means you can't debug why a score was given.",
    },
    good: {
      label: "Structured rubric with reasoning",
      code: `// GOOD: Clear rubric, structured output, reasoning chain
import { z } from "zod";

const EvalResult = z.object({
  reasoning: z.string(),
  scores: z.object({
    relevance: z.number().min(1).max(5),
    accuracy: z.number().min(1).max(5),
    completeness: z.number().min(1).max(5),
  }),
  overall: z.number().min(1).max(5),
  pass: z.boolean(),
});

async function evalResponse(
  question: string,
  response: string,
  referenceAnswer: string,
) {
  const result = await llm.generate({
    system: \`You are an evaluation judge. Score the response
against the reference answer using this rubric:

## Rubric
- Relevance (1-5): Does it answer the question asked?
- Accuracy (1-5): Are the facts correct vs reference?
- Completeness (1-5): Does it cover all key points?

## Instructions
1. First, write your reasoning step by step
2. Then assign scores for each dimension
3. Calculate overall as the average
4. Pass if overall >= 3.5

Respond in JSON matching the schema.\`,
    messages: [
      {
        role: "user",
        content: \`Question: \${question}
Response to evaluate: \${response}
Reference answer: \${referenceAnswer}\`,
      },
    ],
  });

  return EvalResult.parse(JSON.parse(result));
}`,
      explanation:
        "A structured rubric with clear dimensions, score ranges, and reasoning requirements produces consistent, debuggable evaluations. Zod validation ensures the output is always parseable. The reasoning chain lets you understand why scores were assigned.",
    },
  },
  {
    id: "assertion-evals",
    title: "Assertion-Based Evals",
    description: "Deterministic checks for LLM outputs",
    category: "Functional Eval",
    bad: {
      label: "No assertions — manual spot checking",
      code: `// BAD: "Looks good to me" eval strategy
async function testSummarizer() {
  const summary = await summarize(longDocument);

  // Just print it and eyeball it
  console.log("Summary:", summary);
  // "Looks fine" — ships to production

  // No assertions, no regression detection
  // No way to know if next change breaks it
}`,
      explanation:
        "Manual spot-checking catches obvious failures but misses subtle regressions. When you change the prompt, you have no idea if other test cases broke. This is the 'vibe check' anti-pattern.",
    },
    good: {
      label: "Multi-layer assertion pipeline",
      code: `// GOOD: Deterministic + semantic assertions
import { expect } from "vitest";

async function testSummarizer() {
  const input = loadTestCase("quarterly-report-q3");
  const summary = await summarize(input.document);

  // Layer 1: Format assertions (deterministic)
  expect(summary.length).toBeLessThan(500);
  expect(summary.length).toBeGreaterThan(50);
  expect(summary).not.toContain("As an AI");

  // Layer 2: Content assertions (keyword presence)
  const requiredTopics = ["revenue", "growth", "forecast"];
  for (const topic of requiredTopics) {
    expect(summary.toLowerCase()).toContain(topic);
  }

  // Layer 3: Semantic similarity to reference
  const similarity = await cosineSimilarity(
    await embed(summary),
    await embed(input.referenceSummary),
  );
  expect(similarity).toBeGreaterThan(0.75);

  // Layer 4: LLM-as-judge for nuance
  const judgment = await llmJudge(summary, input.referenceSummary);
  expect(judgment.overall).toBeGreaterThanOrEqual(3.5);
}`,
      explanation:
        "Four layers of assertions catch different failure modes: format violations, missing key topics, semantic drift from the reference, and nuanced quality issues. Each layer runs automatically on every change.",
    },
  },
  {
    id: "eval-dataset",
    title: "Eval Dataset Management",
    description: "Building and maintaining test cases",
    category: "Dataset Engineering",
    bad: {
      label: "Hardcoded test cases that never update",
      code: `// BAD: Static test cases written once, never updated
const testCases = [
  { input: "What is AI?", expected: "Artificial Intelligence" },
  { input: "Hello", expected: "Hi there!" },
];

// Problems:
// - Too few cases (2 is not a test suite)
// - Exact string matching is too brittle
// - No edge cases, no adversarial inputs
// - Never updated with production failures
// - No versioning or tracking`,
      explanation:
        "Two hardcoded test cases with exact string matching is not an eval suite. It catches nothing useful, breaks on any output variation, and never learns from production failures.",
    },
    good: {
      label: "Versioned dataset with multiple sources",
      code: `// GOOD: Managed eval dataset with provenance
interface EvalCase {
  id: string;
  input: string;
  expectedOutput?: string;
  rubric: string;
  tags: string[];
  source: "manual" | "synthetic" | "production";
  addedAt: string;
  version: number;
}

async function buildEvalDataset(): Promise<EvalCase[]> {
  const manual = await loadCases("evals/manual/*.json");
  const synthetic = await generateSyntheticCases({
    count: 50,
    categories: ["edge-cases", "adversarial", "multilingual"],
    seedExamples: manual,
  });
  const production = await sampleProductionLogs({
    count: 20,
    strategy: "stratified", // Sample across categories
    filter: { thumbsDown: true }, // Focus on failures
  });

  const dataset = [...manual, ...synthetic, ...production];

  // Version the dataset
  await saveDatasetVersion(dataset, {
    version: getNextVersion(),
    timestamp: new Date().toISOString(),
    stats: computeDatasetStats(dataset),
  });

  return dataset;
}`,
      explanation:
        "A real eval dataset combines manual cases (for known requirements), synthetic cases (for coverage), and production samples (for real-world failures). Versioning tracks how the dataset evolves. Tags enable filtering by category.",
    },
  },
  {
    id: "regression-detection",
    title: "Regression Detection",
    description: "Catching quality drops before they reach users",
    category: "Regression Testing",
    bad: {
      label: "No baseline — flying blind",
      code: `// BAD: No baseline, no comparison
async function updatePrompt(newPrompt: string) {
  // Just swap it and hope for the best
  await db.update("prompts", {
    id: "main-prompt",
    content: newPrompt,
  });

  console.log("Prompt updated! Fingers crossed.");
  // No idea if this made things better or worse
  // Users will let you know... eventually
}`,
      explanation:
        "Updating a prompt without running evals against a baseline is like deploying code without tests. You have no idea if the change improved, degraded, or broke existing behavior. Users become your QA team.",
    },
    good: {
      label: "Baseline comparison with statistical significance",
      code: `// GOOD: Compare against baseline before deploying
interface EvalRun {
  promptVersion: string;
  scores: { caseId: string; score: number }[];
  timestamp: string;
  aggregates: { mean: number; p50: number; p5: number };
}

async function evaluatePromptChange(
  currentPrompt: string,
  candidatePrompt: string,
  dataset: EvalCase[],
): Promise<{ shouldDeploy: boolean; report: string }> {
  // Run both prompts against the same dataset
  const baseline = await runEvalSuite(currentPrompt, dataset);
  const candidate = await runEvalSuite(candidatePrompt, dataset);

  // Compare aggregates
  const improvement = candidate.aggregates.mean - baseline.aggregates.mean;
  const p5Drop = candidate.aggregates.p5 < baseline.aggregates.p5 * 0.95;

  // Find regressions (cases that got worse)
  const regressions = dataset.filter((c) => {
    const baseScore = baseline.scores.find((s) => s.caseId === c.id);
    const candScore = candidate.scores.find((s) => s.caseId === c.id);
    return baseScore && candScore && candScore.score < baseScore.score - 0.5;
  });

  const shouldDeploy = improvement > 0 && !p5Drop && regressions.length < 3;

  return {
    shouldDeploy,
    report: formatReport(baseline, candidate, regressions),
  };
}`,
      explanation:
        "Every prompt change is compared against the current baseline on the same dataset. The function checks mean improvement, tail performance (p5), and individual regressions. Only deploys if overall quality improved without degrading worst-case performance.",
    },
  },
  {
    id: "ci-cd-evals",
    title: "CI/CD Eval Pipeline",
    description: "Automated evals in your deployment workflow",
    category: "CI/CD",
    bad: {
      label: "Evals run manually, maybe",
      code: `// BAD: Evals are a manual afterthought
// Developer workflow:
// 1. Change prompt
// 2. Test manually with 2-3 inputs
// 3. "Looks good" → merge PR
// 4. Deploy to production
// 5. Wait for user complaints
// 6. Hotfix

// No automated checks
// No pre-merge gates
// No monitoring post-deploy`,
      explanation:
        "Without automated evals in CI, every PR that changes a prompt is a gamble. Manual testing with a few inputs catches obvious failures but misses edge cases, regressions, and subtle quality drops.",
    },
    good: {
      label: "Eval gates in CI/CD pipeline",
      code: `// GOOD: Evals run automatically on every PR
// .github/workflows/llm-evals.yml (conceptual)

async function runCIEvals(prDiff: PRDiff): Promise<CIResult> {
  // 1. Detect what changed
  const changedPrompts = detectPromptChanges(prDiff);
  if (changedPrompts.length === 0) return { skip: true };

  // 2. Run fast evals (< 2 min) — assertion-based
  const fastResults = await runFastEvals(changedPrompts);
  if (fastResults.failures > 0) {
    return { block: true, reason: "Fast eval failures", fastResults };
  }

  // 3. Run full eval suite (< 10 min) — LLM-as-judge
  const fullResults = await runFullEvalSuite(changedPrompts);

  // 4. Compare against baseline
  const comparison = compareToBaseline(fullResults);

  // 5. Post results as PR comment
  await postPRComment({
    summary: comparison.summary,
    scoreChange: comparison.delta,
    regressions: comparison.regressions,
    newBaseline: comparison.candidateScores,
  });

  // 6. Block merge if quality dropped
  return {
    block: comparison.delta < -0.1 || comparison.regressions.length > 5,
    results: fullResults,
    comparison,
  };
}`,
      explanation:
        "Evals run automatically on every PR that touches prompts. Fast assertion-based evals provide quick feedback. Full LLM-as-judge evals run in parallel. Results are posted as PR comments with score deltas. Merge is blocked if quality drops below threshold.",
    },
  },
  {
    id: "edd-workflow",
    title: "Ad-Hoc Tweaks vs Eval-Driven Development",
    description: "Write the eval first, then improve the prompt",
    category: "EDD Workflow",
    bad: {
      label: "Ad-hoc prompt tweaking",
      code: `// BAD: Change prompt and hope it's better
async function improvePrompt() {
  let prompt = CURRENT_PROMPT;

  // Engineer tries random changes
  prompt += "\\nBe more concise.";
  // Tests with one example... looks good

  prompt += "\\nAlways cite sources.";
  // Tests with another example... seems better?

  prompt += "\\nDo not hallucinate.";
  // "I think this is better than before"

  // No measurement. No comparison. No confidence.
  await deploy(prompt);
  // Two weeks later: "Users say it's worse"
}`,
      explanation:
        "Ad-hoc prompt tweaking without evaluation is like coding without tests. Each change is a guess. There's no way to know if a change improved or degraded quality overall. Engineers optimize for the last example they looked at.",
    },
    good: {
      label: "Eval-driven development workflow",
      code: `// GOOD: Eval-Driven Development — eval first, then iterate
async function evalDrivenImprovement(issue: string) {
  // Step 1: Write eval cases BEFORE touching the prompt
  const newCases = createEvalCases(issue, {
    positive: 5, // What good looks like
    negative: 3, // Current failures
    edge: 3,     // Tricky variations
  });
  await addToDataset("regression-suite", newCases);

  // Step 2: Measure baseline
  const baseline = await runEvals(CURRENT_PROMPT, newCases);
  console.log(\`Baseline: \${baseline.passRate * 100}%\`);

  // Step 3: Iterate with eval feedback
  const candidates = generatePromptVariants(CURRENT_PROMPT, issue, 5);
  let best = { prompt: CURRENT_PROMPT, score: baseline.score };

  for (const candidate of candidates) {
    const result = await runEvals(candidate, newCases);
    const regression = await runEvals(candidate, FULL_SUITE);

    if (result.score > best.score && regression.regressions === 0) {
      best = { prompt: candidate, score: result.score };
    }
  }

  // Step 4: Deploy only if measurably better
  if (best.score > baseline.score) {
    await deploy(best.prompt);
    console.log(\`Improved: \${baseline.score} → \${best.score}\`);
  }
}`,
      explanation:
        "EDD follows the TDD pattern: write the eval first, measure baseline, iterate with data feedback, deploy only if better with zero regressions. Each iteration is quantifiable. New eval cases become permanent regression tests.",
    },
  },
  {
    id: "uncalibrated-judge",
    title: "Uncalibrated vs Calibrated LLM Judge",
    description: "Building reliable automated evaluation with LLM judges",
    category: "LLM-as-Judge",
    bad: {
      label: "Bare LLM judge with no calibration",
      code: `// BAD: No rubric, no calibration, biased scoring
async function judgeResponse(response: string): Promise<number> {
  const result = await llm.generate({
    system: "Rate this response from 1-10.",
    messages: [{ role: "user", content: response }],
  });

  return parseInt(result);
  // Problems:
  // - No rubric: what does "good" mean?
  // - Verbosity bias: longer = higher score
  // - Position bias: first option always wins
  // - Self-preference: GPT-4 prefers GPT-4 output
  // - Scores drift between runs
}`,
      explanation:
        "Research shows uncalibrated judges have positional bias (favoring the first option), verbosity bias (longer responses score higher), and self-preference bias. Without a rubric and calibration examples, scores are unreliable and inconsistent.",
    },
    good: {
      label: "Calibrated multi-model judge",
      code: `// GOOD: Calibrated judge with rubric and bias mitigation
import { z } from "zod";

const JudgmentSchema = z.object({
  reasoning: z.string(),
  score: z.number().min(1).max(5),
});

async function calibratedJudge(
  response: string,
  rubric: string,
  calibrationExamples: { text: string; score: number }[],
): Promise<z.infer<typeof JudgmentSchema>> {
  const calibration = calibrationExamples
    .map((ex) => \`Response: "\${ex.text}" → Score: \${ex.score}/5\`)
    .join("\\n");

  const result = await llm.generate({
    model: "gpt-4o",
    temperature: 0,
    system: \`You are an expert evaluator. Score 1-5.

RUBRIC: \${rubric}

CALIBRATION (use these to anchor your scale):
\${calibration}

First explain your reasoning, then give a score.
Output JSON: {"reasoning": "...", "score": N}\`,
    messages: [{ role: "user", content: \`Evaluate: "\${response}"\` }],
  });

  return JudgmentSchema.parse(JSON.parse(result));
}

// Multi-judge: average across models to reduce bias
async function multiJudge(response: string, rubric: string) {
  const judges = ["gpt-4o", "claude-sonnet", "gemini-pro"];
  const scores = await Promise.all(
    judges.map((m) => calibratedJudge(response, rubric, CALIBRATION_SET))
  );
  return average(scores.map((s) => s.score));
}`,
      explanation:
        "Calibration examples anchor the scoring scale. Detailed rubrics define each score level. Temperature 0 improves consistency. Multiple judge models reduce individual model bias. Requiring reasoning before scoring improves accuracy.",
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
    name: "Vibe Check Shipping",
    icon: "vibes",
    description:
      "Deploying prompt changes based on manual spot-checking a few examples instead of systematic evaluation.",
    cause:
      "No eval infrastructure in place. Teams treat LLM outputs like they treat UI changes — 'looks good to me' is the approval process.",
    symptom:
      "Prompt changes that 'seemed fine' cause subtle quality regressions in production. Users complain about outputs that used to work. No one can quantify if the system is getting better or worse over time.",
    fix: "Build an eval suite before building features. Even 20 well-chosen test cases with simple assertions is 100x better than eyeballing. Automate these in CI so every PR gets checked.",
    severity: "critical",
  },
  {
    name: "Golden Dataset Rot",
    icon: "rot",
    description:
      "Eval datasets that were created once and never updated, becoming increasingly disconnected from real-world usage patterns.",
    cause:
      "Teams build an initial eval dataset during development but never feed production failures, new edge cases, or shifting user patterns back into the dataset.",
    symptom:
      "Evals pass consistently but production quality degrades. The eval dataset tests scenarios from 6 months ago, not what users actually ask today. False confidence from green CI checks.",
    fix: "Implement a feedback loop: sample production logs weekly, add failing cases from user reports, and run dataset freshness audits monthly. Version your datasets and track coverage metrics.",
    severity: "critical",
  },
  {
    name: "Eval Gaming",
    icon: "gaming",
    description:
      "Optimizing prompts to pass specific eval cases rather than genuinely improving quality, similar to overfitting in ML.",
    cause:
      "Small eval datasets with predictable patterns. Teams iterate on prompts specifically to pass the eval suite rather than to improve general quality.",
    symptom:
      "Eval scores keep going up but production quality stays flat or drops. Prompts become over-fitted to the eval cases. New, unseen inputs fail at higher rates.",
    fix: "Use held-out test sets that prompt engineers never see. Regularly rotate eval cases. Include synthetic and adversarial examples. Monitor production metrics alongside eval scores.",
    severity: "high",
  },
  {
    name: "Metric Myopia",
    icon: "myopia",
    description:
      "Over-relying on a single metric (like BLEU score or cosine similarity) that captures only one dimension of quality.",
    cause:
      "Teams pick one easy-to-compute metric and treat it as the source of truth. Semantic similarity scores become the only quality gate.",
    symptom:
      "High scores on the tracked metric but poor real-world quality. A summarizer scores high on ROUGE but produces summaries that are factually wrong. A chatbot scores high on relevance but is rude.",
    fix: "Use multi-dimensional evaluation: combine deterministic assertions, semantic metrics, LLM-as-judge with rubrics, and human evaluation. No single metric captures LLM quality.",
    severity: "high",
  },
  {
    name: "Eval-less Deployment",
    icon: "no-eval",
    description:
      "Shipping LLM-powered features to production with zero automated evaluation, relying entirely on user feedback as a quality signal.",
    cause:
      "Pressure to ship fast. Teams skip evals because they're seen as slow to build. The 'we'll add evals later' promise that never materializes.",
    symptom:
      "Every production incident is a surprise. No way to assess impact of model provider changes, prompt updates, or temperature adjustments. Users are the canary in the coal mine.",
    fix: "Start with the simplest possible eval: 10 test cases, basic assertions, running in CI. Expand from there. Even a minimal eval suite catches 80% of obvious regressions.",
    severity: "critical",
  },
  {
    name: "Judge Bias Blindspot",
    icon: "bias",
    description:
      "Using LLM-as-judge without calibrating for known biases: verbosity preference, position bias, self-preference.",
    cause:
      "LLM judges have systematic biases — they prefer longer responses, favor the first option presented, and rate their own model's outputs higher. Teams don't test for or correct these biases.",
    symptom:
      "Eval results that don't correlate with human judgment. Verbose, padded responses score higher than concise, accurate ones. A/B comparisons always favor whichever option is presented first.",
    fix: "Calibrate judges against human labels. Randomize option ordering. Use structured rubrics that penalize unnecessary verbosity. Run bias audits on your judge model periodically.",
    severity: "medium",
  },
];

export interface BestPractice {
  category: string;
  items: { title: string; description: string }[];
}

export const bestPractices: BestPractice[] = [
  {
    category: "Eval Dataset Design",
    items: [
      {
        title: "Start with 20-50 cases, not 1000",
        description:
          "A small, well-curated dataset with clear rubrics beats a large noisy one. You can always expand. Start with the cases that matter most to your users.",
      },
      {
        title: "Cover the distribution, not just the happy path",
        description:
          "Include edge cases, adversarial inputs, multilingual queries, and the long tail of real-world usage. Weight your dataset to match production traffic patterns.",
      },
      {
        title: "Version your datasets like code",
        description:
          "Store eval datasets in version control. Track when cases were added, why, and from what source. This lets you audit eval quality over time.",
      },
      {
        title: "Feed production failures back into evals",
        description:
          "Every user complaint, thumbs-down, or escalation is a potential eval case. Build a pipeline that samples production failures into your eval dataset weekly.",
      },
    ],
  },
  {
    category: "Automated Evaluation",
    items: [
      {
        title: "Layer your assertions: deterministic first, LLM-judge last",
        description:
          "Check format, length, and keyword presence with fast deterministic checks. Use semantic similarity as a middle layer. Reserve expensive LLM-as-judge for nuanced quality assessment.",
      },
      {
        title: "Always include reasoning in LLM-as-judge prompts",
        description:
          "Require the judge to explain its reasoning before scoring. This improves consistency and lets you debug disagreements between the judge and human reviewers.",
      },
      {
        title: "Use structured output (Zod/JSON Schema) for eval results",
        description:
          "Parse eval results into typed schemas. This prevents the 'I give it a 7 out of 10' vs '7' vs '7/10' parsing problem and ensures consistent downstream processing.",
      },
      {
        title: "Calibrate LLM judges against human labels",
        description:
          "Run your LLM judge on a set of human-labeled examples. If judge scores don't correlate with human scores, the judge needs better prompting or a different model.",
      },
    ],
  },
  {
    category: "CI/CD Integration",
    items: [
      {
        title: "Run fast evals on every PR, full evals nightly",
        description:
          "Assertion-based evals can run in under 2 minutes. Gate PRs on these. Run expensive LLM-as-judge evals nightly or on-demand for prompt changes.",
      },
      {
        title: "Post eval results as PR comments",
        description:
          "Make eval results visible in the PR review workflow. Show score deltas, regressions, and new failures. This makes eval results impossible to ignore.",
      },
      {
        title: "Block merges on eval regressions",
        description:
          "Treat eval failures like test failures. If a prompt change causes more than N regressions or drops the mean score below a threshold, block the merge.",
      },
      {
        title: "Track eval scores over time as a dashboard",
        description:
          "Plot eval scores per prompt version on a time-series dashboard. This shows whether your system is improving, degrading, or plateauing over weeks and months.",
      },
    ],
  },
  {
    category: "Human Evaluation",
    items: [
      {
        title: "Use human evals to calibrate automated evals",
        description:
          "Have human raters score 50-100 cases. Compare against LLM-as-judge scores. If correlation is below 0.7, revise your judge prompt. Humans are the ground truth.",
      },
      {
        title: "Create detailed annotation guidelines with examples",
        description:
          "Define every score level with concrete examples. Include edge case handling rules. Untrained raters with vague instructions produce unreliable data.",
      },
      {
        title: "Measure and track inter-rater reliability",
        description:
          "Use Cohen's Kappa or Krippendorff's Alpha. If agreement is below 0.6, the task definition is ambiguous — revise guidelines before collecting more labels.",
      },
      {
        title: "Reserve human eval budget for high-stakes decisions",
        description:
          "Use automated evals for routine regression testing. Reserve expensive human evaluation for safety-critical assessments, model comparisons, and rubric development.",
      },
    ],
  },
  {
    category: "Eval-Driven Development",
    items: [
      {
        title: "Write the eval before writing the prompt",
        description:
          "Define what 'good' looks like with test cases and rubrics before you write a single prompt. This is the LLM equivalent of TDD and prevents goalpost-shifting.",
      },
      {
        title: "Use evals to compare prompt candidates",
        description:
          "When iterating on a prompt, run all candidates against the same eval suite. Let data decide which prompt is best, not intuition.",
      },
      {
        title: "Separate development evals from held-out evals",
        description:
          "Keep a set of eval cases that prompt engineers never see during development. Run these as a final gate to detect overfitting to the dev eval set.",
      },
      {
        title: "Treat eval maintenance as ongoing work, not a one-time task",
        description:
          "Allocate 10-20% of your LLM engineering time to eval maintenance. Add new cases, retire stale ones, recalibrate judges, and update rubrics as your product evolves.",
      },
    ],
  },
];

export interface Resource {
  title: string;
  url: string;
  type: "blog" | "paper" | "repo" | "video" | "guide";
  source: string;
  description: string;
}

export const resources: Resource[] = [
  {
    title: "Your AI Product Needs Evals",
    url: "https://hamel.dev/blog/posts/evals/",
    type: "blog",
    source: "Hamel Husain",
    description:
      "The definitive guide to LLM evals by Hamel Husain. Covers why evals matter, how to build them, and common mistakes teams make.",
  },
  {
    title: "How to Evaluate LLM Applications",
    url: "https://eugeneyan.com/writing/evals/",
    type: "blog",
    source: "Eugene Yan",
    description:
      "Practical framework for evaluating LLM applications covering classification, generation, and RAG use cases with code examples.",
  },
  {
    title: "promptfoo: Test Your LLM App",
    url: "https://github.com/promptfoo/promptfoo",
    type: "repo",
    source: "GitHub",
    description:
      "Open-source tool for testing and evaluating LLM outputs. Supports multiple providers, assertions, and CI/CD integration.",
  },
  {
    title: "Braintrust AI Eval Framework",
    url: "https://www.braintrust.dev/docs/guides/evals",
    type: "guide",
    source: "Braintrust",
    description:
      "Production-grade eval framework with experiment tracking, scoring functions, and dataset management.",
  },
  {
    title: "LangSmith Evaluation Guide",
    url: "https://docs.smith.langchain.com/evaluation",
    type: "guide",
    source: "LangChain",
    description:
      "Official LangSmith docs on building evaluators, managing datasets, running experiments, and tracking results over time.",
  },
  {
    title: "Judging LLM-as-a-Judge",
    url: "https://arxiv.org/abs/2306.05685",
    type: "paper",
    source: "arXiv",
    description:
      "Foundational paper on using LLMs as evaluators. Analyzes biases, calibration, and agreement with human judgments.",
  },
  {
    title: "RAGAS: Automated Evaluation of RAG",
    url: "https://github.com/explodinggradients/ragas",
    type: "repo",
    source: "GitHub",
    description:
      "Framework for evaluating RAG pipelines with metrics for faithfulness, answer relevance, context precision, and recall.",
  },
  {
    title: "OpenAI Evals",
    url: "https://github.com/openai/evals",
    type: "repo",
    source: "GitHub",
    description:
      "OpenAI's open-source evaluation framework. Includes benchmark tasks and a framework for creating custom evals.",
  },
  {
    title: "Anthropic's Guide to Prompt Evaluation",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-evaluation",
    type: "guide",
    source: "Anthropic",
    description:
      "Anthropic's official guide to evaluating prompts systematically, including rubric design and scoring methodologies.",
  },
  {
    title: "The Eval Gap: Why Offline Metrics Don't Predict Online Performance",
    url: "https://www.latent.space/p/eval-gap",
    type: "blog",
    source: "Latent Space",
    description:
      "Analysis of why eval scores often don't correlate with production quality, and strategies for closing the gap.",
  },
];
