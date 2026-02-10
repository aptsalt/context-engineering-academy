import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const pipelineStages = [
  {
    stage: "Detect",
    description: "Identify which files changed. If prompts, eval datasets, or model configs changed, trigger the eval pipeline. Skip for unrelated changes.",
    timing: "< 5 seconds",
    color: "text-blue-600",
    border: "border-blue-500/20",
  },
  {
    stage: "Fast Evals",
    description: "Run assertion-based evals: format checks, keyword presence, length constraints, schema validation. These are deterministic and free — no LLM calls needed.",
    timing: "< 30 seconds",
    color: "text-green-600",
    border: "border-green-500/20",
  },
  {
    stage: "Full Evals",
    description: "Run LLM-as-judge and semantic similarity evals against the full regression suite. Compare against the stored baseline. Compute score deltas and regression counts.",
    timing: "2-10 minutes",
    color: "text-purple-600",
    border: "border-purple-500/20",
  },
  {
    stage: "Report",
    description: "Post eval results as a PR comment with score deltas, regression details, and pass/fail status. Make results visible and actionable in the code review workflow.",
    timing: "< 10 seconds",
    color: "text-yellow-600",
    border: "border-yellow-500/20",
  },
  {
    stage: "Gate",
    description: "Block merge if evals fail. Auto-approve if all checks pass. Require manual review for borderline cases (some regressions but within tolerance).",
    timing: "Immediate",
    color: "text-red-600",
    border: "border-red-500/20",
  },
];

const githubActionsCode = `# .github/workflows/llm-evals.yml
name: LLM Eval Suite

on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'evals/**'
      - 'src/lib/llm-config.ts'

env:
  OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}

jobs:
  fast-evals:
    name: Fast Evals (Assertions)
    runs-on: ubuntu-latest
    timeout-minutes: 2
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npx tsx evals/run-assertions.ts
        env:
          EVAL_DATASET: evals/datasets/latest.json
          FAIL_THRESHOLD: 0.95

  full-evals:
    name: Full Eval Suite (LLM-as-Judge)
    needs: fast-evals
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      # Run full eval suite
      - run: npx tsx evals/run-full-suite.ts
        id: evals
        env:
          EVAL_DATASET: evals/datasets/latest.json
          BASELINE_PATH: evals/baselines/latest.json
          OUTPUT_PATH: evals/results/current.json

      # Post results as PR comment
      - uses: actions/github-script@v7
        with:
          script: |
            const results = require('./evals/results/current.json');
            const body = formatEvalComment(results);
            await github.rest.issues.createComment({
              ...context.repo,
              issue_number: context.issue.number,
              body,
            });

      # Fail if below threshold
      - run: |
          node -e "
            const r = require('./evals/results/current.json');
            if (r.regressions > 0 || r.overallScore < 0.9) {
              console.error('Eval failed:', JSON.stringify(r.summary));
              process.exit(1);
            }
          "`;

const evalRunnerCode = `// CI eval runner with reporting
interface CIEvalConfig {
  datasetPath: string;
  baselinePath: string;
  outputPath: string;
  thresholds: {
    fastEvalPassRate: number;    // e.g., 0.95
    fullEvalMinScore: number;    // e.g., 0.85
    maxRegressions: number;      // e.g., 3
    safetyPassRate: number;      // e.g., 1.0 (zero tolerance)
  };
}

async function runCIEvals(config: CIEvalConfig) {
  const dataset = await loadDataset(config.datasetPath);
  const baseline = await loadBaseline(config.baselinePath);

  // Partition test cases by type
  const functional = dataset.filter((c) => c.type === "functional");
  const quality = dataset.filter((c) => c.type === "quality");
  const safety = dataset.filter((c) => c.type === "safety");

  // Phase 1: Fast functional evals (parallel)
  const functionalResults = await Promise.all(
    functional.map((c) => runFunctionalEval(c))
  );
  const functionalPassRate = functionalResults.filter((r) => r.passed).length / functional.length;

  if (functionalPassRate < config.thresholds.fastEvalPassRate) {
    return { status: "fail", phase: "functional", passRate: functionalPassRate };
  }

  // Phase 2: Safety evals (zero tolerance)
  const safetyResults = await Promise.all(
    safety.map((c) => runSafetyEval(c))
  );
  const safetyPassRate = safetyResults.filter((r) => r.passed).length / safety.length;

  if (safetyPassRate < config.thresholds.safetyPassRate) {
    return { status: "fail", phase: "safety", passRate: safetyPassRate };
  }

  // Phase 3: Full quality evals with baseline comparison
  const qualityResults = await Promise.all(
    quality.map((c) => runQualityEval(c))
  );

  const regressions = detectRegressions(baseline, qualityResults);
  const overallScore = average(qualityResults.map((r) => r.score));

  // Save results for reporting
  const report = {
    status: regressions.length > config.thresholds.maxRegressions ? "fail" : "pass",
    functionalPassRate,
    safetyPassRate,
    overallScore,
    regressions: regressions.length,
    improved: qualityResults.filter((r) => r.improved).length,
    details: { functionalResults, safetyResults, qualityResults },
  };

  await saveResults(config.outputPath, report);
  return report;
}`;

const prCommentCode = `// Format eval results as a PR comment
function formatEvalComment(results: EvalReport): string {
  const status = results.status === "pass" ? "PASSED" : "FAILED";
  const emoji = results.status === "pass" ? "white_check_mark" : "x";

  return \`## LLM Eval Results: \${status} :\${emoji}:

| Metric | Score | Threshold | Status |
|--------|-------|-----------|--------|
| Functional Pass Rate | \${pct(results.functionalPassRate)} | 95% | \${badge(results.functionalPassRate >= 0.95)} |
| Safety Pass Rate | \${pct(results.safetyPassRate)} | 100% | \${badge(results.safetyPassRate >= 1.0)} |
| Quality Score | \${results.overallScore.toFixed(2)}/5.0 | 4.0 | \${badge(results.overallScore >= 4.0)} |
| Regressions | \${results.regressions} | < 3 | \${badge(results.regressions < 3)} |
| Improvements | \${results.improved} | — | :chart_with_upwards_trend: |

\${results.regressions > 0 ? \`
### Regressed Cases
\${results.details.qualityResults
  .filter((r: QualityResult) => r.regressed)
  .map((r: QualityResult) => \`- **\${r.caseId}**: \${r.oldScore} → \${r.newScore} (Δ \${r.delta})\`)
  .join("\\n")}
\` : ""}

<details>
<summary>Full Results (\${results.details.qualityResults.length} cases)</summary>
// ... detailed per-case results
</details>

---
*Eval suite v\${results.datasetVersion} | Baseline v\${results.baselineVersion}*\`;
}`;

export function CICD() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          The highest-impact eval practice is making evals{" "}
          <strong>automatic and unavoidable</strong>. When evals run on every PR
          that touches prompts, post results as comments, and block merges on
          regressions — quality becomes a system property, not a personal
          discipline.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Integrating evals into CI/CD transforms them from something engineers
          remember to run into something that runs automatically on every
          change. This is the difference between a demo and a product.
        </p>
      </div>

      {/* Pipeline Stages */}
      <div>
        <h3 className="text-lg font-semibold mb-4">The CI/CD Eval Pipeline</h3>
        <div className="space-y-3">
          {pipelineStages.map((stage, index) => (
            <Card key={stage.stage} className={`bg-card/50 ${stage.border}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-sm font-mono font-bold ${stage.color}`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold text-sm ${stage.color}`}>{stage.stage}</h4>
                      <Badge variant="outline" className="text-xs">
                        {stage.timing}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {stage.description}
                    </p>
                  </div>
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
          Layer your CI evals by cost and speed. <strong>Fast evals</strong>{" "}
          (assertions, format checks) run on every PR in under 30 seconds.{" "}
          <strong>Full evals</strong> (LLM-as-judge) run only when fast evals
          pass, taking 2-10 minutes. This keeps CI fast for non-prompt changes
          while ensuring thorough evaluation for prompt changes.
        </p>
      </div>

      {/* GitHub Actions Example */}
      <div>
        <h3 className="text-lg font-semibold mb-4">GitHub Actions Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          This workflow triggers only when prompt files, eval datasets, or LLM
          config files change. Fast evals run first — if they fail, the
          expensive full eval suite is skipped. Results are posted as a PR
          comment with score deltas.
        </p>
        <CodeBlock code={githubActionsCode} label=".github/workflows/llm-evals.yml" />
      </div>

      {/* CI Runner Code */}
      <div>
        <h3 className="text-lg font-semibold mb-4">CI Eval Runner</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          The eval runner partitions test cases by type and runs them in phases.
          Functional evals gate safety evals, which gate quality evals. Each
          phase can short-circuit if thresholds aren&apos;t met, saving time and
          API costs.
        </p>
        <CodeBlock code={evalRunnerCode} label="ci-eval-runner.ts" />
      </div>

      {/* PR Comment Format */}
      <div>
        <h3 className="text-lg font-semibold mb-4">PR Comment Reporting</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Making eval results visible in the PR review workflow is critical.
          Engineers should see score deltas, regressions, and improvements at
          a glance — without leaving the code review interface.
        </p>
        <CodeBlock code={prCommentCode} label="pr-comment-format.ts" />
      </div>

      {/* Cost Management */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-4">Managing CI Eval Costs</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                strategy: "Path-based triggering",
                description: "Only run evals when prompt files, eval datasets, or model config changes. Use GitHub Actions path filters to skip unrelated PRs.",
              },
              {
                strategy: "Tiered execution",
                description: "Run cheap assertion evals on every PR. Run expensive LLM-as-judge evals only when assertions pass. Run full regression suites nightly.",
              },
              {
                strategy: "Caching",
                description: "Cache eval results for unchanged test cases. If the prompt didn't change, previous results are still valid. Only re-evaluate changed components.",
              },
              {
                strategy: "Concurrency limits",
                description: "Run eval API calls concurrently (10-20 parallel) but rate-limit to avoid provider throttling. Most eval suites of 100 cases complete in 2-5 minutes.",
              },
            ].map((item) => (
              <div key={item.strategy} className="bg-muted/20 rounded-lg p-4 border border-border/50">
                <p className="text-xs font-semibold text-foreground/80 mb-1">{item.strategy}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">The CI/CD Eval Principle</h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            If a human has to remember to run evals, they won&apos;t. Put evals
            in CI, post results on PRs, block merges on regressions, and track
            scores over time. Make quality{" "}
            <strong>automatic and unavoidable</strong> — not optional and
            forgettable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
