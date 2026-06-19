import { Plus, Trash2, Truck, UserCog, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SearchSelect } from "@/components/ui/search-select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RDO_EQUIPMENT_STATUS_OPTIONS } from "@/constants/rdo";
import { RDO_EQUIPMENT_NAME_OPTIONS } from "@/constants/rdo-equipment";
import { WORK_FUNCTION_OPTIONS } from "@/constants/work-functions";
import { formatTimeInput } from "@/lib/validators";
import type { RdoEquipmentInput, RdoEquipmentStatus, RdoProfessionalInput } from "@/types/rdo";
import type { RdoWizardStepProps } from "../rdo-wizard-types";

function emptyProfessional(): RdoProfessionalInput {
  return { workUserId: undefined, name: "", function: "" };
}

function emptyEquipment(): RdoEquipmentInput {
  return { name: "", status: "IDLE" };
}

const IN_USE_STATUSES: RdoEquipmentStatus[] = ["IN_OPERATION", "MAINTENANCE"];

export function StepEquipeEquipamentos({ values, onChange, work }: RdoWizardStepProps) {
  const obraTeam = work?.team.filter((member) => member.status !== "REMOVED") ?? [];
  const memberOptions = obraTeam.map((member) => ({
    value: member.id,
    label: member.userName,
    description: `${member.function} · ${member.userEmail}`,
  }));

  const totalProfessionals = values.professionals.length;
  const equipmentInUse = values.equipments.filter((e) => IN_USE_STATUSES.includes(e.status ?? "IDLE")).length;
  const equipmentIdleOrStopped = values.equipments.length - equipmentInUse;

  function updateProfessional<K extends keyof RdoProfessionalInput>(index: number, field: K, value: RdoProfessionalInput[K]) {
    const next = values.professionals.map((professional, i) => (i === index ? { ...professional, [field]: value } : professional));
    onChange("professionals", next);
  }

  function updateEquipment<K extends keyof RdoEquipmentInput>(index: number, field: K, value: RdoEquipmentInput[K]) {
    const next = values.equipments.map((eq, i) => (i === index ? { ...eq, [field]: value } : eq));
    onChange("equipments", next);
  }

  function handleMemberChange(index: number, memberId: string) {
    const member = obraTeam.find((m) => m.id === memberId);
    if (!member) return;
    const next = values.professionals.map((professional, i) =>
      i === index
        ? { ...professional, workUserId: member.id, name: member.userName, function: professional.function || member.function }
        : professional,
    );
    onChange("professionals", next);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-bold text-primary-900">3. Equipe e Equipamentos</h3>
        <p className="mt-1 text-sm text-muted-foreground">Registre o efetivo mobilizado e os equipamentos em uso.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total de Profissionais</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalProfessionals}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Registros de Equipe</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalProfessionals}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Equipamentos (uso / ocioso)</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {equipmentInUse} <span className="text-base font-normal text-muted-foreground">/ {equipmentIdleOrStopped}</span>
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="size-4" aria-hidden="true" />
          Equipe Mobilizada
        </h4>

        {obraTeam.length === 0 && (
          <EmptyState
            icon={UserCog}
            title="Nenhum usuário vinculado a esta obra"
            description="Adicione membros na gestão da obra para selecioná-los aqui."
          />
        )}

        {values.professionals.length === 0 ? (
          <EmptyState icon={Users} title="Nenhum profissional registrado" description="Adicione os profissionais mobilizados no dia." />
        ) : (
          <div className="flex flex-col gap-3">
            {values.professionals.map((professional, index) => (
              <div key={index} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Profissional {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onChange("professionals", values.professionals.filter((_, i) => i !== index))}
                    aria-label={`Remover profissional ${index + 1}`}
                    className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <SearchSelect
                      label="Profissional"
                      placeholder="Selecione na equipe da obra..."
                      searchPlaceholder="Buscar por nome, e-mail ou função..."
                      options={memberOptions}
                      value={professional.workUserId ?? ""}
                      onChange={(memberId) => handleMemberChange(index, memberId)}
                    />
                  </div>
                  <SearchSelect
                    label="Função"
                    placeholder="Selecione a função..."
                    searchPlaceholder="Buscar função..."
                    options={WORK_FUNCTION_OPTIONS}
                    value={professional.function}
                    onChange={(fn) => updateProfessional(index, "function", fn)}
                  />
                  <Input
                    label="Horário de início"
                    placeholder="07:00"
                    inputMode="numeric"
                    value={professional.startTime ?? ""}
                    onChange={(e) => updateProfessional(index, "startTime", formatTimeInput(e.target.value))}
                  />
                  <Input
                    label="Horário de fim"
                    placeholder="16:00"
                    inputMode="numeric"
                    value={professional.endTime ?? ""}
                    onChange={(e) => updateProfessional(index, "endTime", formatTimeInput(e.target.value))}
                  />
                  <Textarea
                    label="Observações"
                    placeholder="Opcional"
                    value={professional.notes ?? ""}
                    onChange={(e) => updateProfessional(index, "notes", e.target.value)}
                    className="sm:col-span-2 lg:col-span-3"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange("professionals", [...values.professionals, emptyProfessional()])}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden="true" />
          Adicionar Profissional
        </Button>
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-5">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Truck className="size-4" aria-hidden="true" />
          Equipamentos Utilizados
        </h4>

        {values.equipments.length === 0 ? (
          <EmptyState icon={Truck} title="Nenhum equipamento registrado" description="Adicione os equipamentos em uso no dia." />
        ) : (
          <div className="flex flex-col gap-3">
            {values.equipments.map((equipment, index) => (
              <div key={index} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Equipamento {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onChange("equipments", values.equipments.filter((_, i) => i !== index))}
                    aria-label={`Remover equipamento ${index + 1}`}
                    className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <SearchSelect
                    label="Nome do equipamento"
                    placeholder="Selecione o equipamento..."
                    searchPlaceholder="Buscar equipamento..."
                    options={RDO_EQUIPMENT_NAME_OPTIONS}
                    value={equipment.name}
                    onChange={(name) => updateEquipment(index, "name", name)}
                  />
                  <Input
                    label="Identificação / patrimônio"
                    placeholder="EX-104"
                    value={equipment.identifier ?? ""}
                    onChange={(e) => updateEquipment(index, "identifier", e.target.value)}
                  />
                  <Input label="Operador" value={equipment.operator ?? ""} onChange={(e) => updateEquipment(index, "operator", e.target.value)} />
                  <Input
                    label="Horário de início"
                    placeholder="07:00"
                    inputMode="numeric"
                    value={equipment.startTime ?? ""}
                    onChange={(e) => updateEquipment(index, "startTime", formatTimeInput(e.target.value))}
                  />
                  <Input
                    label="Horário de fim"
                    placeholder="16:00"
                    inputMode="numeric"
                    value={equipment.endTime ?? ""}
                    onChange={(e) => updateEquipment(index, "endTime", formatTimeInput(e.target.value))}
                  />
                  <Select
                    label="Status"
                    options={RDO_EQUIPMENT_STATUS_OPTIONS}
                    value={equipment.status ?? "IDLE"}
                    onChange={(e) => updateEquipment(index, "status", e.target.value as RdoEquipmentStatus)}
                  />
                  <Textarea
                    label="Observações"
                    placeholder="Opcional"
                    value={equipment.notes ?? ""}
                    onChange={(e) => updateEquipment(index, "notes", e.target.value)}
                    className="sm:col-span-2 lg:col-span-3"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange("equipments", [...values.equipments, emptyEquipment()])}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden="true" />
          Adicionar Equipamento
        </Button>
      </section>
    </div>
  );
}
