# Enterprise Edition

Enterprise features for contextualized AI training using your codebase.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/aptsalt/context-engineering-academy.git
cd context-engineering-academy

# 2. Set environment variables
cp enterprise/.env.example .env.local

# 3. Switch to server mode (remove static export)
# In next.config.ts, remove: output: "export"

# 4. Start the enterprise server
npm run dev
```

## Environment Variables

```env
# Required for enterprise API
ENTERPRISE_API_KEY=your-api-key-here

# LLM provider for contextualization
OPENAI_API_KEY=sk-...

# Vector database for ingested content
VECTOR_DB_URL=http://localhost:6333
VECTOR_DB_COLLECTION=enterprise-content

# Optional: org defaults
DEFAULT_ORG_ID=org_default
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/ingest` | Ingest codebase, docs, tickets |
| POST | `/api/contextualize` | Generate domain-specific examples |
| GET | `/api/scenarios` | Get playground scenarios |
| GET | `/api/progress` | Team progress & skill gaps |

See `api/routes.ts` for full type definitions and request/response contracts.

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌───────────────┐
│  Enterprise UI   │────▶│  Contextualization    │────▶│  Vector DB    │
│  (same React UI) │     │  Engine (LLM + RAG)   │     │  (Qdrant)     │
└─────────────────┘     └──────────────────────┘     └───────────────┘
        │                         │
        │                         ▼
        │               ┌──────────────────────┐
        └──────────────▶│  Content Provider     │
                        │  (swaps static →  API) │
                        └──────────────────────┘
```

The `ContentProvider` interface in `src/lib/content-provider.ts` is the abstraction layer. The open-source version uses `createStaticProvider()` (reads from TypeScript files). Enterprise uses `createEnterpriseProvider()` (fetches from the API).

## Content Layer

All content flows through the same interfaces:
- `Academy` — academy metadata
- `PlaygroundScenario` — playground scenarios with components, responses, principles
- `ContextualizedExample` — code examples (bad vs. good patterns)

Enterprise just swaps the data source. The UI components don't change.
