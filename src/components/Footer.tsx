export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface px-4 py-3 text-center sm:px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <span className="text-xs text-muted">
        Queres automatizar las consultas de tu negocio?{' '}
      </span>
      <a
        href="https://fedecione-portfolio.vercel.app#contact"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-xs text-accent transition-colors hover:text-info"
      >
        Reservar llamada
      </a>
      <span className="text-xs text-muted"> · </span>
      <a
        href="https://fedecione-portfolio.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted transition-colors hover:text-foreground"
      >
        fedecione.dev
      </a>
    </footer>
  );
}
