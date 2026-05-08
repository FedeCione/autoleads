# AutoLeads — AI lead automation demo

[![Next.js](https://img.shields.io/badge/next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/groq-llama%203.3%2070B-f55036?logo=meta&logoColor=white)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-brightgreen.svg)](./LICENSE)

Public demo of an AI pipeline that classifies, scores, and drafts replies for leads coming into a fictional Buenos Aires real estate agency ("Inmobiliaria Palermo"). Leads arrive from WhatsApp, web forms, MercadoLibre, and Instagram; the AI extracts structured data (operation, property type, budget, neighborhood), assigns priority (high/medium/low), and generates a ready-to-send reply in Rioplatense Spanish.

**Stack**: Next.js 16 · Groq (Llama 3.3 70B, JSON mode) · Zod v4 · Tailwind CSS v4 · Vercel Analytics

## Quick start

```bash
pnpm install
cp .env.local.example .env.local
# Fill in GROQ_API_KEY with your key from https://console.groq.com/keys
pnpm dev
# Open http://localhost:3000
```

Without `GROQ_API_KEY`, the API returns a `[DEMO MODE]` message instead of calling Groq.

Try it:

1. Click **"Cargar ejemplos"** — six sample queries are preloaded covering the high/medium/low/off-topic spectrum.
2. Click **"Procesar todos"** — the pipeline animates the four steps (Reception → AI Extraction → Classification → Reply) for each lead.
3. Click a result row to see the full reply, the extracted data, and the score.

## Retargeting it for your business

Two files:

- `src/lib/leadPrompt.ts` — system prompt with the vertical and the fields to extract. Replace real estate with your vertical (clinic, law firm, gym, e-commerce, etc.) and the structured fields you want to capture.
- `src/data/sampleLeads.ts` — sample queries for the demo. Replace with real messages from your pipeline.

The rest (Zod validation, rate limit, CORS, dashboard UI) doesn't need to change.

## How it connects in production

In the demo, leads are loaded manually. In production the flow is:

```
Lead arrives via WhatsApp / web form / MercadoLibre / Instagram
  → Webhook POST to your server with the provider's payload
  → Your server verifies signature/origin
  → Calls the same /api/process endpoint with the message
  → Receives JSON with extracted data + priority + suggested reply
  → Writes a row to Google Sheets / Airtable / your CRM
  → Sends the reply through the original channel (WhatsApp Business API,
    reply to the form's email, Instagram DM, etc.)
  → Notifies the sales team if priority is "high"
```

That's what the paid service delivers: the integrations with the inbound channels, the CRM writes, the team notifications, and the deployment. The demo proves that the AI part (extraction + classification + drafting) works on real data.

## Project layout

```
src/
  app/
    api/process/route.ts   — validation, rate limit, Groq call (JSON mode)
    page.tsx                — renders <Dashboard />
    layout.tsx              — metadata, fonts, analytics
    globals.css             — Tailwind v4 @theme (dark dashboard)
  components/
    Dashboard.tsx           — state and processing orchestrator
    Header.tsx              — top bar with DEMO indicator
    Footer.tsx              — CTA to portfolio
    LeadInput.tsx           — left panel: form + lead queue
    Pipeline.tsx            — center panel: animated 4-step stepper
    PipelineStep.tsx        — individual step with transitions
    ResultsTable.tsx        — right panel: results table
    ResultRow.tsx           — expandable row with extracted data
    ScoreRing.tsx           — SVG ring with score and color
    ActivityLog.tsx         — terminal-style log
    LogEntry.tsx            — individual log line
    DraftResponseModal.tsx  — modal with full reply + metadata
    Badge.tsx               — reusable pill (priority/status)
  data/
    sampleLeads.ts          — 6 preloaded queries
    pipelineSteps.ts        — definition of the 4 steps
  lib/
    leadPrompt.ts           — system prompt + buildMessages()
    leadSchema.ts           — Zod schemas (request + AI output)
    rateLimit.ts            — in-memory rate limiter (15 req/h/IP)
    cors.ts                 — origin/host check
  types/
    lead.ts                 — shared types
```

## About the author / Sobre el autor

**EN** — Built by **Federico Cione**, a backend engineer from Argentina. I build typed, tested, AI-integrated backends and process automation for product teams. Available for **AI process automation** engagements. [Book a discovery call →](https://fedecione-portfolio.vercel.app/#contact)

**ES** — Hecho por **Federico Cione**, desarrollador backend argentino. Construyo backends tipados, testeados y con IA integrada, y automatización de procesos para equipos de producto. Disponible para paquetes de **automatización de procesos con IA**. [Agendá una llamada →](https://fedecione-portfolio.vercel.app/#contact)

- Portfolio: [fedecione-portfolio.vercel.app](https://fedecione-portfolio.vercel.app)
- GitHub: [github.com/FedeCione](https://github.com/FedeCione)

## License

[MIT](./LICENSE) © Federico Cione
