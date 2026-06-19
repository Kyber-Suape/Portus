"use client";

import Link from "next/link";
import { ClipboardList, FilePlus2, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClasses } from "@/components/ui/button";
import { useWork } from "@/hooks/use-work";
import { useRdos } from "@/hooks/use-rdos";
import { usePermissions } from "@/hooks/use-permissions";
import { RDO_STATUS_CONFIG } from "@/constants/rdo";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";

interface ObraRdosPageContentProps {
  workId: string;
}

export function ObraRdosPageContent({ workId }: ObraRdosPageContentProps) {
  const { can } = usePermissions();
  const { work, isLoading: isLoadingWork, error: workError } = useWork(workId);
  const { rdos, isLoading: isLoadingRdos } = useRdos({ workId, pageSize: 100 });

  if (isLoadingWork) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (workError || !work) {
    return <EmptyState icon={FileQuestion} title="Obra não encontrada" description={workError ?? "Esta obra não existe ou foi removida."} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={`${ROUTES.obras}/${work.id}`} className="text-sm text-primary-600 hover:underline">
            ← {work.name}
          </Link>
          <h1 className="text-2xl font-bold text-foreground">RDOs da Obra</h1>
          <p className="text-sm text-muted-foreground">{rdos.length} RDO(s) registrado(s)</p>
        </div>
        {can("rdo:create") && (
          <Link href={`${ROUTES.rdoNovo}?workId=${work.id}`} className={buttonClasses("primary", "md")}>
            <FilePlus2 className="size-4" aria-hidden="true" />
            Novo RDO
          </Link>
        )}
      </div>

      <Card className="overflow-hidden p-0">
        {isLoadingRdos ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-7" />
          </div>
        ) : rdos.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Nenhum RDO registrado" description="Crie o primeiro RDO desta obra." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                  <th className="p-3">Data</th>
                  <th className="p-3">RDO #</th>
                  <th className="p-3">Responsável</th>
                  <th className="p-3">Status</th>
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
    </div>
  );
}
