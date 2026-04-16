export function Header() {
  return (
    <header className="relative flex items-center justify-between border-b border-border bg-gradient-to-r from-surface via-surface to-accent/[0.03] px-4 py-3.5 sm:px-6">
      {/* Subtle bottom glow line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent/[0.06] px-2 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent-glow)]" />
          <span className="font-mono text-xs font-semibold tracking-wide text-accent">
            AUTO
          </span>
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight">AutoLeads</h1>
          <p className="hidden text-xs text-muted sm:block">
            Automatizacion de consultas con IA
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-accent/20 bg-accent/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-accent">
          demo
        </span>
        <a
          href="https://github.com/FedeCione/autoleads"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted transition-all hover:border-muted hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
