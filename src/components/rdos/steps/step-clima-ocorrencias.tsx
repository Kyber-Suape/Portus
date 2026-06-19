import { AlertTriangle, CloudSun, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import {
  GROUND_STATUS_OPTIONS,
  RDO_NON_CONFORMITY_STATUS_LABELS,
  RDO_OCCURRENCE_TYPE_OPTIONS,
  RDO_SEVERITY_OPTIONS,
  WEATHER_CONDITION_OPTIONS,
} from "@/constants/rdo";
import type {
  GroundStatus,
  RdoNonConformityInput,
  RdoNonConformityStatus,
  RdoOccurrenceInput,
  RdoOccurrenceType,
  RdoSeverity,
  WeatherCondition,
} from "@/types/rdo";
import type { RdoWizardStepProps } from "../rdo-wizard-types";

function emptyOccurrence(): RdoOccurrenceInput {
  return { type: "SAFETY", location: "", severity: "MEDIUM", summary: "" };
}

function emptyNonConformity(): RdoNonConformityInput {
  return { title: "", description: "", severity: "MEDIUM", status: "OPEN" };
}

export function StepClimaOcorrencias({ values, onChange }: RdoWizardStepProps) {
  function updateWeather<K extends keyof typeof values.weather>(field: K, value: (typeof values.weather)[K]) {
    onChange("weather", { ...values.weather, [field]: value });
  }

  function updateOccurrence(index: number, field: keyof RdoOccurrenceInput, value: string) {
    const next = values.occurrences.map((o, i) => (i === index ? { ...o, [field]: value } : o));
    onChange("occurrences", next);
  }

  function updateNonConformity(index: number, field: keyof RdoNonConformityInput, value: string) {
    const next = values.nonConformities.map((nc, i) => (i === index ? { ...nc, [field]: value } : nc));
    onChange("nonConformities", next);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-bold text-primary-900">4. Clima e Ocorrências</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre as condições climáticas, ocorrências e não conformidades do dia.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CloudSun className="size-4" aria-hidden="true" />
          Condições Climáticas
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="Manhã"
            options={WEATHER_CONDITION_OPTIONS}
            value={values.weather.morningCondition ?? ""}
            onChange={(e) => updateWeather("morningCondition", e.target.value as WeatherCondition)}
          />
          <Select
            label="Tarde"
            options={WEATHER_CONDITION_OPTIONS}
            value={values.weather.afternoonCondition ?? ""}
            onChange={(e) => updateWeather("afternoonCondition", e.target.value as WeatherCondition)}
          />
          <Select
            label="Noite"
            options={WEATHER_CONDITION_OPTIONS}
            value={values.weather.nightCondition ?? ""}
            onChange={(e) => updateWeather("nightCondition", e.target.value as WeatherCondition)}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label="Temperatura mín. (°C)"
            type="number"
            value={values.weather.minTemperature ?? ""}
            onChange={(e) => updateWeather("minTemperature", Number(e.target.value))}
          />
          <Input
            label="Temperatura máx. (°C)"
            type="number"
            value={values.weather.maxTemperature ?? ""}
            onChange={(e) => updateWeather("maxTemperature", Number(e.target.value))}
          />
          <Select
            label="Status do solo"
            options={GROUND_STATUS_OPTIONS}
            value={values.weather.groundStatus ?? "DRY"}
            onChange={(e) => updateWeather("groundStatus", e.target.value as GroundStatus)}
          />
        </div>
        <Checkbox
          label="Houve paralisação por clima"
          checked={values.weather.hadStoppage ?? false}
          onChange={(e) => updateWeather("hadStoppage", e.target.checked)}
        />
        {values.weather.hadStoppage && (
          <Input
            label="Motivo da paralisação"
            value={values.weather.stoppageReason ?? ""}
            onChange={(e) => updateWeather("stoppageReason", e.target.value)}
          />
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-5">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldAlert className="size-4" aria-hidden="true" />
          Ocorrências do Dia
        </h4>

        {values.occurrences.length === 0 ? (
          <EmptyState icon={ShieldAlert} title="Nenhuma ocorrência registrada" description="Adicione ocorrências de segurança, operação, etc." />
        ) : (
          <div className="flex flex-col gap-3">
            {values.occurrences.map((occurrence, index) => (
              <div key={index} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Ocorrência {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onChange("occurrences", values.occurrences.filter((_, i) => i !== index))}
                    aria-label={`Remover ocorrência ${index + 1}`}
                    className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Select
                    label="Tipo"
                    options={RDO_OCCURRENCE_TYPE_OPTIONS}
                    value={occurrence.type}
                    onChange={(e) => updateOccurrence(index, "type", e.target.value as RdoOccurrenceType)}
                  />
                  <Input label="Local / Setor" value={occurrence.location} onChange={(e) => updateOccurrence(index, "location", e.target.value)} />
                  <Select
                    label="Gravidade"
                    options={RDO_SEVERITY_OPTIONS}
                    value={occurrence.severity}
                    onChange={(e) => updateOccurrence(index, "severity", e.target.value as RdoSeverity)}
                  />
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Input label="Resumo" value={occurrence.summary} onChange={(e) => updateOccurrence(index, "summary", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Textarea
                      label="Descrição"
                      value={occurrence.description ?? ""}
                      onChange={(e) => updateOccurrence(index, "description", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange("occurrences", [...values.occurrences, emptyOccurrence()])}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden="true" />
          Adicionar Ocorrência
        </Button>
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-5">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <AlertTriangle className="size-4" aria-hidden="true" />
          Não Conformidades Técnicas
        </h4>

        {values.nonConformities.length === 0 ? (
          <EmptyState icon={AlertTriangle} title="Nenhuma não conformidade registrada" description="Registre desvios técnicos identificados." />
        ) : (
          <div className="flex flex-col gap-3">
            {values.nonConformities.map((nc, index) => (
              <div key={index} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Não conformidade {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onChange("nonConformities", values.nonConformities.filter((_, i) => i !== index))}
                    aria-label={`Remover não conformidade ${index + 1}`}
                    className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Título" value={nc.title} onChange={(e) => updateNonConformity(index, "title", e.target.value)} />
                  <Select
                    label="Gravidade"
                    options={RDO_SEVERITY_OPTIONS}
                    value={nc.severity}
                    onChange={(e) => updateNonConformity(index, "severity", e.target.value as RdoSeverity)}
                  />
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Descrição"
                      value={nc.description}
                      onChange={(e) => updateNonConformity(index, "description", e.target.value)}
                    />
                  </div>
                  <Select
                    label="Status"
                    options={Object.entries(RDO_NON_CONFORMITY_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                    value={nc.status ?? "OPEN"}
                    onChange={(e) => updateNonConformity(index, "status", e.target.value as RdoNonConformityStatus)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange("nonConformities", [...values.nonConformities, emptyNonConformity()])}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden="true" />
          Adicionar Não Conformidade
        </Button>
      </section>
    </div>
  );
}
