/**
 * Enterprise API Route Definitions
 *
 * These routes are NOT included in the static open-source build.
 * To enable the enterprise API server:
 *
 * 1. Remove `output: "export"` from next.config.ts
 * 2. Copy these route handlers into src/app/api/
 * 3. Set environment variables:
 *    - ENTERPRISE_API_KEY: API key for authentication
 *    - OPENAI_API_KEY: For contextualization LLM calls
 *    - VECTOR_DB_URL: For storing ingested embeddings
 *
 * Or run the standalone enterprise server:
 *    npm run enterprise
 */

import type { ContentSource, TeamProgress, ContextualizedExample } from "../../src/lib/content-provider";

// ─── POST /api/ingest ─────────────────────────────────────────────────────────
// Accept codebase URLs, documentation, support tickets, and incident reports.
//
// Request:
// {
//   "sources": [
//     { "type": "github", "url": "https://github.com/org/repo" },
//     { "type": "docs", "url": "https://docs.company.com" }
//   ],
//   "orgId": "org_123"
// }
//
// Response:
// {
//   "status": "queued",
//   "sources": ContentSource[],
//   "estimatedProcessingTime": "2-5 minutes per repository"
// }

export interface IngestRequest {
  sources: Array<{
    type: ContentSource["type"];
    url?: string;
    provider?: string;
    apiKey?: string;
  }>;
  orgId: string;
}

export interface IngestResponse {
  status: "queued" | "processing" | "complete" | "error";
  sources: ContentSource[];
  estimatedProcessingTime: string;
  message: string;
}

// ─── POST /api/contextualize ──────────────────────────────────────────────────
// Generate domain-specific module content from ingested sources.
//
// Request:
// {
//   "orgId": "org_123",
//   "academySlug": "context-engineering-academy",
//   "moduleId": "core-components" (optional)
// }
//
// Response:
// {
//   "status": "processing",
//   "examples": ContextualizedExample[],
//   "webhookUrl": "/api/contextualize/status?orgId=..."
// }

export interface ContextualizeRequest {
  orgId: string;
  academySlug: string;
  moduleId?: string;
}

export interface ContextualizeResponse {
  status: "processing" | "complete" | "error";
  orgId: string;
  academySlug: string;
  moduleId: string;
  examples: ContextualizedExample[];
  message: string;
  webhookUrl: string;
}

// ─── GET /api/scenarios?academy=...&orgId=... ─────────────────────────────────
// Return playground scenarios — generic (no orgId) or contextualized (with orgId).

export interface ScenariosParams {
  academy: string;
  orgId?: string;
}

// ─── GET /api/progress?teamId=... ─────────────────────────────────────────────
// Track team completion, skill gaps, and ROI metrics.

export interface ProgressResponse {
  progress: TeamProgress;
  skillGaps: {
    weakest: string;
    strongest: string;
    recommendation: string;
  };
  roi: {
    trainingHoursSaved: number;
    onboardingDaysReduced: number;
    message: string;
  };
}
