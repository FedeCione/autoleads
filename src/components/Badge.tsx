const variants = {
  alta: 'bg-danger/10 text-danger before:bg-danger',
  media: 'bg-warning/10 text-warning before:bg-warning',
  baja: 'bg-success/10 text-success before:bg-success',
  processing: 'bg-info/10 text-info before:bg-info animate-pulse-step',
  done: 'bg-success/10 text-success before:bg-success',
  error: 'bg-danger/10 text-danger before:bg-danger',
  neutral: 'bg-surface-elevated text-muted before:bg-muted',
} as const;

type BadgeVariant = keyof typeof variants;

export function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`relative inline-flex items-center gap-1.5 rounded-full py-0.5 pl-3.5 pr-2 font-mono text-[10px] font-medium uppercase tracking-wider before:absolute before:left-1.5 before:h-1.5 before:w-1.5 before:rounded-full ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
