import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const eddSteps = [
  {
    step: 1,
    title: "Identify the Problem",
    description:
      "Start with a concrete quality issue — user complaints, production failures, or a new capability requirement. Define what 'fixed' looks like in measurable terms.",
    example: "Users report that the chatbot gives wrong refund amounts for multi-item orders.",
    color: "text-red-600",
  },
  {
    step: 2,
    title: "Write the Eval Cases",
    description:
      "Before touching the prompt, create eval cases that test the specific problem. Include positive examples (what good looks like), negative examples (current failure), and edge cases.",
    example: "Create 10 test cases: 3 multi-item orders, 2 single-item, 2 partial refunds, 3 edge cases (free items, discounts, bundles).",
    color: "text-yellow-600",
  },
  {
    step: 3,
    title: "Measure the Baseline",
    description:
      "Run the new eval cases against the current prompt to establish a baseline score. This quantifies how bad the problem actually is and sets a target for improvement.",
    example: "Baseline: 3/10 cases pass (30%). Multi-item orders fail consistently. Target: 9/10 (90%).",
    color: "text-blue-600",
  },
  {
    step: 4,
    title: "Iterate with Eval Feedback",
    description:
      "Modify the prompt and run the eval suite after each change. The eval score is your compass — it tells you if each change helped, hurt, or had no effect.",
    example: "v1: Add multi-item instructions → 5/10. v2: Add calculation examples → 7/10. v3: Add edge case handling → 9/10.",
    color: "text-green-600",
  },
  {
    step: 5,
    title: "Run Full Regression Suite",
    description:
      "Once the new eval passes, run the full regression suite to ensure you didn't break anything else. Only deploy if both the new eval and all existing evals pass.",
    example: "New eval: 9/10 pass. Full regression suite: 0 regressions detected. Safe to deploy.",
    color: "text-purple-600",
  },
  {
    step: 6,
    title: "Promote to Permanent Suite",
    description:
      "Add the new eval cases to your permanent regression suite. They become a safety net that prevents this specific problem from ever recurring.",
    example: "10 multi-item refund cases added to regression suite. Future prompt changes will be tested against these.",
    color: "text-cyan-600",
  },
];

const eddWorkflowCode = `// Eval-Driven Development workflow
interface EDDConfig {
  issue: string;
  evalCases: EvalCase[];
  currentPrompt: string;
  maxIterations: number;
  targetScore: number;
}

async function evalDrivenDevelopment(config: EDDConfig) {
  // Step 1: Add new eval cases to the suite
  const fullSuite = await loadEvalDataset("regression-suite");
  const expandedSuite = [...fullSuite, ...config.evalCases];

  // Step 2: Measure baseline on new cases
  const baselineResults = await runEvals(config.currentPrompt, config.evalCases);
  console.log(\`Baseline: \${baselineResults.passRate * 100}% pass rate\`);
  console.log(\`Target: \${config.targetScore * 100}% pass rate\`);

  // Step 3: Iterate with eval feedback
  let bestPrompt = config.currentPrompt;
  let bestScore = baselineResults.overallScore;
  const history: { prompt: string; score: number; delta: number }[] = [];

  for (let i = 0; i < config.maxIterations; i++) {
    // Generate a prompt variant (can be manual or LLM-assisted)
    const candidate = await generatePromptVariant(bestPrompt, {
      issue: config.issue,
      failingCases: baselineResults.failures,
      iteration: i,
    });

    // Run eval on new cases
    const candidateResults = await runEvals(candidate, config.evalCases);

    // Run full regression suite to check for side effects
    const regressionResults = await runEvals(candidate, fullSuite);

    const improved = candidateResults.overallScore > bestScore;
    const noRegressions = regressionResults.regressions.length === 0;

    history.push({
      prompt: candidate,
      score: candidateResults.overallScore,
      delta: candidateResults.overallScore - bestScore,
    });

    if (improved && noRegressions) {
      bestPrompt = candidate;
      bestScore = candidateResults.overallScore;
      console.log(\`Iteration \${i + 1}: Improved to \${bestScore}\`);
    }

    // Early exit if target reached
    if (bestScore >= config.targetScore) {
      console.log(\`Target reached at iteration \${i + 1}\`);
      break;
    }
  }

  // Step 4: Deploy if improved
  if (bestScore > baselineResults.overallScore) {
    await deploy(bestPrompt);
    // Promote new cases to permanent regression suite
    await saveEvalDataset("regression-suite", expandedSuite);
    console.log(\`Deployed. Score: \${baselineResults.overallScore} → \${bestScore}\`);
  }

  return { bestPrompt, bestScore, history };
}`;

const comparisonData = [
  {
    aspect: "Approach",
    adhoc: "Change prompt, eyeball a few examples",
    edd: "Write eval cases, measure, iterate with data",
  },
  {
    aspect: "Confidence",
    adhoc: "\"I think it's better\"",
    edd: "\"Score improved 3.2 → 4.1, zero regressions\"",
  },
  {
    aspect: "Regression Risk",
    adhoc: "Unknown — discovered by users",
    edd: "Quantified — blocked by automated checks",
  },
  {
    aspect: "Knowledge Capture",
    adhoc: "In engineer's head, lost when they leave",
    edd: "In eval suite, permanent institutional knowledge",
  },
  {
    aspect: "Iteration Speed",
    adhoc: "Fast at first, slow when things break",
    edd: "Slightly slower at first, compounds over time",
  },
  {
    aspect: "Scalability",
    adhoc: "Breaks at 10+ prompt variations",
    edd: "Scales to hundreds of test cases",
  },
];

export function EvalDrivenDev() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Eval-Driven Development (EDD)</strong> is the LLM equivalent
          of Test-Driven Development. The core idea: write the eval{" "}
          <em>before</em> you fix the prompt, then iterate until the eval
          passes. This prevents goalpost-shifting, captures institutional
          knowledge, and ensures every improvement is measurable.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Just as TDD transformed software quality by making tests a first-class
          artifact, EDD transforms LLM product quality by making evals the
          foundation of the development workflow — not an afterthought.
        </p>
      </div>

      {/* The EDD Cycle */}
      <div>
        <h3 className="text-lg font-semibold mb-4">The EDD Cycle</h3>
        <div className="space-y-3">
          {eddSteps.map((step) => (
            <Card key={step.step} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-sm font-mono font-bold ${step.color}`}>
                    {step.step}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {step.description}
                    </p>
                    <div className="mt-2 bg-muted/20 rounded px-3 py-2 border border-border/50">
                      <span className="text-xs text-primary font-medium">Example: </span>
                      <span className="text-xs text-muted-foreground">{step.example}</span>
                    </div>
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
          The most important moment in EDD is <strong>Step 2 — writing the eval
          before touching the prompt</strong>. This forces you to define
          &ldquo;done&rdquo; objectively, prevents the goalpost from shifting
          during iteration, and creates permanent regression tests that protect
          future changes.
        </p>
      </div>

      {/* EDD vs Ad-Hoc Comparison */}
      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-4">EDD vs. Ad-Hoc Prompt Engineering</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Aspect</th>
                  <th className="text-left py-2 px-4 text-red-600 font-semibold">Ad-Hoc</th>
                  <th className="text-left py-2 pl-4 text-green-600 font-semibold">Eval-Driven</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.aspect} className="border-b border-border/20">
                    <td className="py-2.5 pr-4 text-foreground/80 font-medium">{row.aspect}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{row.adhoc}</td>
                    <td className="py-2.5 pl-4 text-muted-foreground">{row.edd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* EDD Workflow Code */}
      <div>
        <h3 className="text-lg font-semibold mb-4">The EDD Workflow in Code</h3>
        <CodeBlock code={eddWorkflowCode} label="eval-driven-development.ts" />
      </div>

      {/* Anti-Pattern Warning */}
      <Card className="bg-card/50 border-red-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/40 flex-shrink-0">
              Warning
            </Badge>
            <div>
              <h4 className="font-semibold text-sm">Avoid Eval Overfitting</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                If you iterate on the same eval cases for too long, your prompt
                becomes over-fitted to those specific cases — it passes the eval
                but fails on unseen production queries. Mitigate this by
                maintaining a <strong>held-out test set</strong> that you never
                look at during development. Run it as a final gate before
                deployment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">The EDD Mantra</h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            <strong>Write the eval. Measure the baseline. Iterate with data.
            Deploy with confidence.</strong> Every production failure becomes a
            new eval case. Every eval case prevents that failure from recurring.
            Over time, your eval suite becomes the most valuable artifact in
            your LLM engineering workflow — it is your team&apos;s accumulated
            knowledge of what can go wrong and what &ldquo;good&rdquo; looks
            like.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
