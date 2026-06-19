"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Settings2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { PermissionsChecklist } from "@/components/permissoes/permissions-checklist";
import { permissionsService } from "@/services/permissions.service";
import type { PermissionSummary } from "@/types/permissions";
import type { UserRole } from "@/types/user";

export interface PermissionCustomizationToggleProps {
  role: UserRole | "";
  catalog: PermissionSummary[];
  permissionKeys: string[] | undefined;
  onChange: (permissionKeys: string[] | undefined) => void;
}

/**
 * Permite customizar as permissões de um usuário no momento da criação (Cadastro ou
 * Gestão de Usuários). Desativado, o usuário usa o padrão de permissões do perfil escolhido.
 * Trocar o perfil enquanto a customização está ativa reaplica os defaults do novo perfil —
 * a seleção antiga pertencia a outro perfil e não deve "sobreviver" à troca.
 */
export function PermissionCustomizationToggle({
  role,
  catalog,
  permissionKeys,
  onChange,
}: PermissionCustomizationToggleProps) {
  const [isCustomizing, setIsCustomizing] = useState(permissionKeys !== undefined);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);
  const previousRoleRef = useRef(role);

  const applyRoleDefaults = useCallback(
    async (targetRole: UserRole) => {
      setIsLoadingDefaults(true);
      try {
        const { permissionKeys: defaults } = await permissionsService.getRoleDefaults(targetRole);
        onChange(defaults);
      } finally {
        setIsLoadingDefaults(false);
      }
    },
    [onChange],
  );

  useEffect(() => {
    const roleChanged = role !== previousRoleRef.current;
    previousRoleRef.current = role;
    if (!isCustomizing || !roleChanged || !role) return;

    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void applyRoleDefaults(role);
    });
  }, [role, isCustomizing, applyRoleDefaults]);

  async function handleToggle() {
    if (isCustomizing) {
      setIsCustomizing(false);
      onChange(undefined);
      return;
    }

    setIsCustomizing(true);
    if (role) await applyRoleDefaults(role);
  }

  function toggleKey(key: string) {
    const current = new Set(permissionKeys ?? []);
    if (current.has(key)) current.delete(key);
    else current.add(key);
    onChange(Array.from(current));
  }

  return (
    <div className="rounded-lg border border-border p-3">
      <label className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Settings2 className="size-4" aria-hidden="true" />
          Personalizar permissões
        </span>
        <input
          type="checkbox"
          role="switch"
          aria-checked={isCustomizing}
          aria-label="Personalizar permissões"
          checked={isCustomizing}
          onChange={handleToggle}
          disabled={!role}
          className="focus-ring size-4 accent-(--color-primary-600)"
        />
      </label>

      {!role && (
        <p className="mt-1 text-xs text-muted-foreground">
          Selecione um perfil para personalizar as permissões.
        </p>
      )}

      {isCustomizing && role && (
        isLoadingDefaults ? (
          <div className="flex justify-center py-4">
            <Spinner className="size-5" />
          </div>
        ) : (
          <div className="mt-3 max-h-64 overflow-y-auto pr-1">
            <PermissionsChecklist
              catalog={catalog}
              selectedKeys={new Set(permissionKeys ?? [])}
              onToggle={toggleKey}
            />
          </div>
        )
      )}
    </div>
  );
}
