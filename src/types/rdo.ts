import type { UserRole } from "@/types/user";

export type RdoStatus =
  | "DRAFT"
  | "SENT_TO_REVIEW"
  | "UNDER_EXTERNAL_REVIEW"
  | "EXTERNAL_APPROVED"
  | "REJECTED_BY_EXTERNAL"
  | "UNDER_SUAPE_REVIEW"
  | "APPROVED"
  | "REJECTED_BY_SUAPE"
  | "SIGNATURE_PENDING"
  | "SIGNED"
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
export type RdoReviewStage = "EXTERNAL" | "SUAPE";
export type RdoReviewDecision = "APPROVED" | "REJECTED";

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

export interface RdoTeam {
  id: string;
  rdoId: string;
  workUserId?: string | null;
  name: string;
  function: string;
  quantity: number;
  startTime?: string | null;
  endTime?: string | null;
  company?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RdoEquipment {
  id: string;
  rdoId: string;
  name: string;
  identifier?: string | null;
  quantity: number;
  operator?: string | null;
  hours?: number | null;
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
  capturedAt?: string | null;
  uploadedBy: RdoAuthorSummary;
  uploadStatus: RdoEvidenceUploadStatus;
  validationStatus: RdoEvidenceValidationStatus;
  validatedBy?: RdoAuthorSummary | null;
  validatedAt?: string | null;
  createdAt: string;
  url: string;
}

export interface RdoReview {
  id: string;
  rdoId: string;
  stage: RdoReviewStage;
  decision: RdoReviewDecision;
  comments?: string | null;
  reviewer: RdoAuthorSummary;
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
  teams: RdoTeam[];
  equipments: RdoEquipment[];
  weather: RdoWeather | null;
  occurrences: RdoOccurrence[];
  nonConformities: RdoNonConformity[];
  evidences: RdoEvidence[];
  reviews: RdoReview[];
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

export interface RdoTeamInput {
  workUserId?: string;
  name: string;
  function: string;
  quantity: number;
  startTime?: string;
  endTime?: string;
  company?: string;
  notes?: string;
}

export interface RdoEquipmentInput {
  name: string;
  identifier?: string;
  quantity?: number;
  operator?: string;
  hours?: number;
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
  teams?: RdoTeamInput[];
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

export interface ReviewActionRequest {
  comments?: string;
}

export interface ReopenRdoRequest {
  reason?: string;
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
  capturedAt?: string;
}

export interface UpdateEvidenceRequest {
  caption?: string;
  validationStatus?: RdoEvidenceValidationStatus;
}
