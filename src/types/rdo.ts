import type { UserRole } from "@/types/user";

/**
 * Estados "de repouso" (persistem até a próxima ação): DRAFT, SENT_TO_REVIEW (só entre o envio
 * e a entrada na fila do 1º aprovador — ver `rdos.service.ts`), UNDER_REVIEW, CHANGES_REQUESTED,
 * REJECTED, SIGNATURE_PENDING, PARTIALLY_SIGNED, COMPLETED, REOPENED, CANCELED.
 * Estados "transitórios" (só aparecem como `toStatus` no histórico, nunca como `rdo.status`
 * por mais que um instante): APPROVED_BY_REVIEWER_1/2/3, FINAL_APPROVED, LOCKED, SIGNED — cada
 * um marca um evento específico no histórico antes do RDO assentar no próximo estado de
 * repouso (mesmo padrão usado para SENT_TO_REVIEW/EXTERNAL_APPROVED no fluxo anterior).
 */
export type RdoStatus =
  | "DRAFT"
  | "SENT_TO_REVIEW"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "REJECTED"
  | "APPROVED_BY_REVIEWER_1"
  | "APPROVED_BY_REVIEWER_2"
  | "APPROVED_BY_REVIEWER_3"
  | "FINAL_APPROVED"
  | "LOCKED"
  | "SIGNATURE_PENDING"
  | "PARTIALLY_SIGNED"
  | "SIGNED"
  | "COMPLETED"
  | "REOPENED"
  | "CANCELED";

export type RdoShift = "MORNING" | "AFTERNOON" | "NIGHT";
export type RdoActivityStatus = "IN_PROGRESS" | "STOPPED" | "COMPLETED";
export type RdoEquipmentStatus = "IN_OPERATION" | "STOPPED" | "MAINTENANCE" | "IDLE";
export type WeatherCondition = "SUNNY" | "RAINY" | "CLOUDY";
export type GroundStatus = "DRY" | "WET" | "MUDDY";
export type RdoOccurrenceType = "SAFETY" | "OPERATIONAL" | "ENVIRONMENTAL" | "QUALITY" | "OTHER";
export type RdoSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RdoNonConformityStatus = "OPEN" | "IN_ANALYSIS" | "RESOLVED";
export type RdoEvidenceType = "PHOTO" | "VIDEO" | "FILE";
export type RdoEvidenceUploadStatus = "PENDING" | "UPLOADING" | "UPLOADED" | "FAILED";
export type RdoEvidenceValidationStatus = "PENDING" | "VALIDATED" | "REJECTED";
export type RdoEvidenceGeoStatus = "VALIDATED" | "PENDING" | "UNAVAILABLE";

export type RdoApprovalStepStatus = "PENDING" | "CURRENT" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "BLOCKED";
export type RdoApprovalAction = "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
export type RdoApprovalHistoryAction =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED"
  | "RESENT"
  | "LOCKED"
  | "REOPENED";

export type RdoSignatureStepStatus = "PENDING" | "CURRENT" | "SIGNED" | "BLOCKED";
export type RdoSignatureMethod = "GOV_BR" | "DIGITAL_CERTIFICATE" | "MOCK_SIGNATURE";
export type RdoSignatureHistoryAction = "SIGNATURE_REQUESTED" | "SIGNED";

export interface RdoAuthorSummary {
  id: string;
  name: string;
  role: UserRole;
}

export interface RdoActivity {
  id: string;
  rdoId: string;
  category: string;
  description: string;
  status: RdoActivityStatus;
  aiSuggestionUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RdoProfessional {
  id: string;
  rdoId: string;
  workUserId?: string | null;
  name: string;
  function: string;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RdoEquipment {
  id: string;
  rdoId: string;
  name: string;
  identifier?: string | null;
  operator?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  status: RdoEquipmentStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RdoWeather {
  id: string;
  rdoId: string;
  morningCondition?: WeatherCondition | null;
  afternoonCondition?: WeatherCondition | null;
  nightCondition?: WeatherCondition | null;
  minTemperature?: number | null;
  maxTemperature?: number | null;
  groundStatus: GroundStatus;
  hadStoppage: boolean;
  stoppageReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RdoOccurrence {
  id: string;
  rdoId: string;
  type: RdoOccurrenceType;
  location: string;
  severity: RdoSeverity;
  summary: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RdoNonConformity {
  id: string;
  rdoId: string;
  code: string;
  title: string;
  description: string;
  severity: RdoSeverity;
  status: RdoNonConformityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RdoEvidenceLocation {
  country?: string | null;
  state?: string | null;
  city?: string | null;
  neighborhood?: string | null;
}

export interface RdoEvidence {
  id: string;
  rdoId: string;
  type: RdoEvidenceType;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  caption?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  accuracyMeters?: number | null;
  altitudeMeters?: number | null;
  location?: RdoEvidenceLocation | null;
  geoStatus: RdoEvidenceGeoStatus;
  capturedAt?: string | null;
  uploadedBy: RdoAuthorSummary;
  uploadStatus: RdoEvidenceUploadStatus;
  validationStatus: RdoEvidenceValidationStatus;
  validatedBy?: RdoAuthorSummary | null;
  validatedAt?: string | null;
  createdAt: string;
  url: string;
}

/** Uma das 3 etapas fixas da cadeia de aprovadores. `reviewerRole` define quem está habilitado a
 * agir (ver `isCurrentApprover` em `constants/rdo-approval.ts`) — não é vinculado a uma pessoa
 * específica, pelo mesmo motivo que o RDO não amarra revisor a usuário: o cargo/papel é quem
 * ocupa a fila, não o indivíduo. */
export interface RdoApprovalStep {
  id: string;
  rdoId: string;
  order: number;
  reviewerRole: UserRole;
  reviewerLabel: string;
  status: RdoApprovalStepStatus;
  action?: RdoApprovalAction | null;
  comment?: string | null;
  requestedChanges?: string | null;
  actedBy?: RdoAuthorSummary | null;
  actedAt?: string | null;
}

export interface RdoApprovalHistoryItem {
  id: string;
  rdoId: string;
  stepOrder?: number | null;
  action: RdoApprovalHistoryAction;
  comment?: string | null;
  requestedChanges?: string | null;
  actor: RdoAuthorSummary;
  createdAt: string;
}

/** Uma das 4 etapas fixas da cadeia de assinatura, liberada na ordem após `FINAL_APPROVED`. */
export interface RdoSignatureStep {
  id: string;
  rdoId: string;
  order: number;
  signerRole: UserRole;
  signerLabel: string;
  status: RdoSignatureStepStatus;
  signedBy?: RdoAuthorSummary | null;
  signedAt?: string | null;
  method?: RdoSignatureMethod | null;
  /** Protocolo mockado, ex.: "SIG-RDO-2026-0001-A8F92C" — nunca uma assinatura eletrônica real. */
  signatureHash?: string | null;
}

export interface RdoSignatureHistoryItem {
  id: string;
  rdoId: string;
  signerRole: UserRole;
  signerLabel: string;
  action: RdoSignatureHistoryAction;
  method?: RdoSignatureMethod | null;
  actor: RdoAuthorSummary;
  createdAt: string;
}

export interface RdoStatusHistoryEntry {
  id: string;
  rdoId: string;
  fromStatus: RdoStatus | null;
  toStatus: RdoStatus;
  reason?: string | null;
  changedBy: RdoAuthorSummary;
  createdAt: string;
}

export interface RdoComment {
  id: string;
  rdoId: string;
  authorId: string;
  body: string;
  author: RdoAuthorSummary;
  createdAt: string;
}

export interface Rdo {
  id: string;
  organizationId: string;
  number: number;
  workId: string;
  workLabel?: string | null;
  contractLabel?: string | null;
  authorId: string;
  author: RdoAuthorSummary;
  date: string;
  shift: RdoShift;
  siteEngineerName: string;
  siteEngineerRegistry?: string | null;
  foremanName?: string | null;
  notes?: string | null;
  status: RdoStatus;
  submittedAt?: string | null;
  activities: RdoActivity[];
  professionals: RdoProfessional[];
  equipments: RdoEquipment[];
  weather: RdoWeather | null;
  occurrences: RdoOccurrence[];
  nonConformities: RdoNonConformity[];
  evidences: RdoEvidence[];
  approvalSteps: RdoApprovalStep[];
  approvalHistory: RdoApprovalHistoryItem[];
  signatureSteps: RdoSignatureStep[];
  signatureHistory: RdoSignatureHistoryItem[];
  statusHistory: RdoStatusHistoryEntry[];
  comments: RdoComment[];
  createdAt: string;
  updatedAt: string;
}

export interface RdoSummary {
  id: string;
  number: number;
  workId: string;
  workLabel?: string | null;
  contractLabel?: string | null;
  date: string;
  shift: RdoShift;
  status: RdoStatus;
  author: RdoAuthorSummary;
  evidenceCount: number;
  nonConformityCount: number;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRdoRequest {
  workId: string;
  date: string;
  shift: RdoShift;
  siteEngineerName: string;
  siteEngineerRegistry?: string;
  foremanName?: string;
  notes?: string;
}

export interface RdoActivityInput {
  category: string;
  description: string;
  status?: RdoActivityStatus;
  aiSuggestionUsed?: boolean;
}

export interface RdoProfessionalInput {
  workUserId?: string;
  name: string;
  function: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface RdoEquipmentInput {
  name: string;
  identifier?: string;
  operator?: string;
  startTime?: string;
  endTime?: string;
  status?: RdoEquipmentStatus;
  notes?: string;
}

export interface RdoWeatherInput {
  morningCondition?: WeatherCondition;
  afternoonCondition?: WeatherCondition;
  nightCondition?: WeatherCondition;
  minTemperature?: number;
  maxTemperature?: number;
  groundStatus?: GroundStatus;
  hadStoppage?: boolean;
  stoppageReason?: string;
}

export interface RdoOccurrenceInput {
  type: RdoOccurrenceType;
  location: string;
  severity: RdoSeverity;
  summary: string;
  description?: string;
}

export interface RdoNonConformityInput {
  title: string;
  description: string;
  severity: RdoSeverity;
  status?: RdoNonConformityStatus;
}

export interface UpdateRdoRequest {
  date?: string;
  shift?: RdoShift;
  siteEngineerName?: string;
  siteEngineerRegistry?: string;
  foremanName?: string;
  notes?: string;
  activities?: RdoActivityInput[];
  professionals?: RdoProfessionalInput[];
  equipments?: RdoEquipmentInput[];
  weather?: RdoWeatherInput;
  occurrences?: RdoOccurrenceInput[];
  nonConformities?: RdoNonConformityInput[];
}

export interface ListRdosQuery {
  page?: number;
  pageSize?: number;
  status?: RdoStatus;
  q?: string;
  workId?: string;
}

export interface ApproveStepRequest {
  comment?: string;
}

export interface RejectStepRequest {
  comment: string;
}

export interface RequestChangesStepRequest {
  requestedChanges: string;
}

export interface SignStepRequest {
  method: RdoSignatureMethod;
}

export interface ReopenRdoRequest {
  reason: string;
}

export interface CreateCommentRequest {
  body: string;
}

export interface EvidenceUploadMeta {
  type: RdoEvidenceType;
  caption?: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  altitudeMeters?: number;
  location?: RdoEvidenceLocation;
  geoStatus?: RdoEvidenceGeoStatus;
  capturedAt?: string;
}

export interface UpdateEvidenceRequest {
  caption?: string;
  validationStatus?: RdoEvidenceValidationStatus;
}
