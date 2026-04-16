# AutoLeads

AI-powered lead processing pipeline demo for a fictional Buenos Aires real estate agency ("Inmobiliaria Palermo"). Proves Package 2 ("Automatizacion de procesos con IA") of the freelance funnel at fedecione.dev.

## Stack

- Next.js 16 App Router + TypeScript + Tailwind v4
- Groq SDK + Llama 3.3 70B (free tier, JSON mode)
- Zod v4 for request + AI output validation
- Vercel Analytics
- pnpm

## Commands

```bash
pnpm dev      # Dev server (port 3000)
pnpm build    # Production build
pnpm lint     # ESLint
```

## Architecture

Single-page dashboard. No database, no auth, no persistence.

```
src/
  app/
    page.tsx                    # Renders <Dashboard />
    api/process/route.ts        # POST — validates lead, calls Groq, returns structured JSON
  components/
    Dashboard.tsx               # Orchestrator — owns all state (leads, results, logs, processing)
    LeadInput.tsx               # Left panel: form + sample loader + lead queue
    Pipeline.tsx                # Center: 4-step animated stepper (visual pipeline)
    ResultsTable.tsx            # Right: processed leads with expandable rows
    ActivityLog.tsx             # Bottom: terminal-style log
    DraftResponseModal.tsx      # Modal with full AI response + metadata
  data/
    sampleLeads.ts              # 6 pre-built leads (high/medium/low/off-topic)
    pipelineSteps.ts            # Step definitions
  lib/
    leadPrompt.ts               # System prompt for lead classification
    leadSchema.ts               # Zod schemas (request + AI output)
    rateLimit.ts                # In-memory rate limiter (15/h/IP)
    cors.ts                     # Origin/host check
  types/
    lead.ts                     # Shared TypeScript types
```

## Key patterns

- **Single API call per lead, simulated multi-step pipeline**: Only step 2 (extraction) calls Groq. Steps 1/3/4 are visual delays (~400-600ms).
- **JSON mode**: `response_format: { type: 'json_object' }` + Zod validation of AI output.
- **Rate limiting**: In-memory, 15 requests/IP/hour.
- **Pre-loaded sample data**: 6 leads loaded on mount via useEffect.

## Retargeting

To adapt for a different business:
1. Edit `src/data/sampleLeads.ts` with domain-specific leads
2. Rewrite the system prompt in `src/lib/leadPrompt.ts`
3. Update Zod schemas in `src/lib/leadSchema.ts` to match new AI output fields
4. Update types in `src/types/lead.ts`

## Environment

```
GROQ_API_KEY=gsk_...   # Required. Get free key at console.groq.com
```

Without GROQ_API_KEY, the API returns a static demo response.
