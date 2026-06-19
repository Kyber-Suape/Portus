"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Stepper } from "@/components/ui/stepper";
import { StepActions } from "@/components/cadastro/step-actions";
import { useRdo } from "@/hooks/use-rdo";
import { useWork } from "@/hooks/use-work";
import { ApiError } from "@/lib/api/client";
import type { Rdo, UpdateRdoRequest } from "@/types/rdo";
import { StepDadosDoDia } from "./steps/step-dados-do-dia";
import { StepAtividades } from "./steps/step-atividades";
import { StepEquipeEquipamentos } from "./steps/step-equipe-equipamentos";
import { StepClimaOcorrencias } from "./steps/step-clima-ocorrencias";
import { StepEvidencias } from "./steps/step-evidencias";
import { StepRevisaoFinal } from "./steps/step-revisao-final";
import { toWizardValues, type RdoWizardValues } from "./rdo-wizard-types";

const STEPS = [
  { label: "Dados do Dia" },
  { label: "Atividades" },
  { label: "Equipe e Equipamentos" },
  { label: "Clima e Ocorrências" },
  { label: "Evidências" },
  { label: "Revisão Final" },
];

function buildSectionPayload(step: number, values: RdoWizardValues): UpdateRdoRequest {
  switch (step) {
    case 1:
      return {
        date: values.date,
        shift: values.shift,
        siteEngineerName: values.siteEngineerName,
        siteEngineerRegistry: values.siteEngineerRegistry || undefined,
        foremanName: values.foremanName || undefined,
        notes: values.notes || undefined,
      };
    case 2:
      return { activities: values.activities };
    case 3:
      return { professionals: values.professionals, equipments: values.equipments };
    case 4:
      return { weather: values.weather, occurrences: values.occurrences, nonConformities: values.nonConformities };
    default:
      return {};
  }
}

interface RdoWizardProps {
  rdo: Rdo;
  onSaved: (rdo: Rdo) => void;
}

/** Wizard de criação/edição de RDO em 6 etapas, com autosave por seção (PATCH a cada "Próximo"). */
export function RdoWizard({ rdo, onSaved }: RdoWizardProps) {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<RdoWizardValues>(() => toWizardValues(rdo));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { update, submit, isSaving } = useRdo(null);
  const { work } = useWork(rdo.workId);

  function updateField<K extends keyof RdoWizardValues>(field: K, value: RdoWizardValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function saveCurrentSection(): Promise<boolean> {
    setSubmitError(null);
    try {
      const payload = buildSectionPayload(step, values);
      if (Object.keys(payload).length === 0) return true;
      const updated = await update(rdo.id, payload);
      onSaved(updated);
      return true;
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível salvar esta etapa.");
      return false;
    }
  }

  async function handleNext() {
    const ok = await saveCurrentSection();
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function handlePrev() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmitForReview() {
    const ok = await saveCurrentSection();
    if (!ok) return;
    try {
      const updated = await submit(rdo.id);
      onSaved(updated);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível enviar o RDO para revisão.");
    }
  }

  const stepProps = { values, onChange: updateField, rdo, work };

  return (
    <>
      <div className="rounded-xl border border-border bg-surface p-3 shadow-sm sm:p-4">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      <Card className="min-h-[420px] p-4 sm:p-6">
        {submitError && (
          <div className="mb-4">
            <Alert tone="danger">{submitError}</Alert>
          </div>
        )}

        {step === 1 && <StepDadosDoDia {...stepProps} />}
        {step === 2 && <StepAtividades {...stepProps} />}
        {step === 3 && <StepEquipeEquipamentos {...stepProps} />}
        {step === 4 && <StepClimaOcorrencias {...stepProps} />}
        {step === 5 && <StepEvidencias rdoId={rdo.id} />}
        {step === 6 && (
          <StepRevisaoFinal
            rdo={rdo}
            values={values}
            onBack={handlePrev}
            onSubmit={handleSubmitForReview}
            isSubmitting={isSaving}
          />
        )}

        {step < STEPS.length && (
          <StepActions step={step} totalSteps={STEPS.length} onPrev={handlePrev} onNext={handleNext} loading={isSaving} />
        )}
      </Card>
    </>
  );
}
