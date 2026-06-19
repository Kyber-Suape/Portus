"use client";

import { useCallback, useState } from "react";
import { permissionsService } from "@/services/permissions.service";
import { ApiError } from "@/lib/api/client";
import type { UserPermissionDetail } from "@/types/permissions";

/** Busca e atualiza as permissões efetivas de um usuário específico (modal de Permissões na Gestão de Usuários). */
export function useUserPermissions(userId: string) {
  const [data, setData] = useState<UserPermissionDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await permissionsService.getUserPermissions(userId);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar as permissões.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const save = useCallback(
    async (permissionKeys: string[]) => {
      setIsSaving(true);
      try {
        const result = await permissionsService.updateUserPermissions(userId, permissionKeys);
        setData(result);
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [userId],
  );

  return { data, isLoading, error, isSaving, fetchPermissions, save };
}
