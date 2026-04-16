'use client';

import { pipelineSteps } from '@/data/pipelineSteps';
import { PipelineStep } from '@/components/PipelineStep';
import type { PipelineStatus, ProcessingState } from '@/types/lead';

function getStepStatus(
  stepIndex: number,
  processing: ProcessingState | null,
): PipelineStatus {
  if (!processing || !processing.active) return 'pending';
  if (stepIndex < processing.currentStep) return 'completed';
  if (stepIndex === processing.currentStep) return 'active';
  return 'pending';
}

function getStepDetail(
  stepIndex: number,
  processing: ProcessingState | null,
  currentLeadName?: string,
): string | undefined {
  if (!processing || !processing.active) return undefined;
  if (stepIndex === 0 && processing.currentStep === 0 && currentLeadName) {
    return `Recibiendo: ${currentLeadName}`;
  }
  if (stepIndex === 1 && processing.currentStep === 1) {
    return 'Analizando con Llama 3.3 70B...';
  }
  if (stepIndex === 2 && processing.currentStep === 2) {
    return 'Asignando prioridad y puntaje...';
  }
  if (stepIndex === 3 && processing.currentStep === 3) {
    return 'Generando borrador de respuesta...';
  }
  return undefined;
}

export function Pipeline({
  processing,
  currentLeadName,
}: {
  processing: ProcessingState | null;
  currentLeadName?: string;
}) {
  const progress =
    processing && processing.active && processing.total > 0
      ? Math.round((processing.currentIndex / processing.total) * 100)
      : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
          Procesamiento IA
        </h2>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-4">
        {pipelineSteps.map((step, i) => (
          <PipelineStep
            key={step.label}
            step={step}
            status={getStepStatus(i, processing)}
            detail={getStepDetail(i, processing, currentLeadName)}
            isLast={i === pipelineSteps.length - 1}
          />
        ))}
      </div>

      {processing?.active && (
        <div className="border-t border-border px-5 py-3">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-muted">
            <span>
              Procesando {processing.currentIndex + 1} de {processing.total}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-info transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
