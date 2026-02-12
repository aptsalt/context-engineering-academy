# LLM/Agent Engineering Academy

**The open-source AI training platform that uses your codebase as the curriculum.**

6 academies. 70+ modules. Interactive playgrounds. Free forever.

Enterprise edition: connect your repo, and every example becomes your code, your products, your production incidents.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://aptsalt.github.io/context-engineering-academy)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/aptsalt/context-engineering-academy?style=for-the-badge)](https://github.com/aptsalt/context-engineering-academy)

---

## The Problem

Every enterprise is paying for **two things separately**:

1. **AI/LLM upskilling** — generic Coursera courses, external workshops, tutorials disconnected from daily work
2. **Internal onboarding** — learning the codebase, products, systems, and incidents

These are separate budgets, separate teams, separate timelines. Neither works well alone.

## The Solution

**One platform that does both.** When you teach "how to build a RAG pipeline," don't use a fake e-commerce dataset — use **your company's actual knowledge base**. When you teach "context engineering anti-patterns," show **your own production incidents** where context rot caused agent failures.

Your engineers learn AI patterns **AND** your product domain. One training budget, 2x the value.

---

## Screenshots

### Homepage — 6 Academy Cards

![Homepage](public/screenshots/homepage.png)

### Academy Module Pages

All 6 academies with deep-dive modules, interactive code examples (bad vs. good patterns), anti-patterns, and best practices:

| Context Engineering | Agent Observability | LLM Evals |
|:---:|:---:|:---:|
| ![Context Engineering](public/screenshots/academy-context-engineering-academy.png) | ![Agent Observability](public/screenshots/academy-agent-observability-academy.png) | ![LLM Evals](public/screenshots/academy-llm-evals-academy.png) |

| Agentic RAG | Multi-Agent Orchestration | Tool Use & MCP |
|:---:|:---:|:---:|
| ![Agentic RAG](public/screenshots/academy-agentic-rag-academy.png) | ![Multi-Agent Orchestration](public/screenshots/academy-multi-agent-orchestration-academy.png) | ![Tool Use & MCP](public/screenshots/academy-tool-use-mcp-academy.png) |

### Interactive Playgrounds

Toggle context components on/off and watch the agent's response quality change in real-time. Each playground has 3 scenarios, 6 toggleable components, and quality scores from 0-100.

| Empty (Score: 12) | Partial (Score: 55) | Full (Score: 95) |
|:---:|:---:|:---:|
| ![Empty](public/screenshots/playground-context-engineering-academy-empty.png) | ![Partial](public/screenshots/playground-context-engineering-academy-partial.png) | ![Full](public/screenshots/playground-context-engineering-academy-full.png) |

| Observability Playground | RAG Playground | Multi-Agent Playground |
|:---:|:---:|:---:|
| ![Observability](public/screenshots/playground-agent-observability-academy-full.png) | ![RAG](public/screenshots/playground-agentic-rag-academy-full.png) | ![Multi-Agent](public/screenshots/playground-multi-agent-orchestration-academy-full.png) |

| Evals Playground | Tool Use Playground |
|:---:|:---:|
| ![Evals](public/screenshots/playground-llm-evals-academy-full.png) | ![Tool Use](public/screenshots/playground-tool-use-mcp-academy-full.png) |

---

## Academies

| Academy | Modules | What You Learn |
|---------|:-------:|----------------|
| **Context Engineering** | 11 | System prompts, tools, memory, RAG, few-shot, conversation history. The 6 core components and 4 strategies (Write, Select, Compress, Isolate). |
| **Agent Observability** | 9 | Tracing, structured logging, metrics, dashboards, cost tracking. LangSmith, Phoenix, Langfuse, Braintrust. |
| **LLM Evals** | 13 | Golden datasets, LLM-as-judge, regression testing, CI/CD pipelines. promptfoo, Braintrust, eval-driven development. |
| **Agentic RAG** | 13 | Chunking strategies, hybrid search, reranking, Self-RAG, corrective RAG, Graph RAG, multimodal RAG. |
| **Multi-Agent Orchestration** | 12 | Sequential, parallel, hierarchical, swarm patterns. CrewAI, AutoGen, LangGraph. Task decomposition, error recovery. |
| **Tool Use & MCP** | 12 | Tool design, Model Context Protocol, MCP servers, tool selection & routing, security, production architecture. |

Each academy includes:
- Interactive code examples (bad vs. good patterns with explanations)
- Anti-patterns with severity levels and fixes
- Best practices checklists
- Curated resources (papers, blogs, repos)
- Interactive playground with real-time quality scoring

---

## Enterprise Edition

### How It Works

```
Your Assets                    Contextualization Engine         Your Academy
───────────────               ────────────────────────         ─────────────
GitHub repos          ──┐
Product docs          ──┤     ┌──────────────────────┐
Support tickets       ──┼───▶ │ Ingest → Chunk →      │ ───▶  Domain-specific
Incident reports      ──┤     │ Generate examples     │       code examples,
API specs             ──┤     │ Build scenarios       │       real playground
Internal tools        ──┘     │ Create anti-patterns  │       scenarios from
                              └──────────────────────┘       your actual systems
```

### API

| Endpoint | Purpose |
|----------|---------|
| `POST /api/ingest` | Accept codebase, docs, tickets, incidents |
| `POST /api/contextualize/:academy` | Generate enterprise-specific module content |
| `GET /api/scenarios/:academy` | Return playground scenarios using your data |
| `GET /api/progress/:team` | Track completion, skill gaps, ROI |

### Why Enterprise

| Feature | Generic Academy | Enterprise Edition |
|---------|:-:|:-:|
| Code examples | Fake e-commerce app | **Your actual codebase** |
| Playground scenarios | Generic support bot | **Your product workflows** |
| Anti-patterns | Textbook examples | **Your production incidents** |
| Eval datasets | Synthetic queries | **Your real user queries** |
| Onboarding value | Zero | **Engineers learn your product too** |

### Business Model

| Layer | Access |
|-------|--------|
| **Open Source Academy** | Free forever — 6 academies, 70+ modules, playgrounds |
| **Contextualization API** | Paid — ingest enterprise assets, generate domain-specific content |
| **Hosted Enterprise Instance** | SaaS — branded academy with SSO, progress tracking, analytics |
| **LMS Integration SDK** | Paid — embed into Workday, Cornerstone, or custom LMS |

---

## Getting Started

```bash
# Clone
git clone https://github.com/aptsalt/context-engineering-academy.git
cd context-engineering-academy

# Install
npm install

# Dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Language:** TypeScript (strict mode)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Icons:** Lucide React
- **State:** React hooks only (no external state library)
- **Deployment:** GitHub Pages (zero infrastructure cost)

## Architecture

```
src/
├── app/                              # Next.js App Router pages
│   ├── page.tsx                      # Homepage + enterprise section
│   ├── globals.css                   # OKLch color system
│   ├── context-engineering-academy/  # Academy page + playground
│   ├── agent-observability-academy/
│   ├── llm-evals-academy/
│   ├── agentic-rag-academy/
│   ├── multi-agent-orchestration-academy/
│   └── tool-use-mcp-academy/
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   ├── playground/                   # Interactive playground (10 components)
│   ├── chapters/                     # Context Engineering modules
│   ├── agent-observability/          # Observability modules
│   ├── llm-evals/                    # Evals modules
│   ├── agentic-rag/                  # RAG modules
│   ├── multi-agent/                  # Multi-Agent modules
│   └── tool-use-mcp/                # Tool Use modules
└── lib/
    ├── academies.ts                  # Academy registry (decoupled content layer)
    ├── data.ts                       # Content data (swappable per enterprise)
    ├── playground-data.ts            # Playground types & scoring logic
    └── scenarios/                    # Scenario data (6 academies x 3 scenarios)
```

### Content Layer (Enterprise-Ready)

All module content lives in TypeScript data files under `src/lib/`. The content layer is already decoupled from the UI components — enterprise contextualization replaces these data files with domain-specific content while keeping the same UI.

```typescript
// Generic (open source)
{ title: "RAG Context Selection", bad: { code: "// Dump everything..." } }

// Enterprise (auto-generated from your codebase)
{ title: "RAG for Acme's Knowledge Base", bad: { code: "// How Acme's bot retrieves..." } }
```

## Contributing

PRs welcome. This is an open-source project — contributions to modules, playgrounds, or the enterprise API are all valued.

## License

[MIT](LICENSE)
