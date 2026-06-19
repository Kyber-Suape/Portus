"use client";

import { useCallback, useEffect, useState } from "react";
import { worksService } from "@/services/works.service";
import type {
  AddWorkAdditiveInput,
  AddWorkDocumentInput,
  AddWorkTeamMemberInput,
  CreateWorkInput,
  UpdateWorkInput,
  UpdateWorkTeamMemberInput,
  Work,
} from "@/types/work";

/** Carrega e gerencia mutações de uma obra (dados gerais, equipe, documentos, aditivos). Passe `id: null` para um hook "apenas mutações" (ex.: a tela /obras/nova). */
export function useWork(id: string | null) {
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchWork = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await worksService.getById(id);
      setWork(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar a obra.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchWork();
    });
  }, [id, fetchWork]);

  const create = useCallback(async (payload: CreateWorkInput) => {
    setIsSaving(true);
    try {
      const result = await worksService.create(payload);
      setWork(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const update = useCallback(async (workId: string, payload: UpdateWorkInput) => {
    setIsSaving(true);
    try {
      const result = await worksService.update(workId, payload);
      setWork(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const remove = useCallback(async (workId: string) => {
    await worksService.remove(workId);
  }, []);

  const addTeamMember = useCallback(async (workId: string, payload: AddWorkTeamMemberInput) => {
    const member = await worksService.addTeamMember(workId, payload);
    setWork((prev) => (prev ? { ...prev, team: [...prev.team, member] } : prev));
    return member;
  }, []);

  const updateTeamMember = useCallback(async (workId: string, memberId: string, payload: UpdateWorkTeamMemberInput) => {
    const member = await worksService.updateTeamMember(workId, memberId, payload);
    setWork((prev) => (prev ? { ...prev, team: prev.team.map((m) => (m.id === memberId ? member : m)) } : prev));
    return member;
  }, []);

  const removeTeamMember = useCallback(async (workId: string, memberId: string) => {
    await worksService.removeTeamMember(workId, memberId);
    setWork((prev) =>
      prev ? { ...prev, team: prev.team.map((m) => (m.id === memberId ? { ...m, status: "REMOVED" as const } : m)) } : prev,
    );
  }, []);

  const addDocument = useCallback(async (workId: string, payload: AddWorkDocumentInput) => {
    const document = await worksService.addDocument(workId, payload);
    setWork((prev) => (prev ? { ...prev, documents: [...prev.documents, document] } : prev));
    return document;
  }, []);

  const removeDocument = useCallback(async (workId: string, documentId: string) => {
    await worksService.removeDocument(workId, documentId);
    setWork((prev) => (prev ? { ...prev, documents: prev.documents.filter((d) => d.id !== documentId) } : prev));
  }, []);

  const addAdditive = useCallback(async (workId: string, payload: AddWorkAdditiveInput) => {
    const additive = await worksService.addAdditive(workId, payload);
    setWork((prev) => (prev ? { ...prev, additives: [...prev.additives, additive] } : prev));
    return additive;
  }, []);

  return {
    work,
    isLoading,
    error,
    isSaving,
    create,
    update,
    remove,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    addDocument,
    removeDocument,
    addAdditive,
    refetch: fetchWork,
    setWork,
  };
}
