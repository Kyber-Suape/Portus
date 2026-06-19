import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FlowStepStatus = "done" | "active" | "bottleneck" | "pending";

export interface FlowStep {
  label: string;
  detail?: string;
  status: FlowStepStatus;
}

const DOT_CLASSES: Record<FlowStepStatus, string> = {
  done: "bg-success-500",
  active: "bg-primary-900",
  bottleneck: "bg-warning-500",
  pending: "bg-border",
};

const FLOW_STEPS: FlowStep[] = [
  { label: "Rascunho / Em Campo", detail: "Concluído (100%)", status: "done" },
  { label: "Revisão Externa", detail: "Em andamento (2 pendentes)", status: "active" },
  { label: "Aprovação SUAPE", detail: "Gargalo atual (5 pendentes)", status: "bottleneck" },
  { label: "Assinatura Digital", status: "pending" },
];

export function RdoFlowTimeline() {
  return (
    <Card className="p-4">
      <CardTitle className="mb-4">Fluxo do RDO (Média)</CardTitle>
      <ol className="ml-3 flex flex-col gap-4 border-l-2 border-border pb-1">
        {FLOW_STEPS.map((step) => (
          <li
            key={step.label}
            className={cn("relative flex items-center pl-4", step.status === "pending" && "opacity-50")}
          >
            <span
              className={cn(
                "absolute -left-[9px] size-4 rounded-full border-2 border-surface",
                DOT_CLASSES[step.status],
                step.status === "bottleneck" && "animate-pulse",
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "flex-1",
                step.status === "bottleneck" && "rounded border border-warning-500/30 bg-warning-50/60 p-2",
              )}
            >
              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              {step.detail && (
                <p
                  className={cn(
                    "text-xs text-muted-foreground",
                    step.status === "bottleneck" && "text-warning-600",
                  )}
                >
                  {step.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
