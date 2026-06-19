"use client";

import { useState } from "react";
import { ListChecks, Mic, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { RDO_ACTIVITY_STATUS_OPTIONS } from "@/constants/rdo";
import { aiService } from "@/services/ai.service";
import { ApiError } from "@/lib/api/client";
import type { RdoActivityInput, RdoActivityStatus } from "@/types/rdo";
import type { RdoWizardStepProps } from "../rdo-wizard-types";

const SUGGESTED_CATEGORIES = ["Terraplenagem", "Fundação", "Concretagem", "Alvenaria"];

function emptyActivity(): RdoActivityInput {
  return { category: "", description: "", status: "IN_PROGRESS", aiSuggestionUsed: false };
}

export function StepAtividades({ values, onChange }: RdoWizardStepProps) {
  /** Atualiza um ou mais campos da atividade de uma só vez — evita perder alterações quando
   * duas chamadas em sequência (ex.: aplicar sugestão + marcar `aiSuggestionUsed`) partiriam
   * da mesma `values.activities` desatualizada se fossem despachadas separadamente. */
  function updateActivity(index: number, patch: Partial<RdoActivityInput>) {
    const next = values.activities.map((activity, i) => (i === index ? { ...activity, ...patch } : activity));
    onChange("activities", next);
  }

  function addActivity() {
    onChange("activities", [...values.activities, emptyActivity()]);
  }

  function removeActivity(index: number) {
    onChange("activities", values.activities.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-bold text-primary-900">2. Atividades Executadas</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Descreva as atividades realizadas no período, com categoria e status.
        </p>
      </div>

      {values.activities.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Nenhuma atividade registrada"
          description="Clique em “Adicionar atividade” para começar."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {values.activities.map((activity, index) => (
            <ActivityCard
              key={index}
              index={index}
              activity={activity}
              onChange={(patch) => updateActivity(index, patch)}
              onRemove={() => removeActivity(index)}
            />
          ))}
        </div>
      )}

      <Button type="button" variant="outline" onClick={addActivity} className="self-start">
        <Plus className="size-4" aria-hidden="true" />
        Adicionar atividade
      </Button>
    </div>
  );
}

interface ActivityCardProps {
  index: number;
  activity: RdoActivityInput;
  onChange: (patch: Partial<RdoActivityInput>) => void;
  onRemove: () => void;
}

function ActivityCard({ index, activity, onChange, onRemove }: ActivityCardProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  async function handleSuggestText() {
    setIsSuggesting(true);
    setAiError(null);
    try {
      const result = await aiService.generateRdoTextSuggestion({ category: activity.category || undefined });
      setSuggestion(result.suggestion);
    } catch (err) {
      setAiError(err instanceof ApiError ? err.message : "Não foi possível gerar a sugestão.");
    } finally {
      setIsSuggesting(false);
    }
  }

  function handleUseSuggestion() {
    if (!suggestion) return;
    onChange({ description: suggestion, aiSuggestionUsed: true });
    setSuggestion(null);
  }

  async function handleTranscribeAudio() {
    setIsTranscribing(true);
    setAiError(null);
    try {
      // Estrutura/placeholder: ainda não captura áudio real do microfone.
      const result = await aiService.transcribeAudio(new Blob(["placeholder"], { type: "audio/webm" }));
      onChange({ description: activity.description ? `${activity.description} ${result.transcript}` : result.transcript });
    } catch (err) {
      setAiError(err instanceof ApiError ? err.message : "Não foi possível transcrever o áudio.");
    } finally {
      setIsTranscribing(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-primary-900">Atividade {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover atividade ${index + 1}`}
          className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Categorias sugeridas
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onChange({ category })}
              className={`focus-ring rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activity.category === category
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-border text-muted-foreground hover:bg-background"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Descrição detalhada"
        placeholder="Descreva as atividades executadas no período..."
        value={activity.description}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={4}
      />
      <p className="-mt-1 text-right text-xs text-muted-foreground">{activity.description.length} caracteres</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" loading={isSuggesting} onClick={handleSuggestText}>
            <Sparkles className="size-4" aria-hidden="true" />
            Sugerir texto com IA
          </Button>
          <Button type="button" variant="outline" size="sm" loading={isTranscribing} onClick={handleTranscribeAudio}>
            <Mic className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <Select
          label=""
          options={RDO_ACTIVITY_STATUS_OPTIONS}
          value={activity.status ?? "IN_PROGRESS"}
          onChange={(e) => onChange({ status: e.target.value as RdoActivityStatus })}
          className="h-9 w-44"
        />
      </div>

      {aiError && <p className="mt-2 text-sm text-danger-600">{aiError}</p>}

      {suggestion && (
        <div className="mt-3 rounded-lg border border-primary-200 bg-primary-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-700">Sugestão da IA</p>
          <p className="text-sm text-foreground">{suggestion}</p>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setSuggestion(null)}>
              Descartar
            </Button>
            <Button type="button" size="sm" onClick={handleUseSuggestion}>
              Usar sugestão
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
