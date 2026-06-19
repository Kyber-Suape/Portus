"use client";

import { useCallback, useEffect, useState } from "react";
import { worksService } from "@/services/works.service";
import type { ListWorksQuery, Work } from "@/types/work";

const DEFAULT_QUERY: ListWorksQuery = {};

export function useWorks(initialQuery: ListWorksQuery = DEFAULT_QUERY) {
  const [query, setQuery] = useState<ListWorksQuery>(initialQuery);
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await worksService.list(query);
      setWorks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as obras.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchWorks();
    });
  }, [fetchWorks]);

  return { works, isLoading, error, query, setQuery, refetch: fetchWorks };
}
