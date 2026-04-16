'use client';

import { useState } from 'react';
import type { Lead, LeadSource } from '@/types/lead';

const SOURCES: { value: LeadSource; icon: string }[] = [
  { value: 'WhatsApp', icon: 'WA' },
  { value: 'Formulario web', icon: 'WEB' },
  { value: 'MercadoLibre', icon: 'ML' },
  { value: 'Instagram', icon: 'IG' },
];

const sourceColor: Record<LeadSource, string> = {
  WhatsApp: 'border-success/40 text-success',
  'Formulario web': 'border-accent/40 text-accent',
  MercadoLibre: 'border-warning/40 text-warning',
  Instagram: 'border-danger/40 text-danger',
};

let nextId = 1;

export function LeadInput({
  leads,
  onAddLead,
  onRemoveLead,
  onLoadSamples,
  onProcess,
  processing,
}: {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  onRemoveLead: (id: string) => void;
  onLoadSamples: () => void;
  onProcess: () => void;
  processing: boolean;
}) {
  const [nombre, setNombre] = useState('');
  const [fuente, setFuente] = useState<LeadSource>('WhatsApp');
  const [mensaje, setMensaje] = useState('');

  function handleAdd() {
    if (!nombre.trim() || !mensaje.trim()) return;
    onAddLead({
      id: `custom-${nextId++}`,
      nombre: nombre.trim(),
      fuente,
      mensaje: mensaje.trim(),
    });
    setNombre('');
    setMensaje('');
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
          Consultas entrantes
        </h2>
      </div>

      {/* Fixed form area */}
      <div className="shrink-0 border-b border-border p-4">
        <button
          onClick={onLoadSamples}
          disabled={processing}
          className="mb-3 w-full rounded border border-dashed border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          Cargar datos de ejemplo
        </button>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={processing}
            className="w-full rounded border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50"
          />
          <div className="flex gap-2">
            <select
              value={fuente}
              onChange={(e) => setFuente(e.target.value as LeadSource)}
              disabled={processing}
              className="flex-1 rounded border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none disabled:opacity-50"
            >
              {SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.value}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Mensaje de la consulta..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            disabled={processing}
            rows={2}
            className="w-full resize-none rounded border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleAdd}
            disabled={processing || !nombre.trim() || !mensaje.trim()}
            className="w-full rounded border border-border bg-surface-elevated px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Scrollable lead queue */}
      <div className="relative min-h-0 flex-1">
        {leads.length > 0 && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-background to-transparent" />
          </>
        )}
        <div className="log-scroll h-full overflow-y-auto px-4 py-3">
          {leads.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted">
              Sin consultas en cola
            </p>
          ) : (
            <>
              <p className="mb-2 font-mono text-xs text-muted">
                Cola ({leads.length}):
              </p>
              <div className="space-y-1.5">
                {leads.map((lead, i) => {
                  const src = SOURCES.find((s) => s.value === lead.fuente);
                  return (
                    <div
                      key={lead.id}
                      className="group flex items-start gap-2.5 rounded-md border border-border bg-surface-elevated/60 px-3 py-2 transition-colors hover:border-muted"
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded border px-1 font-mono text-[10px] font-bold leading-4 ${sourceColor[lead.fuente]}`}
                      >
                        {src?.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-medium leading-tight">
                            {lead.nombre}
                          </span>
                          <span className="font-mono text-[10px] text-muted">
                            #{String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                          {lead.mensaje}
                        </p>
                      </div>
                      {!processing && (
                        <button
                          onClick={() => onRemoveLead(lead.id)}
                          className="shrink-0 text-xs text-transparent transition-colors group-hover:text-muted hover:!text-danger"
                        >
                          x
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Process button */}
      <div className="shrink-0 border-t border-border p-4">
        <button
          onClick={onProcess}
          disabled={processing || leads.length === 0}
          className="w-full rounded bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim disabled:opacity-50"
        >
          {processing ? 'Procesando...' : `Procesar todos (${leads.length})`}
        </button>
      </div>
    </div>
  );
}
