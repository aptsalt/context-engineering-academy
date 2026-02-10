import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const whenToUseHuman = [
  {
    scenario: "Calibrating LLM-as-Judge",
    description:
      "Before trusting an LLM judge, validate its scores against human labels on 50-100 cases. If correlation is low, the judge prompt needs rework.",
    priority: "critical",
  },
  {
    scenario: "Subjective Quality Assessment",
    description:
      "Tasks where 'quality' is genuinely subjective — creative writing, tone matching, brand voice. No automated metric captures this well.",
    priority: "high",
  },
  {
    scenario: "Safety-Critical Applications",
    description:
      "Medical, legal, financial advice. Automated evals catch format issues but humans catch dangerous misinformation.",
    priority: "critical",
  },
  {
    scenario: "New Product Launch",
    description:
      "Before the first public release, human reviewers catch issues that no eval suite anticipated. Use this feedback to bootstrap your automated evals.",
    priority: "high",
  },
  {
    scenario: "Adversarial Testing",
    description:
      "Red-teaming for safety evals. Creative humans find attack vectors that automated adversarial generators miss.",
    priority: "high",
  },
  {
    scenario: "Periodic Audits",
    description:
      "Even with good automated evals, run quarterly human audits on a production sample to catch systematic blind spots.",
    priority: "medium",
  },
];

const annotationGuidelinesCode = `// Annotation guidelines template
interface AnnotationGuideline {
  taskDescription: string;
  dimensions: {
    name: string;
    description: string;
    scale: { value: number; label: string; examples: string }[];
  }[];
  edgeCases: { scenario: string; guidance: string }[];
}

const summaryEvalGuideline: AnnotationGuideline = {
  taskDescription: \`Evaluate the quality of an AI-generated summary.
Read the source document, then rate the summary on each dimension.\`,
  dimensions: [
    {
      name: "Accuracy",
      description: "Are all facts in the summary correct per the source?",
      scale: [
        { value: 1, label: "Major errors", examples: "States wrong numbers, inverts conclusions" },
        { value: 2, label: "Minor errors", examples: "Slightly wrong dates, imprecise wording" },
        { value: 3, label: "Mostly accurate", examples: "Key facts correct, minor omissions" },
        { value: 4, label: "Accurate", examples: "All facts verifiable against source" },
        { value: 5, label: "Perfectly accurate", examples: "Every claim traceable to source" },
      ],
    },
    {
      name: "Completeness",
      description: "Does the summary cover all key points from the source?",
      scale: [
        { value: 1, label: "Missing critical info", examples: "Main conclusion absent" },
        { value: 2, label: "Significant gaps", examples: "2+ key points missing" },
        { value: 3, label: "Adequate coverage", examples: "Main points present, details missing" },
        { value: 4, label: "Good coverage", examples: "All key points, most details" },
        { value: 5, label: "Comprehensive", examples: "All points covered proportionally" },
      ],
    },
    {
      name: "Conciseness",
      description: "Is the summary appropriately brief without losing meaning?",
      scale: [
        { value: 1, label: "Far too long", examples: "Longer than source, excessive repetition" },
        { value: 2, label: "Too verbose", examples: "Could be 50% shorter without loss" },
        { value: 3, label: "Acceptable", examples: "Some unnecessary content" },
        { value: 4, label: "Concise", examples: "Tight writing, minimal fluff" },
        { value: 5, label: "Perfectly concise", examples: "Every word earns its place" },
      ],
    },
  ],
  edgeCases: [
    {
      scenario: "Summary adds information not in the source",
      guidance: "Score Accuracy as 1 regardless of whether the added info is correct.",
    },
    {
      scenario: "Summary is a single sentence",
      guidance: "Can still score high on Conciseness if it captures the core message.",
    },
  ],
};`;

const interRaterCode = `// Calculate inter-rater reliability (Cohen's Kappa)
function cohensKappa(
  rater1: number[],
  rater2: number[],
): { kappa: number; interpretation: string } {
  const n = rater1.length;
  const categories = [...new Set([...rater1, ...rater2])];

  // Observed agreement
  let agreed = 0;
  for (let i = 0; i < n; i++) {
    if (rater1[i] === rater2[i]) agreed++;
  }
  const observedAgreement = agreed / n;

  // Expected agreement by chance
  let expectedAgreement = 0;
  for (const cat of categories) {
    const p1 = rater1.filter((r) => r === cat).length / n;
    const p2 = rater2.filter((r) => r === cat).length / n;
    expectedAgreement += p1 * p2;
  }

  const kappa = (observedAgreement - expectedAgreement) / (1 - expectedAgreement);

  const interpretation =
    kappa >= 0.81 ? "Almost perfect agreement" :
    kappa >= 0.61 ? "Substantial agreement" :
    kappa >= 0.41 ? "Moderate agreement" :
    kappa >= 0.21 ? "Fair agreement" :
    "Poor agreement — revise guidelines";

  return { kappa, interpretation };
}

// Usage: validate annotator consistency
const rater1Scores = [5, 4, 3, 5, 2, 4, 3, 5, 4, 3];
const rater2Scores = [5, 4, 4, 5, 2, 3, 3, 5, 4, 3];
const { kappa, interpretation } = cohensKappa(rater1Scores, rater2Scores);
// kappa: 0.72 — "Substantial agreement"`;

export function HumanEvals() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Automated evals scale, but <strong>human evaluation</strong> is the
          ground truth. LLM judges have known biases — they prefer verbose
          responses, exhibit position bias, and rate their own model&apos;s outputs
          higher. Human evals calibrate your automated systems and catch issues
          that no metric can quantify.
        </p>
      </div>

      {/* When to Use Human Eval */}
      <div>
        <h3 className="text-lg font-semibold mb-4">When to Involve Human Reviewers</h3>
        <div className="space-y-3">
          {whenToUseHuman.map((item) => (
            <Card key={item.scenario} className="bg-card/50">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className={
                      item.priority === "critical"
                        ? "bg-red-500/10 text-red-600 border-red-500/40"
                        : item.priority === "high"
                          ? "bg-orange-500/10 text-orange-600 border-orange-500/30"
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/40"
                    }
                  >
                    {item.priority}
                  </Badge>
                  <div>
                    <h4 className="font-semibold text-sm">{item.scenario}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Annotation Guidelines */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Writing Annotation Guidelines</h3>
        <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg mb-4">
          <p className="text-sm text-foreground/90 leading-relaxed">
            The most common failure in human eval is <strong>vague guidelines</strong>.
            &ldquo;Rate quality from 1-5&rdquo; means different things to different
            annotators. Good guidelines define every score level with concrete
            examples and handle edge cases explicitly.
          </p>
        </div>
        <CodeBlock code={annotationGuidelinesCode} label="annotation-guidelines.ts" />
      </div>

      {/* Inter-Rater Reliability */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Measuring Annotator Agreement</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          If two annotators disagree frequently, your guidelines are ambiguous. Use
          Cohen&apos;s Kappa to measure inter-rater reliability. A kappa below 0.6
          means your guidelines need revision before the annotations are useful.
        </p>
        <CodeBlock code={interRaterCode} label="inter-rater-reliability.ts" />
      </div>

      {/* Crowd vs Expert */}
      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-4">Crowd Workers vs. Domain Experts</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
              <Badge variant="outline" className="mb-3 bg-blue-500/10 text-blue-600 border-blue-500/40">
                Crowd Workers
              </Badge>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">+</span>
                  Cheap ($0.10-$1 per annotation)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">+</span>
                  Fast (hundreds of labels per day)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">+</span>
                  Good for general quality, formatting, clarity
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">-</span>
                  Can&apos;t assess factual accuracy in specialized domains
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">-</span>
                  Quality varies — need attention checks and redundancy
                </li>
              </ul>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
              <Badge variant="outline" className="mb-3 bg-purple-500/10 text-purple-600 border-purple-500/40">
                Domain Experts
              </Badge>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">+</span>
                  Can verify factual correctness
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">+</span>
                  Catch subtle domain-specific errors
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">+</span>
                  Higher trust for safety-critical evaluations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">-</span>
                  Expensive ($50-$200/hr)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">-</span>
                  Limited availability and throughput
                </li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            <strong>Best practice:</strong> Use crowd workers for general quality
            evaluation and formatting checks. Reserve domain experts for factual
            accuracy verification and safety-critical assessments. Use expert labels
            to calibrate your LLM-as-judge, then scale with automated evals.
          </p>
        </CardContent>
      </Card>

      {/* Cost Optimization */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Cost Optimization Strategy</h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Human eval is expensive. Optimize by using it <strong>strategically</strong>:
            label 100 cases with experts to calibrate your LLM judge, then run the LLM
            judge on 10,000 cases. Periodically spot-check the LLM judge against new
            human labels to detect drift. This gives you expert-quality evaluation at
            automated-eval prices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
