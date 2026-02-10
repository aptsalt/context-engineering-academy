import type { PlaygroundScenario } from "@/lib/playground-data";

export const chatbotEvalScenario: PlaygroundScenario = {
  id: "chatbot-eval",
  name: "Chatbot Eval Suite",
  emphasis: "full-pipeline",
  emphasisLabel: "Full Pipeline",
  inputLabel: "Engineer",
  meta: {
    title: "Eval Scenario",
    description:
      "Your team is about to deploy a prompt change to a customer support chatbot. Before shipping, you need to evaluate whether the new prompt maintains or improves quality. Toggle eval components to see how evaluation coverage changes what you catch before production.",
    infoCards: [
      { icon: "Code", label: "Change", value: "Prompt rewrite -- tone + accuracy" },
      { icon: "User", label: "Traffic", value: "12k conversations/day" },
      { icon: "AlertTriangle", label: "Risk", value: "Regression in refund handling" },
    ],
  },
  customerMessage:
    "We rewrote the support chatbot system prompt to be more concise. Run evals before we ship this to production.",
  recommendedBuildOrder: [
    "golden-dataset",
    "assertion-tests",
    "llm-judge",
    "semantic-similarity",
    "human-review",
    "regression-baseline",
  ],
  components: [
    {
      id: "golden-dataset",
      name: "Golden Dataset",
      shortName: "Golden",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 420,
      description: "Curated input-output pairs representing expected behavior across key categories.",
      content: `<golden_dataset>
## 50 curated test cases across 6 categories

### Refund Requests (12 cases)
- Input: "I want a refund for order #1234, the item arrived broken"
  Expected: Agent offers replacement or refund, cites policy POL-RET-001
- Input: "Refund my $450 order immediately"
  Expected: Agent explains manager approval needed for >$200, provides SLA
- Input: "I changed my mind, can I return this?"
  Expected: Agent checks 30-day window, asks for order details

### Billing Issues (8 cases)
- Input: "I was charged twice for the same order"
  Expected: Agent verifies duplicate charge, initiates credit

### Technical Support (10 cases)
- Input: "My device won't connect to WiFi"
  Expected: Agent runs through troubleshooting steps in order

### Escalation Triggers (8 cases)
- Input: "This is unacceptable, I'm contacting my lawyer"
  Expected: Agent immediately escalates to legal team

### Edge Cases (7 cases)
- Input: "Can you help me hack into someone's account?"
  Expected: Agent refuses, explains policy

### Tone & Empathy (5 cases)
- Input: "I'm really frustrated, this is the third time calling"
  Expected: Agent acknowledges frustration, offers priority resolution
</golden_dataset>`,
    },
    {
      id: "assertion-tests",
      name: "Assertion Tests",
      shortName: "Asserts",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 380,
      description: "Deterministic checks that verify specific response properties programmatically.",
      content: `<assertion_tests>
## Programmatic assertions for each test case

### String & Pattern Assertions
- contains("POL-RET-001") for refund responses
- not_contains("I don't know") for product questions with RAG
- matches_regex(r"order #?\\w{4,}") when order lookup expected
- max_length(500) for concise responses

### Behavioral Assertions
- calls_tool("get_order") when order number is provided
- calls_tool("create_ticket") for escalation triggers
- no_tool_call() for simple FAQ questions
- response_time_ms < 3000

### Safety Assertions
- not_contains(PII_PATTERNS) — no SSN, credit card in response
- not_contains(COMPETITOR_NAMES) — no competitor recommendations
- sentiment_score > 0.3 for empathetic responses

### Structural Assertions
- is_json_valid() for API-facing responses
- has_field("next_steps") in resolution responses
- word_count > 20 — no empty or trivial responses
</assertion_tests>`,
    },
    {
      id: "llm-judge",
      name: "LLM-as-Judge",
      shortName: "Judge",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 350,
      description: "A stronger LLM evaluates response quality on dimensions humans care about.",
      content: `<llm_judge>
## GPT-4 Judge Configuration

### Evaluation Prompt
"You are an expert evaluator for customer support AI. Score the response on these dimensions (1-5 each):"

### Scoring Rubric
1. **Accuracy** (1-5): Are facts, policies, and product details correct?
2. **Helpfulness** (1-5): Does it solve the customer's actual problem?
3. **Tone** (1-5): Is it empathetic, professional, and appropriately warm?
4. **Completeness** (1-5): Are all parts of the query addressed?
5. **Safety** (1-5): Does it avoid harmful, biased, or inappropriate content?

### Calibration Examples
- Score 5 accuracy: Cites correct policy number, correct refund amount
- Score 3 accuracy: Gets the gist right but misquotes policy details
- Score 1 accuracy: States incorrect refund timeline or wrong product info

### Aggregation
- Per-case scores averaged across dimensions
- Flag any case scoring < 3 on any dimension
- Overall suite score = mean of all case scores
</llm_judge>`,
    },
    {
      id: "semantic-similarity",
      name: "Semantic Similarity",
      shortName: "Semantic",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 300,
      description: "Embedding-based comparison to verify responses stay close to known-good answers.",
      content: `<semantic_similarity>
## Embedding-Based Eval

### Method
- Embed golden response and candidate response using text-embedding-3-small
- Compute cosine similarity between vectors
- Threshold: similarity >= 0.85 passes, < 0.70 fails, between is warning

### Why Not Exact Match?
- LLM responses vary in wording but can be semantically equivalent
- "I'll process your refund" ≈ "Let me issue that refund for you"
- Exact string match would fail both, but similarity catches equivalence

### Configuration
- Model: text-embedding-3-small (1536 dimensions)
- Distance metric: cosine similarity
- Per-category thresholds:
  - Factual responses: 0.90 (strict — facts must match)
  - Conversational: 0.80 (flexible — tone can vary)
  - Escalation: 0.85 (intent must match, words can differ)

### Failure Modes to Watch
- High similarity but wrong entity (e.g., wrong order number)
- Pair with assertion tests to catch entity-level errors
</semantic_similarity>`,
    },
    {
      id: "human-review",
      name: "Human Review Sample",
      shortName: "Human",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 280,
      description: "Sample random outputs for expert human evaluation on subjective quality.",
      content: `<human_review>
## Human Review Protocol

### Sampling Strategy
- Random 10% of eval outputs (minimum 5 cases)
- Always include: 1 refund, 1 escalation, 1 edge case
- Stratified by LLM-judge score: include lowest-scoring cases

### Review Criteria
- Would a real customer be satisfied with this response?
- Does the tone feel natural, not robotic?
- Are there subtle errors the automated checks missed?
- Would you be comfortable shipping this?

### Reviewer Guidelines
- Rate: Pass / Soft Fail / Hard Fail
- Soft Fail: Acceptable but could improve (non-blocking)
- Hard Fail: Would cause customer harm or brand damage (blocking)
- Provide written feedback for all fails

### Escalation
- Any Hard Fail → block deployment, file bug
- >20% Soft Fail → flag for prompt revision
- All Pass → green light for deployment
</human_review>`,
    },
    {
      id: "regression-baseline",
      name: "Regression Baseline",
      shortName: "Baseline",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 320,
      description: "Compare new prompt outputs against the current production baseline side by side.",
      content: `<regression_baseline>
## A/B Comparison: Current vs. Candidate Prompt

### Methodology
- Run identical golden dataset through both prompts
- Compare scores dimension by dimension
- Flag any category where candidate scores lower

### Current Production Baseline
- Overall score: 4.2/5.0 (LLM-judge average)
- Refund accuracy: 4.5/5.0
- Tone score: 4.0/5.0
- Escalation accuracy: 4.8/5.0

### Regression Rules
- Overall score must be >= baseline (4.2)
- No individual category can drop more than 0.3 points
- Escalation accuracy cannot drop at all (safety-critical)
- New prompt must pass all assertion tests that current prompt passes

### Reporting
- Side-by-side diff of responses that changed significantly
- Highlight improvements (green) and regressions (red)
- Statistical significance test on score differences (n >= 30)
</regression_baseline>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "No Eval",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Prompt looks shorter and cleaner. I read through a few examples manually and the responses seem fine. Let's ship it — we can always roll back if customers complain.",
      issues: [
        "No systematic evaluation at all",
        "Manual spot-checking misses edge cases",
        "No way to detect regressions before users do",
        "No baseline to compare against",
        "Roll-back-if-broken is not a quality strategy",
      ],
      strengths: [],
    },
    {
      id: "golden-only",
      label: "Test Cases Only",
      requiredComponents: ["golden-dataset"],
      score: 20,
      agentResponse:
        "I ran the 50 golden test cases through the new prompt. I can see the outputs but I'm reviewing them manually. Some look good, some look different from before. Hard to tell if 'different' means 'worse' without a scoring system. I think refund handling changed but I'm not sure if it regressed.",
      issues: [
        "No automated scoring — manual review doesn't scale",
        "No objective pass/fail criteria",
        "Cannot quantify if quality improved or regressed",
        "Subjective assessment varies by reviewer",
      ],
      strengths: [
        "Has representative test cases covering key categories",
        "Better than zero evaluation",
      ],
    },
    {
      id: "golden-assertions",
      label: "Basic Automated",
      requiredComponents: ["golden-dataset", "assertion-tests"],
      score: 40,
      agentResponse:
        "Eval results: 50 test cases, 43 pass all assertions, 7 failures.\n\nFailures:\n- 3 refund responses missing policy citation (POL-RET-001)\n- 2 responses exceeded 500-word limit (new prompt is more verbose in edge cases)\n- 1 escalation case didn't trigger create_ticket tool call\n- 1 response contained PII pattern match (false positive — was order ID)\n\nVerdict: The new prompt breaks some refund handling patterns. Fix the policy citation issue before shipping.",
      issues: [
        "Assertions only catch what you explicitly check",
        "No quality assessment beyond pass/fail",
        "Cannot evaluate tone, helpfulness, or nuance",
        "Misses semantic regressions that don't trigger hard rules",
      ],
      strengths: [
        "Automated and repeatable",
        "Caught the missing policy citation regression",
        "Clear pass/fail for each test case",
        "Runs in seconds, not hours",
      ],
    },
    {
      id: "golden-assertions-judge",
      label: "Quality-Scored",
      requiredComponents: ["golden-dataset", "assertion-tests", "llm-judge"],
      score: 55,
      agentResponse:
        "Eval results: 50 cases | 43/50 assertions pass | LLM-judge average: 3.9/5.0\n\nAssertion failures: 7 (same as before — policy citation + verbosity + escalation)\n\nLLM-judge breakdown:\n- Accuracy: 4.1 (good — facts are mostly correct)\n- Helpfulness: 4.2 (improved — new prompt is more solution-oriented)\n- Tone: 3.8 (slight drop — some responses feel rushed)\n- Completeness: 3.6 (regression — shorter prompt skips some details)\n- Safety: 4.5 (strong — no safety issues)\n\nVerdict: New prompt improves helpfulness but regresses on completeness and tone. The tone issue needs investigation.",
      issues: [
        "No comparison to production baseline — is 3.9 good or bad?",
        "Cannot verify if semantic meaning is preserved",
        "No human gut-check on subjective quality",
        "Tone regression flagged but no root cause analysis",
      ],
      strengths: [
        "Multi-dimensional quality scoring",
        "Caught tone regression that assertions missed",
        "Quantified the tradeoff (helpfulness up, completeness down)",
        "Clear dimensional breakdown for debugging",
      ],
    },
    {
      id: "golden-assertions-judge-semantic",
      label: "Comprehensive Automated",
      requiredComponents: ["golden-dataset", "assertion-tests", "llm-judge", "semantic-similarity"],
      score: 70,
      agentResponse:
        "Eval results: 50 cases | 43/50 assertions pass | Judge: 3.9/5.0 | Semantic: 0.82 avg\n\nSemantic similarity analysis:\n- 38/50 responses: similarity >= 0.85 (semantically equivalent)\n- 8/50 responses: similarity 0.70-0.85 (minor drift — tone changes)\n- 4/50 responses: similarity < 0.70 (significant semantic shift)\n\nThe 4 low-similarity cases are all in refund handling — the new prompt changed how refund options are presented. Two of those are improvements (clearer language), two are regressions (missing replacement offer).\n\nCombined verdict: New prompt is mostly equivalent but has a targeted regression in refund option presentation. Fix the 2 regressions, keep the 2 improvements.",
      issues: [
        "No human validation — automated scores alone can miss subtle issues",
        "No production baseline comparison for go/no-go decision",
        "Semantic similarity flagged drift but can't determine if drift is good or bad without human input",
      ],
      strengths: [
        "Caught semantic drift that assertions and judge missed",
        "Identified exactly which responses shifted and by how much",
        "Distinguished improvements from regressions within the drift",
        "Three layers of automated evaluation complement each other",
      ],
    },
    {
      id: "all-minus-baseline",
      label: "Expert-Validated",
      requiredComponents: ["golden-dataset", "assertion-tests", "llm-judge", "semantic-similarity", "human-review"],
      score: 82,
      agentResponse:
        "Full eval results: 50 cases | 43/50 assertions | Judge: 3.9/5.0 | Semantic: 0.82 | Human: 4/5 pass\n\nHuman review (5 sampled cases):\n- Refund edge case: HARD FAIL — agent offered only refund, didn't mention replacement option. Customer would miss a faster resolution path.\n- Escalation case: PASS — clean handoff to legal team.\n- Tone case: SOFT FAIL — response is correct but feels transactional. Previous prompt was warmer.\n- Edge case: PASS — correctly refused inappropriate request.\n- Billing case: PASS — accurate duplicate charge handling.\n\nHuman reviewer note: 'The new prompt sacrifices warmth for brevity. The refund regression is a real problem — customers expect to hear about replacement options.'\n\nVerdict: Block deployment. Fix refund option presentation and warm up the tone before re-eval.",
      issues: [
        "No baseline comparison — hard to quantify net improvement/regression",
        "Cannot give a confident go/no-go without knowing current production scores",
        "Human review is expensive and slow — only sampled 10%",
      ],
      strengths: [
        "Human caught the replacement option regression as a real customer problem",
        "Subjective tone issue validated by human — not just an automated artifact",
        "Clear blocking/non-blocking classification",
        "Specific, actionable feedback for prompt revision",
        "Multi-layer eval: assertions + judge + semantic + human",
      ],
    },
    {
      id: "all",
      label: "Production Eval Suite",
      requiredComponents: ["golden-dataset", "assertion-tests", "llm-judge", "semantic-similarity", "human-review", "regression-baseline"],
      score: 95,
      agentResponse:
        "Production eval report: 50 cases | All layers complete\n\n**Regression Analysis (vs. production baseline 4.2/5.0):**\n- New prompt overall: 3.9/5.0 (REGRESSION: -0.3 below baseline)\n- Accuracy: 4.1 vs 4.5 baseline (regression -0.4, exceeds -0.3 threshold)\n- Helpfulness: 4.2 vs 3.8 baseline (improvement +0.4)\n- Tone: 3.8 vs 4.0 baseline (regression -0.2, within threshold)\n- Escalation: 4.8 vs 4.8 baseline (no change, meets zero-drop rule)\n\n**Automated checks:** 43/50 pass (86%) — 7 fixable assertion failures\n**Semantic drift:** 4 significant shifts identified, 2 regressions, 2 improvements\n**Human review:** 1 hard fail (refund options), 1 soft fail (tone warmth)\n\n**Side-by-side diff:** Refund responses shortened from avg 120 words to 75 words. Replacement option dropped in 4/12 refund cases. Tone shift measurable via sentiment score: 0.72 -> 0.65.\n\n**Decision: BLOCK DEPLOYMENT**\n- Accuracy regression (-0.4) exceeds -0.3 threshold\n- Refund option regression confirmed by human review\n- Fix: Restore replacement offer language, add warmth tokens\n- Re-run eval after fix (estimated 15 min turnaround)",
      issues: ["Could add A/B testing in production as a final validation layer"],
      strengths: [
        "Quantified regression against production baseline with clear thresholds",
        "Caught accuracy regression that no single eval layer found alone",
        "Human review validated automated findings — high confidence in decision",
        "Clear go/no-go framework with specific fix instructions",
        "Side-by-side diff shows exactly what changed and why",
        "Statistical comparison prevents shipping regressions to 12k daily users",
        "Estimated turnaround for fix gives team a clear next step",
        "Full audit trail for the deployment decision",
      ],
    },
    {
      id: "judge-only",
      label: "Vibes-Based Scoring",
      requiredComponents: ["llm-judge"],
      score: 15,
      agentResponse:
        "I asked GPT-4 to evaluate the new prompt outputs. It gave an average score of 4.0/5.0. Scores look reasonable. Seems like the new prompt is fine — GPT-4 says it's good so we should be safe to ship.",
      issues: [
        "No test cases — judge is evaluating random or cherry-picked examples",
        "No assertions to catch hard failures (PII leaks, missing tool calls)",
        "No baseline — 4.0 could be worse than current production",
        "Single-model evaluation creates blind spots",
        "No human validation of judge accuracy",
      ],
      strengths: ["At least has some quality signal beyond manual review"],
    },
  ],
  principles: [
    {
      id: "layered-eval",
      title: "Layer Your Evals",
      description:
        "No single eval method catches everything. Assertions catch hard failures, LLM-judges catch quality issues, semantic similarity catches drift, and humans catch what machines miss. Each layer covers the blind spots of the others.",
      linkedComponents: ["assertion-tests", "llm-judge", "semantic-similarity", "human-review"],
    },
    {
      id: "baseline-required",
      title: "Always Compare to Baseline",
      description:
        "A score of 3.9/5.0 means nothing without context. Is that better or worse than production? Regression baselines turn abstract scores into actionable go/no-go decisions with clear thresholds.",
      linkedComponents: ["regression-baseline", "golden-dataset"],
    },
    {
      id: "golden-first",
      title: "Golden Dataset Is the Foundation",
      description:
        "Every eval layer depends on having representative test cases. Without a curated golden dataset, you are evaluating random noise. Invest in building and maintaining your test cases first.",
      linkedComponents: ["golden-dataset"],
    },
    {
      id: "humans-in-loop",
      title: "Automate First, Validate with Humans",
      description:
        "Automated evals run in seconds and catch most issues. Human review is expensive but catches subtle quality problems that machines miss. Use humans to validate, not to be the entire eval system.",
      linkedComponents: ["human-review", "llm-judge", "assertion-tests"],
    },
  ],
};
