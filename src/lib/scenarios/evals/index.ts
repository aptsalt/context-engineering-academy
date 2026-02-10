import type { PlaygroundScenario } from "@/lib/playground-data";
import { chatbotEvalScenario } from "./chatbot-eval";
import { safetyEvalScenario } from "./safety-eval";
import { regressionPipelineScenario } from "./regression-pipeline";

export const evalScenarios: PlaygroundScenario[] = [
  chatbotEvalScenario,
  safetyEvalScenario,
  regressionPipelineScenario,
];

export {
  chatbotEvalScenario,
  safetyEvalScenario,
  regressionPipelineScenario,
};
