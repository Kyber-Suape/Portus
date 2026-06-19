"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, FilePlus2, MapPin, Search, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useRdos } from "@/hooks/use-rdos";
import { usePermissions } from "@/hooks/use-permissions";
import { RDO_STATUS_CONFIG } from "@/constants/rdo";
import { formatDate } from "@/lib/format";
import { ROUTES } from "@/constants/routes";
import { SelectObraModal } from "@/components/rdos/select-obra-modal";
import type { RdoStatus } from "@/types/rdo";

const STATUS_FILTER_OPTIONS = Object.entries(RDO_STATUS_CONFIG).map(([value, { label }]) => ({ value, label }));

const PENDING_STATUSES: RdoStatus[] = ["SENT_TO_REVIEW", "UNDER_EXTERNAL_REVIEW", "UNDER_SUAPE_REVIEW"];

export function RdosPageContent() {
  const { can } = usePermissions();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<RdoStatus | "">("");
  const [showSelectObra, setShowSelectObra] = useState(false);
  const { rdos, meta, isLoading, error, setQuery } = useRdos();

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      q: q.trim() || undefined,
      status: statusFilter || undefined,
    }));
  }, [q, statusFilter, setQuery]);

  if (!can("rdo:read")) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Acesso restrito"
        description="Você não tem permissão para visualizar os RDOs da organização."
      />
    );
  }

  const pendingCount = rdos.filter((rdo) => PENDING_STATUSES.includes(rdo.status)).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">RDOs</h1>
          <p className="text-sm text-muted-foreground">
            {meta?.total ?? 0} RDOs registrados · {pendingCount} pendência(s) nesta página
          </p>
        </div>
        {can("rdo:create") && (
          <Button onClick={() => setShowSelectObra(true)}>
            <FilePlus2 className="size-4" aria-hidden="true" />
            Novo RDO
          </Button>
        )}
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="rdos-busca" className="sr-only">
              Buscar por obra, contrato ou engenheiro
            </label>
            <input
              id="rdos-busca"
              type="search"
              placeholder="Buscar por obra, contrato ou engenheiro..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="focus-ring h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground"
            />
          </div>
          <select
            aria-label="Filtrar por status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RdoStatus | "")}
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
          <EmptyState icon={ClipboardList} title="Não foi possível carregar os RDOs" description={error} />
        ) : rdos.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhum RDO encontrado"
            description="Crie um novo RDO ou ajuste os filtros aplicados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                  <th className="p-3">Data</th>
                  <th className="p-3">RDO #</th>
                  <th className="p-3">Responsável</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Evidências</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rdos.map((rdo) => (
                  <tr key={rdo.id} className="transition-colors hover:bg-background/60">
                    <td className="p-3 text-sm text-foreground">{formatDate(rdo.date)}</td>
                    <td className="p-3 text-sm font-semibold text-foreground">RDO #{rdo.number}</td>
                    <td className="p-3 text-sm text-foreground">{rdo.author.name}</td>
                    <td className="p-3">
                      <Badge tone={RDO_STATUS_CONFIG[rdo.status].tone}>{RDO_STATUS_CONFIG[rdo.status].label}</Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {rdo.evidenceCount}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`${ROUTES.rdos}/${rdo.id}`} className="text-sm font-medium text-primary-600 hover:underline">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {meta.page} de {meta.totalPages} ({meta.total} RDOs)
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => setQuery((prev) => ({ ...prev, page: meta.page - 1 }))}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setQuery((prev) => ({ ...prev, page: meta.page + 1 }))}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {showSelectObra && <SelectObraModal onClose={() => setShowSelectObra(false)} />}
    </div>
  );
}
