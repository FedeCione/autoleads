import type { LogEntry as LogEntryType } from '@/types/lead';

const typeColors: Record<LogEntryType['type'], string> = {
  info: 'text-foreground/70',
  success: 'text-success',
  error: 'text-danger',
  processing: 'text-info',
};

const typePrefix: Record<LogEntryType['type'], string> = {
  info: '',
  success: '',
  error: '',
  processing: '',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function LogEntryRow({ entry }: { entry: LogEntryType }) {
  return (
    <div className={`font-mono text-[11px] leading-5 ${typeColors[entry.type]}`}>
      <span className="text-muted/50">{formatTime(entry.timestamp)}</span>{' '}
      {typePrefix[entry.type]}
      {entry.message}
    </div>
  );
}
