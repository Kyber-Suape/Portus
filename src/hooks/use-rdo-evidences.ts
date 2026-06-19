"use client";

import { useCallback, useEffect, useState } from "react";
import { rdosService } from "@/services/rdos.service";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/hooks/use-auth";
import type { EvidenceUploadMeta, RdoAuthorSummary, RdoEvidence, UpdateEvidenceRequest } from "@/types/rdo";

export function useRdoEvidences(rdoId: string | null) {
  const { user } = useAuth();
  const actor: RdoAuthorSummary | null = user ? { id: user.id, name: user.name, role: user.role } : null;
  const [evidences, setEvidences] = useState<RdoEvidence[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(rdoId));
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchEvidences = useCallback(async () => {
    if (!rdoId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await rdosService.listEvidences(rdoId);
      setEvidences(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar as evidências.");
    } finally {
      setIsLoading(false);
    }
  }, [rdoId]);

  useEffect(() => {
    if (!rdoId) return;
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchEvidences();
    });
  }, [rdoId, fetchEvidences]);

  const upload = useCallback(
    async (file: File, meta: EvidenceUploadMeta) => {
      if (!rdoId) throw new Error("RDO ainda não foi criado.");
      setIsUploading(true);
      try {
        const evidence = await rdosService.uploadEvidence(rdoId, file, meta, actor);
        setEvidences((prev) => [...prev, evidence]);
        return evidence;
      } finally {
        setIsUploading(false);
      }
    },
    [rdoId, actor],
  );

  const update = useCallback(
    async (evidenceId: string, payload: UpdateEvidenceRequest) => {
      if (!rdoId) throw new Error("RDO ainda não foi criado.");
      const updated = await rdosService.updateEvidence(rdoId, evidenceId, payload, actor);
      setEvidences((prev) => prev.map((e) => (e.id === evidenceId ? updated : e)));
      return updated;
    },
    [rdoId, actor],
  );

  const remove = useCallback(
    async (evidenceId: string) => {
      if (!rdoId) throw new Error("RDO ainda não foi criado.");
      await rdosService.deleteEvidence(rdoId, evidenceId);
      setEvidences((prev) => prev.filter((e) => e.id !== evidenceId));
    },
    [rdoId],
  );

  return { evidences, isLoading, error, isUploading, upload, update, remove, refetch: fetchEvidences };
}
