import { ClipboardCheck, AlertTriangle, Stamp, PenLine, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getInitials, formatRelativeToNow } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Pendencia, PendenciaTipo } from "@/types/dashboard";

const TIPO_ICON: Record<PendenciaTipo, typeof AlertTriangle> = {
  correcao: AlertTriangle,
  aprovacao: Stamp,
  assinatura: PenLine,
  revisao: ClipboardList,
};

const PRIORIDADE_CONFIG = {
  alta: { label: "Atrasado", chip: "bg-danger-50 text-danger-600 border-danger-500/20", dot: "bg-danger-500", icon: "text-danger-600", action: "outline" as const },
  media: { label: "Aguardando", chip: "bg-warning-50 text-warning-600 border-warning-500/20", dot: "bg-warning-500", icon: "text-warning-600", action: "primary" as const },
  baixa: { label: "Pendente", chip: "bg-background text-muted-foreground border-border", dot: "bg-muted-foreground", icon: "text-muted-foreground", action: "outline" as const },
};

export function PendingList({ pendencias }: { pendencias: Pendencia[] }) {
  return (
    <Card id="pendencias" className="flex flex-col overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b border-border p-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-danger-500" aria-hidden="true" />
            Pendências Prioritárias
          </CardTitle>
          <CardDescription>Itens que aguardam ação sua ou da sua equipe.</CardDescription>
        </div>
      </CardHeader>

      {pendencias.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={ClipboardCheck}
            title="Nenhuma pendência no momento"
            description="Quando houver revisões, aprovações ou assinaturas pendentes, elas aparecerão aqui."
          />
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-border bg-background/60 text-xs font-medium text-muted-foreground">
                  <th className="p-3">Tipo / Obra</th>
                  <th className="p-3">Responsável</th>
                  <th className="p-3">Status / Tempo</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendencias.map((pendencia) => {
                  const Icon = TIPO_ICON[pendencia.tipo];
                  const config = PRIORIDADE_CONFIG[pendencia.prioridade];

                  return (
                    <tr key={pendencia.id} className="transition-colors hover:bg-background/60">
                      <td className="p-3 align-top">
                        <div className="flex items-start gap-2">
                          <Icon className={cn("mt-0.5 size-4 shrink-0", config.icon)} aria-hidden="true" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{pendencia.titulo}</p>
                            <p className="text-xs text-muted-foreground">{pendencia.obraNome}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-full bg-background text-[10px] font-semibold text-muted-foreground">
                            {getInitials(pendencia.responsavel)}
                          </span>
                          <span className="text-sm text-foreground">{pendencia.responsavel}</span>
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-semibold",
                            config.chip,
                          )}
                        >
                          <span className={cn("size-1.5 rounded-full", config.dot)} aria-hidden="true" />
                          {config.label} ({formatRelativeToNow(pendencia.prazo)})
                        </span>
                      </td>
                      <td className="p-3 text-right align-top">
                        <button
                          type="button"
                          className={cn(
                            "focus-ring h-8 rounded px-3 text-xs font-semibold transition-colors",
                            config.action === "primary"
                              ? "bg-primary-900 text-white hover:bg-primary-700"
                              : "border border-border text-foreground hover:bg-background",
                          )}
                        >
                          {pendencia.acaoLabel}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-3 p-4 md:hidden">
            {pendencias.map((pendencia) => {
              const Icon = TIPO_ICON[pendencia.tipo];
              const config = PRIORIDADE_CONFIG[pendencia.prioridade];

              return (
                <li key={pendencia.id} className="rounded-lg border border-border p-3.5">
                  <div className="flex items-start gap-2">
                    <Icon className={cn("mt-0.5 size-4 shrink-0", config.icon)} aria-hidden="true" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{pendencia.titulo}</p>
                      <p className="text-xs text-muted-foreground">{pendencia.obraNome}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-semibold",
                        config.chip,
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", config.dot)} aria-hidden="true" />
                      {config.label}
                    </span>
                    <button
                      type="button"
                      className={cn(
                        "focus-ring h-8 rounded px-3 text-xs font-semibold transition-colors",
                        config.action === "primary"
                          ? "bg-primary-900 text-white hover:bg-primary-700"
                          : "border border-border text-foreground hover:bg-background",
                      )}
                    >
                      {pendencia.acaoLabel}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
}
