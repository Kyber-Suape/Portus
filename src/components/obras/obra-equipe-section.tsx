"use client";

import { useState } from "react";
import { Plus, Trash2, UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchSelect } from "@/components/ui/search-select";
import { usePermissions } from "@/hooks/use-permissions";
import { useWork } from "@/hooks/use-work";
import { WORK_FUNCTION_OPTIONS } from "@/constants/work-functions";
import { WORK_TEAM_MEMBER_STATUS_CONFIG } from "@/constants/work";
import { AddTeamMemberModal } from "./add-team-member-modal";
import type { Work } from "@/types/work";

interface ObraEquipeSectionProps {
  work: Work;
  onChanged: (work: Work) => void;
}

export function ObraEquipeSection({ work, onChanged }: ObraEquipeSectionProps) {
  const { can } = usePermissions();
  const { addTeamMember, updateTeamMember, removeTeamMember } = useWork(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const team = work.team.filter((member) => member.status !== "REMOVED");

  async function handleAdd(input: { userId: string; userName: string; userEmail: string; function: string }) {
    await addTeamMember(work.id, input);
    onChanged({ ...work, team: [...work.team, { ...input, id: crypto.randomUUID(), workId: work.id, status: "ACTIVE", createdAt: new Date().toISOString() }] });
  }

  async function handleFunctionChange(memberId: string, fn: string) {
    await updateTeamMember(work.id, memberId, { function: fn });
    onChanged({ ...work, team: work.team.map((m) => (m.id === memberId ? { ...m, function: fn } : m)) });
  }

  async function handleRemove(memberId: string) {
    await removeTeamMember(work.id, memberId);
    onChanged({ ...work, team: work.team.map((m) => (m.id === memberId ? { ...m, status: "REMOVED" as const } : m)) });
  }

  return (
    <Card id="equipe" className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <UserCog className="size-4" aria-hidden="true" />
          Equipe da Obra
        </h2>
        {can("work_users:create") && (
          <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Adicionar Membro
          </Button>
        )}
      </div>

      {team.length === 0 ? (
        <EmptyState icon={UserCog} title="Nenhum membro vinculado" description="Adicione usuários reais da organização à equipe desta obra." />
      ) : (
        <div className="flex flex-col gap-2">
          {team.map((member) => (
            <div key={member.id} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{member.userName}</span>
                <span className="text-xs text-muted-foreground">{member.userEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-48">
                  <SearchSelect
                    label="Função"
                    options={WORK_FUNCTION_OPTIONS}
                    value={member.function}
                    onChange={(fn) => handleFunctionChange(member.id, fn)}
                    disabled={!can("work_users:update")}
                  />
                </div>
                <Badge tone={WORK_TEAM_MEMBER_STATUS_CONFIG[member.status].tone}>
                  {WORK_TEAM_MEMBER_STATUS_CONFIG[member.status].label}
                </Badge>
                {can("work_users:delete") && (
                  <button
                    type="button"
                    onClick={() => handleRemove(member.id)}
                    aria-label={`Remover ${member.userName} da equipe`}
                    className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && <AddTeamMemberModal work={work} onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
    </Card>
  );
}
