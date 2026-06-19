import type { UserRole } from "@/types/user";

export const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "Administrador do Sistema",
  SUAPE_INSPECTOR: "Fiscal SUAPE",
  EXTERNAL_INSPECTOR: "Fiscal Externo",
  SUPPLIER: "Fornecedor / Empresa Executora",
  AUDITOR: "Consulta / Auditoria",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "Governança geral da plataforma: usuários, obras, permissões e auditoria.",
  SUAPE_INSPECTOR: "Validação final do RDO, supervisão contratual e assinatura digital.",
  EXTERNAL_INSPECTOR: "Revisão técnica preliminar dos RDOs enviados pelo fornecedor.",
  SUPPLIER: "Execução da obra e preenchimento dos Relatórios Diários.",
  AUDITOR: "Acesso somente leitura para visualização e auditoria.",
};

export const VINCULO_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "SUPPLIER", label: "Fornecedor / Executor" },
  { value: "EXTERNAL_INSPECTOR", label: "Fiscalização Externa" },
  { value: "SUAPE_INSPECTOR", label: "Fiscal SUAPE" },
  { value: "AUDITOR", label: "Auditoria" },
  { value: "SYSTEM_ADMIN", label: "Administrador do Sistema" },
];
