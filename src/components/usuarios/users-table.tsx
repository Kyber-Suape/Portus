import { Pencil, ShieldCheck, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { ROLE_LABELS } from "@/constants/roles";
import { USER_STATUS_CONFIG } from "@/constants/status";
import { getInitials } from "@/lib/format";
import type { User } from "@/types/user";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  canEdit: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onManagePermissions: (user: User) => void;
}

export function UsersTable({
  users,
  isLoading,
  error,
  canEdit,
  canDelete,
  canManagePermissions,
  onEdit,
  onDelete,
  onManagePermissions,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-7" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Users}
        title="Não foi possível carregar os usuários"
        description={error}
      />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum usuário encontrado"
        description="Convide um novo usuário ou ajuste os filtros aplicados."
      />
    );
  }

  function renderActions(user: User) {
    return (
      <div className="flex justify-end gap-1.5">
        {canEdit && (
          <button
            type="button"
            onClick={() => onEdit(user)}
            aria-label={`Editar ${user.name}`}
            className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
        )}
        {canManagePermissions && (
          <button
            type="button"
            onClick={() => onManagePermissions(user)}
            className="focus-ring flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            {/* Permissões */}
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(user)}
            aria-label={`Remover ${user.name}`}
            className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-muted-foreground">
              <th className="p-3">Nome</th>
              <th className="p-3">Perfil</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-background/60">
                <td className="p-3 align-top">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold text-muted-foreground">
                      {getInitials(user.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 align-top text-sm text-foreground">{ROLE_LABELS[user.role]}</td>
                <td className="p-3 align-top">
                  <Badge tone={USER_STATUS_CONFIG[user.status].tone}>
                    {USER_STATUS_CONFIG[user.status].label}
                  </Badge>
                </td>
                <td className="p-3 text-right align-top">{renderActions(user)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <li key={user.id} className="rounded-lg border border-border p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold text-muted-foreground">
                  {getInitials(user.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge tone={USER_STATUS_CONFIG[user.status].tone}>
                {USER_STATUS_CONFIG[user.status].label}
              </Badge>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</span>
              {renderActions(user)}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
