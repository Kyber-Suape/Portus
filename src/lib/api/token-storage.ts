const TOKEN_KEY = "rdo-suape:token";

/**
 * Acesso ao token JWT persistido. Protegido contra SSR (sem `window`).
 * `persist=true` (padrão, "Manter conectado") grava em `localStorage`; `false` usa
 * `sessionStorage`, válido só enquanto a aba estiver aberta.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, persist = true): void {
  if (typeof window === "undefined") return;
  clearToken();
  (persist ? window.localStorage : window.sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
}
