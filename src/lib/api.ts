const JSON_CT = { 'Content-Type': 'application/json' };

export function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...JSON_CT, ...(init?.headers ?? {}) },
  });
}

export function jsonError(message: string, status: number): Response {
  return jsonResponse({ error: message }, { status });
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function byPublishDateDesc(a: { publishDate: string }, b: { publishDate: string }): number {
  return b.publishDate.localeCompare(a.publishDate);
}
