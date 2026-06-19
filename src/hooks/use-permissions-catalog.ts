"use client";

import { useCallback, useEffect, useState } from "react";
import { permissionsService } from "@/services/permissions.service";
import type { PermissionSummary } from "@/types/permissions";

/** Catálogo completo de permissões (endpoint público) — usado pelo Cadastro e pela Gestão de Usuários. */
export function usePermissionsCatalog() {
  const [catalog, setCatalog] = useState<PermissionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await permissionsService.getCatalog();
      setCatalog(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchCatalog();
    });
  }, [fetchCatalog]);

  return { catalog, isLoading };
}
