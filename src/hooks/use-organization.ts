"use client";

import { useCallback, useEffect, useState } from "react";
import { organizationsService } from "@/services/organizations.service";
import { ApiError } from "@/lib/api/client";
import type { Organization, UpdateOrganizationRequest } from "@/types/organization";

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrganization = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await organizationsService.getMine();
      setOrganization(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar a organização.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchOrganization();
    });
  }, [fetchOrganization]);

  const update = useCallback(async (payload: UpdateOrganizationRequest) => {
    setIsUpdating(true);
    try {
      const data = await organizationsService.updateMine(payload);
      setOrganization(data);
      return data;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { organization, isLoading, error, update, isUpdating, refetch: fetchOrganization };
}
