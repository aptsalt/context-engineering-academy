import type { PlaygroundScenario } from "@/lib/playground-data";

export const regressionPipelineScenario: PlaygroundScenario = {
  id: "regression-pipeline",
  name: "CI/CD Eval Pipeline",
  emphasis: "fewer-retries",
  emphasisLabel: "Fewer Retries",
  inputLabel: "Engineer",
  meta: {
    title: "Pipeline Scenario",
    description:
      "Your team ships prompt and model changes weekly. Without automated eval gates, regressions slip into production undetected. Build a CI/CD pipeline that catches quality drops before they reach users. Toggle components to see how pipeline reliability improves.",
    infoCards: [
      { icon: "Code", label: "Frequency", value: "Weekly prompt/model updates" },
      { icon: "AlertTriangle", label: "Problem", value: "3 silent regressions last quarter" },
      { icon: "Package", label: "Goal", value: "Zero undetected regressions" },
    ],
  },
  customerMessage:
    "We shipped 3 regressions last quarter that users caught before we did. Set up a CI/CD eval pipeline so we never deploy a quality drop again.",
  recommendedBuildOrder: [
    "baseline-snapshots",
    "automated-assertions",
    "quality-gate",
    "pr-comments",
    "metric-tracking",
    "alert-degradation",
  ],
  components: [
    {
      id: "baseline-snapshots",
      name: "Baseline Snapshots",
      shortName: "Baselines",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 350,
      description: "Versioned snapshots of eval scores that new changes are compared against.",
      content: `<baseline_snapshots>
## Eval Baseline Management

### Snapshot Contents (per version)
- Git commit SHA + timestamp
- Golden dataset version used
- Per-category eval scores (accuracy, tone, helpfulness, safety)
- Overall composite score
- Model identifier + config (temperature, top_p, etc.)
- Prompt template version hash

### Current Production Baseline (v2.4.1)
{
  "commit": "a3f8b2c",
  "timestamp": "2025-01-15T14:30:00Z",
  "model": "gpt-4o-mini",
  "overall_score": 4.2,
  "scores": {
    "accuracy": 4.5,
    "tone": 4.0,
    "helpfulness": 4.3,
    "safety": 4.8,
    "latency_p95_ms": 2100
  },
  "golden_dataset_version": "v3.1",
  "test_cases": 50,
  "pass_rate": 0.92
}

### Versioning Rules
- New baseline created on every production deployment
- Previous 10 baselines retained for trend analysis
- Baselines are immutable — never overwrite, only append
- Tag baselines with release version for traceability
</baseline_snapshots>`,
    },
    {
      id: "automated-assertions",
      name: "Automated Assertions",
      shortName: "Assertions",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 380,
      description: "Deterministic eval tests that run on every PR and block merge on failure.",
      content: `<automated_assertions>
## CI Assertion Suite

### Test Runner: promptfoo + custom harness
- Runs on every PR that touches prompt files or model config
- Executes in GitHub Actions (avg runtime: 4 min)
- Parallel execution across 5 workers

### Assertion Categories

#### Hard Assertions (block merge)
- Policy citations present in refund responses
- Tool calls match expected patterns per scenario
- No PII patterns in any response
- Response length within bounds (20-500 words)
- JSON valid for structured outputs
- Refusal on all safety-critical test cases

#### Soft Assertions (warn but don't block)
- Response time under 3 seconds (P95)
- Token usage within 10% of baseline
- Sentiment score > 0.3 for empathetic scenarios
- Semantic similarity > 0.80 vs golden responses

### Failure Reporting
- Each failure includes: test case ID, assertion type, expected vs actual
- Grouped by category for quick triage
- Links to relevant golden dataset entry
- Diff against baseline response for comparison

### Flaky Test Handling
- Tests marked flaky after 3 non-deterministic failures
- Flaky tests run 3x and pass if 2/3 succeed
- Weekly review to fix or remove persistently flaky tests
</automated_assertions>`,
    },
    {
      id: "quality-gate",
      name: "Quality Gate Threshold",
      shortName: "Gate",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 320,
      description: "Configurable score thresholds that must be met before a change can be deployed.",
      content: `<quality_gate>
## Deployment Quality Gates

### Gate Configuration
gates:
  overall_score:
    threshold: 4.0
    comparison: ">="
    action: "block_deploy"
  category_regression:
    max_drop: 0.3
    comparison: "vs_baseline"
    action: "block_deploy"
  safety_score:
    threshold: 4.5
    comparison: ">="
    action: "block_deploy"
    note: "Safety cannot regress at all"
  pass_rate:
    threshold: 0.88
    comparison: ">="
    action: "block_deploy"
  latency_p95:
    threshold: 3000
    comparison: "<="
    unit: "ms"
    action: "warn"
  token_cost:
    max_increase: 0.15
    comparison: "vs_baseline"
    action: "warn"

### Gate Logic
- All "block_deploy" gates must pass for deployment
- "warn" gates generate alerts but don't block
- Override requires 2 senior engineer approvals + documented reason
- Emergency override path for P0 incidents (logged and reviewed)

### Gate Results Format
GATE RESULTS — commit a3f8b2c
  overall_score:    4.2 >= 4.0   PASS
  category_drop:    -0.1 <= 0.3  PASS
  safety_score:     4.8 >= 4.5   PASS
  pass_rate:        0.92 >= 0.88 PASS
  latency_p95:      2100 <= 3000 PASS
  token_cost:       +8% <= 15%   PASS
VERDICT: ALL GATES PASSED — deploy approved
</quality_gate>`,
    },
    {
      id: "pr-comments",
      name: "PR Comment Reports",
      shortName: "PR Reports",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 300,
      description: "Automated eval reports posted directly on pull requests for team visibility.",
      content: `<pr_comment_reports>
## GitHub PR Eval Report Bot

### Report Format (posted as PR comment)

#### Header
Eval Report for \`feature/update-refund-prompt\`
Run: #1247 | Duration: 3m 42s | 50 test cases

#### Score Summary Table
| Metric        | Baseline | This PR | Delta  | Status |
|---------------|----------|---------|--------|--------|
| Overall       | 4.2      | 4.3     | +0.1   | PASS   |
| Accuracy      | 4.5      | 4.4     | -0.1   | PASS   |
| Tone          | 4.0      | 4.2     | +0.2   | PASS   |
| Helpfulness   | 4.3      | 4.4     | +0.1   | PASS   |
| Safety        | 4.8      | 4.8     |  0.0   | PASS   |
| Pass Rate     | 92%      | 94%     | +2%    | PASS   |
| Latency (P95) | 2100ms   | 2250ms  | +150ms | PASS   |

#### Changed Responses (collapsible)
<details><summary>3 responses changed significantly</summary>
- Case #17 (refund edge case): Improved — now includes replacement option
- Case #31 (billing dispute): Minor wording change, semantically equivalent
- Case #45 (escalation): Regression — missing legal team handoff
</details>

#### Gate Verdict
All gates passed. Ready to merge.

### Delivery
- Automatically posted on PR creation and each push
- Updates in-place (edits previous comment, doesn't spam)
- Links to full eval dashboard for deep dive
</pr_comment_reports>`,
    },
    {
      id: "metric-tracking",
      name: "Metric Tracking",
      shortName: "Metrics",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 340,
      description: "Time-series tracking of eval scores to detect gradual degradation trends.",
      content: `<metric_tracking>
## Eval Score Tracking Dashboard

### Tracked Metrics (time series)
- Overall composite score (7-day rolling average)
- Per-category scores: accuracy, tone, helpfulness, safety
- Pass rate per eval run
- P95 response latency
- Average token cost per response
- Number of assertion failures per category

### Visualization
- Line charts: Score trends over last 90 days
- Sparklines: Per-metric trend in PR comments
- Heatmap: Category scores across last 20 deployments
- Scatter plot: Score vs. latency (Pareto frontier)

### Trend Detection
- Linear regression on 14-day windows
- Alert if slope is negative and statistically significant (p < 0.05)
- Detect "boiling frog" gradual degradation:
  - Each individual change passes gates (-0.05 each)
  - But cumulative drift over 10 changes = -0.5 (unacceptable)
  - Trend detection catches this even when gates pass

### Data Storage
- All eval results stored in Postgres with commit SHA foreign key
- Queryable via internal API: GET /api/evals?from=2025-01-01&metric=accuracy
- 1 year retention, then archived to cold storage
- Export to CSV for ad-hoc analysis
</metric_tracking>`,
    },
    {
      id: "alert-degradation",
      name: "Alert on Degradation",
      shortName: "Alerts",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 310,
      description: "Real-time alerts when eval scores cross thresholds or trend downward.",
      content: `<alert_degradation>
## Alerting System

### Alert Rules

#### Critical (PagerDuty — immediate)
- Safety score drops below 4.5 in any eval run
- PII leakage detected in any response
- Pass rate drops below 85%
- Any "block_deploy" gate fails on a merged PR (shouldn't happen)

#### Warning (Slack #eval-alerts)
- Overall score drops > 0.2 in single PR
- Any category score hits new 30-day low
- Latency P95 exceeds 3 seconds
- Token cost increases > 15% vs baseline

#### Trend (Weekly email digest)
- 14-day negative trend detected on any metric
- Cumulative drift > 0.3 from 30-day-ago baseline
- Flaky test rate exceeds 10%
- Golden dataset staleness (>60 days since last update)

### Alert Format
[EVAL WARNING] Tone score trending down
  Current: 3.8 (was 4.0 two weeks ago)
  Trend: -0.01/day over 14 days (p=0.03)
  Commits in window: a3f8b2c, b7d2e1f, c9a4d3e
  Action: Review recent prompt changes for tone regression

### Escalation
- Critical unacknowledged after 15 min → escalate to engineering lead
- Warning unresolved after 48 hours → auto-create JIRA ticket
- Trend alerts reviewed in weekly eval review meeting
</alert_degradation>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Deploy and Pray",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "The prompt change looks good in our staging demo. Merged to main and deployed. We'll keep an eye on user feedback channels and rollback if something goes wrong.",
      issues: [
        "No automated evaluation of any kind",
        "Regressions detected by users, not by the team",
        "No baseline to compare against",
        "No quality gates — anything can be deployed",
        "This is exactly how the 3 regressions last quarter happened",
      ],
      strengths: [],
    },
    {
      id: "baselines-only",
      label: "Measured but Unguarded",
      requiredComponents: ["baseline-snapshots"],
      score: 15,
      agentResponse:
        "I've recorded the current production eval scores as baseline v2.4.1: overall 4.2, accuracy 4.5, tone 4.0. After deploying the new prompt, I'll record v2.5.0 and compare.\n\nBut the comparison happens after deployment, so if there's a regression, users already experienced it. And there's no automated comparison — someone has to manually check the numbers.",
      issues: [
        "Baselines recorded but not used to gate deployment",
        "Post-deploy comparison means regressions hit production",
        "Manual comparison is slow and error-prone",
        "No automated testing — just snapshot management",
      ],
      strengths: [
        "At least has quantified baseline scores",
        "Can detect regressions retroactively",
      ],
    },
    {
      id: "baselines-assertions",
      label: "Pre-Deploy Checks",
      requiredComponents: ["baseline-snapshots", "automated-assertions"],
      score: 35,
      agentResponse:
        "CI pipeline: Running 50 test cases on every PR that touches prompt files.\n\nResults for latest PR:\n- Hard assertions: 46/50 pass (92%), 4 failures\n  - 2 missing policy citations in refund responses\n  - 1 response exceeded 500-word limit\n  - 1 safety refusal test failed\n- Soft assertions: 3 warnings (latency slightly up, token usage up 8%)\n\nBut I can only tell you pass/fail on assertions — I can't tell you if the overall quality score improved or regressed because there's no quality gate comparing against baseline.",
      issues: [
        "No quality gate — assertions pass but quality could still regress",
        "No composite score comparison against baseline",
        "Team has to manually decide if 92% pass rate is good enough",
        "No visibility into results unless you check the CI logs",
      ],
      strengths: [
        "Automated testing runs on every PR",
        "Hard assertions block merge on failure",
        "Caught policy citation regression before production",
        "Clear pass/fail reporting with failure details",
      ],
    },
    {
      id: "baselines-assertions-gate",
      label: "Gated Deployments",
      requiredComponents: ["baseline-snapshots", "automated-assertions", "quality-gate"],
      score: 55,
      agentResponse:
        "CI pipeline with quality gates active.\n\nPR eval results:\n- Assertions: 46/50 pass (92% — above 88% gate)\n- Overall score: 4.3 (above 4.0 gate, +0.1 vs baseline)\n- Category regression check: accuracy dropped 0.1 (within 0.3 threshold)\n- Safety: 4.8 (above 4.5 gate, no change)\n- Latency: 2250ms (below 3000ms gate)\n\nGATE VERDICT: ALL PASSED — deployment approved.\n\nBut the engineer has to dig through CI logs to see this. There's no at-a-glance summary on the PR itself. And we have no visibility into whether scores are gradually trending down over multiple deployments.",
      issues: [
        "No PR-level visibility — results buried in CI logs",
        "No trend detection — gradual degradation goes unnoticed",
        "No alerting — team has to proactively check",
        "Quality gate catches single-PR regressions but not cumulative drift",
      ],
      strengths: [
        "Automated quality gates block bad deployments",
        "Composite score compared against baseline",
        "Per-category regression thresholds prevent targeted quality drops",
        "Safety gate has zero-tolerance policy",
        "Clear pass/fail verdict with data backing each gate",
      ],
    },
    {
      id: "baselines-assertions-gate-pr",
      label: "Team-Visible Pipeline",
      requiredComponents: ["baseline-snapshots", "automated-assertions", "quality-gate", "pr-comments"],
      score: 70,
      agentResponse:
        "PR #482: Eval report posted automatically.\n\n| Metric | Baseline | This PR | Delta | Status |\n|--------|----------|---------|-------|--------|\n| Overall | 4.2 | 4.3 | +0.1 | PASS |\n| Accuracy | 4.5 | 4.4 | -0.1 | PASS |\n| Safety | 4.8 | 4.8 | 0.0 | PASS |\n| Pass Rate | 92% | 94% | +2% | PASS |\n\n3 responses changed significantly (expandable diff).\nAll gates passed — ready to merge.\n\nThe entire team can see eval results directly on the PR. Reviewers can check the score table before approving. But we still can't detect gradual trends or get alerted to emerging problems.",
      issues: [
        "No trend detection — each PR passes but cumulative drift possible",
        "No alerting — degradation only caught during PR review",
        "No historical dashboard for retrospective analysis",
      ],
      strengths: [
        "Eval results visible directly on the PR — no log diving",
        "Score table with baseline comparison is immediately actionable",
        "Changed responses shown in collapsible diffs",
        "Team code review now includes eval review",
        "Updates in-place to avoid PR comment spam",
      ],
    },
    {
      id: "all-minus-alerts",
      label: "Trend-Aware Pipeline",
      requiredComponents: ["baseline-snapshots", "automated-assertions", "quality-gate", "pr-comments", "metric-tracking"],
      score: 82,
      agentResponse:
        "Full eval pipeline with metric tracking active.\n\nPR #482 eval report: All gates passed (details on PR).\n\nMetric dashboard update:\n- Overall score: 4.3 (current) — 90-day trend: stable\n- Tone score: 3.9 — 14-day trend: DECLINING (-0.02/day)\n  - Each individual PR passed gates, but tone has dropped from 4.1 to 3.9 over 5 deployments\n  - Statistical significance: p=0.04\n- Accuracy: 4.4 — trend: stable\n- Token cost: up 12% over 30 days — approaching warning threshold\n\nThe 'boiling frog' detection caught the tone drift. No single PR caused it, but the cumulative effect is a meaningful regression. However, this is only visible if someone checks the dashboard — there's no proactive alerting.",
      issues: [
        "No alerting — dashboard insights require someone to check",
        "Tone drift discovered but no automated notification sent",
        "Token cost creep approaching threshold with no early warning",
      ],
      strengths: [
        "Trend detection caught gradual tone regression across multiple PRs",
        "The 'boiling frog' problem — each PR passes but cumulative drift is bad",
        "Time-series data enables root cause analysis (which commits caused drift)",
        "Token cost tracking prevents runaway expense",
        "Full pipeline: assertions + gates + PR reports + trend analysis",
      ],
    },
    {
      id: "all",
      label: "Eval-Gated Deployments",
      requiredComponents: ["baseline-snapshots", "automated-assertions", "quality-gate", "pr-comments", "metric-tracking", "alert-degradation"],
      score: 95,
      agentResponse:
        "Full CI/CD eval pipeline operational. Here's what happened this week:\n\n**PR #482** (prompt update): All gates passed. Report posted on PR. Merged and deployed.\n\n**PR #485** (model config change): BLOCKED by quality gate.\n- Accuracy dropped 0.4 (threshold: 0.3) — auto-blocked merge\n- PR comment showed exact test cases that regressed\n- Engineer fixed prompt, re-ran evals, passed on 2nd attempt\n- Regression NEVER reached production\n\n**Trend Alert** (Slack #eval-alerts):\n- Tone score trending down: 4.1 -> 3.9 over 14 days (p=0.04)\n- Alert linked to 3 commits in the window\n- Team investigated: found overly terse system prompt edit in PR #479\n- Fix shipped in PR #487, tone recovered to 4.1\n\n**Weekly Digest:**\n- 4 PRs evaluated, 1 blocked (caught before production)\n- 0 regressions reached users (vs. 3 last quarter)\n- Cumulative drift: +0.1 overall (positive trend)\n- Golden dataset freshness: 45 days (within 60-day threshold)\n- Recommendation: Add 5 new edge cases from recent customer tickets\n\n**Zero undetected regressions this quarter. Pipeline is working.**",
      issues: ["Could add canary deployments as a final production validation layer"],
      strengths: [
        "PR #485 regression caught and fixed before production — exact goal met",
        "Trend alert caught gradual tone drift that individual gates missed",
        "Specific commit attribution for both regressions and fixes",
        "Weekly digest keeps leadership informed without manual effort",
        "Golden dataset freshness monitoring prevents eval staleness",
        "Full audit trail: every deployment decision backed by eval data",
        "Zero undetected regressions vs. 3 last quarter — measurable improvement",
        "Proactive alerting means issues are found, not reported",
      ],
    },
    {
      id: "assertions-only",
      label: "Tests Without Context",
      requiredComponents: ["automated-assertions"],
      score: 20,
      agentResponse:
        "CI runs 50 test assertions on every PR. Latest results: 44/50 pass, 6 fail.\n\nFailures:\n- 2 policy citation checks\n- 2 response length violations\n- 1 tool call pattern mismatch\n- 1 safety refusal test\n\nI don't know if 44/50 is good or bad. I don't know what the previous pass rate was. I just know 6 things failed. Should we fix them? Should we ship anyway? There's no threshold or baseline to compare against.",
      issues: [
        "No baseline — can't tell if pass rate improved or regressed",
        "No quality gate — no automated go/no-go decision",
        "No composite quality score beyond pass/fail counting",
        "Team has to manually interpret results every time",
        "6 failures could be new regressions or pre-existing — no way to tell",
      ],
      strengths: [
        "Automated tests run on every PR",
        "Failure details are specific and actionable",
      ],
    },
  ],
  principles: [
    {
      id: "gate-before-deploy",
      title: "Gate Before You Deploy",
      description:
        "Quality gates that block deployment are the core of the pipeline. Without them, eval scores are just information — nice to have but non-blocking. The moment a gate blocks a bad PR, the pipeline pays for itself.",
      linkedComponents: ["quality-gate", "baseline-snapshots", "automated-assertions"],
    },
    {
      id: "detect-gradual-drift",
      title: "Detect the Boiling Frog",
      description:
        "Individual PRs can pass quality gates while cumulative drift degrades quality. Metric tracking with trend detection catches this 'boiling frog' problem that per-PR gates cannot. Both mechanisms are necessary.",
      linkedComponents: ["metric-tracking", "alert-degradation"],
    },
    {
      id: "visibility-drives-action",
      title: "Visibility Drives Action",
      description:
        "Eval results buried in CI logs don't get reviewed. PR comments make eval results part of the code review workflow. Alerts make degradation someone's immediate problem. Dashboards enable retrospective analysis.",
      linkedComponents: ["pr-comments", "alert-degradation", "metric-tracking"],
    },
    {
      id: "baselines-not-absolutes",
      title: "Compare to Baseline, Not Absolutes",
      description:
        "An overall score of 4.0 means nothing in isolation. The question is always: is this better or worse than what's in production? Baseline snapshots make every eval result relative and actionable.",
      linkedComponents: ["baseline-snapshots", "quality-gate"],
    },
  ],
};
