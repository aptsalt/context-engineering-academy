import type { PlaygroundScenario } from "@/lib/playground-data";

export const costInvestigationScenario: PlaygroundScenario = {
  id: "cost-investigation",
  name: "Cost Spike Investigation",
  emphasis: "token-efficiency",
  emphasisLabel: "Token Efficiency",
  meta: {
    title: "Cost Anomaly",
    description:
      "Token costs spiked 3x overnight with no change in traffic volume. Each observability component you enable gives you more tools to find the cause. Watch how your ability to identify, scope, and fix the cost spike improves as you add visibility layers.",
    infoCards: [
      { icon: "CreditCard", label: "Daily Cost", value: "$340/day (was $110/day)" },
      { icon: "Package", label: "Traffic", value: "Steady — 48k requests/day" },
      { icon: "AlertTriangle", label: "Spike", value: "3.1x increase overnight" },
    ],
  },
  inputLabel: "Engineer",
  customerMessage:
    "Our AI agent's daily token cost jumped from $110 to $340 overnight. Traffic volume hasn't changed. Finance flagged it this morning and wants an explanation by EOD. I need to find out what changed, which routes are responsible, and how to bring costs back down.",
  recommendedBuildOrder: [
    "token-tracking",
    "request-logs",
    "model-usage-metrics",
    "budget-alerts",
    "per-route-breakdown",
    "historical-trends",
  ],
  components: [
    {
      id: "token-tracking",
      name: "Token Tracking",
      shortName: "Tokens",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 170,
      description: "Per-request token counts for prompt, completion, and total with model attribution.",
      content: `<token_tracking>
## Token Usage — Last 24 Hours

### Aggregate
- Total tokens: 18.4M (yesterday: 5.9M) [UP 3.1x]
- Prompt tokens: 16.1M (yesterday: 4.8M) [UP 3.4x]
- Completion tokens: 2.3M (yesterday: 1.1M) [UP 2.1x]

### Per-Request Averages
- Avg prompt tokens: 335 (yesterday: 100) [UP 3.35x]
- Avg completion tokens: 48 (yesterday: 23) [UP 2.1x]
- Avg total tokens: 383 (yesterday: 123)

### Model Distribution
- gpt-4o: 67% of requests (yesterday: 67%)
- gpt-4o-mini: 33% of requests (yesterday: 33%)

### Anomaly
- Prompt token bloat is the primary driver (3.4x vs 2.1x for completions)
- The spike started at approximately 2025-01-14T22:00Z
- No change in request volume (48,200 vs 47,800 yesterday)
</token_tracking>`,
    },
    {
      id: "request-logs",
      name: "Request Logs",
      shortName: "Logs",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 190,
      description: "Detailed request/response logs showing prompt content, model selection, and caching behavior.",
      content: `<request_logs>
## Sample Requests — Comparing Before and After Spike

### Request at 2025-01-14T21:45Z (BEFORE spike)
route=/api/chat/general model=gpt-4o-mini
prompt_tokens=82 completion_tokens=19
system_prompt_tokens=45 user_message_tokens=22 rag_tokens=0 few_shot_tokens=15
cache_status=HIT (system_prompt cached)

### Request at 2025-01-14T22:15Z (AFTER spike)
route=/api/chat/general model=gpt-4o-mini
prompt_tokens=310 completion_tokens=24
system_prompt_tokens=45 user_message_tokens=22 rag_tokens=228 few_shot_tokens=15
cache_status=MISS (prompt changed — new RAG context)

### Request at 2025-01-15T01:30Z (AFTER spike)
route=/api/chat/support model=gpt-4o
prompt_tokens=580 completion_tokens=67
system_prompt_tokens=120 user_message_tokens=35 rag_tokens=380 few_shot_tokens=45
cache_status=MISS (prompt changed — new RAG context)

### Pattern: RAG context injection started at 22:00Z
- Before 22:00Z: rag_tokens=0 on all /api/chat/general requests
- After 22:00Z: rag_tokens=150-400 on every request
- Cause: Feature flag "enable-rag-all-routes" was turned ON at 21:58Z
</request_logs>`,
    },
    {
      id: "model-usage-metrics",
      name: "Model Usage Metrics",
      shortName: "Models",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 160,
      description: "Cost breakdown by model, showing pricing tiers and usage patterns.",
      content: `<model_usage_metrics>
## Model Cost Breakdown — Last 24 Hours

### gpt-4o (67% of requests)
- Requests: 32,300
- Input tokens: 11.2M @ $2.50/1M = $28.00 (yesterday: $8.40)
- Output tokens: 1.6M @ $10.00/1M = $16.00 (yesterday: $7.70)
- Subtotal: $44.00 (yesterday: $16.10) [UP 2.7x]

### gpt-4o-mini (33% of requests)
- Requests: 15,900
- Input tokens: 4.9M @ $0.15/1M = $0.74 (yesterday: $0.22)
- Output tokens: 0.7M @ $0.60/1M = $0.42 (yesterday: $0.19)
- Subtotal: $1.16 (yesterday: $0.41) [UP 2.8x]

### Embedding (text-embedding-3-small)
- Tokens: 82M @ $0.02/1M = $1.64 (yesterday: $1.58)
- Status: NORMAL — not contributing to spike

### Total: $46.80/day API cost (yesterday: $18.09)
### Infrastructure (vector DB, compute): $293.20/day (unchanged)
### Combined: $340.00/day (yesterday: $111.29)

Note: API cost increased 2.6x; the 3.1x total spike includes
a baseline infra cost that dilutes the ratio.
</model_usage_metrics>`,
    },
    {
      id: "budget-alerts",
      name: "Budget Alerts",
      shortName: "Alerts",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 140,
      description: "Cost threshold alerts, budget limits, and anomaly detection configuration.",
      content: `<budget_alerts>
## Alert Configuration

### Active Alerts
- Monthly budget limit ($4,000): 68% consumed (22 days remaining)
  Projected: $7,480 at current rate — WILL EXCEED BUDGET
- Daily cost > $200: TRIGGERED at 2025-01-15T06:00Z
  Notification sent to: #cost-alerts Slack channel
  Acknowledged by: nobody (unread for 8 hours)

### Alert Timeline
- 2025-01-15T06:00Z: Daily cost alert triggered ($287 at 6AM projection)
- 2025-01-15T06:00Z: Slack notification sent to #cost-alerts
- 2025-01-15T14:00Z: Finance flagged the cost manually
- Gap: 8 hours between automated alert and human response

### Missing Alerts
- Per-route cost threshold: NOT CONFIGURED
- Token-per-request anomaly: NOT CONFIGURED
- Feature flag change notification: NOT CONFIGURED
- Model routing change detection: NOT CONFIGURED

### Budget Forecast
- At $110/day: $3,410/month (under budget)
- At $340/day: $7,480/month (87% over budget)
- Break-even daily rate: $129/day for remaining month
</budget_alerts>`,
    },
    {
      id: "per-route-breakdown",
      name: "Per-Route Breakdown",
      shortName: "Routes",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 180,
      description: "Cost and token usage broken down by API route, endpoint, and feature.",
      content: `<per_route_breakdown>
## Cost by Route — Last 24 Hours

### /api/chat/general (casual queries)
- Requests: 29,100 (60% of traffic)
- Cost today: $22.40 (yesterday: $4.20) [UP 5.3x] <<<< PRIMARY DRIVER
- Avg tokens/request: 298 (yesterday: 82)
- RAG enabled: YES (since 21:58Z yesterday) — was previously NO
- Cache hit rate: 8% (yesterday: 72%)

### /api/chat/support (customer support)
- Requests: 12,400 (26% of traffic)
- Cost today: $18.90 (yesterday: $11.20) [UP 1.7x]
- Avg tokens/request: 520 (yesterday: 380)
- RAG enabled: YES (always) — no change
- Cache hit rate: 12% (yesterday: 15%)

### /api/chat/technical (technical queries)
- Requests: 6,700 (14% of traffic)
- Cost today: $5.50 (yesterday: $2.69) [UP 2.0x]
- Avg tokens/request: 410 (yesterday: 210)
- RAG enabled: YES (since 21:58Z yesterday) — was previously NO
- Cache hit rate: 5% (yesterday: 65%)

### Root Cause: /api/chat/general went from no RAG to full RAG injection
- This route handles 60% of traffic (simple queries that DON'T need RAG)
- Adding RAG context to every request tripled prompt tokens
- Cache invalidated because prompts changed (new RAG context each time)
</per_route_breakdown>`,
    },
    {
      id: "historical-trends",
      name: "Historical Trends",
      shortName: "Trends",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 170,
      description: "30-day cost and usage trends showing baseline, anomalies, and growth patterns.",
      content: `<historical_trends>
## 30-Day Cost Trend

### Daily API Cost
- Jan 1-14: $15-19/day (stable baseline)
- Jan 14 (after 22:00Z): $46.80/day (spike)
- Trend before spike: +2%/week (organic traffic growth)

### Token Efficiency Over Time
- Jan 1-14: 123 avg tokens/request (stable)
- Jan 15: 383 avg tokens/request (spike)
- Correlation: 1:1 with feature flag "enable-rag-all-routes"

### Feature Flag Change Log
- Jan 14 21:58Z: "enable-rag-all-routes" toggled ON by user deploy-bot
  Commit: abc789 "Enable RAG context for all chat routes"
  Author: alex.kim@company.com
  No cost impact analysis in PR review

### Cache Efficiency Trend
- Jan 1-13: 65-72% cache hit rate (prompt caching effective)
- Jan 14: 68% hit rate (before change)
- Jan 15: 9% hit rate (after change — RAG injects unique context per request)
- Estimated cache savings lost: $12-15/day

### Projection
- If reverted: return to ~$115/day within 24 hours
- If kept: $7,480/month (87% over budget)
- Recommendation: disable RAG on /general and /technical routes,
  or implement smart routing (only inject RAG when query needs it)
</historical_trends>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Completely Blind",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Finance says costs went up 3x but I have no visibility into token usage, model costs, or what changed. I can check our OpenAI dashboard for total spend but it doesn't break down by route or feature. I have no idea if this is a traffic spike, a model change, or something else. I'll need to manually audit our codebase for recent changes and cross-reference with the billing page.",
      issues: [
        "No per-request token visibility",
        "Cannot identify which route or feature caused the spike",
        "No correlation between code changes and cost impact",
        "Manual codebase audit is slow and error-prone",
        "Cannot give Finance a timeline for resolution",
      ],
      strengths: [],
    },
    {
      id: "token-tracking-only",
      label: "Knows the Symptom",
      requiredComponents: ["token-tracking"],
      score: 20,
      agentResponse:
        "I can see the numbers: prompt tokens are up 3.4x (from 100 to 335 avg per request) and completions are up 2.1x. The spike started around 22:00Z last night. Request volume is flat so it's not a traffic issue — something is stuffing more tokens into each prompt. The model distribution hasn't changed (still 67/33 gpt-4o/mini split). I need request-level logs to see what's being injected into the prompts.",
      issues: [
        "Knows tokens increased but not why",
        "Cannot see what changed in the prompts",
        "No route-level breakdown to narrow scope",
        "Cannot identify the specific feature or config change",
      ],
      strengths: [
        "Quantified the token increase precisely",
        "Ruled out traffic volume as the cause",
        "Identified prompt bloat as the primary driver",
        "Pinpointed the start time",
      ],
    },
    {
      id: "token-tracking-logs",
      label: "Found the Injection",
      requiredComponents: ["token-tracking", "request-logs"],
      score: 40,
      agentResponse:
        "Found it. Comparing before/after request logs: before 22:00Z, /api/chat/general requests had 0 RAG tokens. After 22:00Z, every request has 150-400 RAG tokens injected. The feature flag \"enable-rag-all-routes\" was turned on at 21:58Z.\n\nThis explains the prompt token bloat (3.4x increase) — RAG context is being injected into every request, including simple queries that don't need it. Cache hit rate also dropped because each prompt now contains unique RAG context.\n\nI don't have a cost breakdown by route yet, so I can't quantify exactly how much each route contributes to the total spike.",
      issues: [
        "Cannot quantify cost per route",
        "No budget impact analysis",
        "Doesn't know which routes are the biggest cost drivers",
        "No historical context to estimate monthly projection",
      ],
      strengths: [
        "Identified the feature flag as the root cause",
        "Explains both the token increase and cache invalidation",
        "Specific timestamp for the change",
        "Understands the mechanism (RAG injection into all routes)",
      ],
    },
    {
      id: "token-tracking-logs-models",
      label: "Cost Attributed",
      requiredComponents: ["token-tracking", "request-logs", "model-usage-metrics"],
      score: 55,
      agentResponse:
        "Root cause: Feature flag \"enable-rag-all-routes\" enabled at 21:58Z yesterday injected RAG context into every request, including casual queries that never needed it.\n\nCost impact by model:\n- gpt-4o: jumped from $16.10 to $44.00/day (+$27.90). Input tokens tripled due to RAG injection.\n- gpt-4o-mini: jumped from $0.41 to $1.16/day (+$0.75). Same pattern, lower absolute cost.\n- Embeddings: unchanged at ~$1.60/day.\n\nThe gpt-4o routes are the main cost driver because 67% of traffic goes through the expensive model, and each request now carries 200-400 extra RAG tokens at $2.50/1M input.\n\nFix: Disable \"enable-rag-all-routes\" and implement selective RAG — only inject context when the query classifier indicates the user needs document-backed answers.",
      issues: [
        "No per-route breakdown — can't tell Finance exactly which product feature",
        "No budget projection or alert analysis",
        "No historical trend to show this is anomalous vs organic growth",
      ],
      strengths: [
        "Complete cost attribution by model",
        "Root cause identified with specific config change",
        "Dollar impact quantified",
        "Concrete fix proposed",
        "Explains why gpt-4o is the bigger driver",
      ],
    },
    {
      id: "token-tracking-logs-models-alerts",
      label: "Budget-Aware",
      requiredComponents: ["token-tracking", "request-logs", "model-usage-metrics", "budget-alerts"],
      score: 68,
      agentResponse:
        "Root cause: Feature flag change at 21:58Z injected RAG context into all routes, tripling prompt tokens.\n\nBudget impact:\n- Current daily rate: $340/day (was $110/day)\n- Monthly projection at current rate: $7,480 (budget: $4,000 — 87% over)\n- The daily cost alert triggered at 06:00Z but went unacknowledged for 8 hours\n- Break-even requires reverting to $129/day for the rest of the month\n\nCritical gap: The alert fired but nobody was watching the #cost-alerts channel. We need per-route cost alerts and feature flag change notifications, not just daily totals.\n\nImmediate actions:\n1. Revert \"enable-rag-all-routes\" feature flag\n2. Add per-route cost threshold alerts\n3. Require cost impact analysis in PR reviews for feature flag changes\n4. Route the daily cost alert to PagerDuty, not just Slack",
      issues: [
        "Still missing per-route cost breakdown for Finance report",
        "No historical trend to prove this is anomalous",
        "Cannot show the exact route driving the most waste",
      ],
      strengths: [
        "Budget projection with clear timeline",
        "Identified the alert acknowledgment gap",
        "Process improvements to prevent recurrence",
        "Break-even analysis for Finance",
        "Actionable alert configuration changes",
      ],
    },
    {
      id: "all-minus-trends",
      label: "Fully Attributed",
      requiredComponents: ["token-tracking", "request-logs", "model-usage-metrics", "budget-alerts", "per-route-breakdown"],
      score: 82,
      agentResponse:
        "Complete cost investigation report:\n\n**Root cause**: Feature flag \"enable-rag-all-routes\" (enabled 21:58Z by alex.kim) injected RAG context into all chat routes, including /api/chat/general which handles 60% of traffic and never needed RAG.\n\n**Route-level impact**:\n- /api/chat/general: $4.20 -> $22.40/day (+$18.20, UP 5.3x) — PRIMARY DRIVER\n- /api/chat/support: $11.20 -> $18.90/day (+$7.70, UP 1.7x) — secondary, always had RAG\n- /api/chat/technical: $2.69 -> $5.50/day (+$2.81, UP 2.0x)\n\n**Secondary effect**: Cache hit rate dropped from 72% to 8% on /general because RAG injects unique context per request, defeating prompt caching.\n\n**Budget**: Projected $7,480/month at current rate (87% over $4,000 budget).\n\n**Fix plan**:\n1. IMMEDIATE: Revert feature flag on /general and /technical routes\n2. Implement smart routing: classify query intent, only inject RAG when needed\n3. Add per-route cost alerts and feature flag change notifications\n4. Estimated savings: $21/day from reverting general + technical routes",
      issues: [
        "No historical baseline to prove this is an anomaly vs trend",
        "Cannot show Finance a 30-day trend chart for the cost report",
        "No cache efficiency trend to quantify the secondary impact over time",
      ],
      strengths: [
        "Per-route cost attribution with exact dollar amounts",
        "Identified primary driver route (60% of traffic, 5.3x spike)",
        "Quantified the cache invalidation secondary effect",
        "Concrete savings estimate from the fix",
        "Budget impact with monthly projection",
      ],
    },
    {
      id: "all",
      label: "Production-Ready Analysis",
      requiredComponents: ["token-tracking", "request-logs", "model-usage-metrics", "budget-alerts", "per-route-breakdown", "historical-trends"],
      score: 95,
      agentResponse:
        "Cost investigation complete — ready for Finance report.\n\n**Root cause**: Feature flag \"enable-rag-all-routes\" toggled ON at 21:58Z (commit abc789 by alex.kim, no cost impact analysis in PR). Injected RAG context into /general and /technical routes that previously had zero RAG usage.\n\n**Impact breakdown**:\n- /api/chat/general: $4.20 -> $22.40/day (5.3x, 60% of traffic, $18.20/day waste)\n- Cache hit rate: 72% -> 8% (prompt caching defeated by per-request RAG, ~$13/day additional waste)\n- Total daily overspend: ~$31/day in unnecessary costs\n- Monthly projection: $7,480 vs $4,000 budget (87% over)\n\n**Historical context**: 30-day trend shows stable $15-19/day API cost with +2%/week organic growth. This spike is a clear anomaly, not organic. Token efficiency was flat at 123 tokens/request for 14 days before jumping to 383.\n\n**Resolution** (implemented):\n1. Reverted feature flag on /general and /technical — cost returning to baseline within 24h\n2. Smart routing RFC opened: inject RAG only when query classifier scores > 0.7\n3. New alerts: per-route daily cost > 2x baseline, feature flag change -> PagerDuty\n4. Process: PR template now requires cost impact estimate for feature flag changes\n5. Cache monitoring: alert when cache hit rate drops > 30% in 1 hour\n\n**Estimated monthly savings from fix**: $930/month ($31/day x 30)\n**Time to detection**: 8 hours (alert fired but unmonitored Slack channel)\n**With new alerts**: <15 minutes (PagerDuty escalation)",
      issues: ["Could add automated cost regression testing for feature flag changes"],
      strengths: [
        "Complete Finance-ready report with dollar amounts per route",
        "Historical trend proves this is an anomaly, not growth",
        "Cache efficiency impact quantified separately",
        "Root cause traced to specific commit and author",
        "Process improvements prevent recurrence",
        "Monthly savings quantified",
        "Detection time improvement measurable",
        "30-day context eliminates ambiguity",
      ],
    },
    {
      id: "logs-only",
      label: "Reading Tea Leaves",
      requiredComponents: ["request-logs"],
      score: 15,
      agentResponse:
        "I can see individual request logs. Comparing a few before and after samples, I notice RAG tokens appeared in /api/chat/general requests after 22:00Z — they were zero before. A feature flag \"enable-rag-all-routes\" was apparently turned on. But without aggregate metrics, I'm manually sampling logs trying to estimate the impact. I think this might be the cause but I can't quantify how much it costs or which routes are affected most.",
      issues: [
        "Manual log sampling — could miss the full picture",
        "No aggregate cost or token metrics",
        "Cannot quantify the dollar impact",
        "No route-level breakdown",
        "Relies on spotting patterns in individual requests",
      ],
      strengths: [
        "Found the feature flag change in request metadata",
        "Noticed the RAG injection pattern",
      ],
    },
  ],
  principles: [
    {
      id: "token-attribution",
      title: "Token Attribution Is Cost Attribution",
      description:
        "When you can break down tokens per component (system prompt, user message, RAG context, few-shot examples), you can directly attribute cost to each part of your context engineering pipeline. This turns 'costs went up' into 'RAG injection on the general route added $18.20/day.'",
      linkedComponents: ["token-tracking", "request-logs", "per-route-breakdown"],
    },
    {
      id: "route-level-visibility",
      title: "Route-Level Visibility Finds the Needle",
      description:
        "Aggregate metrics tell you something is wrong. Per-route breakdowns tell you exactly where. The /general route (60% of traffic) was the primary driver — without route-level visibility, you'd waste time investigating all routes equally.",
      linkedComponents: ["per-route-breakdown", "model-usage-metrics"],
    },
    {
      id: "alerts-need-routing",
      title: "Alerts Without Routing Are Silent",
      description:
        "The daily cost alert fired 8 hours before Finance flagged the issue — but it went to an unmonitored Slack channel. Alert configuration includes both thresholds AND routing. PagerDuty for critical cost alerts, not Slack-only.",
      linkedComponents: ["budget-alerts"],
    },
    {
      id: "trends-prove-anomalies",
      title: "Trends Prove Anomalies",
      description:
        "A 30-day baseline turns 'costs seem high' into 'costs are 3.1x above a 14-day stable baseline, correlated 1:1 with a specific feature flag change.' Historical trends are essential for incident reports and preventing false positives from organic growth.",
      linkedComponents: ["historical-trends", "token-tracking"],
    },
  ],
};
