import type { PlaygroundScenario } from "@/lib/playground-data";
import { customerSupportScenario } from "./customer-support";
import { codeReviewScenario } from "./code-review";
import { invoiceExtractorScenario } from "./invoice-extractor";
import { researchAnalystScenario } from "./research-analyst";
import { blogWriterScenario } from "./blog-writer";

export const scenarios: PlaygroundScenario[] = [
  customerSupportScenario,
  codeReviewScenario,
  invoiceExtractorScenario,
  researchAnalystScenario,
  blogWriterScenario,
];

export {
  customerSupportScenario,
  codeReviewScenario,
  invoiceExtractorScenario,
  researchAnalystScenario,
  blogWriterScenario,
};
