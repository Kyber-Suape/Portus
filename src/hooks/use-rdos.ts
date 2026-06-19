"use client";

import { useCallback, useEffect, useState } from "react";
import { rdosService } from "@/services/rdos.service";
import { ApiError } from "@/lib/api/client";
import type { PaginatedData } from "@/types/api";
import type { ListRdosQuery, RdoSummary } from "@/types/rdo";

const DEFAULT_QUERY: ListRdosQuery = { page: 1, pageSize: 20 };

export function useRdos(initialQuery: ListRdosQuery = DEFAULT_QUERY) {
  const [query, setQuery] = useState<ListRdosQuery>(initialQuery);
  const [data, setData] = useState<PaginatedData<RdoSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRdos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await rdosService.list(query);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar os RDOs.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchRdos();
    });
  }, [fetchRdos]);

  return {
    rdos: data?.items ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    query,
    setQuery,
    refetch: fetchRdos,
  };
}
