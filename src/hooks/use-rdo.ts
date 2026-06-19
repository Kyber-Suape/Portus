"use client";

import { useCallback, useEffect, useState } from "react";
import { rdosService } from "@/services/rdos.service";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/hooks/use-auth";
import type {
  ApproveStepRequest,
  CreateCommentRequest,
  CreateRdoRequest,
  Rdo,
  RdoAuthorSummary,
  RejectStepRequest,
  ReopenRdoRequest,
  RequestChangesStepRequest,
  SignStepRequest,
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

  const approveStep = useCallback(async (rdoId: string, payload?: ApproveStepRequest) => {
    const result = await rdosService.approveStep(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const rejectStep = useCallback(async (rdoId: string, payload: RejectStepRequest) => {
    const result = await rdosService.rejectStep(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const requestChangesStep = useCallback(async (rdoId: string, payload: RequestChangesStepRequest) => {
    const result = await rdosService.requestChangesStep(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const signStep = useCallback(async (rdoId: string, payload: SignStepRequest) => {
    const result = await rdosService.signStep(rdoId, payload, actor);
    setRdo(result);
    return result;
  }, [actor]);

  const reopen = useCallback(async (rdoId: string, payload: ReopenRdoRequest) => {
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
    approveStep,
    rejectStep,
    requestChangesStep,
    signStep,
    reopen,
    addComment,
    refetch: fetchRdo,
    setRdo,
  };
}
