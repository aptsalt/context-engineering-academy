import type { PlaygroundScenario } from "@/lib/playground-data";

export const debugFailingAgentScenario: PlaygroundScenario = {
  id: "debug-failing-agent",
  name: "Debug Failing Agent",
  emphasis: "full-pipeline",
  emphasisLabel: "Full Pipeline",
  meta: {
    title: "Production Incident",
    description:
      "An AI agent in production is failing silently — users report wrong answers but no errors appear in your dashboard. Each observability component you enable gives you more visibility into what went wrong. Watch how your debugging ability improves as you build up the observability stack.",
    infoCards: [
      { icon: "AlertTriangle", label: "Incident", value: "Silent failures — wrong answers, no errors" },
      { icon: "Code", label: "Agent", value: "RAG-based support agent — GPT-4o" },
      { icon: "User", label: "Impact", value: "~15% of queries returning hallucinated answers" },
    ],
  },
  inputLabel: "Engineer",
  customerMessage:
    "Our support agent has been returning incorrect policy information to customers since last night. No errors in the logs, no alerts fired. Multiple customers have complained. I need to figure out what broke and fix it before more customers get wrong answers.",
  recommendedBuildOrder: [
    "structured-logging",
    "distributed-tracing",
    "metrics-dashboard",
    "error-alerting",
    "cost-tracking",
    "trace-replay",
  ],
  components: [
    {
      id: "structured-logging",
      name: "Structured Logging",
      shortName: "Logging",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 180,
      description: "JSON-formatted logs with trace IDs, latency, model parameters, and retrieval metadata.",
      content: `<structured_logs>
## Recent Logs (last 6 hours, filtered: agent=support-agent-v2)

[2025-01-15T03:12:44Z] level=INFO trace_id=abc-1190
  action=rag_retrieval query="refund policy deadline"
  docs_returned=3 top_score=0.42 latency_ms=340
  model=gpt-4o temperature=0.1 index=policy-docs-v3

[2025-01-15T03:12:45Z] level=INFO trace_id=abc-1190
  action=llm_completion prompt_tokens=2847 completion_tokens=312
  finish_reason=stop latency_ms=1820
  tool_calls=0 retrieval_context_length=1940

[2025-01-15T02:58:11Z] level=WARN trace_id=abc-1187
  action=rag_retrieval query="shipping damage claim process"
  docs_returned=3 top_score=0.31 latency_ms=380
  model=gpt-4o temperature=0.1 index=policy-docs-v3
  note="low relevance scores across all returned documents"

[2025-01-15T02:01:33Z] level=INFO trace_id=abc-1180
  action=index_refresh index=policy-docs-v3 status=completed
  docs_indexed=847 duration_ms=12400 embedding_model=text-embedding-3-small

## Pattern detected: top_score dropped from avg 0.82 to avg 0.38
   starting at ~02:01Z (after index refresh)
</structured_logs>`,
    },
    {
      id: "distributed-tracing",
      name: "Distributed Tracing",
      shortName: "Tracing",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 200,
      description: "End-to-end request traces showing every span from ingestion to response.",
      content: `<distributed_traces>
## Trace: abc-1190 (flagged by customer complaint)

Span 1: api-gateway (12ms)
  -> method=POST path=/v1/chat
  -> user_id=cust-8821 session_id=sess-4410

Span 2: intent-classifier (85ms)
  -> intent=policy_inquiry confidence=0.94
  -> routed_to=support-agent-v2

Span 3: rag-retrieval (340ms)
  -> query="refund policy deadline"
  -> index=policy-docs-v3
  -> chunks_retrieved=3
  -> relevance_scores=[0.42, 0.38, 0.29]  // ALL BELOW 0.5 THRESHOLD
  -> WARNING: no chunks above quality threshold

Span 4: context-assembly (8ms)
  -> system_prompt=loaded few_shot=loaded
  -> rag_context=included (despite low scores)
  -> total_tokens=2847

Span 5: llm-completion (1820ms)
  -> model=gpt-4o prompt_tokens=2847 completion_tokens=312
  -> finish_reason=stop
  -> grounding_check=SKIPPED (not configured)

Span 6: response-delivery (5ms)
  -> status=200 total_latency=2270ms
</distributed_traces>`,
    },
    {
      id: "metrics-dashboard",
      name: "Metrics Dashboard",
      shortName: "Metrics",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 170,
      description: "Aggregated metrics showing retrieval quality, response accuracy, and throughput over time.",
      content: `<metrics_dashboard>
## Key Metrics — Last 24 Hours

### Retrieval Quality
- Avg relevance score: 0.38 (was 0.82 yesterday) [DOWN 54%]
- Queries with score > 0.5: 12% (was 91% yesterday)
- Index: policy-docs-v3, last refresh: 2025-01-15T02:01Z

### Response Accuracy (sampled)
- Hallucination rate: ~15% (was <2% yesterday) [UP 7.5x]
- Grounding ratio: not measured (grounding check disabled)
- Avg response confidence: not tracked

### Throughput
- Requests/min: 42 (normal range: 35-50)
- p50 latency: 2.1s | p95: 3.8s | p99: 5.2s
- Error rate (HTTP 5xx): 0.1% (normal)

### Embedding Pipeline
- Embedding model: text-embedding-3-small (changed from text-embedding-ada-002 at 02:01Z)
- Index doc count: 847 (unchanged)
- Dimension mismatch: DETECTED — old embeddings=1536d, new model=512d
</metrics_dashboard>`,
    },
    {
      id: "error-alerting",
      name: "Error Alerting",
      shortName: "Alerts",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 150,
      description: "Alert rules, thresholds, and notification history for the agent pipeline.",
      content: `<error_alerting>
## Alert Configuration

### Active Alerts
- HTTP 5xx rate > 5%: NOT TRIGGERED (current: 0.1%)
- Latency p95 > 10s: NOT TRIGGERED (current: 3.8s)
- Request volume drop > 50%: NOT TRIGGERED

### Missing Alerts (gaps in coverage)
- Retrieval relevance score: NO ALERT CONFIGURED
- Hallucination rate: NO ALERT CONFIGURED
- Embedding model change: NO ALERT CONFIGURED
- Index refresh failure: NO ALERT CONFIGURED
- Grounding check bypass: NO ALERT CONFIGURED

### Recent Alert History
- 2025-01-10: Latency spike (resolved — cold start after deploy)
- 2025-01-03: 5xx spike (resolved — rate limit hit on OpenAI)
- No alerts fired between 01-10 and now

### Notification Channels
- PagerDuty: on-call engineer (5xx, latency)
- Slack #agent-alerts: all warnings
- Email: weekly digest only
</error_alerting>`,
    },
    {
      id: "cost-tracking",
      name: "Cost Tracking",
      shortName: "Costs",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 160,
      description: "Token usage, model costs, and embedding pipeline expenses per request and aggregate.",
      content: `<cost_tracking>
## Cost Report — Last 24 Hours

### LLM Costs
- Total: $47.82 (yesterday: $44.10) — normal variance
- Avg tokens/request: prompt=2847, completion=312
- Model: gpt-4o @ $2.50/1M input, $10/1M output

### Embedding Costs
- Today: $18.40 (yesterday: $0.12) [UP 153x]
- Cause: Full re-embedding of 847 docs with text-embedding-3-small
- Previous model: text-embedding-ada-002 ($0.10/1M tokens)
- New model: text-embedding-3-small ($0.02/1M tokens)
- Note: re-embedding was triggered by model change in config

### Retrieval Infrastructure
- Vector DB queries: $2.10/day (normal)
- Index storage: $0.80/day (normal)

### Anomaly
- Embedding cost spike correlates with index refresh at 02:01Z
- The model change saved per-query cost but triggered a full re-index
- New embeddings are 512-dimensional vs old 1536-dimensional
- MIXED DIMENSIONS in index — queries return low-relevance results
</cost_tracking>`,
    },
    {
      id: "trace-replay",
      name: "Trace Replay",
      shortName: "Replay",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 190,
      description: "Ability to replay a failing trace step-by-step, comparing inputs/outputs at each stage.",
      content: `<trace_replay>
## Replaying Trace abc-1190 (customer complaint)

### Step 1: Original Query
Input: "What is the deadline for requesting a refund?"
Expected: "You can request a refund within 30 days of purchase per policy POL-RET-001"

### Step 2: RAG Retrieval (ROOT CAUSE VISIBLE)
Query embedding: 512 dimensions (text-embedding-3-small)
Index contains: mix of 1536-dim (old) and 512-dim (new) embeddings
Cosine similarity: meaningless across different dimensions
Result: Retrieved chunks about "shipping logistics" instead of "refund policy"

### Step 3: Context Assembly
System prompt: correct
Retrieved context: WRONG DOCUMENTS (shipping, not refunds)
The agent received irrelevant context but no signal that retrieval failed

### Step 4: LLM Generation
Model generated answer based on wrong context
No grounding check to catch the mismatch
Response: "Refund requests should be submitted to the shipping department within 5 business days"
HALLUCINATED — mixed shipping context with refund question

### Root Cause Summary
Config change switched embedding model without re-indexing existing vectors.
Index now has mixed dimensions. Similarity search returns random results.
Fix: Re-embed all documents with the new model, or revert to old model.
</trace_replay>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Completely Blind",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "I can see customers are complaining about wrong answers, but I have no visibility into the agent's internals. No logs, no traces, no metrics. I would have to manually test queries and compare outputs to known-correct answers one by one. I have no idea when this started, what changed, or how many users are affected. My only option is to restart the service and hope it fixes itself.",
      issues: [
        "Zero visibility into agent behavior",
        "Cannot determine root cause",
        "Cannot scope the blast radius",
        "Cannot verify if a fix worked",
        "Reduced to guessing and restarting",
      ],
      strengths: [],
    },
    {
      id: "logging-only",
      label: "Log Spelunking",
      requiredComponents: ["structured-logging"],
      score: 25,
      agentResponse:
        "Looking at the structured logs, I can see something changed. Retrieval relevance scores dropped from ~0.82 to ~0.38 average starting around 02:01Z, right after an index refresh completed. The logs show `index=policy-docs-v3` was refreshed and the embedding model is `text-embedding-3-small`. I suspect the index refresh introduced a problem, but I can't trace the full request path to confirm. I need to check if the embedding model was recently changed.",
      issues: [
        "Can see symptoms but not the full causal chain",
        "Cannot trace a single request end-to-end",
        "No aggregate view — manually scanning logs",
        "Cannot confirm the embedding dimension mismatch",
      ],
      strengths: [
        "Identified the time the problem started",
        "Spotted the relevance score drop",
        "Correlated with the index refresh event",
      ],
    },
    {
      id: "logging-tracing",
      label: "Trace the Path",
      requiredComponents: ["structured-logging", "distributed-tracing"],
      score: 45,
      agentResponse:
        "I traced request abc-1190 (from the customer complaint) end-to-end. The intent classifier worked fine (0.94 confidence), but the RAG retrieval returned chunks with relevance scores all below 0.5 — the worst was 0.29. The trace shows these low-quality chunks were still passed to the LLM, and there was no grounding check configured. The LLM generated a response using irrelevant context.\n\nThe logs confirm relevance scores dropped after the 02:01Z index refresh. I strongly suspect an embedding issue, but I need aggregate metrics to confirm this isn't just a few bad queries and to understand the full scope.",
      issues: [
        "Cannot see aggregate impact — just individual traces",
        "Doesn't know about the embedding dimension mismatch specifically",
        "No visibility into what config changed at 02:01Z",
        "Cannot quantify the blast radius (15% hallucination rate)",
      ],
      strengths: [
        "Full request path visibility for specific traces",
        "Identified that low-relevance chunks are being passed through",
        "Found that grounding check is not configured",
        "Narrowed the problem to the RAG retrieval layer",
      ],
    },
    {
      id: "logging-tracing-metrics",
      label: "Scoped and Quantified",
      requiredComponents: ["structured-logging", "distributed-tracing", "metrics-dashboard"],
      score: 65,
      agentResponse:
        "Now I can see the full picture quantitatively. The metrics dashboard confirms:\n- Retrieval quality dropped 54% after the 02:01Z index refresh\n- Only 12% of queries now score above the 0.5 relevance threshold (was 91%)\n- Hallucination rate jumped from <2% to ~15%\n- The embedding model changed from text-embedding-ada-002 (1536d) to text-embedding-3-small (512d)\n- DIMENSION MISMATCH DETECTED: old embeddings are 1536-dimensional, new model outputs 512-dimensional\n\nRoot cause: Someone changed the embedding model in config, which triggered a re-index, but the index now has mixed-dimension vectors. Cosine similarity is meaningless across different dimensions.\n\nFix: Either re-embed all documents with text-embedding-3-small, or revert the config to text-embedding-ada-002. I can act on this now, but I'm concerned about why no alert fired for this.",
      issues: [
        "No alerts fired — the alerting gap means this could happen again",
        "Cannot replay the exact failure to verify the fix",
        "No cost visibility — doesn't know about the $18.40 re-embedding spike",
      ],
      strengths: [
        "Quantified the blast radius (15% hallucination, 54% quality drop)",
        "Identified the exact root cause (dimension mismatch)",
        "Has a concrete fix plan",
        "Understands the timeline precisely",
      ],
    },
    {
      id: "logging-tracing-metrics-alerts",
      label: "Prevention-Aware",
      requiredComponents: ["structured-logging", "distributed-tracing", "metrics-dashboard", "error-alerting"],
      score: 75,
      agentResponse:
        "Root cause identified: embedding model config change at 02:01Z created a dimension mismatch in the vector index (1536d vs 512d). Hallucination rate jumped from <2% to 15%, affecting approximately 1 in 7 customer queries.\n\nImmediate fix: Revert embedding model to text-embedding-ada-002 and trigger a full re-index with consistent dimensions.\n\nBut critically — the alert configuration explains why this was a silent failure. We have alerts for HTTP errors and latency, but NOTHING for:\n- Retrieval relevance score degradation\n- Hallucination rate increases\n- Embedding model changes\n- Grounding check bypass\n\nPost-incident actions:\n1. Revert embedding model and re-index\n2. Add alert: relevance score p50 < 0.5\n3. Add alert: hallucination rate > 5%\n4. Enable grounding check in the LLM pipeline\n5. Add config change notifications to Slack",
      issues: [
        "Cannot replay the exact failure path step-by-step to verify",
        "No cost analysis of the incident (re-embedding cost, customer impact)",
        "Fix verification requires manual testing without replay capability",
      ],
      strengths: [
        "Root cause identified with full context",
        "Prevention plan addresses the alerting gaps",
        "Understands why existing alerts didn't fire",
        "Concrete post-incident action items",
        "Proactive about preventing recurrence",
      ],
    },
    {
      id: "all-minus-replay",
      label: "Full Diagnosis",
      requiredComponents: ["structured-logging", "distributed-tracing", "metrics-dashboard", "error-alerting", "cost-tracking"],
      score: 85,
      agentResponse:
        "Full incident report:\n\n**Root cause**: Config change at 02:01Z switched embedding model from text-embedding-ada-002 (1536d) to text-embedding-3-small (512d). This triggered a re-index that created mixed-dimension vectors. Cosine similarity became meaningless, causing retrieval to return irrelevant documents.\n\n**Impact**: 15% hallucination rate (up from <2%), affecting ~1 in 7 customer queries over 4+ hours.\n\n**Cost impact**: The re-embedding cost $18.40 (vs normal $0.12/day — a 153x spike). While the new model is cheaper per-query, the migration was botched. Total incident cost: ~$18 in unnecessary embeddings + unknown customer trust impact.\n\n**Immediate fix**: Revert to text-embedding-ada-002, trigger clean re-index.\n\n**Post-incident**:\n1. Add retrieval quality alerts (p50 score < 0.5)\n2. Add hallucination rate alert (> 5%)\n3. Gate embedding model changes behind a migration script that re-embeds ALL docs before switching\n4. Enable grounding checks on LLM responses\n5. Add cost anomaly alerts for embedding pipeline (> 10x daily average)\n\nI'm confident in this diagnosis but would like to replay the exact failure path to verify the fix before deploying.",
      issues: [
        "Cannot step through the failure to verify the fix before deploying",
        "Manual testing required to confirm the rollback works",
        "No ability to compare before/after at each pipeline stage",
      ],
      strengths: [
        "Complete root cause analysis with timeline",
        "Quantified both customer impact and cost impact",
        "Identified the cost anomaly that triggered the re-index",
        "Prevention plan covers alerts, process, and architecture",
        "Actionable fix with clear next steps",
      ],
    },
    {
      id: "all",
      label: "Production-Ready Observability",
      requiredComponents: ["structured-logging", "distributed-tracing", "metrics-dashboard", "error-alerting", "cost-tracking", "trace-replay"],
      score: 95,
      agentResponse:
        "Incident resolved. Full analysis with verified fix:\n\n**Root cause** (confirmed via trace replay): Config change at 02:01Z switched embedding model from text-embedding-ada-002 (1536d) to text-embedding-3-small (512d). The index refresh created mixed-dimension vectors. Replaying trace abc-1190 shows the query embedding (512d) was compared against 1536d document vectors — cosine similarity returned near-random results, causing the agent to receive shipping docs instead of refund policy.\n\n**Verified fix**: Replayed the same trace after reverting to ada-002 and re-indexing. Relevance score went from 0.42 to 0.89. Correct refund policy document now returned.\n\n**Impact**: 15% hallucination rate over ~4 hours, ~$18.40 wasted embedding cost, unknown customer trust damage.\n\n**Post-incident actions**:\n1. Reverted embedding model, clean re-index deployed (verified via replay)\n2. New alerts added: retrieval score < 0.5, hallucination > 5%, embedding cost > 10x avg\n3. Migration gate: embedding model changes now require full re-index completion before traffic switch\n4. Enabled grounding check: LLM responses now validated against retrieved context\n5. Runbook created: \"Embedding Model Migration Checklist\"\n\nTime to detection: 4+ hours (will be <5 minutes with new alerts)\nTime to root cause: 25 minutes (with full observability stack)\nTime to verified fix: 40 minutes (trace replay confirmed correctness before deploy)",
      issues: ["Could add automated regression tests that replay known-good traces nightly"],
      strengths: [
        "Root cause verified by replaying the exact failure",
        "Fix confirmed working before deploying to production",
        "Complete cost accounting of the incident",
        "Prevention plan addresses detection, process, and architecture",
        "Specific SLA improvements quantified (4h -> 5min detection)",
        "Replay capability eliminates guesswork in verification",
        "Runbook created for future embedding migrations",
        "Demonstrates full observability pipeline value",
      ],
    },
    {
      id: "tracing-only",
      label: "Single Thread",
      requiredComponents: ["distributed-tracing"],
      score: 20,
      agentResponse:
        "I pulled up trace abc-1190 from the customer complaint. I can see the request went through the intent classifier (fine), then RAG retrieval returned low relevance scores (all below 0.5), and the LLM generated a response from that bad context. There's no grounding check configured. But I can only look at individual traces — I don't know if this is a widespread issue or just this one query. I need aggregate metrics to scope this.",
      issues: [
        "Can only inspect individual requests, not patterns",
        "No aggregate view to scope the problem",
        "Cannot determine when the issue started",
        "No visibility into what changed in the system",
        "Manual trace-by-trace investigation",
      ],
      strengths: [
        "Can follow a single request end-to-end",
        "Identified the low retrieval scores",
        "Found the missing grounding check",
      ],
    },
  ],
  principles: [
    {
      id: "layers-compound",
      title: "Observability Layers Compound",
      description:
        "Logs tell you what happened. Traces tell you where. Metrics tell you how much. Alerts tell you when. Each layer alone gives partial visibility — together they give you full situational awareness. The jump from 25 to 65 happens when you combine these three core layers.",
      linkedComponents: ["structured-logging", "distributed-tracing", "metrics-dashboard"],
    },
    {
      id: "silent-failures-need-quality-alerts",
      title: "Silent Failures Need Quality Alerts",
      description:
        "Traditional alerts (5xx rate, latency) miss AI-specific failures. An agent can return HTTP 200 with a confident, completely wrong answer. You need alerts on retrieval quality, hallucination rate, and semantic correctness — not just infrastructure health.",
      linkedComponents: ["error-alerting", "metrics-dashboard"],
    },
    {
      id: "replay-enables-verification",
      title: "Replay Enables Verification",
      description:
        "Diagnosing the root cause is only half the battle. Trace replay lets you verify your fix works by re-running the exact failing request through the corrected pipeline — before deploying to production. This is the difference between 'I think it's fixed' and 'I proved it's fixed.'",
      linkedComponents: ["trace-replay", "distributed-tracing"],
    },
    {
      id: "cost-as-signal",
      title: "Cost Is an Observability Signal",
      description:
        "Cost anomalies often surface problems before quality metrics do. A 153x spike in embedding costs was the earliest signal that something changed in the pipeline. Tracking cost per component turns your bill into a monitoring dashboard.",
      linkedComponents: ["cost-tracking"],
    },
  ],
};
