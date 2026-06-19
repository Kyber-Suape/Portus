import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { UserInviteCard } from "@/components/cadastro/user-invite-card";
import { usePermissionsCatalog } from "@/hooks/use-permissions-catalog";
import type { UsuarioConvidado, UsuarioConvidadoErrors } from "@/types/cadastro";

export interface StepUsuariosProps {
  usuarios: UsuarioConvidado[];
  usuarioErrors: Record<string, UsuarioConvidadoErrors>;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdateUsuario: <K extends keyof Omit<UsuarioConvidado, "id">>(
    id: string,
    field: K,
    value: UsuarioConvidado[K],
  ) => void;
}

export function StepUsuarios({ usuarios, usuarioErrors, onAdd, onRemove, onUpdateUsuario }: StepUsuariosProps) {
  const { catalog } = usePermissionsCatalog();

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-bold text-primary-900">3. Usuários da Organização</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Convide já as pessoas que vão usar a plataforma — você pode pular esta etapa e
          adicionar usuários depois, como Administrador do Sistema.
        </p>
      </div>

      {usuarios.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum usuário adicionado ainda"
          description="Clique em “Adicionar usuário” para convidar sua equipe agora, ou pule esta etapa e faça isso depois."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {usuarios.map((usuario, index) => (
            <UserInviteCard
              key={usuario.id}
              index={index}
              usuario={usuario}
              errors={usuarioErrors[usuario.id]}
              catalog={catalog}
              onChange={(field, value) => onUpdateUsuario(usuario.id, field, value)}
              onRemove={() => onRemove(usuario.id)}
            />
          ))}
        </div>
      )}

      <Button type="button" variant="outline" onClick={onAdd} className="self-start">
        <UserPlus className="size-4" aria-hidden="true" />
        Adicionar usuário
      </Button>
    </div>
  );
}
