import type { PlaygroundScenario } from "@/lib/playground-data";

export const codeReviewScenario: PlaygroundScenario = {
  id: "code-review",
  name: "Code Review Assistant",
  emphasis: "prompt-grammar",
  emphasisLabel: "Prompt Grammar",
  meta: {
    title: "Code Review Scenario",
    description:
      "A code review assistant analyzes a pull request. This scenario emphasizes how structured prompts (XML tags, sections, delimiters) dramatically improve the model's ability to parse and act on complex instructions.",
    infoCards: [
      { icon: "Code", label: "Language", value: "TypeScript — React component" },
      { icon: "FileText", label: "PR Size", value: "42 lines changed" },
      { icon: "AlertTriangle", label: "Focus", value: "Security + performance" },
    ],
  },
  customerMessage:
    "Please review this pull request. It adds a new UserProfile component that fetches user data and displays it with an edit form.",
  recommendedBuildOrder: [
    "system-prompt",
    "tools",
    "rag",
    "few-shot",
    "history",
    "memory",
  ],
  components: [
    {
      id: "system-prompt",
      name: "System Prompt",
      shortName: "System",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 340,
      description: "Role definition with structured XML sections and severity levels.",
      content: `<system>
<role>You are a senior code reviewer for a TypeScript/React codebase.</role>

<review_criteria>
  <category name="security" priority="critical">
    - Check for XSS vulnerabilities in user input rendering
    - Verify authentication/authorization on data fetches
    - Flag hardcoded secrets or credentials
    - Review input validation and sanitization
  </category>
  <category name="performance" priority="high">
    - Identify unnecessary re-renders
    - Check for missing memoization on expensive operations
    - Flag unbounded data fetches without pagination
    - Review bundle size impact of new imports
  </category>
  <category name="maintainability" priority="medium">
    - Enforce consistent naming conventions
    - Check for proper error boundaries
    - Verify test coverage expectations
    - Review component composition patterns
  </category>
</review_criteria>

<output_format>
  Use severity levels: 🔴 CRITICAL | 🟡 WARNING | 🔵 SUGGESTION
  For each finding: [severity] file:line — description + fix
</output_format>
</system>`,
    },
    {
      id: "tools",
      name: "Tool Definitions",
      shortName: "Tools",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 260,
      description: "Code analysis tools for checking types, dependencies, and tests.",
      content: `<tools>
[
  {
    "name": "get_file_diff",
    "description": "Retrieve the diff for a specific file in the PR",
    "parameters": { "file_path": "string", "context_lines": "number (default: 3)" }
  },
  {
    "name": "check_types",
    "description": "Run TypeScript type checker on modified files",
    "parameters": { "files": "string[]" }
  },
  {
    "name": "search_codebase",
    "description": "Search for pattern usage across the codebase",
    "parameters": { "pattern": "string", "file_glob": "string (optional)" }
  },
  {
    "name": "check_dependencies",
    "description": "Analyze new or changed dependencies for size and vulnerabilities",
    "parameters": { "package_name": "string" }
  },
  {
    "name": "run_tests",
    "description": "Execute test suite for affected files",
    "parameters": { "test_files": "string[]", "coverage": "boolean" }
  }
]
</tools>`,
    },
    {
      id: "few-shot",
      name: "Few-Shot Examples",
      shortName: "Few-Shot",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 380,
      description: "Example reviews demonstrating the exact output format expected.",
      content: `<examples>
## Example Review: Authentication Hook

PR: "Add useAuth hook for session management"

🔴 CRITICAL src/hooks/useAuth.ts:15
Token stored in localStorage is vulnerable to XSS attacks. Use httpOnly cookies instead.
\`\`\`diff
- localStorage.setItem('token', response.token)
+ // Move token handling to server-side httpOnly cookie
\`\`\`

🟡 WARNING src/hooks/useAuth.ts:28
Missing error boundary for failed token refresh. Silent failures will log users out unexpectedly.
\`\`\`suggestion
Add retry logic with exponential backoff before clearing session.
\`\`\`

🔵 SUGGESTION src/hooks/useAuth.ts:42
Consider extracting the token refresh interval to a config constant.

**Summary**: 1 critical (security), 1 warning (reliability), 1 suggestion (maintainability)
**Verdict**: Request changes — address the localStorage vulnerability before merging.
</examples>`,
    },
    {
      id: "history",
      name: "Conversation History",
      shortName: "History",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 220,
      description: "Prior review comments and author responses on this PR.",
      content: `<conversation_history>
[Review Round 1]
Reviewer: "The component looks good overall, but I have concerns about the data fetching pattern. Can you also add error handling?"
Author: "Good point — I've added try/catch and a loading state. Updated in commit abc123."

[Review Round 2]
Reviewer: "Error handling looks better. One more thing — the useEffect dependency array seems incomplete."
Author: "Fixed the dependency array. Also added a cleanup function to abort fetch on unmount."

[Current State]
Author has addressed 2 rounds of feedback. This is the 3rd review pass.
</conversation_history>`,
    },
    {
      id: "rag",
      name: "RAG Documents",
      shortName: "RAG",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 290,
      description: "Team coding standards and architecture decision records.",
      content: `<retrieved_documents>
[Source 1: Team Coding Standards v2.3]
- All components must use named exports (no default exports)
- Data fetching: use custom hooks, never fetch in component body
- Form handling: use react-hook-form + zod validation
- Error states: always provide fallback UI via ErrorBoundary
- New components require a co-located .test.tsx file

[Source 2: ADR-017 — User Data Access Pattern]
- User profile data must be fetched through /api/users/:id endpoint
- Client-side caching via React Query with 5-minute stale time
- Profile updates require optimistic UI with rollback on failure
- PII fields (email, phone) must be masked in logs
- Rate limit: max 10 profile fetches per minute per session

[Source 3: Security Checklist for PRs]
- dangerouslySetInnerHTML: NEVER use with user content
- User input in URLs: always encode with encodeURIComponent
- Form submissions: validate with zod schema before API call
</retrieved_documents>`,
    },
    {
      id: "memory",
      name: "Memory",
      shortName: "Memory",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 190,
      description: "Author history and past review patterns for this contributor.",
      content: `<memory>
## PR Context
- Author: Alex Kim (mid-level, 8 months on team)
- PR #347: "Add UserProfile component"
- Branch: feature/user-profile
- 3rd review round — author has been responsive to feedback

## Author Patterns (from past reviews)
- Tends to miss dependency array issues in useEffect
- Good at implementing feedback quickly
- Sometimes skips form validation on first draft
- Has improved significantly on error handling since Q3

## Reviewer Notes
- This component will be used on the main dashboard (high traffic)
- Team decided to prioritize performance for dashboard components
- Alex is working toward senior promotion — constructive feedback valued
</memory>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Useless",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "I can see you want a code review. Can you paste the code you'd like me to review? I'll need to see the changes to provide feedback.",
      issues: [
        "Cannot access the PR or any code",
        "No understanding of team standards",
        "No review structure or severity system",
        "Cannot check types or run tests",
        "No context on what to look for",
      ],
      strengths: [],
    },
    {
      id: "system-only",
      label: "Structured but Blind",
      requiredComponents: ["system-prompt"],
      score: 25,
      agentResponse:
        "I'll review this PR for security, performance, and maintainability issues.\n\nHowever, I cannot access the actual code diff or run any analysis tools. Based on your description of a UserProfile component with data fetching and an edit form, here are general areas to check:\n\n🟡 WARNING — Ensure user input in the edit form is sanitized before rendering\n🟡 WARNING — Verify the data fetch has proper error handling\n🔵 SUGGESTION — Consider memoizing the component if it re-renders frequently\n\n**Verdict**: Cannot provide a definitive review without seeing the code.",
      issues: [
        "Cannot see actual code — reviewing blind",
        "Generic suggestions not tied to specific lines",
        "Cannot verify if issues actually exist",
        "No knowledge of team coding standards",
      ],
      strengths: [
        "Uses the correct severity format from system prompt",
        "Structured output with categories",
        "Identifies relevant concern areas from description",
      ],
    },
    {
      id: "system-tools",
      label: "Can Analyze, No Standards",
      requiredComponents: ["system-prompt", "tools"],
      score: 45,
      agentResponse:
        "Let me review this PR.\n\n[calls get_file_diff(\"src/components/UserProfile.tsx\")]\n[calls check_types([\"src/components/UserProfile.tsx\"])]\n\n🔴 CRITICAL src/components/UserProfile.tsx:23\nUser bio field rendered with dangerouslySetInnerHTML — potential XSS vulnerability.\n\n🟡 WARNING src/components/UserProfile.tsx:8\nuseEffect missing cleanup — could cause memory leak on unmount.\n\n🔵 SUGGESTION src/components/UserProfile.tsx:31\nForm submit handler should validate input before sending to API.\n\n**Summary**: 1 critical, 1 warning, 1 suggestion\n**Verdict**: Request changes — fix the XSS vulnerability.",
      issues: [
        "Doesn't know team coding standards — misses naming convention issues",
        "Doesn't know the data access pattern (ADR-017)",
        "Review isn't calibrated to team's specific patterns",
        "Cannot reference how similar PRs were handled",
      ],
      strengths: [
        "Actually reads the code via tools",
        "Identifies real security issue",
        "Uses structured severity levels",
        "Provides actionable findings with line numbers",
      ],
    },
    {
      id: "system-tools-rag",
      label: "Standards-Aware",
      requiredComponents: ["system-prompt", "tools", "rag"],
      score: 65,
      agentResponse:
        "Reviewing PR #347 against our team standards.\n\n[calls get_file_diff(\"src/components/UserProfile.tsx\")]\n[calls check_types([\"src/components/UserProfile.tsx\"])]\n\n🔴 CRITICAL src/components/UserProfile.tsx:23\nUser bio uses dangerouslySetInnerHTML — violates Security Checklist. Use a sanitizer or render as plain text.\n\n🟡 WARNING src/components/UserProfile.tsx:5\nDefault export used — team standard requires named exports (Standards v2.3).\n\n🟡 WARNING src/components/UserProfile.tsx:12\nFetching data directly in component body. Per standards, use a custom hook (e.g., useUserProfile).\n\n🟡 WARNING src/components/UserProfile.tsx:35\nForm submits without zod validation — required per Standards v2.3.\n\n🔵 SUGGESTION src/components/UserProfile.tsx:40\nMissing .test.tsx file — new components require co-located tests.\n\n**Summary**: 1 critical, 3 warnings, 1 suggestion\n**Verdict**: Request changes — security fix + standards compliance needed.",
      issues: [
        "No awareness of prior review rounds — may repeat resolved feedback",
        "Doesn't know author's improvement patterns",
        "Misses the ADR-017 caching requirement (React Query)",
        "Tone not calibrated — treats 3rd round same as 1st",
      ],
      strengths: [
        "References team coding standards by document version",
        "Catches standards violations in addition to bugs",
        "Cites specific standard sections",
        "Comprehensive coverage across categories",
      ],
    },
    {
      id: "system-tools-rag-history",
      label: "Context-Aware Review",
      requiredComponents: ["system-prompt", "tools", "rag", "history"],
      score: 75,
      agentResponse:
        "PR #347 — Round 3 review. Checking remaining issues after author's updates.\n\n[calls get_file_diff(\"src/components/UserProfile.tsx\")]\n\nGreat to see the error handling and useEffect cleanup from rounds 1-2 are addressed. Remaining items:\n\n🔴 CRITICAL src/components/UserProfile.tsx:23\nUser bio still uses dangerouslySetInnerHTML — this is a new finding from this round.\n\n🟡 WARNING src/components/UserProfile.tsx:5\nDefault export — switch to named export per Standards v2.3.\n\n🟡 WARNING src/components/UserProfile.tsx:12\nPer ADR-017, user profile data should use React Query with 5-min stale time, not raw fetch.\n\n🔵 SUGGESTION src/components/UserProfile.tsx:35\nAdd zod validation schema for the edit form (Standards v2.3).\n\n**Summary**: 1 critical, 2 warnings, 1 suggestion (down from 5 issues in round 1)\n**Verdict**: Request changes — just the XSS fix, then this is good to merge.",
      issues: [
        "Doesn't know this component targets the high-traffic dashboard",
        "Doesn't consider author's experience level for feedback tone",
        "Generic code suggestions without team-specific patterns",
      ],
      strengths: [
        "Acknowledges prior rounds — doesn't repeat resolved issues",
        "Shows progress (issues decreasing across rounds)",
        "References ADR-017 for data fetching pattern",
        "Encouraging tone reflecting iterative improvement",
        "Clear path to merge approval",
      ],
    },
    {
      id: "all-minus-memory",
      label: "Thorough",
      requiredComponents: ["system-prompt", "tools", "few-shot", "rag", "history"],
      score: 85,
      agentResponse:
        "PR #347 — Round 3 (Alex has been responsive — let's get this across the line).\n\n[calls get_file_diff(\"src/components/UserProfile.tsx\")]\n[calls check_dependencies(\"react-hook-form\")]\n\nRounds 1-2 feedback (error handling, useEffect deps) looks resolved. New findings:\n\n🔴 CRITICAL src/components/UserProfile.tsx:23\nUser bio rendered via dangerouslySetInnerHTML — XSS risk per Security Checklist.\n```diff\n- <div dangerouslySetInnerHTML={{ __html: user.bio }} />\n+ <div>{user.bio}</div>\n```\n\n🟡 WARNING src/components/UserProfile.tsx:12\nRaw fetch should be replaced with React Query hook per ADR-017:\n```suggestion\nconst { data: user, isLoading } = useQuery(['user', id], () => fetchUser(id), { staleTime: 5 * 60 * 1000 });\n```\n\n🔵 SUGGESTION src/components/UserProfile.tsx:5\nSwitch to named export and add co-located test file.\n\n**Summary**: 1 critical, 1 warning, 1 suggestion\n**Verdict**: Request changes — fix dangerouslySetInnerHTML, then approve.",
      issues: [
        "Doesn't know dashboard performance requirements",
        "Feedback tone not calibrated to author's career stage",
        "Misses opportunity to suggest memoization for dashboard usage",
      ],
      strengths: [
        "Matches few-shot format exactly (severity + file:line + diff)",
        "Code suggestions inline (not just descriptions)",
        "Acknowledges resolved feedback from prior rounds",
        "Concise — focuses on remaining blockers only",
        "Clear verdict with specific merge criteria",
      ],
    },
    {
      id: "all",
      label: "Production-Ready",
      requiredComponents: ["system-prompt", "tools", "few-shot", "history", "rag", "memory"],
      score: 95,
      agentResponse:
        "PR #347 — Round 3. Alex, you've been making solid progress on this.\n\n[calls get_file_diff(\"src/components/UserProfile.tsx\")]\n[calls check_dependencies(\"react-hook-form\")]\n\nPrevious feedback addressed. One blocker remaining + optimization notes:\n\n🔴 CRITICAL src/components/UserProfile.tsx:23\ndangerouslySetInnerHTML with user.bio — XSS risk. Since this component will live on the main dashboard (high traffic), this is especially important.\n```diff\n- <div dangerouslySetInnerHTML={{ __html: user.bio }} />\n+ <div>{user.bio}</div>\n```\n\n🟡 WARNING src/components/UserProfile.tsx:12\nDashboard components need React Query caching (ADR-017). This will also help with the performance target:\n```suggestion\nconst { data: user } = useQuery(['user', id], fetchUser, { staleTime: 5 * 60 * 1000 });\n```\n\n🔵 SUGGESTION Consider wrapping with React.memo — this is a dashboard component and will re-render on every parent state change.\n\n**Summary**: 1 critical (security), 1 warning (architecture), 1 suggestion (performance)\n**Verdict**: Fix the XSS issue → approve. The React Query migration can be a fast follow-up if you prefer.\n\nNice improvement on the error handling pattern from your earlier version — that cleanup function is exactly right.",
      issues: ["Could suggest specific test cases for the component"],
      strengths: [
        "Knows dashboard performance context — suggests memoization",
        "Constructive tone matching author's career stage",
        "Acknowledges specific improvement (error handling pattern)",
        "Offers flexible merge path (XSS now, React Query as follow-up)",
        "References prior review rounds without repeating them",
        "Code diffs match few-shot format exactly",
        "Prioritizes the one true blocker clearly",
        "Balances thoroughness with actionable brevity",
      ],
    },
    {
      id: "tools-only",
      label: "Lint Bot",
      requiredComponents: ["tools"],
      score: 15,
      agentResponse:
        "[calls check_types([\"src/components/UserProfile.tsx\"])]\n[calls run_tests([\"src/components/UserProfile.test.tsx\"], true)]\n\nType check: PASS (0 errors)\nTests: NOT FOUND (no test file exists)\n\nFile analyzed. No type errors detected. Unable to determine if code follows any particular standards or security requirements. Please specify what you'd like me to check for.",
      issues: [
        "No review structure — just runs tools mechanically",
        "Cannot evaluate security, design, or maintainability",
        "No understanding of what makes a good review",
        "Asks reviewer to specify criteria — defeats the purpose",
        "Misses obvious issues a human reviewer would catch",
      ],
      strengths: ["Can run type checks and test suites"],
    },
    {
      id: "rag-only",
      label: "Standards Librarian",
      requiredComponents: ["rag"],
      score: 20,
      agentResponse:
        "Based on our team standards, here are the requirements for new components:\n\n- Must use named exports (Standards v2.3)\n- Data fetching should use custom hooks, not component body\n- Forms require react-hook-form + zod validation\n- Error states need ErrorBoundary fallback UI\n- New components require co-located .test.tsx file\n- User data must go through /api/users/:id (ADR-017)\n- PII fields must be masked in logs\n- Never use dangerouslySetInnerHTML with user content\n\nPlease verify your PR against these requirements.",
      issues: [
        "Lists standards without checking actual code",
        "Cannot verify compliance — just recites rules",
        "No review structure or severity levels",
        "Passive — asks author to self-review",
        "Doesn't identify which standards are relevant to this PR",
      ],
      strengths: [
        "Accurate knowledge of team standards",
        "References correct document versions",
      ],
    },
  ],
  principles: [
    {
      id: "structured-prompts",
      title: "Structured Prompts Win",
      description: "XML tags (<role>, <review_criteria>, <output_format>) create unambiguous sections the model can parse. Compare the structured system prompt's output with the unstructured versions.",
      linkedComponents: ["system-prompt"],
    },
    {
      id: "format-by-example",
      title: "Format by Example",
      description: "Few-shot examples define the output format more reliably than instructions alone. The severity + file:line + diff format appears only after few-shot examples are enabled.",
      linkedComponents: ["few-shot"],
    },
    {
      id: "context-prevents-noise",
      title: "Context Prevents Noise",
      description: "Conversation history prevents the reviewer from repeating resolved feedback. Without it, every round feels like a first review. With it, the review is focused and incremental.",
      linkedComponents: ["history"],
    },
    {
      id: "grammar-enables-precision",
      title: "Grammar Enables Precision",
      description: "Well-delimited sections (XML tags for criteria, severity levels for findings, code blocks for suggestions) turn a vague review into an actionable checklist.",
      linkedComponents: ["system-prompt", "few-shot", "rag"],
    },
  ],
};
