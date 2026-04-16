const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 15;
const ipHits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): {
  ok: boolean;
  resetIn: number;
} {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, resetIn: WINDOW_MS };
  }
  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, resetIn: entry.resetAt - now };
  }
  entry.count += 1;
  return { ok: true, resetIn: entry.resetAt - now };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
