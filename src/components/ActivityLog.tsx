'use client';

import { useEffect, useRef } from 'react';
import type { LogEntry } from '@/types/lead';
import { LogEntryRow } from '@/components/LogEntry';

export function ActivityLog({
  logs,
  onClear,
}: {
  logs: LogEntry[];
  onClear: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="scanline-overlay relative flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-info shadow-[0_0_4px_var(--info-glow)]" />
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            Log de actividad
          </h2>
        </div>
        {logs.length > 0 && (
          <button
            onClick={onClear}
            className="font-mono text-[10px] text-muted transition-colors hover:text-foreground"
          >
            limpiar
          </button>
        )}
      </div>
      <div ref={scrollRef} className="log-scroll flex-1 overflow-y-auto px-4 py-2">
        {logs.length === 0 ? (
          <p className="font-mono text-[11px] text-muted">
            <span className="text-info/40">$</span> esperando procesamiento...
          </p>
        ) : (
          <div className="space-y-px">
            {logs.map((entry) => (
              <LogEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
