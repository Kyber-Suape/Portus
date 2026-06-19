"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { PermissionsChecklist } from "@/components/permissoes/permissions-checklist";
import { usePermissionsCatalog } from "@/hooks/use-permissions-catalog";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/types/user";

interface PermissionsModalProps {
  user: User;
  onClose: () => void;
}

/** Renderizado condicionalmente pelo pai (ex.: `{permissionsTarget && <PermissionsModal key={...} .../>}`). */
export function PermissionsModal({ user, onClose }: PermissionsModalProps) {
  const { catalog, isLoading: isCatalogLoading } = usePermissionsCatalog();
  const { isLoading, error, isSaving, fetchPermissions, save } = useUserPermissions(user.id);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void fetchPermissions().then((result) => {
        setSelectedKeys(new Set(result.filter((p) => p.granted).map((p) => p.key)));
      });
    });
  }, [fetchPermissions]);

  function toggleKey(key: string) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleSave() {
    setSaveError(null);
    try {
      await save(Array.from(selectedKeys));
      onClose();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Não foi possível salvar as permissões.");
    }
  }

  const isBusy = isLoading || isCatalogLoading;

  return (
    <Modal
      open
      onClose={onClose}
      title={`Permissões de ${user.name}`}
      description="Marque as permissões que este usuário deve ter. As alterações substituem o padrão do perfil."
    >
      {isBusy ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      ) : error ? (
        <Alert tone="danger">{error}</Alert>
      ) : (
        <div className="flex flex-col gap-4">
          {saveError && <Alert tone="danger">{saveError}</Alert>}
          <div className="max-h-[50vh] overflow-y-auto pr-1">
            <PermissionsChecklist catalog={catalog} selectedKeys={selectedKeys} onToggle={toggleKey} />
          </div>
          <div className="flex justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" loading={isSaving} onClick={handleSave}>
              Salvar permissões
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
