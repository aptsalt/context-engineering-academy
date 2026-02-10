import type { PlaygroundScenario } from "@/lib/playground-data";
import { featureDevelopmentScenario } from "./feature-development";
import { researchSynthesisScenario } from "./research-synthesis";
import { dataPipelineScenario } from "./data-pipeline";

export const multiAgentScenarios: PlaygroundScenario[] = [
  featureDevelopmentScenario,
  researchSynthesisScenario,
  dataPipelineScenario,
];

export {
  featureDevelopmentScenario,
  researchSynthesisScenario,
  dataPipelineScenario,
};
