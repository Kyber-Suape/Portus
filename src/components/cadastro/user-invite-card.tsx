import { Trash2, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { PermissionCustomizationToggle } from "@/components/permissoes/permission-customization-toggle";
import { VINCULO_OPTIONS } from "@/constants/roles";
import { formatPhoneInput } from "@/lib/validators";
import type { PermissionSummary } from "@/types/permissions";
import type { UsuarioConvidado, UsuarioConvidadoErrors } from "@/types/cadastro";

export interface UserInviteCardProps {
  index: number;
  usuario: UsuarioConvidado;
  errors?: UsuarioConvidadoErrors;
  catalog: PermissionSummary[];
  onChange: <K extends keyof Omit<UsuarioConvidado, "id">>(
    field: K,
    value: UsuarioConvidado[K],
  ) => void;
  onRemove: () => void;
}

export function UserInviteCard({ index, usuario, errors, catalog, onChange, onRemove }: UserInviteCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold text-primary-900">
          <UserRound className="size-4" aria-hidden="true" />
          Usuário {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover usuário ${index + 1}`}
          className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nome"
          placeholder="Nome completo"
          value={usuario.nome}
          onChange={(e) => onChange("nome", e.target.value)}
          error={errors?.nome}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="nome@empresa.com.br"
          value={usuario.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors?.email}
        />
        <MaskedInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          mask={formatPhoneInput}
          value={usuario.telefone}
          onValueChange={(value) => onChange("telefone", value)}
          error={errors?.telefone}
        />
        <Select
          label="Função / Perfil"
          placeholder="Selecione o perfil..."
          options={VINCULO_OPTIONS}
          value={usuario.perfil}
          onChange={(e) => onChange("perfil", e.target.value as UsuarioConvidado["perfil"])}
          error={errors?.perfil}
        />
        <PasswordInput
          label="Senha de acesso"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          value={usuario.senha}
          onChange={(e) => onChange("senha", e.target.value)}
          error={errors?.senha}
        />
        <PasswordInput
          label="Confirmar senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={usuario.confirmarSenha}
          onChange={(e) => onChange("confirmarSenha", e.target.value)}
          error={errors?.confirmarSenha}
        />
        <div className="sm:col-span-2">
          <PermissionCustomizationToggle
            role={usuario.perfil}
            catalog={catalog}
            permissionKeys={usuario.permissionKeys}
            onChange={(keys) => onChange("permissionKeys", keys)}
          />
        </div>
      </div>
    </div>
  );
}
