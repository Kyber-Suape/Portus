"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";

export function useLogin() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (email: string, password: string, remember = true) => {
      setIsLoading(true);
      setError(null);
      try {
        await login({ email, password }, remember);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  return { login: submit, isLoading, error };
}
