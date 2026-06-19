import { History } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeToNow } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Atividade } from "@/types/dashboard";

const TOM_CLASSES: Record<Atividade["tom"], string> = {
  primary: "bg-primary-50 text-primary-700",
  success: "bg-success-50 text-success-600",
};

export function ActivityFeed({ atividades }: { atividades: Atividade[] }) {
  return (
    <Card className="p-4">
      <CardTitle className="mb-3 flex items-center gap-2">
        <History className="size-4" aria-hidden="true" />
        Atividade Recente
      </CardTitle>

      {atividades.length === 0 ? (
        <EmptyState icon={History} title="Nenhuma atividade recente" />
      ) : (
        <ul className="flex flex-col gap-1">
          {atividades.map((atividade) => {
            const Icon = atividade.icon;
            return (
              <li
                key={atividade.id}
                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-background"
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded",
                    TOM_CLASSES[atividade.tom],
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{atividade.autor}</span> {atividade.acao} —{" "}
                    <span className="text-muted-foreground">{atividade.alvo}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatRelativeToNow(atividade.criadaEm)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
