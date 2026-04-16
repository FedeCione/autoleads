'use client';

import { useState, useEffect, useCallback } from 'react';
import { track } from '@vercel/analytics';
import type { Lead, ProcessedLead, LogEntry, ProcessingState } from '@/types/lead';
import { sampleLeads } from '@/data/sampleLeads';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LeadInput } from '@/components/LeadInput';
import { Pipeline } from '@/components/Pipeline';
import { ResultsTable } from '@/components/ResultsTable';
import { ActivityLog } from '@/components/ActivityLog';
import { DraftResponseModal } from '@/components/DraftResponseModal';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fetchWithTimeout(
  url: string,
  options: RequestInit,
  ms = 15000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

let logId = 0;

export function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [results, setResults] = useState<ProcessedLead[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [processing, setProcessing] = useState<ProcessingState | null>(null);
  const [selectedResult, setSelectedResult] = useState<ProcessedLead | null>(
    null,
  );

  // Pre-load sample leads on mount
  useEffect(() => {
    setLeads([...sampleLeads]);
    addLog('Sistema iniciado — 6 consultas de ejemplo cargadas', 'info');
  }, []);

  function addLog(message: string, type: LogEntry['type'] = 'info') {
    setLogs((prev) => [
      ...prev,
      { id: `log-${logId++}`, timestamp: new Date(), message, type },
    ]);
  }

  const processAllLeads = useCallback(async () => {
    if (leads.length === 0) return;

    const queue = [...leads];
    setResults([]);
    setProcessing({ active: true, currentIndex: 0, currentStep: 0, total: queue.length });
    track('pipeline_started', { leadCount: queue.length });
    addLog(`Proceso iniciado — ${queue.length} consultas en cola`, 'info');

    for (let i = 0; i < queue.length; i++) {
      const lead = queue[i];

      // Step 0: Reception
      setProcessing({ active: true, currentIndex: i, currentStep: 0, total: queue.length });
      addLog(`Consulta recibida: ${lead.nombre} (${lead.fuente})`, 'info');
      await delay(400);

      // Step 1: AI extraction (actual API call)
      setProcessing({ active: true, currentIndex: i, currentStep: 1, total: queue.length });
      addLog('Extrayendo datos con IA...', 'processing');

      try {
        const res = await fetchWithTimeout('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lead: { nombre: lead.nombre, fuente: lead.fuente, mensaje: lead.mensaje } }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          const errMsg = errBody.error === 'rate_limited'
            ? 'Limite alcanzado — espera antes de procesar mas consultas'
            : `Error HTTP ${res.status}`;
          addLog(`✗ ${lead.nombre}: ${errMsg}`, 'error');
          await delay(1000);
          continue;
        }

        const data = await res.json();
        const result = data.result;

        // Step 2: Classification (visual delay, data already received)
        setProcessing({ active: true, currentIndex: i, currentStep: 2, total: queue.length });
        addLog(
          `Clasificado: ${result.operacion.toUpperCase()} / ${result.tipo_propiedad} / Prioridad ${result.prioridad.toUpperCase()} (${result.score}/100 pts)`,
          'info',
        );
        await delay(600);

        // Step 3: Response generated
        setProcessing({ active: true, currentIndex: i, currentStep: 3, total: queue.length });
        addLog('Respuesta generada', 'processing');
        await delay(400);

        // Add to results
        const processedLead: ProcessedLead = { ...lead, ...result };
        setResults((prev) => [...prev, processedLead]);
        addLog(`✓ Consulta procesada: ${lead.nombre}`, 'success');
        track('lead_processed', { prioridad: result.prioridad, score: result.score });
      } catch (err) {
        const msg = err instanceof DOMException && err.name === 'AbortError'
          ? 'Timeout — la IA tardo demasiado'
          : 'Error de red';
        addLog(`✗ ${lead.nombre}: ${msg}`, 'error');
      }

      // Delay between leads to avoid Groq free-tier rate limits
      if (i < queue.length - 1) await delay(1500);
    }

    setProcessing(null);
    setLeads([]);
    addLog(`Proceso completo`, 'success');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads]);

  function handleLoadSamples() {
    setLeads([...sampleLeads]);
    setResults([]);
    addLog('Datos de ejemplo cargados (6 consultas)', 'info');
  }

  const currentLeadName =
    processing?.active && leads[processing.currentIndex]
      ? leads[processing.currentIndex].nombre
      : undefined;

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[320px_1fr_400px]">
        {/* Left panel */}
        <div className="overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <LeadInput
            leads={leads}
            onAddLead={(lead) => setLeads((prev) => [...prev, lead])}
            onRemoveLead={(id) => setLeads((prev) => prev.filter((l) => l.id !== id))}
            onLoadSamples={handleLoadSamples}
            onProcess={processAllLeads}
            processing={processing?.active ?? false}
          />
        </div>

        {/* Center panel */}
        <div className="overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <Pipeline processing={processing} currentLeadName={currentLeadName} />
        </div>

        {/* Right panel */}
        <div className="overflow-hidden border-b border-border lg:border-b-0">
          <ResultsTable results={results} onViewResponse={setSelectedResult} />
        </div>
      </div>

      {/* Activity log */}
      <div className="h-36 shrink-0 border-t border-border bg-surface/80">
        <ActivityLog logs={logs} onClear={() => setLogs([])} />
      </div>

      <Footer />

      {selectedResult && (
        <DraftResponseModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}
