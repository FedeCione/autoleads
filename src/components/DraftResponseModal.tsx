'use client';

import type { ProcessedLead } from '@/types/lead';
import { Badge } from '@/components/Badge';
import { ScoreRing } from '@/components/ScoreRing';

export function DraftResponseModal({
  result,
  onClose,
}: {
  result: ProcessedLead;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border-glow/50 bg-surface shadow-2xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-5">
          <div className="flex items-center gap-4">
            <ScoreRing score={result.score} />
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                {result.nombre}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="neutral">{result.fuente}</Badge>
                <Badge variant={result.prioridad}>{result.prioridad}</Badge>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-border p-1.5 text-muted transition-all hover:border-muted hover:text-foreground"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2l8 8M10 2l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Extracted data */}
        <div className="border-b border-border p-5">
          <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            Datos extraidos
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {[
              ['Operacion', result.operacion],
              ['Propiedad', result.tipo_propiedad],
              ['Presupuesto', result.presupuesto],
              ['Zona', result.zona],
              ['Ambientes', result.ambientes],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {label}
                </span>
                <p className="mt-0.5 text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Intent + reason */}
        <div className="border-b border-border p-5">
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            Intencion detectada
          </p>
          <p className="mb-3 text-sm text-foreground">{result.intencion}</p>
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            Razon del puntaje
          </p>
          <p className="text-sm text-foreground/70">{result.razon_score}</p>
        </div>

        {/* Draft response */}
        <div className="p-5">
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            Respuesta sugerida
          </p>
          <div className="rounded-lg border border-accent/15 bg-gradient-to-br from-accent/[0.04] to-transparent p-4 text-sm leading-relaxed text-foreground">
            {result.respuesta_sugerida}
          </div>
        </div>
      </div>
    </div>
  );
}
