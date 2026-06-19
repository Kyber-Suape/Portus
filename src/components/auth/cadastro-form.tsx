"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Stepper } from "@/components/ui/stepper";
import { StepActions } from "@/components/cadastro/step-actions";
import { StepDadosPessoais } from "@/components/cadastro/steps/step-dados-pessoais";
import { StepOrganizacao } from "@/components/cadastro/steps/step-organizacao";
import { StepUsuarios } from "@/components/cadastro/steps/step-usuarios";
import { StepRevisao } from "@/components/cadastro/steps/step-revisao";
import { ROUTES } from "@/constants/routes";
import { validateCadastroStep } from "@/lib/cadastro-validation";
import { toRegisterRequest } from "@/lib/adapters/cadastro-to-register";
import { firstStepWithError, mapRegisterApiErrors } from "@/lib/adapters/register-error-mapper";
import { useRegister } from "@/hooks/use-register";
import { ApiError } from "@/lib/api/client";
import { CADASTRO_INITIAL_STATE, createUsuarioConvidado } from "@/types/cadastro";
import type {
  CadastroFormState,
  CadastroFormErrors,
  UsuarioConvidado,
  UsuarioConvidadoErrors,
} from "@/types/cadastro";

const STEPS = [
  { label: "Identificação" },
  { label: "Organização" },
  { label: "Usuários" },
  { label: "Revisão" },
];

export function CadastroForm() {
  const { register, isLoading } = useRegister();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<CadastroFormState>(CADASTRO_INITIAL_STATE);
  const [errors, setErrors] = useState<CadastroFormErrors>({});
  const [usuarioErrors, setUsuarioErrors] = useState<Record<string, UsuarioConvidadoErrors>>({});
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function updateField<K extends keyof CadastroFormState>(field: K, value: CadastroFormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function addUsuario() {
    setValues((prev) => ({ ...prev, usuarios: [...prev.usuarios, createUsuarioConvidado()] }));
  }

  function removeUsuario(id: string) {
    setValues((prev) => ({ ...prev, usuarios: prev.usuarios.filter((u) => u.id !== id) }));
    setUsuarioErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateUsuario<K extends keyof Omit<UsuarioConvidado, "id">>(
    id: string,
    field: K,
    value: UsuarioConvidado[K],
  ) {
    setValues((prev) => ({
      ...prev,
      usuarios: prev.usuarios.map((u) => (u.id === id ? { ...u, [field]: value } : u)),
    }));
  }

  function goToStep(nextStep: number) {
    setErrors({});
    setUsuarioErrors({});
    setSubmitErrors([]);
    setStep(nextStep);
  }

  function handleNext() {
    const result = validateCadastroStep(step, values);
    setErrors(result.errors);
    setUsuarioErrors(result.usuarioErrors);
    if (Object.keys(result.errors).length > 0 || Object.keys(result.usuarioErrors).length > 0) return;
    goToStep(Math.min(step + 1, STEPS.length));
  }

  function handleSkipUsuarios() {
    goToStep(Math.min(step + 1, STEPS.length));
  }

  function handlePrev() {
    goToStep(Math.max(step - 1, 1));
  }

  async function handleSubmit() {
    const result = validateCadastroStep(4, values);
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) return;

    setSubmitErrors([]);
    try {
      await register(toRegisterRequest(values));
      setStatus("success");
    } catch (error) {
      const apiErrors = error instanceof ApiError ? error.errors : undefined;
      const mapping = mapRegisterApiErrors(apiErrors, values);
      setErrors(mapping.errors);
      setUsuarioErrors(mapping.usuarioErrors);
      setSubmitErrors(
        mapping.generalMessages.length > 0
          ? mapping.generalMessages
          : [error instanceof ApiError ? error.message : "Não foi possível concluir o cadastro."],
      );

      const targetStep = firstStepWithError(mapping);
      if (targetStep) setStep(targetStep);
    }
  }

  if (status === "success") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2 className="size-7 text-success-600" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-foreground">Cadastro concluído com sucesso</h1>
            <p className="text-sm text-muted-foreground">
              A organização {values.organizacaoNome || values.nome.split(" ")[0]} foi registrada.
              Você poderá acessar como Administrador do Sistema após a validação inicial.
            </p>
          </div>
          <Link href={ROUTES.login} className={buttonClasses("primary", "lg", "w-full")}>
            Ir para o login
          </Link>
        </CardContent>
      </Card>
    );
  }

  const stepProps = { values, errors, onChange: updateField };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-primary-900">Cadastro de Organização</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre sua organização e crie o acesso inicial de Administrador do Sistema na
          plataforma Portus RDO.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-3 shadow-sm sm:p-4">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      <Card className="min-h-[420px] p-4 sm:p-6">
        {submitErrors.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {submitErrors.map((message) => (
              <Alert key={message} tone="danger">
                {message}
              </Alert>
            ))}
          </div>
        )}

        {step === 1 && <StepDadosPessoais {...stepProps} />}
        {step === 2 && <StepOrganizacao {...stepProps} />}
        {step === 3 && (
          <StepUsuarios
            usuarios={values.usuarios}
            usuarioErrors={usuarioErrors}
            onAdd={addUsuario}
            onRemove={removeUsuario}
            onUpdateUsuario={updateUsuario}
          />
        )}
        {step === 4 && <StepRevisao {...stepProps} />}

        <StepActions
          step={step}
          totalSteps={STEPS.length}
          onPrev={handlePrev}
          onNext={step === STEPS.length ? handleSubmit : handleNext}
          onSkip={step === 3 ? handleSkipUsuarios : undefined}
          loading={isLoading}
        />
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Já possui acesso?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary-600 hover:underline">
          Fazer login
        </Link>
      </p>
    </>
  );
}
