import { ArrowLeft, ArrowRight, Check, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StepActionsProps {
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip?: () => void;
  loading?: boolean;
}

export function StepActions({ step, totalSteps, onPrev, onNext, onSkip, loading }: StepActionsProps) {
  const isLastStep = step === totalSteps;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      {step > 1 ? (
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar
        </Button>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-2.5">
        {onSkip && (
          <Button type="button" variant="ghost" onClick={onSkip}>
            <SkipForward className="size-4" aria-hidden="true" />
            Pular etapa
          </Button>
        )}

        {isLastStep ? (
          <Button type="button" variant="primary" loading={loading} onClick={onNext}>
            {loading ? "Enviando…" : "Concluir Cadastro"}
            {!loading && <Check className="size-4" aria-hidden="true" />}
          </Button>
        ) : (
          <Button type="button" onClick={onNext}>
            Próximo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
