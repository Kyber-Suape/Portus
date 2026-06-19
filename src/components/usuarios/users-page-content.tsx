"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useUsers } from "@/hooks/use-users";
import { ApiError } from "@/lib/api/client";
import { UsersFilters } from "@/components/usuarios/users-filters";
import { UsersTable } from "@/components/usuarios/users-table";
import { UserFormModal } from "@/components/usuarios/user-form-modal";
import { DeleteUserModal } from "@/components/usuarios/delete-user-modal";
import { PermissionsModal } from "@/components/usuarios/permissions-modal";
import type { CreateUserRequest, UpdateUserRequest, User, UserRole, UserStatus } from "@/types/user";

type FormModalState = { mode: "create" } | { mode: "edit"; user: User } | null;

export function UsersPageContent() {
  const { user: currentUser } = useAuth();
  const { can } = usePermissions();
  const { users, meta, isLoading, error, setQuery, createUser, updateUser, deleteUser, isMutating } =
    useUsers();

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");

  const [formModal, setFormModal] = useState<FormModalState>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [permissionsTarget, setPermissionsTarget] = useState<User | null>(null);

  const visibleUsers = users.filter((u) => u.id !== currentUser?.id);

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      q: q.trim() || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    }));
  }, [q, roleFilter, statusFilter, setQuery]);

  if (!can("users:read")) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Acesso restrito"
        description="Você não tem permissão para visualizar os usuários da organização."
      />
    );
  }

  async function handleFormSubmit(payload: CreateUserRequest | UpdateUserRequest) {
    setFormError(null);
    try {
      if (formModal?.mode === "edit") {
        await updateUser(formModal.user.id, payload as UpdateUserRequest);
      } else {
        await createUser(payload as CreateUserRequest);
      }
      setFormModal(null);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Não foi possível salvar o usuário.");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Não foi possível remover o usuário.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Convide, edite e remova usuários da sua organização.
          </p>
        </div>
        {can("users:create") && (
          <Button onClick={() => setFormModal({ mode: "create" })}>
            <UserPlus className="size-4" aria-hidden="true" />
            Adicionar usuário
          </Button>
        )}
      </div>

      <Card className="p-4">
        <UsersFilters
          q={q}
          role={roleFilter}
          status={statusFilter}
          onChangeQ={setQ}
          onChangeRole={setRoleFilter}
          onChangeStatus={setStatusFilter}
        />
      </Card>

      <Card className="overflow-hidden p-0">
        <UsersTable
          users={visibleUsers}
          isLoading={isLoading}
          error={error}
          canEdit={can("users:update")}
          canDelete={can("users:delete")}
          canManagePermissions={can("permissions:update")}
          onEdit={(targetUser) => setFormModal({ mode: "edit", user: targetUser })}
          onDelete={setDeleteTarget}
          onManagePermissions={setPermissionsTarget}
        />
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {meta.page} de {meta.totalPages} ({meta.total} usuários)
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => setQuery((prev) => ({ ...prev, page: meta.page - 1 }))}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setQuery((prev) => ({ ...prev, page: meta.page + 1 }))}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {formModal && (
        <UserFormModal
          key={formModal.mode === "edit" ? formModal.user.id : "create"}
          mode={formModal.mode}
          user={formModal.mode === "edit" ? formModal.user : undefined}
          onClose={() => {
            setFormModal(null);
            setFormError(null);
          }}
          onSubmit={handleFormSubmit}
          isSubmitting={isMutating}
          submitError={formError}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          key={deleteTarget.id}
          user={deleteTarget}
          onClose={() => {
            setDeleteTarget(null);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteConfirm}
          isDeleting={isMutating}
          error={deleteError}
        />
      )}

      {permissionsTarget && (
        <PermissionsModal
          key={permissionsTarget.id}
          user={permissionsTarget}
          onClose={() => setPermissionsTarget(null)}
        />
      )}
    </div>
  );
}
