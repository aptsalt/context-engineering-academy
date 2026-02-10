import type { PlaygroundScenario } from "@/lib/playground-data";

export const featureDevelopmentScenario: PlaygroundScenario = {
  id: "feature-development",
  name: "Feature Development Team",
  emphasis: "full-pipeline",
  emphasisLabel: "Full Pipeline",
  inputLabel: "Team Lead",
  meta: {
    title: "Multi-Agent Feature Development",
    description:
      "Orchestrate a team of specialized agents — researcher, coder, tester, and reviewer — to implement a complete feature. Each orchestration component you enable improves coordination, reduces rework, and increases the quality of the final deliverable.",
    infoCards: [
      { icon: "Code", label: "Feature", value: "OAuth2 Auth System" },
      { icon: "User", label: "Agents", value: "4 specialized roles" },
      { icon: "AlertTriangle", label: "Complexity", value: "Full-stack + tests" },
    ],
  },
  customerMessage:
    "Implement a user authentication system with OAuth2, including login page, API endpoints, and tests.",
  recommendedBuildOrder: [
    "task-decomposition",
    "agent-roles",
    "communication-protocol",
    "shared-scratchpad",
    "error-recovery",
    "quality-gate",
  ],
  components: [
    {
      id: "task-decomposition",
      name: "Task Decomposition Plan",
      shortName: "Tasks",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 380,
      description: "Breaks the feature request into subtasks with dependencies, priorities, and acceptance criteria.",
      content: `<task_decomposition>
## Feature: OAuth2 Authentication System

### Phase 1: Research & Design
- Task 1.1: Research OAuth2 providers (Google, GitHub, Discord)
  - Owner: researcher
  - Output: Provider comparison matrix
  - Acceptance: Covers auth flow, token handling, rate limits

- Task 1.2: Design database schema for users/sessions
  - Owner: researcher
  - Output: Schema diagram + migration files
  - Depends on: 1.1

### Phase 2: Implementation
- Task 2.1: Build OAuth2 callback endpoints (/api/auth/*)
  - Owner: coder
  - Output: API routes with token exchange
  - Depends on: 1.1, 1.2

- Task 2.2: Build login page with provider buttons
  - Owner: coder
  - Output: React component with OAuth redirect
  - Depends on: 2.1

- Task 2.3: Implement session management middleware
  - Owner: coder
  - Output: JWT middleware + refresh logic
  - Depends on: 2.1

### Phase 3: Verification
- Task 3.1: Write integration tests for auth flow
  - Owner: tester
  - Output: Test suite with mocked providers
  - Depends on: 2.1, 2.2, 2.3

- Task 3.2: Security review of token handling
  - Owner: reviewer
  - Output: Review report with findings
  - Depends on: 2.1, 2.3

### Dependency Graph
1.1 -> 1.2 -> 2.1 -> [2.2, 2.3] -> [3.1, 3.2]
</task_decomposition>`,
    },
    {
      id: "agent-roles",
      name: "Agent Role Definitions",
      shortName: "Roles",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 340,
      description: "Defines each agent's expertise, constraints, and output format.",
      content: `<agent_roles>
## Researcher Agent
- Expertise: API documentation, security best practices, architecture
- Capabilities: Web search, documentation parsing, comparison analysis
- Output format: Structured markdown with pros/cons tables
- Constraints: Must cite sources, flag security concerns, no code generation
- Escalation: If conflicting best practices found, request human decision

## Coder Agent
- Expertise: TypeScript, Next.js App Router, Prisma ORM, React
- Capabilities: Code generation, file creation, dependency installation
- Output format: Complete code files with inline comments
- Constraints: Must follow project conventions, max 200 lines per file, no secrets in code
- Escalation: If architectural decision needed, consult researcher first

## Tester Agent
- Expertise: Vitest, Playwright, mocking, test strategy
- Capabilities: Test generation, fixture creation, coverage analysis
- Output format: Test files with describe/it blocks and assertions
- Constraints: Must cover happy path + edge cases + error states, no implementation changes
- Escalation: If untestable code found, report to reviewer

## Reviewer Agent
- Expertise: Security audit, code quality, OWASP, performance
- Capabilities: Static analysis, pattern detection, vulnerability scanning
- Output format: Review comments with severity (critical/warning/info)
- Constraints: Must provide fix suggestions, not just identify issues
- Escalation: Critical security findings block merge immediately
</agent_roles>`,
    },
    {
      id: "communication-protocol",
      name: "Communication Protocol",
      shortName: "Comms",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 290,
      description: "Rules for how agents communicate, hand off work, and resolve conflicts.",
      content: `<communication_protocol>
## Message Format
All inter-agent messages must follow:
{
  "from": "agent_role",
  "to": "agent_role | orchestrator",
  "type": "handoff | question | blocker | completion",
  "task_id": "1.1",
  "content": "...",
  "artifacts": ["file_path_or_reference"]
}

## Handoff Rules
1. Completing agent must include all artifacts (code, docs, schemas)
2. Receiving agent must acknowledge within 1 turn
3. If receiving agent finds issues, send "blocker" back to source agent
4. Orchestrator resolves conflicts if agents disagree

## Communication Channels
- Direct: Agent-to-agent for task handoffs
- Broadcast: To all agents for breaking changes or blockers
- Escalation: To orchestrator for decisions outside agent scope

## Sequencing Rules
- No agent may start a task until all dependencies are marked "complete"
- Parallel tasks can execute simultaneously
- If a blocker is raised, downstream tasks pause automatically
</communication_protocol>`,
    },
    {
      id: "shared-scratchpad",
      name: "Shared Scratchpad",
      shortName: "Scratch",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 260,
      description: "A shared workspace where agents store intermediate results, decisions, and artifacts.",
      content: `<shared_scratchpad>
## Project State
- Feature: OAuth2 Authentication System
- Status: In Progress
- Current Phase: 2 (Implementation)

## Decisions Log
- [researcher] Selected Google + GitHub as initial OAuth providers
- [researcher] JWT with httpOnly cookies for session management (not localStorage)
- [coder] Using next-auth v5 as OAuth library (researcher approved)
- [reviewer] PKCE flow required for all OAuth providers

## Shared Artifacts
- Schema: /prisma/schema.prisma (User, Account, Session models)
- API Routes: /app/api/auth/[...nextauth]/route.ts
- Login Component: /app/login/page.tsx
- Middleware: /middleware.ts (session validation)

## Open Questions
- Q1: Rate limiting strategy for auth endpoints? (assigned: researcher)
- Q2: Should we support email/password fallback? (awaiting human decision)

## Blockers
- None currently
</shared_scratchpad>`,
    },
    {
      id: "error-recovery",
      name: "Error Recovery",
      shortName: "Recovery",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 300,
      description: "Strategies for handling agent failures, task retries, and graceful degradation.",
      content: `<error_recovery>
## Retry Strategy
- Max retries per task: 3
- Backoff: Exponential (1s, 4s, 16s)
- On retry: Include previous error context in agent prompt
- After max retries: Escalate to orchestrator with full failure log

## Failure Modes
### Agent Produces Invalid Output
- Validator checks output against expected schema
- If invalid: retry with explicit correction instructions
- Example: "Your previous output was missing the 'exports' field. Regenerate with all required fields."

### Dependency Task Failed
- Downstream tasks enter "blocked" state
- Orchestrator attempts to fix upstream task first
- If unfixable: mark feature as "partially complete" with available subtasks

### Agent Conflict
- When two agents produce contradictory outputs
- Resolution: Reviewer agent arbitrates, or escalate to human
- Example: Coder uses localStorage, Reviewer flags as insecure -> Coder must revise

### Timeout
- Max time per task: 60 seconds
- On timeout: Save partial work to scratchpad, reassign to fresh agent instance
- Partial work is available to the new agent as context

## Checkpointing
- After each task completion, save state to scratchpad
- On system restart, resume from last checkpoint
- Never re-execute completed tasks unless explicitly invalidated
</error_recovery>`,
    },
    {
      id: "quality-gate",
      name: "Quality Gate",
      shortName: "QGate",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 270,
      description: "Automated quality checks that must pass before a task is marked complete.",
      content: `<quality_gate>
## Gate Definitions

### Gate 1: Research Completeness
- Applies to: Phase 1 tasks
- Checks: All comparison criteria covered, sources cited, security noted
- Pass threshold: All required sections present

### Gate 2: Code Quality
- Applies to: Phase 2 tasks
- Checks:
  - TypeScript strict mode, no "any" types
  - All functions under 50 lines
  - Error handling at all async boundaries
  - No hardcoded secrets or credentials
  - Follows project naming conventions
- Pass threshold: Zero critical violations

### Gate 3: Test Coverage
- Applies to: Phase 3 tasks (testing)
- Checks:
  - Happy path covered for all endpoints
  - Error states tested (401, 403, 500)
  - Edge cases: expired tokens, revoked access, concurrent sessions
  - Minimum 80% line coverage on auth module
- Pass threshold: All checks pass

### Gate 4: Security Review
- Applies to: Phase 3 tasks (review)
- Checks:
  - No token exposure in logs or client state
  - CSRF protection enabled
  - Rate limiting on auth endpoints
  - Secure cookie configuration (httpOnly, secure, sameSite)
- Pass threshold: Zero critical or high severity findings

## Gate Enforcement
- Tasks cannot be marked "complete" until relevant gates pass
- Gate failures trigger automatic retry with feedback
- Orchestrator tracks gate pass rates for quality metrics
</quality_gate>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Single Overloaded Agent",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Sure, I'll implement the OAuth2 authentication system.\n\n```typescript\n// app/api/auth/route.ts\nimport { NextResponse } from 'next/server';\n\nexport async function POST(req) {\n  const { provider, code } = await req.json();\n  // TODO: handle OAuth flow\n  // TODO: create session\n  // TODO: store in database\n  return NextResponse.json({ token: 'some-token' });\n}\n```\n\nHere's a basic login page too... I think this covers the main parts. You might want to add tests later. I'm not sure about the security implications of storing tokens this way.",
      issues: [
        "Single agent trying to do everything at once",
        "No task breakdown or planning phase",
        "TODOs instead of implementation",
        "No security considerations",
        "No tests or review process",
        "Uncertain about its own output quality",
      ],
      strengths: [],
    },
    {
      id: "tasks-only",
      label: "Planned but Leaderless",
      requiredComponents: ["task-decomposition"],
      score: 15,
      agentResponse:
        "I've broken the feature into phases:\n\n**Phase 1:** Research OAuth2 providers, design schema\n**Phase 2:** Build endpoints, login page, session middleware\n**Phase 3:** Write tests, security review\n\nDependency chain: Research -> Schema -> API -> [UI, Middleware] -> [Tests, Review]\n\nNow executing all tasks sequentially as a single agent...\n\n[Starts implementing everything without specialization]\n\nThe API endpoints are done but I'm not confident about the security setup. The tests are basic — I wrote them but I also wrote the code, so I might be biased. The schema might need changes but I already built on top of it.",
      issues: [
        "Good plan but no specialized agents to execute it",
        "Single agent context window overloaded",
        "Self-reviewing own code (no objectivity)",
        "Sequential execution with no parallelism",
        "No communication structure between tasks",
      ],
      strengths: [
        "Clear task breakdown with dependencies",
        "Phased approach shows planning awareness",
      ],
    },
    {
      id: "tasks-roles",
      label: "Team Without Coordination",
      requiredComponents: ["task-decomposition", "agent-roles"],
      score: 35,
      agentResponse:
        "**Orchestrator:** Dispatching tasks to specialized agents.\n\n**Researcher:** I've analyzed OAuth2 providers. Recommending Google + GitHub. Using JWT for sessions. Here's my report... [sends to coder]\n\n**Coder:** Got it. Building the endpoints now.\n...\n**Coder:** Done. Built the login page, API routes, and middleware. Stored tokens in localStorage for easy access.\n\n**Tester:** Writing tests for the auth flow. Some endpoints return unexpected formats — adapting tests to match.\n\n**Reviewer:** Found critical issue — tokens in localStorage are vulnerable to XSS. But the coder already finished and the tester wrote tests around it. Rework needed.\n\n**Result:** Feature works but has security vulnerabilities. Significant rework required because the reviewer found issues too late.",
      issues: [
        "Agents work independently without checking in",
        "Coder made security mistake that researcher should have flagged",
        "No mechanism to share context between agents",
        "Reviewer findings come too late in the process",
        "Tester adapted to bugs instead of flagging them",
      ],
      strengths: [
        "Specialized agents with clear expertise",
        "Tasks properly assigned to matching roles",
        "Issues are eventually identified by reviewer",
      ],
    },
    {
      id: "tasks-roles-comms",
      label: "Coordinated but Fragile",
      requiredComponents: ["task-decomposition", "agent-roles", "communication-protocol"],
      score: 50,
      agentResponse:
        "**Orchestrator:** Starting Phase 1. Researcher, begin task 1.1.\n\n**Researcher -> Coder [handoff]:** Provider analysis complete. Recommending httpOnly cookies for tokens (NOT localStorage). See artifact: /docs/auth-design.md\n\n**Coder -> Researcher [question]:** Should PKCE be required for the OAuth flow?\n**Researcher -> Coder [response]:** Yes, PKCE required per current security best practices.\n\n**Coder -> Tester [handoff]:** API routes complete. Session middleware uses httpOnly cookies with PKCE. All artifacts in /app/api/auth/\n\n**Tester -> Coder [blocker]:** Token refresh endpoint returns 500 when session is expired instead of 401.\n**Coder -> Tester [completion]:** Fixed. Expired sessions now return 401 with clear error message.\n\n**Reviewer:** Security review passed. Auth flow follows OWASP guidelines.\n\n**Result:** Feature is functional and secure, but if any agent had crashed mid-task, the whole pipeline would stall with no recovery.",
      issues: [
        "No shared state — agents rely on direct messages only",
        "If an agent fails, there is no recovery strategy",
        "No checkpointing — restart means full re-execution",
        "No quality gates — completion is self-reported",
      ],
      strengths: [
        "Agents communicate before making decisions",
        "Security concern caught early via researcher-coder handoff",
        "Blockers properly raised and resolved",
        "Sequential dependencies respected",
      ],
    },
    {
      id: "tasks-roles-comms-scratch",
      label: "Shared Context Team",
      requiredComponents: ["task-decomposition", "agent-roles", "communication-protocol", "shared-scratchpad"],
      score: 65,
      agentResponse:
        "**Orchestrator:** Initializing shared scratchpad. Starting Phase 1.\n\n**Researcher:** Completed provider analysis. Writing decisions to scratchpad:\n- Selected: Google + GitHub OAuth\n- Session strategy: JWT in httpOnly cookies\n- PKCE required for all flows\n[Scratchpad updated: decisions log, schema artifact]\n\n**Coder:** Reading scratchpad for latest decisions... Building endpoints aligned with researcher's recommendations.\n[Scratchpad updated: API routes artifact, component paths]\n\n**Tester:** Reading scratchpad for implementation details. Writing targeted tests.\n- Auth flow: 12 tests (happy path + edge cases)\n- Session management: 8 tests (expiry, refresh, concurrent)\n[Scratchpad updated: test coverage report]\n\n**Reviewer:** Reading all scratchpad artifacts. Cross-referencing researcher decisions with coder implementation.\n- Implementation matches design decisions\n- All security recommendations followed\n- One suggestion: add rate limiting to /api/auth endpoints\n[Scratchpad updated: review findings]\n\n**Result:** Feature is solid with good alignment across agents. But no automated quality checks and no recovery if something breaks.",
      issues: [
        "No error recovery — a single agent failure stalls the pipeline",
        "No automated quality gates — relying on agent self-assessment",
        "Reviewer suggestions are advisory, not enforced",
      ],
      strengths: [
        "Shared scratchpad ensures all agents see the same context",
        "Decisions are logged and traceable",
        "Agents read before acting — no contradictory implementations",
        "Artifacts are centrally tracked",
        "Reviewer can cross-reference design with implementation",
      ],
    },
    {
      id: "all-minus-quality",
      label: "Resilient Team",
      requiredComponents: ["task-decomposition", "agent-roles", "communication-protocol", "shared-scratchpad", "error-recovery"],
      score: 80,
      agentResponse:
        "**Orchestrator:** Starting orchestration with full error recovery enabled.\n\n**Researcher:** Provider analysis complete. [Scratchpad updated, checkpoint saved]\n\n**Coder (Attempt 1):** Built API routes. Validator detected missing CSRF protection.\n**[Error Recovery]:** Retrying with correction: \"Add CSRF token validation to all POST endpoints.\"\n**Coder (Attempt 2):** Rebuilt with CSRF protection. Validator passed. [Checkpoint saved]\n\n**Coder:** Login page and middleware complete. [Checkpoint saved]\n\n**Tester:** Running test suite...\n- 18/20 tests pass. 2 failures: concurrent session handling.\n**[Error Recovery]:** Sending failure context to Coder: \"Concurrent sessions overwrite each other. Expected: separate session per device.\"\n**Coder:** Fixed session storage to support multiple active sessions. [Checkpoint saved]\n**Tester:** All 20 tests pass.\n\n**Reviewer:** Security review complete. All OWASP auth requirements met. Rate limiting configured. No critical findings.\n\n**Result:** Production-quality auth system. Errors were caught and recovered automatically. But quality was verified by reviewer judgment alone — no automated enforcement.",
      issues: [
        "Quality checks depend on agent judgment, not automated gates",
        "Reviewer approval is the only barrier to completion",
        "No structured pass/fail criteria for each phase",
      ],
      strengths: [
        "Automatic retry with contextual error feedback",
        "Checkpointing prevents re-execution of completed work",
        "Agent failures are handled gracefully",
        "Concurrent session bug caught and fixed in pipeline",
        "Full traceability from research through review",
      ],
    },
    {
      id: "all",
      label: "Coordinated Agent Team",
      requiredComponents: ["task-decomposition", "agent-roles", "communication-protocol", "shared-scratchpad", "error-recovery", "quality-gate"],
      score: 95,
      agentResponse:
        "**Orchestrator:** Full pipeline initialized. Quality gates armed.\n\n**Phase 1 - Research:**\n**Researcher:** Provider analysis complete. OAuth2 design documented.\n[Quality Gate 1: Research Completeness] PASSED - all sections present, sources cited.\n[Checkpoint saved]\n\n**Phase 2 - Implementation:**\n**Coder:** API routes with PKCE, httpOnly cookies, CSRF protection.\n[Quality Gate 2: Code Quality] PASSED - strict TypeScript, no secrets, error handling at all boundaries.\n**Coder:** Login page with Google + GitHub buttons, loading states, error handling.\n[Quality Gate 2] PASSED.\n**Coder:** Session middleware with JWT validation + refresh.\n[Quality Gate 2] PASSED.\n[Checkpoint saved]\n\n**Phase 3 - Verification:**\n**Tester:** 24 tests covering auth flow, session management, edge cases.\n[Quality Gate 3: Test Coverage] PASSED - 94% line coverage, all error states covered.\n**Reviewer:** Full security audit against OWASP checklist.\n[Quality Gate 4: Security Review] PASSED - zero critical/high findings.\n\n**Final Status:**\n- 7 tasks completed, 0 failures, 1 auto-retry (CSRF fix)\n- All 4 quality gates passed\n- Auth system ready for production deployment\n\n**Deliverables:** OAuth2 login (Google + GitHub), JWT sessions, full test suite, security audit report.",
      issues: [
        "Could add performance benchmarking as a 5th quality gate",
      ],
      strengths: [
        "Every phase has automated quality enforcement",
        "Tasks cannot proceed until gates pass",
        "Error recovery caught and fixed issues automatically",
        "Shared scratchpad kept all agents aligned",
        "Communication protocol prevented security mistakes early",
        "Full audit trail from research through deployment",
        "Parallel execution where dependency graph allows",
        "Production-ready output with tests and security review",
      ],
    },
    {
      id: "roles-only",
      label: "Skilled but Chaotic",
      requiredComponents: ["agent-roles"],
      score: 20,
      agentResponse:
        "**Researcher:** Here's my OAuth2 analysis. Recommending Google OAuth with PKCE. Sending to... anyone? Not sure who needs this.\n\n**Coder:** I'll start building. Haven't seen the researcher's output yet. Going with my own assumptions — GitHub OAuth, tokens in localStorage.\n\n**Tester:** What am I testing? I see some code files but no spec or requirements. Writing basic smoke tests.\n\n**Reviewer:** Reviewing what I can find. The coder used localStorage for tokens — this is a critical XSS vulnerability. Also the researcher recommended a completely different provider than what was implemented.\n\n**Result:** Four skilled agents produced contradictory work. The coder ignored the researcher, the tester had nothing to test against, and the reviewer found fundamental misalignment. Complete rework needed.",
      issues: [
        "No task plan — agents don't know what to work on",
        "No communication — agents can't share findings",
        "No shared context — each agent works in isolation",
        "Coder contradicts researcher recommendations",
        "Tester has no spec to test against",
        "Complete misalignment between agent outputs",
      ],
      strengths: [
        "Each agent demonstrates domain expertise",
        "Reviewer correctly identifies security issue",
      ],
    },
  ],
  principles: [
    {
      id: "orchestration-is-the-product",
      title: "Orchestration Is the Product",
      description:
        "Individual agent capability matters less than how agents coordinate. A team of mediocre agents with great orchestration outperforms brilliant agents working in isolation.",
      linkedComponents: ["task-decomposition", "communication-protocol", "shared-scratchpad"],
    },
    {
      id: "fail-fast-recover-faster",
      title: "Fail Fast, Recover Faster",
      description:
        "Multi-agent systems have more failure points. Error recovery and checkpointing transform cascading failures into minor hiccups that the pipeline handles automatically.",
      linkedComponents: ["error-recovery", "shared-scratchpad"],
    },
    {
      id: "shared-context-prevents-drift",
      title: "Shared Context Prevents Drift",
      description:
        "Without a shared scratchpad, agents make independent decisions that contradict each other. Shared state is what turns parallel agents into a coherent team.",
      linkedComponents: ["shared-scratchpad", "communication-protocol", "agent-roles"],
    },
    {
      id: "quality-gates-enforce-standards",
      title: "Quality Gates Enforce Standards",
      description:
        "Relying on agent judgment for quality is unreliable. Automated gates ensure every task meets a measurable bar before downstream work begins.",
      linkedComponents: ["quality-gate", "task-decomposition"],
    },
  ],
};
