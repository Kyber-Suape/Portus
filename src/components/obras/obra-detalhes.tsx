"use client";

import Link from "next/link";
import { Building2, CalendarRange, ClipboardList, FilePlus2, FileQuestion, Pencil, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useWork } from "@/hooks/use-work";
import { usePermissions } from "@/hooks/use-permissions";
import { WORK_STATUS_CONFIG } from "@/constants/work";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";
import { ObraEquipeSection } from "./obra-equipe-section";
import { ObraAdditivesSection, ObraDocumentsSection } from "./obra-documents-additives-section";

interface ObraDetalhesProps {
  workId: string;
}

export function ObraDetalhes({ workId }: ObraDetalhesProps) {
  const { can } = usePermissions();
  const { work, isLoading, error, setWork } = useWork(workId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !work) {
    return <EmptyState icon={FileQuestion} title="Obra não encontrada" description={error ?? "Esta obra não existe ou foi removida."} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{work.name}</h1>
            <Badge tone={WORK_STATUS_CONFIG[work.status].tone}>{WORK_STATUS_CONFIG[work.status].label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {work.contractNumber} · {work.contractedCompanyName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`${ROUTES.obras}/${work.id}/rdos`} className={buttonClasses("outline", "sm")}>
            <ClipboardList className="size-4" aria-hidden="true" />
            Ver RDOs ({work.rdoCount})
          </Link>
          {can("rdo:create") && (
            <Link href={`${ROUTES.rdoNovo}?workId=${work.id}`} className={buttonClasses("outline", "sm")}>
              <FilePlus2 className="size-4" aria-hidden="true" />
              Novo RDO
            </Link>
          )}
          {can("works:update") && (
            <Link href={`${ROUTES.obras}/${work.id}/editar`} className={buttonClasses("primary", "sm")}>
              <Pencil className="size-4" aria-hidden="true" />
              Editar
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-3 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building2 className="size-4" aria-hidden="true" />
              Dados Gerais
            </h2>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Objeto contratual" value={work.contractObject} />
              <Field label="Tipo de contrato" value={work.contractType} />
              <Field label="Localização" value={work.location} />
              <Field label="Descrição" value={work.description} className="sm:col-span-2" />
              <Field label="Observações" value={work.notes} className="sm:col-span-2" />
            </dl>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarRange className="size-4" aria-hidden="true" />
              Prazos
            </h2>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Início da vigência" value={formatDate(work.contractStartDate)} />
              <Field label="Fim da vigência" value={formatDate(work.contractEndDate)} />
              <Field label="Prazo" value={work.durationDays ? `${work.durationDays} dias` : undefined} />
              <Field label="Início da execução" value={work.executionStartDate ? formatDate(work.executionStartDate) : undefined} />
              <Field label="Previsão de conclusão" value={work.expectedCompletionDate ? formatDate(work.expectedCompletionDate) : undefined} />
            </dl>
          </Card>

          <ObraDocumentsSection work={work} onChanged={(w) => setWork(w)} />
          <ObraAdditivesSection work={work} onChanged={(w) => setWork(w)} />
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-3 p-5">
            <h2 className="text-sm font-semibold text-foreground">Empresa Contratada</h2>
            <dl className="flex flex-col gap-3">
              <Field label="Nome" value={work.contractedCompanyName} />
              <Field label="CNPJ" value={work.contractedCompanyCnpj} />
              <Field label="Responsável" value={work.contractedCompanyResponsibleName} />
              <Field label="E-mail" value={work.contractedCompanyResponsibleEmail} />
              <Field label="Telefone" value={work.contractedCompanyResponsiblePhone} />
            </dl>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users2 className="size-4" aria-hidden="true" />
              Responsáveis
            </h2>
            <dl className="flex flex-col gap-3">
              <Field label="Fiscal SUAPE" value={work.suapeInspectorName} />
              <Field label="Fiscal externo" value={work.externalInspectorName} />
              <Field label="Gestor do contrato" value={work.contractManagerName} />
            </dl>
          </Card>
        </div>
      </div>

      <ObraEquipeSection work={work} onChanged={(w) => setWork(w)} />
    </div>
  );
}

function Field({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}
