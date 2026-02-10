import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const datasetSources = [
  {
    name: "Manual / Curated",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/40",
    description:
      "Hand-crafted test cases written by domain experts who understand what good output looks like. The highest quality source but the least scalable.",
    pros: ["Highest quality and precision", "Tests specific requirements", "Captures domain nuance"],
    cons: ["Expensive and slow to create", "Limited scale", "Author bias"],
    tip: "Start here. 20 well-crafted manual cases beat 500 auto-generated ones for establishing your eval baseline.",
  },
  {
    name: "Synthetic / LLM-Generated",
    badge: "bg-purple-500/10 text-purple-600 border-purple-500/40",
    description:
      "Use an LLM to generate test cases from seed examples, templates, or category descriptions. Good for coverage and edge cases, but requires human review.",
    pros: ["Scales to hundreds of cases quickly", "Good for edge case generation", "Covers categories systematically"],
    cons: ["Quality varies — needs human review", "Can miss real-world patterns", "May have blind spots matching the generator model"],
    tip: "Generate in batches by category, then have a human review and filter. A 50% acceptance rate is typical and acceptable.",
  },
  {
    name: "Production Sampling",
    badge: "bg-green-500/10 text-green-600 border-green-500/40",
    description:
      "Sample real user inputs and outputs from production logs. The most representative source of how your system is actually used.",
    pros: ["Reflects real usage patterns", "Captures edge cases you'd never imagine", "Automatically tracks distribution shifts"],
    cons: ["Requires production traffic first", "May contain PII (needs scrubbing)", "Needs labeling after collection"],
    tip: "Stratified sampling is key — sample across user types, input categories, and outcome types (success/failure). Over-sample failures.",
  },
];

const syntheticGenerationCode = `// Generate synthetic eval cases from seed examples
import { z } from "zod";

const EvalCase = z.object({
  input: z.string(),
  expectedBehavior: z.string(),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard", "adversarial"]),
});

async function generateSyntheticCases(
  seedCases: z.infer<typeof EvalCase>[],
  categories: string[],
  countPerCategory: number,
): Promise<z.infer<typeof EvalCase>[]> {
  const allCases: z.infer<typeof EvalCase>[] = [];

  for (const category of categories) {
    const seeds = seedCases.filter((c) => c.category === category);

    const generated = await llm.generate({
      system: \`You are an eval dataset generator. Given seed examples,
generate \${countPerCategory} new test cases for the "\${category}" category.

Requirements:
- Each case must be meaningfully different from seeds
- Include a mix of difficulties: easy, medium, hard, adversarial
- Adversarial cases should test edge cases and failure modes
- Expected behavior should describe what a GOOD response does

Respond as a JSON array matching the schema.\`,
      messages: [
        {
          role: "user",
          content: \`Seed examples:\\n\${JSON.stringify(seeds, null, 2)}\`,
        },
      ],
    });

    const parsed = z.array(EvalCase).parse(JSON.parse(generated));
    allCases.push(...parsed);
  }

  return allCases;
}`;

const productionSamplingCode = `// Sample production logs for eval dataset
interface ProductionLog {
  id: string;
  input: string;
  output: string;
  timestamp: string;
  userFeedback?: "positive" | "negative";
  latencyMs: number;
  model: string;
}

async function sampleForEvals(
  logs: ProductionLog[],
  config: {
    totalSamples: number;
    failureOversampling: number; // e.g., 3x
    stratifyBy: "category" | "date" | "model";
  },
): Promise<ProductionLog[]> {
  // Separate successes and failures
  const failures = logs.filter((l) => l.userFeedback === "negative");
  const successes = logs.filter((l) => l.userFeedback !== "negative");

  // Over-sample failures (they're more valuable as eval cases)
  const failureSamples = stratifiedSample(
    failures,
    Math.min(
      failures.length,
      Math.floor(config.totalSamples * 0.4 * config.failureOversampling),
    ),
    config.stratifyBy,
  );

  const successSamples = stratifiedSample(
    successes,
    config.totalSamples - failureSamples.length,
    config.stratifyBy,
  );

  return [...failureSamples, ...successSamples];
}`;

const versioningCode = `// Version and track eval datasets
interface DatasetVersion {
  version: string;
  createdAt: string;
  cases: EvalCase[];
  metadata: {
    totalCases: number;
    bySource: Record<string, number>;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
  };
  changelog: string;
}

async function saveDatasetVersion(
  cases: EvalCase[],
  changelog: string,
): Promise<DatasetVersion> {
  const version: DatasetVersion = {
    version: \`v\${Date.now()}\`,
    createdAt: new Date().toISOString(),
    cases,
    metadata: {
      totalCases: cases.length,
      bySource: countBy(cases, "source"),
      byCategory: countBy(cases, "category"),
      byDifficulty: countBy(cases, "difficulty"),
    },
    changelog,
  };

  // Store in version control alongside code
  await writeFile(
    \`evals/datasets/\${version.version}.json\`,
    JSON.stringify(version, null, 2),
  );

  // Update the "latest" symlink
  await writeFile(
    "evals/datasets/latest.json",
    JSON.stringify(version, null, 2),
  );

  return version;
}`;

export function EvalDatasets() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          Your evals are only as good as your dataset. A well-constructed eval
          dataset is the most valuable artifact in your LLM engineering workflow
          — it encodes your team&apos;s knowledge of what &ldquo;good&rdquo;
          looks like and what can go wrong.
        </p>
      </div>

      {/* Dataset Source Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Three Sources of Eval Data</h3>
        <div className="space-y-4">
          {datasetSources.map((source) => (
            <Card key={source.name} className="bg-card/50">
              <CardContent className="pt-6 space-y-4">
                <Badge variant="outline" className={source.badge}>
                  {source.name}
                </Badge>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {source.description}
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                      Pros
                    </p>
                    <ul className="space-y-1">
                      {source.pros.map((pro) => (
                        <li key={pro} className="text-xs text-muted-foreground">+ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                      Cons
                    </p>
                    <ul className="space-y-1">
                      {source.cons.map((con) => (
                        <li key={con} className="text-xs text-muted-foreground">- {con}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Tip
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{source.tip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Synthetic Generation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Generating Synthetic Test Cases</h3>
        <CodeBlock code={syntheticGenerationCode} label="synthetic-eval-generation.ts" />
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          Use an LLM to generate test cases from seed examples. Specify categories and
          difficulty levels. Always have a human review generated cases before adding
          them to the eval suite — a 50% acceptance rate is typical.
        </p>
      </div>

      {/* Production Sampling */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sampling from Production</h3>
        <CodeBlock code={productionSamplingCode} label="production-sampling.ts" />
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          Over-sample failures — they are far more valuable as eval cases than
          successes. Use stratified sampling to ensure coverage across user types,
          input categories, and time periods.
        </p>
      </div>

      {/* Dataset Versioning */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Versioning Your Datasets</h3>
        <CodeBlock code={versioningCode} label="dataset-versioning.ts" />
      </div>

      {/* Edge Case Coverage */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-4">Edge Case Checklist</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              "Empty or whitespace-only inputs",
              "Very long inputs (near token limits)",
              "Inputs in unexpected languages",
              "Adversarial / prompt injection attempts",
              "Ambiguous queries with multiple valid answers",
              "Inputs requiring refused responses",
              "Multi-part questions",
              "Inputs with typos or informal language",
              "Domain-specific jargon and abbreviations",
              "Time-sensitive queries with stale data",
            ].map((edge) => (
              <div key={edge} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-muted/50 border border-border flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-sm bg-primary/40" />
                </div>
                <span className="text-xs text-muted-foreground">{edge}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">The Golden Rule</p>
        <p className="text-foreground/90 leading-relaxed">
          Your eval dataset should be a <strong>living document</strong>, not a
          static artifact. Feed production failures back in weekly. Regenerate
          synthetic cases quarterly. Audit for coverage gaps monthly. The teams
          with the best AI products are the ones that invest the most in their
          eval datasets.
        </p>
      </div>
    </div>
  );
}
