"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { clearToken, getToken, setToken } from "@/lib/api/token-storage";
import { setUnauthorizedHandler } from "@/lib/api/client";
import type { Organization } from "@/types/organization";
import type { User } from "@/types/user";
import type { LoginRequest, UpdateMeInput } from "@/types/auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  organization: Organization | null;
  permissions: string[];
  login: (payload: LoginRequest, remember?: boolean) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  updateProfile: (payload: UpdateMeInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const clearSession = useCallback(() => {
    clearToken();
    setUser(null);
    setOrganization(null);
    setPermissions([]);
    setStatus("unauthenticated");
  }, []);

  const refreshSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    try {
      const { user: me, organization: myOrganization, permissions: myPermissions } = await authService.me();
      setUser(me);
      setOrganization(myOrganization);
      setPermissions(myPermissions);
      setStatus("authenticated");
    } catch {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    // Adiado para um microtask: chamar refreshSession() diretamente aqui dispararia
    // setState de forma síncrona dentro do efeito (ex.: o branch "sem token").
    queueMicrotask(() => {
      void refreshSession();
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession, refreshSession]);

  const login = useCallback(async (payload: LoginRequest, remember = true) => {
    const { token } = await authService.login(payload);
    setToken(token, remember);
    await refreshSession();
  }, [refreshSession]);

  const updateProfile = useCallback(async (payload: UpdateMeInput) => {
    const updated = await authService.updateMe(payload);
    setUser(updated);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, organization, permissions, login, logout: clearSession, refreshSession, updateProfile }),
    [status, user, organization, permissions, login, clearSession, refreshSession, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
