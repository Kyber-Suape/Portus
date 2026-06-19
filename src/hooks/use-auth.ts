"use client";

import { useAuthContext } from "@/context/auth-context";

/**
 * Sessão real (token + usuário + organização), restaurada via `GET /auth/me`.
 * Mantém a mesma API usada hoje por `Topbar`/`SidebarFooter` (`logout()`).
 */
export function useAuth() {
  return useAuthContext();
}
