import type { StatusTone } from "@/constants/status";
import type { WorkStatus, WorkTeamMemberStatus } from "@/types/work";

export const WORK_STATUS_CONFIG: Record<WorkStatus, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Rascunho", tone: "muted" },
  ACTIVE: { label: "Ativa", tone: "success" },
  PAUSED: { label: "Paralisada", tone: "warning" },
  COMPLETED: { label: "Concluída", tone: "accent" },
  CANCELED: { label: "Cancelada", tone: "danger" },
  EXPIRED: { label: "Expirada", tone: "muted" },
};

export const WORK_TEAM_MEMBER_STATUS_CONFIG: Record<WorkTeamMemberStatus, { label: string; tone: StatusTone }> = {
  ACTIVE: { label: "Ativo", tone: "success" },
  INVITED: { label: "Convidado", tone: "warning" },
  REMOVED: { label: "Removido", tone: "muted" },
};

export const WORK_CONTRACT_TYPE_OPTIONS = [
  { value: "Empreitada global", label: "Empreitada global" },
  { value: "Empreitada por preço unitário", label: "Empreitada por preço unitário" },
  { value: "Fornecimento", label: "Fornecimento" },
  { value: "Manutenção", label: "Manutenção" },
  { value: "Consultoria/Fiscalização", label: "Consultoria/Fiscalização" },
  { value: "Outro", label: "Outro" },
];

export const WORK_DOCUMENT_TYPE_OPTIONS = [
  { value: "ART/RRT", label: "ART/RRT" },
  { value: "Ordem de Serviço", label: "Ordem de Serviço" },
  { value: "Memorial Descritivo", label: "Memorial Descritivo" },
  { value: "Planta/Projeto", label: "Planta/Projeto" },
  { value: "Licença Ambiental", label: "Licença Ambiental" },
  { value: "Outro", label: "Outro" },
];

export const WORK_ADDITIVE_TYPE_OPTIONS = [
  { value: "Prazo", label: "Prazo" },
  { value: "Valor", label: "Valor" },
  { value: "Escopo", label: "Escopo" },
  { value: "Outro", label: "Outro" },
];
