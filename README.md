# LLM/Agent Engineering Academy

A comprehensive, free, open-source learning platform for mastering every layer of the AI agent stack. Six focused academies with 70+ modules and interactive playgrounds.

## Academies

| Academy | Modules | Focus |
|---------|---------|-------|
| **Context Engineering** | 11 | System prompts, tools, memory, RAG, few-shot, conversation history |
| **Agent Observability** | 9 | Tracing, structured logging, metrics, dashboards, cost tracking |
| **LLM Evals** | 13 | Eval datasets, automated evals, regression testing, CI/CD pipelines |
| **Agentic RAG** | 13 | Chunking, embeddings, retrieval strategies, agentic patterns, evaluation |
| **Multi-Agent Orchestration** | 12 | Orchestration patterns, communication, shared state, error recovery |
| **Tool Use & MCP** | 12 | Tool design, Model Context Protocol, security, production architecture |

Each academy includes interactive code examples, anti-patterns, best practices checklists, and curated resources.

## Interactive Playgrounds

Every academy has a hands-on playground where you toggle context components on/off and watch a simulated AI agent's response quality change in real-time. Each playground has 3 scenarios with 6 toggleable components and quality scores from 0-100.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Icons:** Lucide React
- **State:** React hooks (no external state library)
- **Deployment:** Static export, GitHub Pages

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                            # Next.js App Router pages
│   ├── page.tsx                    # Homepage with academy grid
│   ├── globals.css                 # Color system & animations
│   ├── context-engineering-academy/
│   ├── agent-observability-academy/
│   ├── llm-evals-academy/
│   ├── agentic-rag-academy/
│   ├── multi-agent-orchestration-academy/
│   └── tool-use-mcp-academy/
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── chapters/                   # Context Engineering chapters
│   ├── playground/                 # Playground UI components
│   ├── agent-observability/        # Observability chapters
│   ├── llm-evals/                  # Evals chapters
│   ├── agentic-rag/                # RAG chapters
│   ├── multi-agent/                # Multi-Agent chapters
│   └── tool-use-mcp/              # Tool Use chapters
└── lib/
    ├── academies.ts                # Academy metadata
    ├── data.ts                     # Context Engineering content
    ├── playground-data.ts          # Playground types & logic
    └── scenarios/                  # Playground scenario data
```

## License

[MIT](LICENSE)
