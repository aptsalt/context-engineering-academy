import type { PlaygroundScenario } from "@/lib/playground-data";

export const latencyOptimizationScenario: PlaygroundScenario = {
  id: "latency-optimization",
  name: "Latency Regression Debug",
  emphasis: "fewer-retries",
  emphasisLabel: "Fewer Retries",
  meta: {
    title: "Latency Regression",
    description:
      "Agent response times went from 2s to 8s after a deployment. Users are dropping off and the SLO is breached. Each observability component you enable helps you pinpoint the bottleneck faster. Watch how your debugging speed and fix accuracy improve as you build up the observability stack.",
    infoCards: [
      { icon: "AlertTriangle", label: "p50 Latency", value: "8.1s (SLO target: 3s)" },
      { icon: "Code", label: "Agent", value: "Multi-tool research agent" },
      { icon: "User", label: "User Impact", value: "32% drop-off rate (was 8%)" },
    ],
  },
  inputLabel: "Engineer",
  customerMessage:
    "Our research agent's response times jumped from 2s to 8s after yesterday's deploy. The SLO dashboard is red, user drop-off rate tripled, and the PM is asking when it will be fixed. I need to find the bottleneck, understand why the deploy caused it, and get latency back under the 3s SLO target.",
  recommendedBuildOrder: [
    "latency-tracing",
    "span-breakdown",
    "tool-call-profiling",
    "queue-monitoring",
    "cache-hit-rates",
    "slo-dashboard",
  ],
  components: [
    {
      id: "latency-tracing",
      name: "Latency Tracing",
      shortName: "Latency",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 180,
      description: "End-to-end latency measurements for every request with percentile breakdowns.",
      content: `<latency_tracing>
## Latency Overview — Last 24 Hours

### Current Percentiles
- p50: 8.1s (SLO target: 3.0s) [BREACHED]
- p95: 14.2s (SLO target: 8.0s) [BREACHED]
- p99: 22.5s (SLO target: 15.0s) [BREACHED]

### Yesterday's Percentiles (before deploy)
- p50: 1.9s | p95: 3.4s | p99: 5.1s
- All within SLO targets

### Timeline
- Deploy completed: 2025-01-14T18:00Z
- Latency increase detected: 2025-01-14T18:05Z
- p50 crossed 3s SLO: 2025-01-14T18:12Z
- Current status: sustained 8s+ for 18 hours

### Request Volume
- Requests/min: 38 (yesterday: 52) [DOWN 27%]
- Drop-off rate: 32% (yesterday: 8%)
- Timeout rate (>30s): 4.2% (yesterday: 0.1%)

### Slow Request Sample
- trace_id=lat-2201: total=9.4s (research query)
- trace_id=lat-2215: total=12.1s (multi-step analysis)
- trace_id=lat-2220: total=7.8s (simple lookup)
</latency_tracing>`,
    },
    {
      id: "span-breakdown",
      name: "Span Breakdown",
      shortName: "Spans",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 200,
      description: "Per-span timing showing exactly where time is spent in the request pipeline.",
      content: `<span_breakdown>
## Span Breakdown — Trace lat-2201 (9.4s total)

### Pipeline Stages
Span 1: api-gateway          45ms  (0.5%)
Span 2: intent-classifier    120ms (1.3%)
Span 3: tool-orchestrator    180ms (1.9%)  [plans tool calls]
Span 4: tool-execution       6840ms (72.8%) <<<< BOTTLENECK
  ├─ web-search             2100ms (sequential)
  ├─ web-search             2050ms (sequential)  [was parallel before deploy]
  ├─ doc-retrieval          1800ms (sequential)
  └─ calculator              890ms (sequential)
Span 5: context-assembly     85ms  (0.9%)
Span 6: llm-completion       2020ms (21.5%)
Span 7: response-formatting  110ms (1.2%)

### Comparison: Same Query Type Yesterday (2.1s total)
Span 4: tool-execution       820ms (39.0%)
  ├─ web-search             380ms  ─┐
  ├─ web-search             410ms  ─┤ (PARALLEL)
  ├─ doc-retrieval          420ms  ─┘
  └─ calculator              10ms  (cached)

### Key Finding
- Tool calls switched from PARALLEL to SEQUENTIAL after deploy
- 4 tools at ~2s each sequential = 6.8s
- 4 tools at ~2s each parallel = 2s
- The deploy changed tool execution strategy
</span_breakdown>`,
    },
    {
      id: "tool-call-profiling",
      name: "Tool Call Profiling",
      shortName: "Profiling",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 190,
      description: "Detailed profiling of each tool call with execution mode, retries, and dependency analysis.",
      content: `<tool_call_profiling>
## Tool Execution Profile — Last 24 Hours

### Execution Mode Change
- Before deploy: Promise.all() — tools run in parallel
- After deploy: sequential await — tools run one after another
- Change: commit def456 "refactor: migrate tool executor to new SDK"
- The new SDK's default execution mode is sequential (safety-first)
- Old SDK defaulted to parallel with dependency-aware scheduling

### Tool Latency Breakdown (p50)
| Tool           | Before  | After   | Delta  | Note              |
|----------------|---------|---------|--------|-------------------|
| web-search     | 390ms   | 2050ms  | +425%  | sequential + no cache |
| doc-retrieval  | 410ms   | 1800ms  | +339%  | sequential queuing |
| calculator     | 12ms    | 890ms   | +7317% | lost cache, cold start |
| code-executor  | 280ms   | 1200ms  | +329%  | sequential queuing |

### Individual Tool Issues
- web-search: added retry logic in new SDK (3 retries with 500ms backoff)
  Even successful calls wait 500ms before first attempt (backoff bug)
- calculator: result cache was in old SDK's memory; new SDK has no cache
- doc-retrieval: connection pool not configured in new SDK (new conn each call)

### Retry Analysis
- Unnecessary retries: 23% of tool calls retry once (200 status treated as retry-worthy)
- Cause: new SDK retries on any non-2xx AND on latency > 1s
- The 1s latency threshold triggers retries on normal web-search calls
</tool_call_profiling>`,
    },
    {
      id: "queue-monitoring",
      name: "Queue Monitoring",
      shortName: "Queues",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 150,
      description: "Request queue depth, worker utilization, and concurrency limits across the pipeline.",
      content: `<queue_monitoring>
## Queue & Concurrency — Current State

### Request Queue
- Queue depth: 12 (normal: 0-3)
- Queue wait time p50: 1.2s (normal: <100ms)
- Worker pool: 8 workers
- Worker utilization: 94% (normal: 40-60%)

### Concurrency Bottleneck
- Old config: max_concurrent_tool_calls=10 per worker
- New config: max_concurrent_tool_calls=1 per worker (new SDK default)
- Effect: each worker processes tool calls one at a time
- With 4 tool calls per request at ~2s each = 8s per request
- Workers blocked waiting for sequential tool calls

### Connection Pool
- HTTP connection pool: NOT CONFIGURED (new SDK)
- Old SDK: 50 persistent connections, keep-alive=30s
- New SDK: new TCP connection per tool call
- DNS lookup + TLS handshake adding ~200ms per tool call

### Downstream Services
- OpenAI API: responding normally (latency unchanged)
- Web search API: responding normally
- Vector DB: responding normally, connection queue growing
  - Vector DB connections: 47 active (limit: 50)
  - Near connection limit due to no pooling
</queue_monitoring>`,
    },
    {
      id: "cache-hit-rates",
      name: "Cache Hit Rates",
      shortName: "Cache",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 160,
      description: "Cache performance metrics across tool results, embeddings, and LLM prompt caching.",
      content: `<cache_hit_rates>
## Cache Performance — Before vs After Deploy

### Tool Result Cache
- Before: 45% hit rate (calculator, frequent queries)
- After: 0% hit rate — CACHE LOST
- Cause: old SDK stored tool results in in-memory LRU cache
- New SDK has no built-in result cache
- Impact: calculator calls went from 12ms (cached) to 890ms (cold)

### Embedding Cache
- Before: 62% hit rate (repeated doc lookups)
- After: 8% hit rate
- Cause: connection pool reset clears embedding cache on each connection
- Impact: doc-retrieval latency increased 4.4x

### LLM Prompt Cache (OpenAI)
- Before: 38% cache hit (repeated system prompts)
- After: 35% cache hit (minimal change)
- Note: prompt caching unaffected because prompts didn't change

### Estimated Latency Savings from Restoring Caches
- Tool result cache: saves ~800ms/request (calculator + frequent searches)
- Embedding cache with connection pooling: saves ~400ms/request
- Combined: ~1.2s savings per request
- After restoring parallel execution + caching: est. p50 = 1.8s (under SLO)
</cache_hit_rates>`,
    },
    {
      id: "slo-dashboard",
      name: "SLO Dashboard",
      shortName: "SLOs",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 170,
      description: "SLO compliance tracking with error budgets, burn rates, and business impact metrics.",
      content: `<slo_dashboard>
## SLO Status — Research Agent

### Latency SLOs
| SLO               | Target | Current | Status   | Budget Remaining |
|--------------------|--------|---------|----------|-----------------|
| p50 < 3s          | 99.5%  | 12.3%   | BREACHED | -87.2%          |
| p95 < 8s          | 99.0%  | 41.2%   | BREACHED | -57.8%          |
| p99 < 15s         | 99.0%  | 78.4%   | BREACHED | -20.6%          |

### Error Budget
- Monthly error budget (p50 SLO): 0.5% = 3.6 hours of breach allowed
- Budget consumed: 18 hours (500% of monthly budget in 1 day)
- Budget replenishment: resets Feb 1
- Current burn rate: 24x normal

### Business Impact (last 18 hours)
- User drop-off rate: 32% (baseline: 8%) — 4x increase
- Estimated lost queries: ~580 (users abandoned before response)
- Support tickets about slowness: 14
- NPS impact: estimated -8 points if unresolved this week

### Incident Timeline
- 18:00Z: Deploy completed
- 18:12Z: p50 SLO breached (automated)
- 18:30Z: PagerDuty alert sent to on-call
- 19:00Z: Acknowledged, investigation started
- Current: root cause identified, fix in progress

### Recovery Forecast
- If fix deployed now: p50 returns to <3s within 5 minutes
- Error budget recovery: will remain negative until Feb 1
- Recommendation: deploy fix + implement canary deploys for latency SLOs
</slo_dashboard>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Completely Blind",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Users say it's slow and the PM is asking for a fix. I don't have any latency data, no trace visibility, and no idea what the deploy changed. I could roll back the entire deploy but I don't know if that will fix it or break something else. My only option is to add console.log timestamps around each function and redeploy to measure where time is being spent. This will take hours to instrument and iterate on.",
      issues: [
        "No latency data of any kind",
        "Cannot identify the bottleneck",
        "Rolling back blindly risks new issues",
        "Manual instrumentation takes hours",
        "Cannot quantify user impact",
      ],
      strengths: [],
    },
    {
      id: "latency-only",
      label: "Knows It's Slow",
      requiredComponents: ["latency-tracing"],
      score: 20,
      agentResponse:
        "I can confirm the latency regression: p50 went from 1.9s to 8.1s after the 18:00Z deploy. All three SLO tiers are breached. Request volume dropped 27% and timeout rate went from 0.1% to 4.2%, suggesting users are abandoning slow requests. I have some slow trace IDs I can investigate, but I can't see where in the pipeline the time is being spent. I need span-level breakdowns to find the bottleneck.",
      issues: [
        "Knows it's slow but not where the bottleneck is",
        "Cannot pinpoint the pipeline stage causing latency",
        "No visibility into tool execution or queue state",
        "Cannot estimate fix impact without more granular data",
      ],
      strengths: [
        "Confirmed the regression with precise numbers",
        "Correlated with the deploy timestamp",
        "Identified user drop-off impact",
        "Has specific trace IDs to investigate further",
      ],
    },
    {
      id: "latency-spans",
      label: "Found the Bottleneck",
      requiredComponents: ["latency-tracing", "span-breakdown"],
      score: 40,
      agentResponse:
        "Found the bottleneck. Span breakdown shows tool-execution takes 6.8s (73% of the total 9.4s request time). The four tool calls are running SEQUENTIALLY instead of in PARALLEL. Before the deploy, the same tools ran in parallel and completed in ~820ms total. Now they run one after another: 2.1s + 2.0s + 1.8s + 0.9s = 6.8s.\n\nThe deploy must have changed the tool execution strategy from parallel to sequential. I need to check the tool executor code from the deploy diff. But I don't know why individual tool latencies also increased (e.g., calculator went from 12ms to 890ms).",
      issues: [
        "Cannot explain why individual tool latencies also increased",
        "No insight into what specific code change caused the switch",
        "No queue or concurrency visibility",
        "Cannot estimate the full fix impact",
      ],
      strengths: [
        "Identified the primary bottleneck (sequential tool execution)",
        "Quantified the latency breakdown per span",
        "Comparison with before-deploy shows the exact change",
        "Focused investigation on the right pipeline stage",
      ],
    },
    {
      id: "latency-spans-profiling",
      label: "Root Cause Identified",
      requiredComponents: ["latency-tracing", "span-breakdown", "tool-call-profiling"],
      score: 60,
      agentResponse:
        "Root cause: Commit def456 migrated the tool executor from the old SDK to a new one. The new SDK defaults to sequential execution (safety-first design) whereas the old SDK ran tools in parallel with dependency-aware scheduling.\n\nAdditional issues found in the new SDK:\n- Retry bug: 500ms backoff triggers before the FIRST attempt on every call\n- Aggressive retry: retries on latency > 1s, causing unnecessary retries on 23% of normal web-search calls\n- No built-in result cache (calculator went from 12ms cached to 890ms cold)\n- No connection pooling (new TCP + TLS handshake per tool call, +200ms each)\n\nFix plan:\n1. Set execution mode to 'parallel' in the new SDK config\n2. Fix the retry backoff bug (first attempt shouldn't wait)\n3. Raise the latency retry threshold from 1s to 5s\n4. Add a result cache for calculator and frequent queries\n\nEstimated improvement: 6.8s -> ~2s for tool execution (parallel mode alone).",
      issues: [
        "No queue/concurrency visibility — may miss capacity issues",
        "No cache analysis to quantify all latency savings",
        "No SLO or business impact metrics for the incident report",
      ],
      strengths: [
        "Traced root cause to specific commit and SDK migration",
        "Identified four separate issues in the new SDK",
        "Quantified unnecessary retries (23% of calls)",
        "Concrete fix plan with estimated improvement",
        "Understands the design difference (safety-first vs performance-first)",
      ],
    },
    {
      id: "latency-spans-profiling-queues",
      label: "Infrastructure-Aware",
      requiredComponents: ["latency-tracing", "span-breakdown", "tool-call-profiling", "queue-monitoring"],
      score: 72,
      agentResponse:
        "Root cause: New SDK (commit def456) defaults to sequential tool execution with max_concurrent_tool_calls=1. Combined with lost connection pooling, queue depth is at 12 (normal: 0-3) and worker utilization hit 94%.\n\nFull bottleneck chain:\n1. Sequential tool calls: 4 x ~2s = 8s (was ~2s parallel)\n2. No connection pool: +200ms per tool call for new TCP/TLS\n3. Queue buildup: 1.2s wait before request even starts processing\n4. Vector DB nearing connection limit (47/50) due to no pooling\n\nFix (priority order):\n1. Set max_concurrent_tool_calls=10 (match old config)\n2. Configure HTTP connection pool (50 persistent connections)\n3. Fix retry backoff bug and raise latency threshold\n4. Add result cache for calculator\n\nThis should bring p50 from 8.1s to approximately 2s. Queue depth and worker utilization will normalize once requests aren't blocking on sequential tool calls.",
      issues: [
        "No cache analysis — doesn't know full latency savings possible",
        "No SLO dashboard — cannot quantify business impact or recovery timeline",
        "Cannot give PM a precise recovery forecast",
      ],
      strengths: [
        "Complete infrastructure bottleneck analysis",
        "Queue and concurrency issues identified",
        "Vector DB connection limit risk flagged proactively",
        "Prioritized fix plan addressing root cause first",
        "Worker utilization context explains the cascade",
      ],
    },
    {
      id: "all-minus-slo",
      label: "Comprehensive Fix",
      requiredComponents: ["latency-tracing", "span-breakdown", "tool-call-profiling", "queue-monitoring", "cache-hit-rates"],
      score: 85,
      agentResponse:
        "Complete latency analysis with fix plan:\n\n**Root cause**: SDK migration (commit def456) changed tool execution from parallel to sequential, lost connection pooling, and destroyed all caches.\n\n**Bottleneck breakdown**:\n1. Sequential execution: +6s (was parallel in ~0.8s)\n2. Lost tool result cache: +0.8s (calculator 12ms -> 890ms, frequent queries uncached)\n3. Lost embedding cache: +0.4s (62% -> 8% hit rate)\n4. No connection pool: +0.2s per tool call (~0.8s total for 4 calls)\n5. Queue buildup: +1.2s wait time\n\n**Fix plan (estimated p50 after each fix)**:\n1. Enable parallel execution -> p50: ~3.2s\n2. Configure connection pool (50 connections) -> p50: ~2.6s\n3. Add tool result cache (LRU, 1000 entries) -> p50: ~2.0s\n4. Fix retry backoff bug -> p50: ~1.8s\n\n**Total estimated improvement**: 8.1s -> 1.8s (under the 3s SLO target)\n\nDeploying fix #1 alone (parallel mode) gets us close to SLO. Fixes 2-4 bring us below pre-regression baseline.",
      issues: [
        "No SLO compliance or business impact data for the incident report",
        "Cannot tell PM the exact error budget remaining or recovery timeline",
        "No business impact quantification (drop-off rate, lost queries)",
      ],
      strengths: [
        "Every latency source identified and quantified",
        "Cache analysis reveals additional savings beyond parallel fix",
        "Incremental fix plan shows impact at each step",
        "Total fix brings latency below pre-regression baseline",
        "Connection pool and vector DB risk addressed",
      ],
    },
    {
      id: "all",
      label: "Production-Ready Debug",
      requiredComponents: ["latency-tracing", "span-breakdown", "tool-call-profiling", "queue-monitoring", "cache-hit-rates", "slo-dashboard"],
      score: 95,
      agentResponse:
        "Incident report — Latency regression resolved.\n\n**Root cause**: SDK migration (commit def456) defaulted to sequential tool execution, removed connection pooling, and destroyed all caches. p50 latency went from 1.9s to 8.1s.\n\n**Business impact** (18 hours of breach):\n- SLO error budget: consumed 500% of monthly allowance (18h vs 3.6h allowed)\n- User drop-off: 32% (4x baseline), ~580 abandoned queries\n- Support tickets: 14 about slowness\n- Estimated NPS impact: -8 points if unresolved this week\n\n**Fix deployed** (all four changes):\n1. Parallel tool execution (max_concurrent=10) -> biggest win\n2. Connection pool configured (50 persistent connections)\n3. Tool result cache restored (LRU, 1000 entries)\n4. Retry backoff bug fixed, threshold raised to 5s\n\n**Result**: p50 dropped from 8.1s to 1.8s within 5 minutes of deploy. All SLO tiers now green.\n\n**Prevention**:\n1. Canary deploys: new deploys serve 5% traffic for 10 min, auto-rollback if p50 > 3s\n2. SDK migration checklist: verify execution mode, connection pool, caching, retry config\n3. Pre-deploy latency benchmark: run standard query set, compare p50 before/after\n4. SLO burn rate alert: alert if >2x normal burn rate for 15 minutes\n\n**Error budget**: exhausted for January. Will recover Feb 1. Added burn-rate alerting to catch future regressions within 15 minutes instead of 18 hours.",
      issues: ["Could add automated latency regression tests to CI/CD pipeline"],
      strengths: [
        "Complete incident report with business impact quantified",
        "SLO error budget accounting for stakeholders",
        "Fix verified with measured improvement (8.1s -> 1.8s)",
        "Prevention plan addresses deploy process, not just the code",
        "Canary deploy strategy prevents future latency regressions",
        "Burn-rate alerting catches regressions 72x faster",
        "Recovery forecast accurate (5 minutes to green)",
        "NPS and user impact data for product team",
      ],
    },
    {
      id: "spans-only",
      label: "Narrow View",
      requiredComponents: ["span-breakdown"],
      score: 15,
      agentResponse:
        "I grabbed a span breakdown for one trace. Tool execution is taking 6.8s — that's 73% of the request time. The four tool calls are running sequentially instead of in parallel. Each tool call takes 1-2s, adding up. But I only have this one trace — I don't know if every request looks like this. I don't have aggregate latency numbers, queue stats, or SLO compliance data. I need more context before recommending a fix.",
      issues: [
        "Single trace — cannot confirm this is the systemic issue",
        "No aggregate latency or percentile data",
        "No tool-level profiling to explain individual tool slowness",
        "Cannot quantify business impact or SLO status",
        "Hesitant to recommend fix without more data",
      ],
      strengths: [
        "Identified the sequential execution bottleneck",
        "Correct percentage attribution for the trace",
      ],
    },
  ],
  principles: [
    {
      id: "spans-find-bottlenecks",
      title: "Spans Find Bottlenecks Instantly",
      description:
        "End-to-end latency tells you it's slow. Span breakdowns tell you where. In this case, tool execution was 73% of total latency — without span visibility, you'd waste time investigating the LLM call or network layer. Always instrument span-level timing for multi-step agent pipelines.",
      linkedComponents: ["latency-tracing", "span-breakdown"],
    },
    {
      id: "tool-profiling-reveals-cascades",
      title: "Tool Profiling Reveals Cascade Failures",
      description:
        "The SDK migration created four separate performance issues: sequential execution, lost caching, missing connection pool, and a retry bug. Tool call profiling surfaces all of these, while span breakdown only shows the aggregate symptom. Profile individual tools, not just pipeline stages.",
      linkedComponents: ["tool-call-profiling", "span-breakdown"],
    },
    {
      id: "slos-quantify-urgency",
      title: "SLOs Quantify Urgency",
      description:
        "Without SLO data, 'it's slow' is subjective. With SLO data, you know: error budget is 500% consumed, 580 users abandoned, and NPS will drop 8 points. SLOs turn performance discussions from opinions into business decisions with clear thresholds.",
      linkedComponents: ["slo-dashboard", "latency-tracing"],
    },
    {
      id: "caching-is-invisible-infrastructure",
      title: "Caching Is Invisible Infrastructure",
      description:
        "Tool result caching and connection pooling saved ~1.2s per request — but they were invisible until they disappeared. Cache hit rates went from 45% to 0% after the SDK migration. Monitor your caches: when they fail, latency doesn't degrade gracefully — it jumps.",
      linkedComponents: ["cache-hit-rates", "queue-monitoring"],
    },
  ],
};
