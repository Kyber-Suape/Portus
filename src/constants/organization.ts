import type { OrganizationType } from "@/types/organization";

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  SUAPE: "SUAPE",
  SUPPLIER: "Empresa Executora / Fornecedora",
  EXTERNAL_INSPECTION: "Fiscalização Externa",
  CONSULTING: "Consultoria",
  AUDIT: "Auditoria",
  OTHER: "Outro",
};

export const ORGANIZATION_TYPE_OPTIONS: { value: OrganizationType; label: string }[] = Object.entries(
  ORGANIZATION_TYPE_LABELS,
).map(([value, label]) => ({ value: value as OrganizationType, label }));
