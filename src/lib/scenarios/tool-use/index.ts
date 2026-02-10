import type { PlaygroundScenario } from "@/lib/playground-data";
import { toolDesignScenario } from "./tool-design";
import { mcpServerScenario } from "./mcp-server";
import { toolSelectionScenario } from "./tool-selection";

export const toolUseScenarios: PlaygroundScenario[] = [
  toolDesignScenario,
  mcpServerScenario,
  toolSelectionScenario,
];

export {
  toolDesignScenario,
  mcpServerScenario,
  toolSelectionScenario,
};
