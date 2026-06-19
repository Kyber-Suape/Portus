"use client";

import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api/client";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const submit = useCallback(async (payload: RegisterRequest): Promise<RegisterResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await authService.register(payload);
    } catch (err) {
      const apiError =
        err instanceof ApiError ? err : new ApiError(0, "Não foi possível concluir o cadastro.");
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { register: submit, isLoading, error };
}
