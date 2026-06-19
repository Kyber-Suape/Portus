"use client";

import { type FormEvent, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { UF_OPTIONS } from "@/constants/cadastro";
import { ORGANIZATION_TYPE_OPTIONS } from "@/constants/organization";
import { usePermissions } from "@/hooks/use-permissions";
import { useOrganization } from "@/hooks/use-organization";
import { ApiError } from "@/lib/api/client";
import { formatCepInput, formatCnpjInput, formatCpfInput, formatPhoneInput, onlyDigits } from "@/lib/validators";
import type { Organization, OrganizationType, UpdateOrganizationRequest } from "@/types/organization";

export function OrganizacaoPageContent() {
  const { can } = usePermissions();
  const { organization, isLoading, isUpdating, update } = useOrganization();

  if (!can("organization:update")) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Acesso restrito"
        description="Você não tem permissão para editar os dados da organização."
      />
    );
  }

  if (isLoading || !organization) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-7" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organização</h1>
        <p className="text-sm text-muted-foreground">Atualize os dados cadastrais da sua organização.</p>
      </div>

      <OrganizacaoForm key={organization.id} organization={organization} isSaving={isUpdating} onSave={update} />
    </div>
  );
}

interface OrganizacaoFormProps {
  organization: Organization;
  isSaving: boolean;
  onSave: (payload: UpdateOrganizationRequest) => Promise<Organization>;
}

function OrganizacaoForm({ organization, isSaving, onSave }: OrganizacaoFormProps) {
  const [values, setValues] = useState(organization);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function updateField<K extends keyof Organization>(field: K, value: Organization[K]) {
    setSuccess(false);
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await onSave({
        name: values.name,
        legalName: values.legalName,
        tradeName: values.tradeName,
        cnpj: onlyDigits(values.cnpj),
        organizationType: values.organizationType,
        institutionalEmail: values.institutionalEmail,
        institutionalPhone: onlyDigits(values.institutionalPhone),
        cep: onlyDigits(values.cep),
        state: values.state,
        city: values.city,
        district: values.district,
        street: values.street,
        number: values.number,
        complement: values.complement || undefined,
        legalResponsibleName: values.legalResponsibleName,
        legalResponsibleCpf: onlyDigits(values.legalResponsibleCpf),
        legalResponsibleEmail: values.legalResponsibleEmail,
        legalResponsiblePhone: onlyDigits(values.legalResponsiblePhone),
        notes: values.notes || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar a organização.");
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {error && <Alert tone="danger">{error}</Alert>}
        {success && <Alert tone="success">Organização atualizada com sucesso.</Alert>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            required
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <MaskedInput
            label="CNPJ"
            required
            mask={formatCnpjInput}
            value={formatCnpjInput(values.cnpj)}
            onValueChange={(value) => updateField("cnpj", value)}
          />
          <Input
            label="Razão social"
            required
            value={values.legalName}
            onChange={(e) => updateField("legalName", e.target.value)}
          />
          <Input
            label="Nome fantasia"
            required
            value={values.tradeName}
            onChange={(e) => updateField("tradeName", e.target.value)}
          />
          <Select
            label="Tipo de organização"
            required
            options={ORGANIZATION_TYPE_OPTIONS}
            value={values.organizationType}
            onChange={(e) => updateField("organizationType", e.target.value as OrganizationType)}
          />
          <Input
            label="E-mail institucional"
            type="email"
            required
            value={values.institutionalEmail}
            onChange={(e) => updateField("institutionalEmail", e.target.value)}
          />
          <MaskedInput
            label="Telefone institucional"
            required
            mask={formatPhoneInput}
            value={formatPhoneInput(values.institutionalPhone)}
            onValueChange={(value) => updateField("institutionalPhone", value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <h4 className="text-sm font-semibold text-foreground sm:col-span-2">Endereço</h4>
          <MaskedInput
            label="CEP"
            required
            mask={formatCepInput}
            value={formatCepInput(values.cep)}
            onValueChange={(value) => updateField("cep", value)}
          />
          <Select
            label="Estado"
            required
            options={UF_OPTIONS}
            value={values.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
          <Input
            label="Cidade"
            required
            value={values.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
          <Input
            label="Bairro"
            required
            value={values.district}
            onChange={(e) => updateField("district", e.target.value)}
          />
          <Input
            label="Logradouro"
            required
            value={values.street}
            onChange={(e) => updateField("street", e.target.value)}
          />
          <Input
            label="Número"
            required
            value={values.number}
            onChange={(e) => updateField("number", e.target.value)}
          />
          <Input
            label="Complemento"
            value={values.complement ?? ""}
            onChange={(e) => updateField("complement", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <h4 className="text-sm font-semibold text-foreground sm:col-span-2">Responsável Legal</h4>
          <Input
            label="Nome"
            required
            value={values.legalResponsibleName}
            onChange={(e) => updateField("legalResponsibleName", e.target.value)}
          />
          <MaskedInput
            label="CPF"
            required
            mask={formatCpfInput}
            value={formatCpfInput(values.legalResponsibleCpf)}
            onValueChange={(value) => updateField("legalResponsibleCpf", value)}
          />
          <Input
            label="E-mail"
            type="email"
            required
            value={values.legalResponsibleEmail}
            onChange={(e) => updateField("legalResponsibleEmail", e.target.value)}
          />
          <MaskedInput
            label="Telefone"
            required
            mask={formatPhoneInput}
            value={formatPhoneInput(values.legalResponsiblePhone)}
            onValueChange={(value) => updateField("legalResponsiblePhone", value)}
          />
        </div>

        <div className="border-t border-border pt-4">
          <Textarea
            label="Observações"
            value={values.notes ?? ""}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </div>

        <div className="mt-2 flex justify-end">
          <Button type="submit" loading={isSaving}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Card>
  );
}
