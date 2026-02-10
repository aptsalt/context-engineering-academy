import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { quotes } from "@/lib/llm-evals-data";

const costOfNoEvals = [
  {
    scenario: "Prompt Regression",
    description: "A prompt change that improves one use case silently breaks three others.",
    impact: "Users see degraded quality for days before anyone notices.",
    color: "border-red-500/20",
  },
  {
    scenario: "Model Provider Update",
    description: "Your LLM provider ships a new model version. Your app behavior changes overnight.",
    impact: "No way to quantify the impact or decide whether to pin the old version.",
    color: "border-orange-500/20",
  },
  {
    scenario: "Temperature Tweak",
    description: "Someone changes temperature from 0.7 to 0.3 to reduce hallucinations.",
    impact: "Hallucinations drop but creative tasks become robotic. No data to balance the tradeoff.",
    color: "border-yellow-500/20",
  },
  {
    scenario: "RAG Index Update",
    description: "New documents are indexed into the retrieval system with different formatting.",
    impact: "Retrieval quality shifts but nothing in the pipeline detects the change.",
    color: "border-purple-500/20",
  },
];

export function WhyEvals() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>LLM evaluations</strong> are systematic methods for measuring
          the quality, reliability, and safety of LLM outputs. They are the
          difference between shipping a demo and shipping a product.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Traditional software has type systems, unit tests, and integration
          tests. LLM outputs are non-deterministic, subjective, and context-
          dependent. Evals are the testing discipline designed for this reality
          — they give you confidence that your system works, a safety net when
          you make changes, and data to drive decisions.
        </p>
      </div>

      {/* The Core Problem */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-3">The Core Problem</Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            LLMs are <strong>stochastic systems</strong>. The same input can
            produce different outputs. A prompt that works today may fail
            tomorrow after a model update. Without evals, every change is a leap
            of faith — you have no way to know if your system is improving,
            degrading, or breaking. Users become your QA team, and user complaints
            become your monitoring system.
          </p>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          Evals are not a quality-assurance step you add at the end. They are the
          <strong> foundation</strong> of the entire development workflow. The
          best AI engineering teams write evals <em>before</em> they write
          prompts — the same way the best software teams write tests before they
          write code.
        </p>
      </div>

      {/* Cost of No Evals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">The Cost of Shipping Without Evals</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {costOfNoEvals.map((item) => (
            <Card key={item.scenario} className={`bg-card/50 ${item.color}`}>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-2">{item.scenario}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                  <p className="text-xs text-red-600 font-medium">Impact</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.impact}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* The Eval Mindset */}
      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sm mb-4">The Eval Mindset</h3>
          <div className="space-y-3">
            {[
              {
                principle: "Every prompt change is a hypothesis",
                detail: "Evals turn subjective 'I think this is better' into measurable 'this scores 4.2 vs 3.8 on our rubric.'",
              },
              {
                principle: "Evals compound over time",
                detail: "Each production failure you add to your eval suite makes the next deployment safer. Your eval suite is your institutional knowledge of what can go wrong.",
              },
              {
                principle: "Measure what matters to users",
                detail: "Don't eval for perplexity or BLEU score if your users care about helpfulness and accuracy. Eval metrics should map to user satisfaction.",
              },
              {
                principle: "Automate relentlessly",
                detail: "If a human has to remember to run evals, they won't. Put evals in CI, block merges on regressions, and post results on every PR.",
              },
            ].map((item) => (
              <div key={item.principle} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-primary"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{item.principle}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quotes */}
      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map((quote) => (
          <Card key={quote.author} className="bg-card/50">
            <CardContent className="pt-6">
              <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold">{quote.author}</p>
                <p className="text-xs text-muted-foreground">{quote.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
