export type WorkStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELED" | "EXPIRED";

export type WorkTeamMemberStatus = "ACTIVE" | "INVITED" | "REMOVED";

export interface WorkTeamMember {
  id: string;
  workId: string;
  userId: string;
  userName: string;
  userEmail: string;
  function: string;
  status: WorkTeamMemberStatus;
  createdAt: string;
}

export interface WorkDocument {
  id: string;
  workId: string;
  title: string;
  type: string;
  fileName: string;
  url: string;
  createdAt: string;
}

export interface WorkAdditive {
  id: string;
  workId: string;
  description: string;
  type: string;
  newEndDate?: string | null;
  createdAt: string;
}

export interface Work {
  id: string;
  name: string;
  contractNumber?: string;
  contractObject?: string;
  description?: string;
  contractType?: string;
  status: WorkStatus;
  location?: string;
  contractedCompanyName: string;
  contractedCompanyCnpj: string;
  contractedCompanyResponsibleName: string;
  contractedCompanyResponsibleEmail?: string;
  contractedCompanyResponsiblePhone?: string;
  suapeInspectorName: string;
  externalInspectorName?: string;
  contractManagerName?: string;
  contractStartDate: string;
  contractEndDate: string;
  executionStartDate?: string;
  expectedCompletionDate?: string;
  durationDays?: number;
  notes?: string;
  team: WorkTeamMember[];
  documents: WorkDocument[];
  additives: WorkAdditive[];
  rdoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkInput {
  name: string;
  contractNumber?: string;
  contractObject?: string;
  description?: string;
  contractType?: string;
  status: WorkStatus;
  location?: string;
  contractedCompanyName: string;
  contractedCompanyCnpj: string;
  contractedCompanyResponsibleName: string;
  contractedCompanyResponsibleEmail?: string;
  contractedCompanyResponsiblePhone?: string;
  suapeInspectorName: string;
  externalInspectorName?: string;
  contractManagerName?: string;
  contractStartDate: string;
  contractEndDate: string;
  executionStartDate?: string;
  expectedCompletionDate?: string;
  durationDays?: number;
  notes?: string;
}

export type UpdateWorkInput = Partial<CreateWorkInput>;

export interface ListWorksQuery {
  q?: string;
  status?: WorkStatus;
}

export interface AddWorkTeamMemberInput {
  userId: string;
  userName: string;
  userEmail: string;
  function: string;
}

export interface UpdateWorkTeamMemberInput {
  function?: string;
  status?: WorkTeamMemberStatus;
}

export interface AddWorkDocumentInput {
  title: string;
  type: string;
  fileName: string;
}

export interface AddWorkAdditiveInput {
  description: string;
  type: string;
  newEndDate?: string;
}
