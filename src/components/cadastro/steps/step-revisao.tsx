import { ShieldCheck, Building2, MapPin, UserCog, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ReviewSection } from "@/components/cadastro/review-section";
import { ROLE_LABELS } from "@/constants/roles";
import { ORGANIZACAO_TIPO_OPTIONS } from "@/constants/cadastro";
import type { CadastroStepProps } from "@/components/cadastro/steps/types";

export function StepRevisao({ values, errors, onChange }: CadastroStepProps) {
  const tipoLabel = ORGANIZACAO_TIPO_OPTIONS.find((o) => o.value === values.organizacaoTipo)?.label;
  const enderecoLinha1 = [values.logradouro, values.numero].filter(Boolean).join(", ");
  const enderecoLinha2 = [values.cidade, values.estado].filter(Boolean).join(" / ");

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-bold text-primary-900">4. Revisão dos Dados</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Confira as informações abaixo antes de concluir o cadastro. Você pode voltar a
          qualquer etapa para corrigir algo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <ReviewSection
          title="Administrador do Sistema"
          icon={ShieldCheck}
          fields={[
            { label: "Perfil inicial", value: "Administrador do Sistema", highlight: true },
            { label: "Nome Completo", value: values.nome },
            { label: "CPF", value: values.cpf },
            { label: "E-mail", value: values.email },
            { label: "Telefone", value: values.telefone },
          ]}
        />

        <ReviewSection
          title="Organização"
          icon={Building2}
          fields={[
            { label: "Nome da Organização", value: values.organizacaoNome },
            { label: "CNPJ", value: values.cnpj, highlight: true },
            { label: "Razão Social", value: values.razaoSocial },
            { label: "Nome Fantasia", value: values.nomeFantasia },
            { label: "Tipo de Organização", value: tipoLabel },
            { label: "E-mail Institucional", value: values.organizacaoEmail },
            { label: "Telefone Institucional", value: values.organizacaoTelefone },
          ]}
        />

        <ReviewSection
          title="Endereço"
          icon={MapPin}
          fields={[
            { label: "Logradouro", value: enderecoLinha1 },
            { label: "Complemento", value: values.complemento },
            { label: "Bairro", value: values.bairro },
            { label: "Cidade / Estado", value: enderecoLinha2 },
            { label: "CEP", value: values.cep },
          ]}
        />

        <ReviewSection
          title="Responsável Legal"
          icon={UserCog}
          fields={[
            { label: "Nome", value: values.responsavelNome },
            { label: "CPF", value: values.responsavelCpf },
            { label: "E-mail", value: values.responsavelEmail },
            { label: "Telefone", value: values.responsavelTelefone },
          ]}
        />

        <ReviewSection
          title="Observações"
          fields={[{ label: "Observações", value: values.observacoes }]}
          columns={1}
        />

        <div className="rounded-xl bg-background p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-900">
            <Users className="size-4" aria-hidden="true" />
            Usuários Convidados
          </h4>

          {values.usuarios.length === 0 ? (
            <Alert tone="info">
              Nenhum usuário convidado nesta etapa. Eles poderão ser adicionados depois pelo
              Administrador do Sistema.
            </Alert>
          ) : (
            <ul className="flex flex-col gap-2">
              {values.usuarios.map((usuario) => (
                <li
                  key={usuario.id}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{usuario.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {usuario.email}
                      {usuario.telefone && ` · ${usuario.telefone}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {usuario.permissionKeys && <Badge tone="accent">Permissões customizadas</Badge>}
                    {usuario.perfil && <Badge tone="primary">{ROLE_LABELS[usuario.perfil]}</Badge>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Checkbox
        label="Declaro que as informações prestadas são verdadeiras e estou ciente das normas de uso e confidencialidade da plataforma Portus RDO."
        checked={values.declaracao}
        onChange={(e) => onChange("declaracao", e.target.checked)}
        error={errors.declaracao}
      />
    </div>
  );
}
