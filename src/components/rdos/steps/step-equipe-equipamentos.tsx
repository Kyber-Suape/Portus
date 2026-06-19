import { Plus, Trash2, Truck, UserCog, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SearchSelect } from "@/components/ui/search-select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { RDO_EQUIPMENT_STATUS_OPTIONS } from "@/constants/rdo";
import { WORK_FUNCTION_OPTIONS } from "@/constants/work-functions";
import type { RdoEquipmentInput, RdoEquipmentStatus, RdoTeamInput } from "@/types/rdo";
import type { RdoWizardStepProps } from "../rdo-wizard-types";

function emptyTeam(): RdoTeamInput {
  return { workUserId: undefined, name: "", function: "", quantity: 1 };
}

function emptyEquipment(): RdoEquipmentInput {
  return { name: "", quantity: 1, status: "IDLE" };
}

const IN_USE_STATUSES: RdoEquipmentStatus[] = ["IN_OPERATION", "MAINTENANCE"];

export function StepEquipeEquipamentos({ values, onChange, work }: RdoWizardStepProps) {
  const obraTeam = work?.team.filter((member) => member.status !== "REMOVED") ?? [];
  const memberOptions = obraTeam.map((member) => ({
    value: member.id,
    label: member.userName,
    description: `${member.function} · ${member.userEmail}`,
  }));

  const totalProfessionals = values.teams.reduce((sum, team) => sum + (team.quantity || 0), 0);
  const equipmentInUse = values.equipments.filter((e) => IN_USE_STATUSES.includes(e.status ?? "IDLE")).length;
  const equipmentIdleOrStopped = values.equipments.length - equipmentInUse;

  function updateTeam<K extends keyof RdoTeamInput>(index: number, field: K, value: RdoTeamInput[K]) {
    const next = values.teams.map((team, i) => (i === index ? { ...team, [field]: value } : team));
    onChange("teams", next);
  }

  function updateEquipment<K extends keyof RdoEquipmentInput>(index: number, field: K, value: RdoEquipmentInput[K]) {
    const next = values.equipments.map((eq, i) => (i === index ? { ...eq, [field]: value } : eq));
    onChange("equipments", next);
  }

  function handleMemberChange(index: number, memberId: string) {
    const member = obraTeam.find((m) => m.id === memberId);
    if (!member) return;
    const next = values.teams.map((team, i) =>
      i === index ? { ...team, workUserId: member.id, name: member.userName, function: team.function || member.function } : team,
    );
    onChange("teams", next);
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
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Equipes Registradas</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{values.teams.length}</p>
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

        {values.teams.length === 0 ? (
          <EmptyState icon={Users} title="Nenhuma equipe registrada" description="Adicione as equipes mobilizadas no dia." />
        ) : (
          <div className="flex flex-col gap-3">
            {values.teams.map((team, index) => (
              <div key={index} className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Equipe {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => onChange("teams", values.teams.filter((_, i) => i !== index))}
                    aria-label={`Remover equipe ${index + 1}`}
                    className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <SearchSelect
                    label="Profissional / equipe da obra"
                    placeholder="Selecione na equipe da obra..."
                    searchPlaceholder="Buscar por nome ou e-mail..."
                    options={memberOptions}
                    value={team.workUserId ?? ""}
                    onChange={(memberId) => handleMemberChange(index, memberId)}
                  />
                  <SearchSelect
                    label="Função no RDO"
                    placeholder="Selecione a função..."
                    searchPlaceholder="Buscar função..."
                    options={WORK_FUNCTION_OPTIONS}
                    value={team.function}
                    onChange={(fn) => updateTeam(index, "function", fn)}
                  />
                  <Input
                    label="Quantidade"
                    type="number"
                    min={1}
                    value={team.quantity}
                    onChange={(e) => updateTeam(index, "quantity", Number(e.target.value))}
                  />
                  <Input label="Início" placeholder="07:00" value={team.startTime ?? ""} onChange={(e) => updateTeam(index, "startTime", e.target.value)} />
                  <Input label="Fim" placeholder="16:00" value={team.endTime ?? ""} onChange={(e) => updateTeam(index, "endTime", e.target.value)} />
                  <Input label="Empresa" value={team.company ?? ""} onChange={(e) => updateTeam(index, "company", e.target.value)} />
                  <Textarea
                    label="Observações"
                    placeholder="Opcional"
                    value={team.notes ?? ""}
                    onChange={(e) => updateTeam(index, "notes", e.target.value)}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button type="button" variant="outline" size="sm" onClick={() => onChange("teams", [...values.teams, emptyTeam()])} className="self-start">
          <Plus className="size-4" aria-hidden="true" />
          Adicionar Equipe
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
                  <Input label="Nome" value={equipment.name} onChange={(e) => updateEquipment(index, "name", e.target.value)} />
                  <Input label="Identificação" placeholder="EX-104" value={equipment.identifier ?? ""} onChange={(e) => updateEquipment(index, "identifier", e.target.value)} />
                  <Input
                    label="Quantidade"
                    type="number"
                    min={1}
                    value={equipment.quantity ?? 1}
                    onChange={(e) => updateEquipment(index, "quantity", Number(e.target.value))}
                  />
                  <Input label="Operador" value={equipment.operator ?? ""} onChange={(e) => updateEquipment(index, "operator", e.target.value)} />
                  <Input
                    label="Horas"
                    type="number"
                    min={0}
                    step="0.5"
                    value={equipment.hours ?? 0}
                    onChange={(e) => updateEquipment(index, "hours", Number(e.target.value))}
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
