export interface ContextComponent {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tokens: number;
  content: string;
  description: string;
}

export interface PlaygroundResponse {
  id: string;
  label: string;
  requiredComponents: string[];
  score: number;
  agentResponse: string;
  issues: string[];
  strengths: string[];
}

export interface ScenarioPrinciple {
  id: string;
  title: string;
  description: string;
  linkedComponents: string[];
}

export interface ScenarioMeta {
  title: string;
  description: string;
  infoCards: { icon: "User" | "Package" | "CreditCard" | "Code" | "FileText" | "Search" | "PenTool" | "AlertTriangle"; label: string; value: string }[];
}

export type ScenarioEmphasis = "full-pipeline" | "prompt-grammar" | "fewer-retries" | "token-efficiency" | "anti-patterns";

export interface PlaygroundScenario {
  id: string;
  name: string;
  emphasis: ScenarioEmphasis;
  emphasisLabel: string;
  meta: ScenarioMeta;
  components: ContextComponent[];
  responses: PlaygroundResponse[];
  principles: ScenarioPrinciple[];
  customerMessage: string;
  recommendedBuildOrder: string[];
  inputLabel?: string;
}

export function findBestResponse(
  enabledComponents: Set<string>,
  responses: PlaygroundResponse[],
): PlaygroundResponse {
  const enabledArray = Array.from(enabledComponents);

  const exactMatch = responses.find((response) => {
    if (response.requiredComponents.length !== enabledArray.length) return false;
    return response.requiredComponents.every((c) => enabledComponents.has(c)) &&
      enabledArray.every((c) => response.requiredComponents.includes(c));
  });

  if (exactMatch) return exactMatch;

  let bestScore = -1;
  let bestResponse = responses[0];

  for (const response of responses) {
    const required = new Set(response.requiredComponents);
    const matchCount = enabledArray.filter((c) => required.has(c)).length;
    const extraCount = enabledArray.filter((c) => !required.has(c)).length;
    const missingCount = response.requiredComponents.filter((c) => !enabledComponents.has(c)).length;

    const score = matchCount * 3 - missingCount * 5 - extraCount * 1;

    if (score > bestScore) {
      bestScore = score;
      bestResponse = response;
    }
  }

  return bestResponse;
}
