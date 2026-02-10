import type { PlaygroundScenario } from "@/lib/playground-data";
import { knowledgeBaseQaScenario } from "./knowledge-base-qa";
import { multiStepResearchScenario } from "./multi-step-research";
import { codeDocumentationScenario } from "./code-documentation";

export const ragScenarios: PlaygroundScenario[] = [
  knowledgeBaseQaScenario,
  multiStepResearchScenario,
  codeDocumentationScenario,
];

export {
  knowledgeBaseQaScenario,
  multiStepResearchScenario,
  codeDocumentationScenario,
};
