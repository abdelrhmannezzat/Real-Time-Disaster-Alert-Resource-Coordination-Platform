export function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function toWebSocketUrl(httpBase: string, path: string) {
  const url = new URL(httpBase);
  const scheme = url.protocol === "https:" ? "wss:" : "ws:";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${scheme}//${url.host}${normalizedPath}`;
}

export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}