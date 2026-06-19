import type { StatusTone } from "@/constants/status";
import type {
  GroundStatus,
  RdoActivityStatus,
  RdoEquipmentStatus,
  RdoEvidenceType,
  RdoEvidenceValidationStatus,
  RdoNonConformityStatus,
  RdoOccurrenceType,
  RdoSeverity,
  RdoShift,
  RdoStatus,
  WeatherCondition,
} from "@/types/rdo";

export const RDO_STATUS_CONFIG: Record<RdoStatus, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Rascunho", tone: "muted" },
  SENT_TO_REVIEW: { label: "Enviado para revisão", tone: "warning" },
  UNDER_EXTERNAL_REVIEW: { label: "Em revisão externa", tone: "warning" },
  EXTERNAL_APPROVED: { label: "Aprovado (externo)", tone: "accent" },
  REJECTED_BY_EXTERNAL: { label: "Reprovado (externo)", tone: "danger" },
  UNDER_SUAPE_REVIEW: { label: "Em revisão SUAPE", tone: "warning" },
  APPROVED: { label: "Aprovado", tone: "success" },
  REJECTED_BY_SUAPE: { label: "Reprovado (SUAPE)", tone: "danger" },
  SIGNATURE_PENDING: { label: "Aguardando assinatura", tone: "accent" },
  SIGNED: { label: "Assinado", tone: "success" },
  REOPENED: { label: "Reaberto", tone: "warning" },
  CANCELED: { label: "Cancelado", tone: "muted" },
};

export const RDO_SHIFT_LABELS: Record<RdoShift, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  NIGHT: "Noite",
};

export const RDO_ACTIVITY_STATUS_OPTIONS: { value: RdoActivityStatus; label: string }[] = [
  { value: "IN_PROGRESS", label: "Em execução" },
  { value: "STOPPED", label: "Paralisado" },
  { value: "COMPLETED", label: "Concluído" },
];

export const RDO_EQUIPMENT_STATUS_OPTIONS: { value: RdoEquipmentStatus; label: string }[] = [
  { value: "IN_OPERATION", label: "Em operação" },
  { value: "STOPPED", label: "Parado" },
  { value: "MAINTENANCE", label: "Manutenção" },
  { value: "IDLE", label: "Ocioso" },
];

export const WEATHER_CONDITION_OPTIONS: { value: WeatherCondition; label: string }[] = [
  { value: "SUNNY", label: "Sol" },
  { value: "RAINY", label: "Chuva" },
  { value: "CLOUDY", label: "Nublado" },
];

export const GROUND_STATUS_OPTIONS: { value: GroundStatus; label: string }[] = [
  { value: "DRY", label: "Seco" },
  { value: "WET", label: "Úmido" },
  { value: "MUDDY", label: "Encharcado" },
];

export const RDO_OCCURRENCE_TYPE_OPTIONS: { value: RdoOccurrenceType; label: string }[] = [
  { value: "SAFETY", label: "Segurança" },
  { value: "OPERATIONAL", label: "Operacional" },
  { value: "ENVIRONMENTAL", label: "Ambiental" },
  { value: "QUALITY", label: "Qualidade" },
  { value: "OTHER", label: "Outro" },
];

export const RDO_SEVERITY_CONFIG: Record<RdoSeverity, { label: string; tone: StatusTone }> = {
  LOW: { label: "Baixa", tone: "muted" },
  MEDIUM: { label: "Média", tone: "warning" },
  HIGH: { label: "Alta", tone: "danger" },
  CRITICAL: { label: "Crítica", tone: "danger" },
};

export const RDO_SEVERITY_OPTIONS: { value: RdoSeverity; label: string }[] = (
  Object.entries(RDO_SEVERITY_CONFIG) as [RdoSeverity, { label: string; tone: StatusTone }][]
).map(([value, { label }]) => ({ value, label }));

export const RDO_NON_CONFORMITY_STATUS_LABELS: Record<RdoNonConformityStatus, string> = {
  OPEN: "Aberta",
  IN_ANALYSIS: "Em análise",
  RESOLVED: "Resolvida",
};

export const RDO_EVIDENCE_TYPE_OPTIONS: { value: RdoEvidenceType; label: string }[] = [
  { value: "PHOTO", label: "Foto" },
  { value: "VIDEO", label: "Vídeo" },
  { value: "FILE", label: "Arquivo" },
];

export const RDO_EVIDENCE_VALIDATION_CONFIG: Record<RdoEvidenceValidationStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Pendente", tone: "warning" },
  VALIDATED: { label: "Validada", tone: "success" },
  REJECTED: { label: "Rejeitada", tone: "danger" },
};

const EDITABLE_STATUSES: RdoStatus[] = ["DRAFT", "REJECTED_BY_EXTERNAL", "REJECTED_BY_SUAPE", "REOPENED"];
const REOPENABLE_STATUSES: RdoStatus[] = ["APPROVED", "REJECTED_BY_SUAPE", "REJECTED_BY_EXTERNAL"];

export function isRdoEditable(status: RdoStatus): boolean {
  return EDITABLE_STATUSES.includes(status);
}

export function isRdoReopenable(status: RdoStatus): boolean {
  return REOPENABLE_STATUSES.includes(status);
}
