function getColor(score: number): string {
  if (score >= 70) return 'var(--danger)';
  if (score >= 40) return 'var(--warning)';
  return 'var(--success)';
}

export function ScoreRing({ score }: { score: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <svg
        className="-rotate-90"
        width="40"
        height="40"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
      </svg>
      <span className="absolute font-mono text-[10px] font-semibold">
        {score}
      </span>
    </div>
  );
}

export function ScoreRingLabeled({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <ScoreRing score={score} />
      <span className="font-mono text-[8px] uppercase tracking-wider text-muted">
        prioridad
      </span>
    </div>
  );
}
