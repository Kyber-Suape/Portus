"use client";

import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api/client";
import type { MeResponse } from "@/types/auth";

/** Busca `GET /auth/me` sob demanda — útil para revalidar a sessão manualmente fora do AuthProvider. */
export function useCurrentUser() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.me();
      setData(response);
      return response;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar os dados do usuário.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetchMe };
}
