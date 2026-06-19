import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert } from "@/components/ui/alert";
import { formatCpfInput, formatPhoneInput } from "@/lib/validators";
import type { CadastroStepProps } from "@/components/cadastro/steps/types";

export function StepDadosPessoais({ values, errors, onChange }: CadastroStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="border-b border-border pb-2 text-base font-bold text-primary-900">
        1. Identificação do Administrador
      </h3>

      {/* <Alert tone="info" title="Atenção ao E-mail">
        Use preferencialmente seu e-mail institucional. E-mails genéricos (gmail, outlook)
        podem sofrer atrasos na validação de segurança.
      </Alert> */}

      <Alert tone="success" title="Perfil inicial: Administrador do Sistema">
        Quem realiza este cadastro assume o papel de Administrador do Sistema da organização,
        com permissão para gerenciar usuários, obras, contratos e permissões.
      </Alert>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nome completo"
          placeholder="Ex: João da Silva Santos"
          autoComplete="name"
          required
          value={values.nome}
          onChange={(e) => onChange("nome", e.target.value)}
          error={errors.nome}
        />
        <Input
          label="E-mail institucional"
          type="email"
          placeholder="joao.santos@empresa.com.br"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
        />
        <MaskedInput
          label="CPF"
          placeholder="000.000.000-00"
          autoComplete="off"
          required
          mask={formatCpfInput}
          value={values.cpf}
          onValueChange={(value) => onChange("cpf", value)}
          error={errors.cpf}
        />
        <MaskedInput
          label="Telefone / WhatsApp"
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          required
          mask={formatPhoneInput}
          value={values.telefone}
          onValueChange={(value) => onChange("telefone", value)}
          error={errors.telefone}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <PasswordInput
          label="Senha desejada"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          required
          value={values.senha}
          onChange={(e) => onChange("senha", e.target.value)}
          error={errors.senha}
        />
        <PasswordInput
          label="Confirmar senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          required
          value={values.confirmarSenha}
          onChange={(e) => onChange("confirmarSenha", e.target.value)}
          error={errors.confirmarSenha}
        />
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Os dados de acesso informados aqui pertencem exclusivamente ao Administrador do
        Sistema desta organização.
      </p>
    </div>
  );
}
