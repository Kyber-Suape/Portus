import { Search } from "lucide-react";
import { ROLE_LABELS } from "@/constants/roles";
import { USER_STATUS_CONFIG } from "@/constants/status";
import type { UserRole, UserStatus } from "@/types/user";

interface UsersFiltersProps {
  q: string;
  role: UserRole | "";
  status: UserStatus | "";
  onChangeQ: (value: string) => void;
  onChangeRole: (value: UserRole | "") => void;
  onChangeStatus: (value: UserStatus | "") => void;
}

export function UsersFilters({ q, role, status, onChangeQ, onChangeRole, onChangeStatus }: UsersFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="usuarios-busca" className="sr-only">
          Buscar por nome ou e-mail
        </label>
        <input
          id="usuarios-busca"
          type="search"
          placeholder="Buscar por nome ou e-mail..."
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
          className="focus-ring h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground"
        />
      </div>

      <select
        aria-label="Filtrar por perfil"
        value={role}
        onChange={(e) => onChangeRole(e.target.value as UserRole | "")}
        className="focus-ring h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
      >
        <option value="">Todos os perfis</option>
        {Object.entries(ROLE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por status"
        value={status}
        onChange={(e) => onChangeStatus(e.target.value as UserStatus | "")}
        className="focus-ring h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
      >
        <option value="">Todos os status</option>
        {Object.entries(USER_STATUS_CONFIG).map(([value, config]) => (
          <option key={value} value={value}>
            {config.label}
          </option>
        ))}
      </select>
    </div>
  );
}
