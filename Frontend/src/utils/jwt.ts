function base64UrlToBase64(input: string) {
  let output = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = output.length % 4;

  if (pad) {
    output += "=".repeat(4 - pad);
  }

  return output;
}

export function decodeJwtPayload<T extends Record<string, unknown> = Record<string, unknown>>(
  token: string
): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payload = parts[1];
    const decoded = atob(base64UrlToBase64(payload));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}