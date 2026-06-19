import { CheckCircle2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { RDO_SHIFT_LABELS } from "@/constants/rdo";
import type { Rdo } from "@/types/rdo";
import type { RdoWizardValues } from "../rdo-wizard-types";

interface StepRevisaoFinalProps {
  rdo: Rdo;
  values: RdoWizardValues;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepRevisaoFinal({ rdo, values, onBack, onSubmit, isSubmitting }: StepRevisaoFinalProps) {
  const checklist = [
    { label: "Dados Gerais", ok: Boolean(values.siteEngineerName && values.date) },
    { label: "Atividades Realizadas", ok: values.activities.length > 0 },
    { label: "Efetivo da Equipe", ok: values.teams.length > 0 },
    { label: "Condições Climáticas", ok: Boolean(values.weather.groundStatus) },
    { label: "Evidências Fotográficas", ok: rdo.evidences.length > 0 },
  ];

  const criticalAlerts: string[] = [];
  if (rdo.evidences.length === 0) criticalAlerts.push("Nenhuma evidência fotográfica anexada ao RDO.");
  const criticalNonConformities = values.nonConformities.filter((nc) => nc.severity === "CRITICAL");
  if (criticalNonConformities.length > 0) {
    criticalAlerts.push(`${criticalNonConformities.length} não conformidade(s) crítica(s) em aberto.`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-bold text-primary-900">6. Revisão Final</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Confira o resumo do RDO #{rdo.number} antes de enviar para revisão.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-900">
            <ClipboardList className="size-4" aria-hidden="true" />
            Checklist de Completude
          </h4>
          <ul className="flex flex-col gap-2">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
                <span className="text-foreground">{item.label}</span>
                <Badge tone={item.ok ? "success" : "warning"}>{item.ok ? "OK" : "Ajustar"}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <h4 className="mb-2 text-sm font-bold text-primary-900">Resumo</h4>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Turno</dt>
              <dd className="text-foreground">{RDO_SHIFT_LABELS[values.shift]}</dd>
              <dt className="text-muted-foreground">Obra / Contrato</dt>
              <dd className="text-foreground">{rdo.workLabel || "—"}</dd>
              <dt className="text-muted-foreground">Atividades</dt>
              <dd className="text-foreground">{values.activities.length}</dd>
              <dt className="text-muted-foreground">Evidências</dt>
              <dd className="text-foreground">{rdo.evidences.length}</dd>
            </dl>
          </div>

          {criticalAlerts.length > 0 && (
            <Alert tone="danger" title="Alertas Críticos">
              <ul className="list-inside list-disc">
                {criticalAlerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            </Alert>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar e Editar
        </Button>
        <Button type="button" loading={isSubmitting} onClick={onSubmit}>
          {isSubmitting ? "Enviando…" : "Enviar para Revisão"}
          {!isSubmitting && <CheckCircle2 className="size-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
}
