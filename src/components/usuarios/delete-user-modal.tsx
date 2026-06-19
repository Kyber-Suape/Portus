"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import type { User } from "@/types/user";

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  error?: string | null;
}

/** Renderizado condicionalmente pelo pai (ex.: `{deleteTarget && <DeleteUserModal user={deleteTarget} .../>}`). */
export function DeleteUserModal({ user, onClose, onConfirm, isDeleting, error }: DeleteUserModalProps) {
  return (
    <Modal open onClose={onClose} title="Remover usuário">
      <div className="flex flex-col gap-4">
        {error && <Alert tone="danger">{error}</Alert>}
        <p className="text-sm text-foreground">
          Tem certeza de que deseja remover <span className="font-semibold">{user.name}</span> da
          organização? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" loading={isDeleting} onClick={onConfirm}>
            Remover
          </Button>
        </div>
      </div>
    </Modal>
  );
}
