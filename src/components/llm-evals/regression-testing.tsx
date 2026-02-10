import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const regressionTriggers = [
  {
    trigger: "Prompt Changes",
    description: "Modifying system prompts, few-shot examples, or instruction formatting. The most common source of regressions — fixing one edge case often breaks three others.",
    frequency: "Every PR that touches prompts",
    color: "border-red-500/20",
  },
  {
    trigger: "Model Version Updates",
    description: "LLM providers ship new model versions that change behavior. GPT-4o-2024-08-06 may behave differently from GPT-4o-2024-05-13 in subtle ways.",
    frequency: "On every model version change",
    color: "border-orange-500/20",
  },
  {
    trigger: "RAG Index Changes",
    description: "Adding, removing, or re-indexing documents in your retrieval system. Chunk size changes, embedding model updates, or metadata schema changes.",
    frequency: "On every index rebuild",
    color: "border-yellow-500/20",
  },
  {
    trigger: "Parameter Tuning",
    description: "Adjusting temperature, top-p, max tokens, or other inference parameters. Small parameter changes can cascade into large behavior shifts.",
    frequency: "On any parameter change",
    color: "border-purple-500/20",
  },
  {
    trigger: "Tool/Function Updates",
    description: "Changing tool descriptions, adding new tools, modifying tool output schemas. Tool changes alter what the model 'sees' and how it decides to act.",
    frequency: "On any tool schema change",
    color: "border-blue-500/20",
  },
];

const baselineCode = `// Baseline management for regression detection
interface Baseline {
  id: string;
  promptVersion: string;
  modelVersion: string;
  timestamp: string;
  results: Map<string, CaseResult>;
  aggregates: {
    mean: number;
    median: number;
    p5: number;   // 5th percentile — worst-case performance
    p95: number;  // 95th percentile — best-case performance
    passRate: number;
  };
}

interface CaseResult {
  caseId: string;
  score: number;
  passed: boolean;
  output: string;
  evalDetails: Record<string, number>;
}

async function createBaseline(
  promptVersion: string,
  dataset: EvalCase[],
): Promise<Baseline> {
  const results = new Map<string, CaseResult>();

  for (const testCase of dataset) {
    const output = await generateResponse(testCase.input, promptVersion);
    const evalResult = await evaluate(output, testCase);

    results.set(testCase.id, {
      caseId: testCase.id,
      score: evalResult.score,
      passed: evalResult.passed,
      output,
      evalDetails: evalResult.details,
    });
  }

  const scores = [...results.values()].map((r) => r.score).sort((a, b) => a - b);

  return {
    id: \`baseline-\${Date.now()}\`,
    promptVersion,
    modelVersion: getCurrentModelVersion(),
    timestamp: new Date().toISOString(),
    results,
    aggregates: {
      mean: average(scores),
      median: scores[Math.floor(scores.length / 2)],
      p5: scores[Math.floor(scores.length * 0.05)],
      p95: scores[Math.floor(scores.length * 0.95)],
      passRate: [...results.values()].filter((r) => r.passed).length / results.size,
    },
  };
}`;

const regressionDetectionCode = `// Regression detection: compare candidate against baseline
interface RegressionReport {
  improved: { caseId: string; oldScore: number; newScore: number }[];
  regressed: { caseId: string; oldScore: number; newScore: number }[];
  unchanged: string[];
  newCases: string[];  // Cases in candidate but not in baseline
  aggregateDelta: {
    mean: number;
    p5: number;
    passRate: number;
  };
  verdict: "pass" | "fail" | "review";
}

async function detectRegressions(
  baseline: Baseline,
  candidateResults: Map<string, CaseResult>,
  config: {
    regressionThreshold: number; // Score drop that counts as regression
    maxRegressions: number;      // Max allowed regressions
    minP5: number;               // Minimum acceptable p5 score
  },
): Promise<RegressionReport> {
  const report: RegressionReport = {
    improved: [],
    regressed: [],
    unchanged: [],
    newCases: [],
    aggregateDelta: { mean: 0, p5: 0, passRate: 0 },
    verdict: "pass",
  };

  for (const [caseId, candidateResult] of candidateResults) {
    const baselineResult = baseline.results.get(caseId);

    if (!baselineResult) {
      report.newCases.push(caseId);
      continue;
    }

    const delta = candidateResult.score - baselineResult.score;

    if (delta > config.regressionThreshold) {
      report.improved.push({
        caseId, oldScore: baselineResult.score, newScore: candidateResult.score,
      });
    } else if (delta < -config.regressionThreshold) {
      report.regressed.push({
        caseId, oldScore: baselineResult.score, newScore: candidateResult.score,
      });
    } else {
      report.unchanged.push(caseId);
    }
  }

  // Calculate aggregate deltas
  const candidateScores = [...candidateResults.values()].map((r) => r.score).sort((a, b) => a - b);
  const candidateP5 = candidateScores[Math.floor(candidateScores.length * 0.05)];

  report.aggregateDelta = {
    mean: average(candidateScores) - baseline.aggregates.mean,
    p5: candidateP5 - baseline.aggregates.p5,
    passRate: (candidateResults.size > 0
      ? [...candidateResults.values()].filter((r) => r.passed).length / candidateResults.size
      : 0) - baseline.aggregates.passRate,
  };

  // Determine verdict
  if (report.regressed.length > config.maxRegressions) {
    report.verdict = "fail";
  } else if (candidateP5 < config.minP5) {
    report.verdict = "fail";
  } else if (report.regressed.length > 0) {
    report.verdict = "review"; // Some regressions but within tolerance
  }

  return report;
}`;

export function RegressionTesting() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Regression testing is the practice of comparing new LLM outputs
          against a known <strong>baseline</strong> to detect quality drops
          before they reach production. It is the most critical eval practice
          for teams that ship frequently — every prompt change, model update,
          or parameter tweak can silently degrade quality.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          In traditional software, unit tests prevent code regressions. In LLM
          systems, eval baselines serve the same purpose. Without them, you are
          flying blind every time you deploy.
        </p>
      </div>

      {/* Regression Triggers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">What Causes LLM Regressions?</h3>
        <div className="space-y-3">
          {regressionTriggers.map((item) => (
            <Card key={item.trigger} className={`bg-card/50 ${item.color}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">{item.trigger}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {item.frequency}
                  </Badge>
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
          Track <strong>p5 (5th percentile)</strong> in addition to mean score.
          The mean can improve while worst-case performance silently degrades.
          A prompt change that improves 80% of cases but makes 5% catastrophically
          worse is a net negative — and mean score alone won&apos;t catch it.
        </p>
      </div>

      {/* Baseline Management */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Creating and Managing Baselines</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          A baseline is a snapshot of your system&apos;s eval scores at a known-good
          state. Every candidate change is compared against this baseline. When a
          candidate passes, it becomes the new baseline for future comparisons.
        </p>
        <CodeBlock code={baselineCode} label="baseline-management.ts" />
      </div>

      {/* Regression Detection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detecting Regressions</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Compare each test case individually against the baseline. Track
          improvements, regressions, and unchanged cases. Use configurable
          thresholds to determine what counts as a regression and how many are
          acceptable before blocking deployment.
        </p>
        <CodeBlock code={regressionDetectionCode} label="regression-detection.ts" />
      </div>

      {/* Quality Gates */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-4">Quality Gate Recommendations</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                Hard Block
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>- p5 score drops below threshold</li>
                <li>- Any safety eval fails</li>
                <li>- Pass rate drops more than 5%</li>
                <li>- More than 5 individual regressions</li>
              </ul>
            </div>
            <div className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/10">
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-2">
                Requires Review
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>- 1-5 individual regressions</li>
                <li>- Mean score drops but p5 holds</li>
                <li>- New test cases with low scores</li>
                <li>- Significant output style changes</li>
              </ul>
            </div>
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                Auto-Approve
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>- Zero regressions</li>
                <li>- Mean and p5 improved or stable</li>
                <li>- Pass rate maintained or improved</li>
                <li>- All safety evals pass</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">The Regression Testing Workflow</h3>
          <div className="space-y-2">
            {[
              "Establish a baseline at your current known-good state",
              "Run the same eval suite against the candidate change",
              "Compare case-by-case and aggregate metrics against the baseline",
              "Block deployment if regressions exceed thresholds",
              "On successful deployment, promote candidate scores as the new baseline",
              "Repeat for every change to prompts, models, retrieval, or parameters",
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono font-bold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
