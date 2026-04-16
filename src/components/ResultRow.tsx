'use client';

import { useState } from 'react';
import type { ProcessedLead } from '@/types/lead';
import { Badge } from '@/components/Badge';
import { ScoreRingLabeled } from '@/components/ScoreRing';

export function ResultRow({
  result,
  onViewResponse,
}: {
  result: ProcessedLead;
  onViewResponse: (result: ProcessedLead) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-elevated/50"
      >
        <ScoreRingLabeled score={result.score} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{result.nombre}</p>
            <Badge variant={result.prioridad}>{result.prioridad}</Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            {result.intencion}
          </p>
        </div>
        <span
          className={`text-xs text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border/40 bg-surface-elevated/30 px-4 py-3">
          <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {[
              ['Operacion', result.operacion],
              ['Propiedad', result.tipo_propiedad],
              ['Presupuesto', result.presupuesto],
              ['Zona', result.zona],
              ['Ambientes', result.ambientes],
              ['Fuente', result.fuente],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-1.5">
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {label}
                </span>
                <span className="truncate text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <div className="mb-2 rounded border border-border/40 bg-surface/50 px-3 py-2">
            <p className="text-xs leading-relaxed text-muted">
              {result.razon_score}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewResponse(result);
            }}
            className="font-mono text-[11px] font-medium text-accent transition-colors hover:text-info"
          >
            ver respuesta sugerida →
          </button>
        </div>
      )}
    </div>
  );
}
