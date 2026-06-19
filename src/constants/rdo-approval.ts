import { CheckCircle2, FileEdit, RotateCcw, Send, ShieldCheck, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StatusTone } from "@/constants/status";
import type { UserRole } from "@/types/user";
import type { RdoApprovalHistoryAction, RdoApprovalStepStatus } from "@/types/rdo";

export interface RdoApprovalChainDefinition {
  order: number;
  reviewerRole: UserRole;
  reviewerLabel: string;
}

/** Cadeia fixa de 3 aprovadores após o responsável inicial — usada para inicializar
 * `approvalSteps` ao enviar um RDO para revisão (ver `rdos.service.ts`). */
export const RDO_APPROVAL_CHAIN: RdoApprovalChainDefinition[] = [
  { order: 1, reviewerRole: "EXTERNAL_INSPECTOR", reviewerLabel: "1º Aprovador — Fiscal Externo" },
  { order: 2, reviewerRole: "SUAPE_INSPECTOR", reviewerLabel: "2º Aprovador — Fiscal SUAPE" },
  { order: 3, reviewerRole: "SYSTEM_ADMIN", reviewerLabel: "3º Aprovador — Gestor/Administrador" },
];

/** Só a etapa `CURRENT` pode ser decidida, e só pelo papel dono dela — `SYSTEM_ADMIN` tem
 * acesso a todas as etapas (mesma convenção de "acesso total" usada nas permissões reais). */
export function canActOnApprovalStep(userRole: UserRole, step: { status: RdoApprovalStepStatus; reviewerRole: UserRole }): boolean {
  if (step.status !== "CURRENT") return false;
  return userRole === "SYSTEM_ADMIN" || userRole === step.reviewerRole;
}

export const RDO_APPROVAL_STEP_STATUS_CONFIG: Record<RdoApprovalStepStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Aguardando", tone: "muted" },
  CURRENT: { label: "Em análise", tone: "warning" },
  APPROVED: { label: "Aprovado", tone: "success" },
  REJECTED: { label: "Reprovado", tone: "danger" },
  CHANGES_REQUESTED: { label: "Ajustes solicitados", tone: "warning" },
  BLOCKED: { label: "Bloqueado", tone: "muted" },
};

export const RDO_APPROVAL_HISTORY_CONFIG: Record<RdoApprovalHistoryAction, { label: string; icon: LucideIcon; tone: StatusTone }> = {
  SUBMITTED: { label: "RDO enviado para revisão", icon: Send, tone: "primary" },
  APPROVED: { label: "Etapa aprovada", icon: CheckCircle2, tone: "success" },
  REJECTED: { label: "Etapa reprovada", icon: XCircle, tone: "danger" },
  CHANGES_REQUESTED: { label: "Ajustes solicitados", icon: FileEdit, tone: "warning" },
  RESENT: { label: "RDO reenviado após ajustes", icon: Send, tone: "primary" },
  LOCKED: { label: "RDO bloqueado para edição", icon: ShieldCheck, tone: "muted" },
  REOPENED: { label: "RDO reaberto", icon: RotateCcw, tone: "warning" },
};
