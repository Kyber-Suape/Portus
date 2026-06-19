import Link from "next/link";
import { Building2, FileText, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SearchSelect } from "@/components/ui/search-select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { RDO_SHIFT_LABELS } from "@/constants/rdo";
import { ROUTES } from "@/constants/routes";
import type { RdoShift } from "@/types/rdo";
import type { RdoWizardStepProps } from "../rdo-wizard-types";

const SHIFT_OPTIONS: { value: RdoShift; label: string }[] = [
  { value: "MORNING", label: RDO_SHIFT_LABELS.MORNING },
  { value: "AFTERNOON", label: RDO_SHIFT_LABELS.AFTERNOON },
  { value: "NIGHT", label: RDO_SHIFT_LABELS.NIGHT },
];

export function StepDadosDoDia({ values, onChange, rdo, work }: RdoWizardStepProps) {
  const team = work?.team.filter((member) => member.status !== "REMOVED") ?? [];
  const teamOptions = team.map((member) => ({
    value: member.id,
    label: member.userName,
    description: `${member.function} · ${member.userEmail}`,
  }));

  const selectedEngineer = team.find((member) => member.userName === values.siteEngineerName);
  const selectedForeman = team.find((member) => member.userName === values.foremanName);

  function handleEngineerChange(memberId: string) {
    const member = team.find((m) => m.id === memberId);
    if (member) onChange("siteEngineerName", member.userName);
  }

  function handleForemanChange(memberId: string) {
    const member = team.find((m) => m.id === memberId);
    onChange("foremanName", member?.userName ?? "");
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="border-b border-border pb-2 text-base font-bold text-primary-900">1. Dados do Dia</h3>

      <div className="rounded-xl border border-border bg-background p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="size-4" aria-hidden="true" />
          Contexto da Obra
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Obra" disabled icon={Building2} value={rdo.workLabel ?? ""} readOnly />
          <Input label="Contrato" disabled icon={FileText} value={rdo.contractLabel ?? ""} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Data do RDO"
          type="date"
          required
          value={values.date}
          onChange={(e) => onChange("date", e.target.value)}
        />
        <Select
          label="Turno"
          required
          options={SHIFT_OPTIONS}
          value={values.shift}
          onChange={(e) => onChange("shift", e.target.value as RdoShift)}
        />
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="size-4" aria-hidden="true" />
          Responsáveis
        </h4>

        {teamOptions.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum usuário vinculado a esta obra"
            description="Adicione membros na gestão da obra antes de criar o RDO."
            action={
              work && (
                <Link href={`${ROUTES.obras}/${work.id}`} className="text-sm font-medium text-primary-600 hover:underline">
                  Gerenciar equipe da obra
                </Link>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SearchSelect
              label="Engenheiro residente"
              required
              placeholder="Selecione um membro da equipe..."
              searchPlaceholder="Buscar por nome ou e-mail..."
              options={teamOptions}
              value={selectedEngineer?.id ?? ""}
              onChange={handleEngineerChange}
            />
            <SearchSelect
              label="Mestre de obras"
              placeholder="Opcional"
              searchPlaceholder="Buscar por nome ou e-mail..."
              options={teamOptions}
              value={selectedForeman?.id ?? ""}
              onChange={handleForemanChange}
            />
          </div>
        )}

        {teamOptions.length > 0 && work && (
          <Link
            href={`${ROUTES.obras}/${work.id}`}
            className="mt-2 inline-block text-xs font-medium text-primary-600 hover:underline"
          >
            Gerenciar equipe da obra
          </Link>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <Textarea
          label="Observações"
          placeholder="Informações gerais sobre o turno..."
          value={values.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
