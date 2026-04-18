# AutoLeads — demo de automatización de leads con IA

Demo pública de un pipeline de IA que clasifica, puntúa y redacta respuestas para leads de una inmobiliaria ficticia de Buenos Aires ("Inmobiliaria Palermo"). Los leads llegan de WhatsApp, formularios web, MercadoLibre e Instagram; la IA extrae datos estructurados (operación, tipo de propiedad, presupuesto, zona), asigna prioridad (alta/media/baja) y genera una respuesta en español rioplatense lista para enviar.

**Stack**: Next.js 16 · Groq (Llama 3.3 70B, JSON mode) · Zod v4 · Tailwind CSS v4 · Vercel Analytics

## Cómo probarlo

```bash
pnpm install
cp .env.local.example .env.local
# Completá GROQ_API_KEY con tu key de https://console.groq.com/keys
pnpm dev
# Abrí http://localhost:3000
```

Sin `GROQ_API_KEY` la API devuelve un mensaje de `[DEMO MODE]` en lugar de llamar a Groq.

Probalo:

1. Click en **"Cargar ejemplos"** — se precargan 6 consultas que cubren el espectro alta/media/baja/off-topic.
2. Click en **"Procesar todos"** — el pipeline anima los 4 pasos (Recepción → Extracción IA → Clasificación → Respuesta) por cada lead.
3. Click en una fila de resultados para ver la respuesta completa, los datos extraídos y el puntaje.

## Cómo retargetearlo para tu negocio

Son dos archivos:

- `src/lib/leadPrompt.ts` — system prompt con el rubro y los campos a extraer. Cambiá inmobiliaria por tu vertical (clínica, estudio jurídico, gimnasio, ecommerce, etc.) y los campos estructurados que te interesa capturar.
- `src/data/sampleLeads.ts` — consultas de ejemplo para la demo. Reemplazá por mensajes reales de tu pipeline.

El resto (validación Zod, rate limit, CORS, UI del dashboard) no se toca.

## Cómo se conecta en producción

En la demo los leads se cargan manualmente. En producción el flujo es:

```
Lead entra por WhatsApp / formulario web / MercadoLibre / Instagram
  → Webhook POST a tu servidor con el payload del proveedor
  → Tu servidor verifica firma/origen
  → Llama al mismo endpoint /api/process con el mensaje
  → Recibe JSON con datos extraídos + prioridad + respuesta sugerida
  → Escribe fila en Google Sheets / Airtable / tu CRM
  → Envía la respuesta por el canal original (WhatsApp Business API,
    reply al email del form, DM de Instagram, etc.)
  → Notifica al equipo de ventas si la prioridad es "alta"
```

Eso es lo que entrega el servicio pago: las integraciones con los canales de entrada, la escritura al CRM, las notificaciones al equipo y el deploy. La demo prueba que la parte de IA (extracción + clasificación + redacción) funciona con datos reales.

## Estructura

```
src/
  app/
    api/process/route.ts   — validación, rate limit, llamada a Groq (JSON mode)
    page.tsx                — renderiza <Dashboard />
    layout.tsx              — metadata, fonts, analytics
    globals.css             — Tailwind v4 @theme (dark dashboard)
  components/
    Dashboard.tsx           — orquestador de estado y procesamiento
    Header.tsx              — barra superior con indicador DEMO
    Footer.tsx              — CTA al portfolio
    LeadInput.tsx           — panel izq: formulario + cola de leads
    Pipeline.tsx            — panel centro: stepper animado de 4 pasos
    PipelineStep.tsx        — step individual con transiciones
    ResultsTable.tsx        — panel der: tabla de resultados
    ResultRow.tsx           — fila expandible con datos extraídos
    ScoreRing.tsx           — anillo SVG con puntaje y color
    ActivityLog.tsx         — log estilo terminal
    LogEntry.tsx            — línea individual del log
    DraftResponseModal.tsx  — modal con respuesta completa + metadata
    Badge.tsx               — pill reutilizable (prioridad/estado)
  data/
    sampleLeads.ts          — 6 consultas precargadas
    pipelineSteps.ts        — definición de los 4 pasos
  lib/
    leadPrompt.ts           — system prompt + buildMessages()
    leadSchema.ts           — schemas Zod (request + salida IA)
    rateLimit.ts            — rate limiter in-memory (15 req/h/IP)
    cors.ts                 — check de origin/host
  types/
    lead.ts                 — tipos compartidos
```

## Autor

**Federico Cione** — Backend Engineer · IA & Automatización

- Portfolio: [fedecione.dev](https://fedecione-portfolio.vercel.app)
- GitHub: [github.com/FedeCione](https://github.com/FedeCione)

## Licencia

MIT
