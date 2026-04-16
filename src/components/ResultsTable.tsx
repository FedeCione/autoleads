'use client';

import type { ProcessedLead } from '@/types/lead';
import { ResultRow } from '@/components/ResultRow';

export function ResultsTable({
  results,
  onViewResponse,
}: {
  results: ProcessedLead[];
  onViewResponse: (result: ProcessedLead) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
          Resultados
        </h2>
        {results.length > 0 && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent">
            {results.length}
          </span>
        )}
      </div>

      <div className="log-scroll flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
            <div className="h-8 w-8 rounded-full border-2 border-dashed border-border" />
            <p className="text-center text-xs text-muted">
              Las consultas procesadas apareceran aca
            </p>
          </div>
        ) : (
          results.map((result) => (
            <ResultRow
              key={result.id}
              result={result}
              onViewResponse={onViewResponse}
            />
          ))
        )}
      </div>
    </div>
  );
}
