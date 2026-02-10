import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { quotes } from "@/lib/data";

export function WhatIsIt() {
  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-foreground/90">
          <strong>Context engineering</strong> is the discipline of designing
          systems that provide LLMs with the right information, at the right
          time, in the right format, to accomplish a task reliably.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Unlike prompt engineering — which focuses on{" "}
          <em>how you ask</em> — context engineering focuses on{" "}
          <em>what information the model has access to</em> when it generates a
          response. It encompasses system prompts, retrieved documents, tool
          definitions, conversation history, memory, and structured data.
        </p>
      </div>

      {/* Origin */}
      <Card className="bg-card/50 border-primary/20">
        <CardContent className="pt-6">
          <Badge className="mb-3">Origin Story</Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The term was popularized by <strong>Tobi Lütke</strong> (CEO of
            Shopify) in a tweet on June 19, 2025. <strong>Andrej Karpathy</strong>{" "}
            enthusiastically endorsed it, and by July 2025, <strong>Gartner</strong>{" "}
            declared &ldquo;context engineering is in, prompt engineering is
            out.&rdquo; While the underlying techniques existed before, the term
            gave the community a clear framework for thinking about the biggest
            challenge in building reliable AI agents.
          </p>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-lg">
        <p className="text-sm font-semibold text-primary mb-2">Key Insight</p>
        <p className="text-foreground/90 leading-relaxed">
          When agentic LLM systems fail, it is <strong>almost never</strong>{" "}
          because the model is incapable. It&apos;s because the model wasn&apos;t given
          the context required to make a good decision. Missing facts, poor
          formatting, wrong tools — these are <em>context failures</em>, not
          model failures.
        </p>
      </div>

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
