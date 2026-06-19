"use client";

import { useCallback, useEffect, useState } from "react";
import { rdosService } from "@/services/rdos.service";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/hooks/use-auth";
import type {
  CreateCommentRequest,
  CreateRdoRequest,
  Rdo,
  RdoAuthorSummary,
  ReopenRdoRequest,
  ReviewActionRequest,
  UpdateRdoRequest,
} from "@/types/rdo";

/** Carrega e gerencia mutações de um único RDO. Passe `id: null` para um hook "apenas mutações" (ex.: a página /rdos/novo antes de criar). */
export function useRdo(id: string | null) {
  const { user } = useAuth();
  const [rdo, setRdo] = useState<Rdo | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  /** Os mocks de RDO simulam autoria/revisão com o usuário autenticado real (login continua via API). */
  const actor: RdoAuthorSummary | null = user ? { id: user.id, name: user.name, role: user.role } : null;

  const fetchRdo = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await rdosService.getById(id);
      setRdo(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar o RDO.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchRdo();
    });
  }, [id, fetchRdo]);

  const create = useCallback(async (payload: CreateRdoRequest) => {
    setIsSaving(true);
    try {
      const result = await rdosService.create(payload, actor);
      setRdo(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, [actor]);

  const update = useCallback(async (rdoId: string, payload: UpdateRdoRequest) => {
    setIsSaving(true);
    try {
      const result = await rdosService.update(rdoId, payload);
      setRdo(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const remove = useCallback(async (rdoId: string) => {
    await rdosService.remove(rdoId);
  }, []);

  const submit = useCallback(async (rdoId: string) => {
    const result = await rdosService.submit(rdoId, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const externalApprove = useCallback(async (rdoId: string, payload?: ReviewActionRequest) => {
    const result = await rdosService.externalApprove(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const externalReject = useCallback(async (rdoId: string, payload: ReviewActionRequest) => {
    const result = await rdosService.externalReject(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const suapeApprove = useCallback(async (rdoId: string, payload?: ReviewActionRequest) => {
    const result = await rdosService.suapeApprove(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const suapeReject = useCallback(async (rdoId: string, payload: ReviewActionRequest) => {
    const result = await rdosService.suapeReject(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const reopen = useCallback(async (rdoId: string, payload?: ReopenRdoRequest) => {
    const result = await rdosService.reopen(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const addComment = useCallback(async (rdoId: string, payload: CreateCommentRequest) => {
    const comment = await rdosService.addComment(rdoId, payload, actor);
    setRdo((prev) => (prev ? { ...prev, comments: [...prev.comments, comment] } : prev));
    return comment;
  }, [actor]);

  return {
    rdo,
    isLoading,
    error,
    isSaving,
    create,
    update,
    remove,
    submit,
    externalApprove,
    externalReject,
    suapeApprove,
    suapeReject,
    reopen,
    addComment,
    refetch: fetchRdo,
    setRdo,
  };
}
