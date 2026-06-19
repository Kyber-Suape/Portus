"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Checagem de permissões no front — apenas UX (esconder/desabilitar ações). A
 * autorização real é sempre validada pelo backend (`requirePermission`).
 */
export function usePermissions() {
  const { permissions } = useAuth();

  return useMemo(() => {
    const set = new Set(permissions);
    return {
      permissions,
      can: (key: string) => set.has(key),
      canAny: (keys: string[]) => keys.some((key) => set.has(key)),
      canAll: (keys: string[]) => keys.every((key) => set.has(key)),
    };
  }, [permissions]);
}
