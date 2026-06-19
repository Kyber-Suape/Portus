"use client";

import { useCallback, useEffect, useState } from "react";
import { usersService } from "@/services/users.service";
import { ApiError } from "@/lib/api/client";
import type { PaginatedData } from "@/types/api";
import type { CreateUserRequest, ListUsersQuery, UpdateUserRequest, User } from "@/types/user";

const DEFAULT_QUERY: ListUsersQuery = { page: 1, pageSize: 20 };

export function useUsers(initialQuery: ListUsersQuery = DEFAULT_QUERY) {
  const [query, setQuery] = useState<ListUsersQuery>(initialQuery);
  const [data, setData] = useState<PaginatedData<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await usersService.list(query);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar os usuários.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchUsers();
    });
  }, [fetchUsers]);

  const createUser = useCallback(
    async (payload: CreateUserRequest) => {
      setIsMutating(true);
      try {
        const user = await usersService.create(payload);
        await fetchUsers();
        return user;
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers],
  );

  const updateUser = useCallback(
    async (id: string, payload: UpdateUserRequest) => {
      setIsMutating(true);
      try {
        const user = await usersService.update(id, payload);
        await fetchUsers();
        return user;
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      setIsMutating(true);
      try {
        await usersService.remove(id);
        await fetchUsers();
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers],
  );

  return {
    users: data?.items ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    query,
    setQuery,
    createUser,
    updateUser,
    deleteUser,
    isMutating,
    refetch: fetchUsers,
  };
}
