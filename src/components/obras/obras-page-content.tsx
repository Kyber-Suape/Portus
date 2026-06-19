"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Building2, CheckCircle2, PauseCircle, Plus, Search, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useWorks } from "@/hooks/use-works";
import { usePermissions } from "@/hooks/use-permissions";
import { WORK_STATUS_CONFIG } from "@/constants/work";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";
import type { Work, WorkStatus } from "@/types/work";

const STATUS_FILTER_OPTIONS = Object.entries(WORK_STATUS_CONFIG).map(([value, { label }]) => ({ value, label }));
const EXPIRATION_WINDOW_DAYS = 30;

function isNearExpiration(work: Work): boolean {
  if (work.status !== "ACTIVE") return false;
  const end = new Date(work.contractEndDate).getTime();
  const now = Date.now();
  return end >= now && end - now <= EXPIRATION_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export function ObrasPageContent() {
  const { can } = usePermissions();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkStatus | "">("");
  const { works, isLoading, error } = useWorks();

  const filtered = useMemo(() => {
    return works.filter((work) => {
      if (statusFilter && work.status !== statusFilter) return false;
      if (q.trim()) {
        const haystack = [work.name, work.contractNumber, work.contractedCompanyName, work.suapeInspectorName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [works, q, statusFilter]);

  if (!can("works:read")) {
    return (
      <EmptyState icon={ShieldAlert} title="Acesso restrito" description="Você não tem permissão para visualizar as obras da organização." />
    );
  }

  const summary = {
    active: works.filter((w) => w.status === "ACTIVE").length,
    paused: works.filter((w) => w.status === "PAUSED").length,
    completed: works.filter((w) => w.status === "COMPLETED").length,
    nearExpiration: works.filter(isNearExpiration).length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Obras</h1>
          <p className="text-sm text-muted-foreground">{works.length} obra(s) cadastrada(s)</p>
        </div>
        {can("works:create") && (
          <Link href={ROUTES.obraNova} className={buttonClasses("primary", "md")}>
            <Plus className="size-4" aria-hidden="true" />
            Nova Obra
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success-50">
            <Building2 className="size-5 text-success-600" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Obras ativas</p>
            <p className="text-xl font-bold text-foreground">{summary.active}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-50">
            <PauseCircle className="size-5 text-warning-600" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Paralisadas</p>
            <p className="text-xl font-bold text-foreground">{summary.paused}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-50">
            <CheckCircle2 className="size-5 text-accent-700" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Concluídas</p>
            <p className="text-xl font-bold text-foreground">{summary.completed}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-50">
            <AlertTriangle className="size-5 text-danger-600" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Contratos a vencer</p>
            <p className="text-xl font-bold text-foreground">{summary.nearExpiration}</p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="obras-busca" className="sr-only">
              Buscar por nome, contrato, empresa ou fiscal
            </label>
            <input
              id="obras-busca"
              type="search"
              placeholder="Buscar por nome, contrato, empresa ou fiscal..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="focus-ring h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground"
            />
          </div>
          <select
            aria-label="Filtrar por status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkStatus | "")}
            className="focus-ring h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground"
          >
            <option value="">Todos os status</option>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-7" />
          </div>
        ) : error ? (
          <EmptyState icon={Building2} title="Não foi possível carregar as obras" description={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Building2} title="Nenhuma obra encontrada" description="Cadastre uma nova obra ou ajuste os filtros aplicados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                  <th className="p-3">Obra</th>
                  <th className="p-3">Contrato</th>
                  <th className="p-3">Empresa contratada</th>
                  <th className="p-3">Fiscal SUAPE</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Vigência</th>
                  <th className="p-3">RDOs</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((work) => (
                  <tr key={work.id} className="transition-colors hover:bg-background/60">
                    <td className="p-3 text-sm font-semibold text-foreground">
                      <Link href={`${ROUTES.obras}/${work.id}`} className="hover:underline">
                        {work.name}
                      </Link>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{work.contractNumber ?? "—"}</td>
                    <td className="p-3 text-sm text-foreground">{work.contractedCompanyName}</td>
                    <td className="p-3 text-sm text-foreground">{work.suapeInspectorName}</td>
                    <td className="p-3">
                      <Badge tone={WORK_STATUS_CONFIG[work.status].tone}>{WORK_STATUS_CONFIG[work.status].label}</Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {formatDate(work.contractStartDate)} – {formatDate(work.contractEndDate)}
                    </td>
                    <td className="p-3 text-sm text-foreground">{work.rdoCount}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-3 text-sm font-medium">
                        <Link href={`${ROUTES.obras}/${work.id}/rdos`} className="text-primary-600 hover:underline">
                          RDOs
                        </Link>
                        {can("rdo:create") && (
                          <Link href={`${ROUTES.rdoNovo}?workId=${work.id}`} className="text-primary-600 hover:underline">
                            Novo RDO
                          </Link>
                        )}
                        {can("works:update") && (
                          <Link href={`${ROUTES.obras}/${work.id}/editar`} className="text-primary-600 hover:underline">
                            Editar
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
