import type { StatusTone } from "@/constants/status";
import type { UserRole } from "@/types/user";
import type { RdoSignatureMethod, RdoSignatureStepStatus } from "@/types/rdo";

export interface RdoSignatureChainDefinition {
  order: number;
  signerRole: UserRole;
  signerLabel: string;
}

/** Cadeia fixa de 4 signatários liberada em sequência após `FINAL_APPROVED` (ver `rdos.service.ts`). */
export const RDO_SIGNATURE_CHAIN: RdoSignatureChainDefinition[] = [
  { order: 1, signerRole: "SUPPLIER", signerLabel: "Responsável Inicial / Fornecedor" },
  { order: 2, signerRole: "EXTERNAL_INSPECTOR", signerLabel: "Fiscal Externo" },
  { order: 3, signerRole: "SUAPE_INSPECTOR", signerLabel: "Fiscal SUAPE" },
  { order: 4, signerRole: "SYSTEM_ADMIN", signerLabel: "Gestor/Administrador Autorizado" },
];

/** Só a etapa `CURRENT` pode ser assinada, e só pelo papel dono dela — `SYSTEM_ADMIN` tem
 * acesso a todas as etapas (mesma convenção de "acesso total" usada nas permissões reais). */
export function canActOnSignatureStep(userRole: UserRole, step: { status: RdoSignatureStepStatus; signerRole: UserRole }): boolean {
  if (step.status !== "CURRENT") return false;
  return userRole === "SYSTEM_ADMIN" || userRole === step.signerRole;
}

export const RDO_SIGNATURE_STEP_STATUS_CONFIG: Record<RdoSignatureStepStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Aguardando", tone: "muted" },
  CURRENT: { label: "Disponível para assinatura", tone: "warning" },
  SIGNED: { label: "Assinado", tone: "success" },
  BLOCKED: { label: "Bloqueado", tone: "muted" },
};

export const RDO_SIGNATURE_METHOD_OPTIONS: { value: RdoSignatureMethod; label: string }[] = [
  { value: "GOV_BR", label: "Gov.br" },
  { value: "DIGITAL_CERTIFICATE", label: "Certificado Digital" },
  { value: "MOCK_SIGNATURE", label: "Assinatura Simulada" },
];

export const RDO_SIGNATURE_METHOD_LABELS: Record<RdoSignatureMethod, string> = Object.fromEntries(
  RDO_SIGNATURE_METHOD_OPTIONS.map((option) => [option.value, option.label]),
) as Record<RdoSignatureMethod, string>;

function randomHex(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join("");
}

/** Protocolo mockado para demonstração — nunca uma assinatura eletrônica real. Ex.: "SIG-RDO-2026-0001-A8F92C". */
export function generateMockSignatureHash(rdoNumber: number): string {
  const year = new Date().getFullYear();
  return `SIG-RDO-${year}-${String(rdoNumber).padStart(4, "0")}-${randomHex(6)}`;
}
