import type { PlaygroundScenario } from "@/lib/playground-data";
import { debugFailingAgentScenario } from "./debug-failing-agent";
import { costInvestigationScenario } from "./cost-investigation";
import { latencyOptimizationScenario } from "./latency-optimization";

export const observabilityScenarios: PlaygroundScenario[] = [
  debugFailingAgentScenario,
  costInvestigationScenario,
  latencyOptimizationScenario,
];

export {
  debugFailingAgentScenario,
  costInvestigationScenario,
  latencyOptimizationScenario,
};
