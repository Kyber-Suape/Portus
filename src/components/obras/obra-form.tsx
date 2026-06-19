"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CalendarRange, FileText, Save, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MaskedInput } from "@/components/ui/masked-input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useWork } from "@/hooks/use-work";
import { formatCnpjInput, formatPhoneInput } from "@/lib/validators";
import { WORK_CONTRACT_TYPE_OPTIONS, WORK_STATUS_CONFIG } from "@/constants/work";
import { ROUTES } from "@/constants/routes";
import type { CreateWorkInput, WorkStatus } from "@/types/work";

const STATUS_OPTIONS = Object.entries(WORK_STATUS_CONFIG).map(([value, { label }]) => ({ value, label }));

const EMPTY_FORM: CreateWorkInput = {
  name: "",
  contractNumber: "",
  contractObject: "",
  description: "",
  contractType: "",
  status: "DRAFT",
  location: "",
  contractedCompanyName: "",
  contractedCompanyCnpj: "",
  contractedCompanyResponsibleName: "",
  contractedCompanyResponsibleEmail: "",
  contractedCompanyResponsiblePhone: "",
  suapeInspectorName: "",
  externalInspectorName: "",
  contractManagerName: "",
  contractStartDate: "",
  contractEndDate: "",
  executionStartDate: "",
  expectedCompletionDate: "",
  durationDays: undefined,
  notes: "",
};

interface ObraFormProps {
  workId?: string;
}

/** Formulário de Obra em seções — usado tanto para criação (`workId` ausente) quanto edição. */
export function ObraForm({ workId }: ObraFormProps) {
  const router = useRouter();
  const isEditing = Boolean(workId);
  const { work, isLoading, isSaving, create, update } = useWork(workId ?? null);
  const [form, setForm] = useState<CreateWorkInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!work) return;
    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      setForm({
        name: work.name,
        contractNumber: work.contractNumber ?? "",
        contractObject: work.contractObject ?? "",
        description: work.description ?? "",
        contractType: work.contractType ?? "",
        status: work.status,
        location: work.location ?? "",
        contractedCompanyName: work.contractedCompanyName,
        contractedCompanyCnpj: work.contractedCompanyCnpj,
        contractedCompanyResponsibleName: work.contractedCompanyResponsibleName,
        contractedCompanyResponsibleEmail: work.contractedCompanyResponsibleEmail ?? "",
        contractedCompanyResponsiblePhone: work.contractedCompanyResponsiblePhone ?? "",
        suapeInspectorName: work.suapeInspectorName,
        externalInspectorName: work.externalInspectorName ?? "",
        contractManagerName: work.contractManagerName ?? "",
        contractStartDate: work.contractStartDate.slice(0, 10),
        contractEndDate: work.contractEndDate.slice(0, 10),
        executionStartDate: work.executionStartDate?.slice(0, 10) ?? "",
        expectedCompletionDate: work.expectedCompletionDate?.slice(0, 10) ?? "",
        durationDays: work.durationDays,
        notes: work.notes ?? "",
      });
    });
  }, [work]);

  function field<K extends keyof CreateWorkInput>(key: K, value: CreateWorkInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isEditing && workId) {
        await update(workId, form);
        router.push(`${ROUTES.obras}/${workId}`);
      } else {
        const created = await create(form);
        router.push(`${ROUTES.obras}/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a obra.");
    }
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Editar Obra" : "Nova Obra"}</h1>
        <p className="text-sm text-muted-foreground">Preencha os dados do contrato e da obra.</p>
      </div>

      {error && <Alert tone="danger">{error}</Alert>}

      <Card className="flex flex-col gap-4 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="size-4" aria-hidden="true" />
          Dados Gerais
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome da obra"
            required
            className="sm:col-span-2"
            value={form.name}
            onChange={(e) => field("name", e.target.value)}
          />
          <Input
            label="Número do contrato"
            value={form.contractNumber ?? ""}
            onChange={(e) => field("contractNumber", e.target.value)}
          />
          <Select
            label="Tipo de contrato"
            placeholder="Selecione..."
            options={WORK_CONTRACT_TYPE_OPTIONS}
            value={form.contractType ?? ""}
            onChange={(e) => field("contractType", e.target.value)}
          />
          <Select
            label="Status"
            required
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(e) => field("status", e.target.value as WorkStatus)}
          />
          <Input label="Localização / setor" value={form.location ?? ""} onChange={(e) => field("location", e.target.value)} />
          <Textarea
            label="Objeto contratual"
            className="sm:col-span-2"
            value={form.contractObject ?? ""}
            onChange={(e) => field("contractObject", e.target.value)}
          />
          <Textarea
            label="Descrição"
            className="sm:col-span-2"
            value={form.description ?? ""}
            onChange={(e) => field("description", e.target.value)}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarRange className="size-4" aria-hidden="true" />
          Prazos
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Início da vigência"
            type="date"
            required
            value={form.contractStartDate}
            onChange={(e) => field("contractStartDate", e.target.value)}
          />
          <Input
            label="Fim da vigência"
            type="date"
            required
            value={form.contractEndDate}
            onChange={(e) => field("contractEndDate", e.target.value)}
          />
          <Input
            label="Prazo (dias)"
            type="number"
            min={0}
            value={form.durationDays ?? ""}
            onChange={(e) => field("durationDays", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            label="Início da execução"
            type="date"
            value={form.executionStartDate ?? ""}
            onChange={(e) => field("executionStartDate", e.target.value)}
          />
          <Input
            label="Previsão de conclusão"
            type="date"
            value={form.expectedCompletionDate ?? ""}
            onChange={(e) => field("expectedCompletionDate", e.target.value)}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="size-4" aria-hidden="true" />
          Empresa Contratada
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome da empresa"
            required
            value={form.contractedCompanyName}
            onChange={(e) => field("contractedCompanyName", e.target.value)}
          />
          <MaskedInput
            label="CNPJ"
            required
            mask={formatCnpjInput}
            value={form.contractedCompanyCnpj}
            onValueChange={(value) => field("contractedCompanyCnpj", value)}
          />
          <Input
            label="Responsável"
            required
            value={form.contractedCompanyResponsibleName}
            onChange={(e) => field("contractedCompanyResponsibleName", e.target.value)}
          />
          <Input
            label="E-mail do responsável"
            type="email"
            value={form.contractedCompanyResponsibleEmail ?? ""}
            onChange={(e) => field("contractedCompanyResponsibleEmail", e.target.value)}
          />
          <MaskedInput
            label="Telefone do responsável"
            mask={formatPhoneInput}
            value={form.contractedCompanyResponsiblePhone ?? ""}
            onValueChange={(value) => field("contractedCompanyResponsiblePhone", value)}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users2 className="size-4" aria-hidden="true" />
          Responsáveis
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Fiscal SUAPE"
            required
            value={form.suapeInspectorName}
            onChange={(e) => field("suapeInspectorName", e.target.value)}
          />
          <Input
            label="Fiscal externo"
            value={form.externalInspectorName ?? ""}
            onChange={(e) => field("externalInspectorName", e.target.value)}
          />
          <Input
            label="Gestor do contrato"
            value={form.contractManagerName ?? ""}
            onChange={(e) => field("contractManagerName", e.target.value)}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <Textarea label="Observações" value={form.notes ?? ""} onChange={(e) => field("notes", e.target.value)} />
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSaving}>
          <Save className="size-4" aria-hidden="true" />
          {isEditing ? "Salvar alterações" : "Criar obra"}
        </Button>
      </div>
    </form>
  );
}
