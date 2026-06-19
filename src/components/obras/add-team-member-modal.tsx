"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { SearchSelect } from "@/components/ui/search-select";
import { useUsers } from "@/hooks/use-users";
import { WORK_FUNCTION_OPTIONS } from "@/constants/work-functions";
import type { Work } from "@/types/work";

interface AddTeamMemberModalProps {
  work: Work;
  onClose: () => void;
  onAdd: (input: { userId: string; userName: string; userEmail: string; function: string }) => Promise<unknown>;
}

/** Vincula um usuário real (já cadastrado na organização) à equipe mockada da obra. */
export function AddTeamMemberModal({ work, onClose, onAdd }: AddTeamMemberModalProps) {
  const { users, isLoading } = useUsers({ page: 1, pageSize: 100 });
  const [userId, setUserId] = useState("");
  const [fn, setFn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const linkedIds = new Set(work.team.filter((m) => m.status !== "REMOVED").map((m) => m.userId));
  const userOptions = users
    .filter((u) => !linkedIds.has(u.id))
    .map((u) => ({ value: u.id, label: u.name, description: u.email }));

  async function handleSubmit() {
    const user = users.find((u) => u.id === userId);
    if (!user || !fn) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onAdd({ userId: user.id, userName: user.name, userEmail: user.email, function: fn });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível adicionar o membro.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Adicionar membro à equipe" description="Busque um usuário já cadastrado na organização e defina sua função nesta obra.">
      <div className="flex flex-col gap-4">
        {error && <Alert tone="danger">{error}</Alert>}
        <SearchSelect
          label="Usuário"
          required
          placeholder={isLoading ? "Carregando usuários..." : "Buscar por nome ou e-mail..."}
          searchPlaceholder="Buscar por nome ou e-mail..."
          options={userOptions}
          value={userId}
          onChange={setUserId}
          emptyMessage="Nenhum usuário disponível para vincular."
        />
        <SearchSelect
          label="Função na obra"
          required
          placeholder="Selecione a função..."
          searchPlaceholder="Buscar função..."
          options={WORK_FUNCTION_OPTIONS}
          value={fn}
          onChange={setFn}
        />
        <div className="flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" disabled={!userId || !fn} loading={isSubmitting} onClick={handleSubmit}>
            Adicionar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
