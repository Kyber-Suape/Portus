"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { PermissionCustomizationToggle } from "@/components/permissoes/permission-customization-toggle";
import { usePermissionsCatalog } from "@/hooks/use-permissions-catalog";
import { VINCULO_OPTIONS } from "@/constants/roles";
import { formatCpfInput, formatPhoneInput, isValidEmail, isValidPhone, onlyDigits } from "@/lib/validators";
import type { CreateUserRequest, UpdateUserRequest, User, UserStatus } from "@/types/user";

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INVITED", label: "Convidado" },
  { value: "INACTIVE", label: "Inativo" },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: User["role"] | "";
  status: UserStatus;
  senha: string;
  confirmarSenha: string;
  permissionKeys?: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  role?: string;
  senha?: string;
  confirmarSenha?: string;
}

function buildInitialState(user?: User): FormState {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ? formatPhoneInput(user.phone) : "",
    cpf: user?.cpf ? formatCpfInput(user.cpf) : "",
    role: user?.role ?? "",
    status: user?.status ?? "ACTIVE",
    senha: "",
    confirmarSenha: "",
    permissionKeys: undefined,
  };
}

function validate(values: FormState, mode: "create" | "edit"): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Informe o nome.";
  if (!values.email.trim()) errors.email = "Informe o e-mail.";
  else if (!isValidEmail(values.email)) errors.email = "Informe um e-mail válido.";
  if (!values.phone.trim()) errors.phone = "Informe o telefone.";
  else if (!isValidPhone(values.phone)) errors.phone = "Informe um telefone válido.";
  if (values.cpf && onlyDigits(values.cpf).length !== 11) errors.cpf = "CPF deve ter 11 dígitos.";
  if (!values.role) errors.role = "Selecione o perfil.";

  if (mode === "create") {
    if (!values.senha) errors.senha = "Crie uma senha de acesso.";
    else if (values.senha.length < 8) errors.senha = "A senha deve ter ao menos 8 caracteres.";
    if (values.confirmarSenha !== values.senha) errors.confirmarSenha = "As senhas não coincidem.";
  }

  return errors;
}

interface UserFormModalProps {
  mode: "create" | "edit";
  user?: User;
  onClose: () => void;
  onSubmit: (payload: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  isSubmitting: boolean;
  submitError?: string | null;
}

/**
 * Renderizado condicionalmente pelo pai (ex.: `{formModal && <UserFormModal key={...} .../>}`)
 * para que cada abertura monte uma instância nova — o estado do formulário começa sempre
 * limpo via `useState` sem precisar de um efeito para "resetar ao abrir".
 */
export function UserFormModal({
  mode,
  user,
  onClose,
  onSubmit,
  isSubmitting,
  submitError,
}: UserFormModalProps) {
  const { catalog } = usePermissionsCatalog();
  const [values, setValues] = useState<FormState>(() => buildInitialState(user));
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values, mode);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (mode === "edit") {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: onlyDigits(values.phone),
        role: values.role as User["role"],
        cpf: values.cpf ? onlyDigits(values.cpf) : undefined,
        status: values.status,
      } satisfies UpdateUserRequest);
    } else {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: onlyDigits(values.phone),
        role: values.role as User["role"],
        cpf: values.cpf ? onlyDigits(values.cpf) : undefined,
        password: values.senha,
        passwordConfirmation: values.confirmarSenha,
        permissionKeys: values.permissionKeys,
      } satisfies CreateUserRequest);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={mode === "create" ? "Adicionar usuário" : "Editar usuário"}
      description={
        mode === "create"
          ? "O usuário poderá acessar a plataforma imediatamente com a senha definida abaixo."
          : `Atualize os dados de ${user?.name ?? "usuário"}.`
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {submitError && <Alert tone="danger">{submitError}</Alert>}

        <Input
          label="Nome"
          required
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label="E-mail"
          type="email"
          required
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MaskedInput
            label="Telefone"
            required
            mask={formatPhoneInput}
            value={values.phone}
            onValueChange={(value) => updateField("phone", value)}
            error={errors.phone}
          />
          <MaskedInput
            label="CPF"
            mask={formatCpfInput}
            value={values.cpf}
            onValueChange={(value) => updateField("cpf", value)}
            error={errors.cpf}
          />
        </div>
        

        {mode === "create" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PasswordInput
                label="Senha de acesso"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                required
                value={values.senha}
                onChange={(e) => updateField("senha", e.target.value)}
                error={errors.senha}
              />
              <PasswordInput
                label="Confirmar senha"
                placeholder="Repita a senha"
                autoComplete="new-password"
                required
                value={values.confirmarSenha}
                onChange={(e) => updateField("confirmarSenha", e.target.value)}
                error={errors.confirmarSenha}
              />
            </div>
        )}
        
        <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <Select
            label="Perfil"
            placeholder="Selecione o perfil..."
            required
            options={VINCULO_OPTIONS}
            value={values.role}
            onChange={(e) => updateField("role", e.target.value as User["role"])}
            error={errors.role}
          />
          {mode === "edit" && (
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={values.status}
              onChange={(e) => updateField("status", e.target.value as UserStatus)}
            />
          )}
        </div>
        <PermissionCustomizationToggle
              role={values.role}
              catalog={catalog}
              permissionKeys={values.permissionKeys}
              onChange={(keys) => updateField("permissionKeys", keys)}
            />

        <div className="mt-2 flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {mode === "create" ? "Adicionar usuário" : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
