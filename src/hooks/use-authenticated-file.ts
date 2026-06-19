"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api/client";
import { getToken } from "@/lib/api/token-storage";

/**
 * Busca um arquivo autenticado (ex.: evidência de RDO) e expõe uma Object URL local —
 * necessário porque `<img src>`/`<video src>` não enviam o header Authorization, e o
 * download de evidências nunca é exposto via diretório estático público.
 */
export function useAuthenticatedFileUrl(path: string | null): { url: string | null; isLoading: boolean } {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      if (cancelled) return;

      if (!path) {
        setUrl(null);
        return;
      }

      setIsLoading(true);
      const token = getToken();
      void fetch(`${API_BASE_URL}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
        .then((response) => response.blob())
        .then((blob) => {
          if (cancelled) return;
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        })
        .catch(() => {
          if (!cancelled) setUrl(null);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return { url, isLoading };
}
