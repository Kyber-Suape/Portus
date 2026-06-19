"use client";

import { type FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { formatCpfInput, formatPhoneInput, isValidEmail, isValidPhone, onlyDigits } from "@/lib/validators";
import type { User } from "@/types/user";

export function PerfilPageContent() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Atualize seus dados pessoais e, se quiser, sua senha de acesso.</p>
      </div>

      <PerfilForm key={user.id} user={user} />
    </div>
  );
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordConfirmation?: string;
}

function PerfilForm({ user }: { user: User }) {
  const { updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(formatPhoneInput(user.phone));
  const [cpf, setCpf] = useState(user.cpf ? formatCpfInput(user.cpf) : "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Informe o nome.";
    if (!isValidEmail(email)) next.email = "Informe um e-mail válido.";
    if (!isValidPhone(phone)) next.phone = "Informe um telefone válido.";
    if (password) {
      if (password.length < 8) next.password = "A senha deve ter ao menos 8 caracteres.";
      if (password !== passwordConfirmation) next.passwordConfirmation = "As senhas não coincidem.";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccess(false);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: onlyDigits(phone),
        cpf: cpf ? onlyDigits(cpf) : undefined,
        ...(password ? { password, passwordConfirmation } : {}),
      });
      setPassword("");
      setPasswordConfirmation("");
      setSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível atualizar o perfil.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl p-4 sm:p-6">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {submitError && <Alert tone="danger">{submitError}</Alert>}
        {success && <Alert tone="success">Perfil atualizado com sucesso.</Alert>}

        <Input
          label="Nome completo"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MaskedInput
            label="Telefone"
            required
            mask={formatPhoneInput}
            value={phone}
            onValueChange={setPhone}
            error={errors.phone}
          />
          <MaskedInput label="CPF" hint="Opcional" mask={formatCpfInput} value={cpf} onValueChange={setCpf} />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <h4 className="text-sm font-semibold text-foreground sm:col-span-2">Alterar senha (opcional)</h4>
          <PasswordInput
            label="Nova senha"
            placeholder="Deixe em branco para manter a atual"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <PasswordInput
            label="Confirmar nova senha"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={errors.passwordConfirmation}
          />
        </div>

        <div className="mt-2 flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Card>
  );
}
