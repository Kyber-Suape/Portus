export type OrganizationType =
  | "SUAPE"
  | "SUPPLIER"
  | "EXTERNAL_INSPECTION"
  | "CONSULTING"
  | "AUDIT"
  | "OTHER";

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  organizationType: OrganizationType;
  institutionalEmail: string;
  institutionalPhone: string;
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement?: string | null;
  legalResponsibleName: string;
  legalResponsibleCpf: string;
  legalResponsibleEmail: string;
  legalResponsiblePhone: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateOrganizationRequest = Partial<
  Omit<Organization, "id" | "createdAt" | "updatedAt">
>;
