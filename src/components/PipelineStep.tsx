import type { PipelineStepDef, PipelineStatus } from '@/types/lead';

const statusStyles: Record<PipelineStatus, string> = {
  pending: 'border-border bg-surface text-muted',
  active:
    'border-accent/40 bg-gradient-to-r from-accent/[0.08] to-accent/[0.03] text-accent animate-glow',
  completed:
    'border-success/30 bg-gradient-to-r from-success/[0.06] to-transparent text-success',
  error: 'border-danger/30 bg-danger/[0.06] text-danger',
};

const dotStyles: Record<PipelineStatus, string> = {
  pending: 'border-muted/40 bg-transparent',
  active: 'border-accent bg-accent shadow-[0_0_8px_var(--accent-glow)]',
  completed: 'border-success bg-success',
  error: 'border-danger bg-danger',
};

export function PipelineStep({
  step,
  status,
  detail,
  isLast,
}: {
  step: PipelineStepDef;
  status: PipelineStatus;
  detail?: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-3">
      {/* Vertical connector */}
      <div className="flex w-4 flex-col items-center">
        <div
          className={`h-3 w-3 shrink-0 rounded-full border-2 transition-all duration-500 ${dotStyles[status]}`}
        />
        {!isLast && (
          <div
            className={`w-0.5 flex-1 transition-all duration-500 ${
              status === 'completed'
                ? 'bg-success/30'
                : status === 'active'
                  ? 'pipeline-connector-active'
                  : 'bg-border'
            }`}
          />
        )}
      </div>

      {/* Step card */}
      <div
        className={`mb-2 flex-1 rounded-lg border p-3 transition-all duration-500 ${statusStyles[status]}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
              {step.icon}
            </span>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
          {status === 'completed' && (
            <span className="font-mono text-[10px] text-success/60">OK</span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted">
          {detail || step.description}
        </p>
      </div>
    </div>
  );
}
