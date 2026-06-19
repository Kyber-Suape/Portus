import { RDO_APPROVAL_CHAIN } from "@/constants/rdo-approval";
import { RDO_SIGNATURE_CHAIN } from "@/constants/rdo-signature";
import type {
  Rdo,
  RdoApprovalHistoryItem,
  RdoApprovalStep,
  RdoApprovalStepStatus,
  RdoSignatureHistoryItem,
  RdoSignatureStep,
  RdoSignatureStepStatus,
  RdoStatus,
  RdoStatusHistoryEntry,
} from "@/types/rdo";

const AUTHOR = { id: "demo-fornecedor", name: "Fornecedor Demo", role: "SUPPLIER" as const };
const EXTERNAL_REVIEWER = { id: "demo-fiscal-externo", name: "Fiscal Externo Demo", role: "EXTERNAL_INSPECTOR" as const };
const SUAPE_REVIEWER = { id: "demo-fiscal-suape", name: "Fiscal SUAPE Demo", role: "SUAPE_INSPECTOR" as const };
const ADMIN = { id: "demo-admin", name: "Administrador Demo", role: "SYSTEM_ADMIN" as const };

const ACTOR_BY_ROLE = {
  SUPPLIER: AUTHOR,
  EXTERNAL_INSPECTOR: EXTERNAL_REVIEWER,
  SUAPE_INSPECTOR: SUAPE_REVIEWER,
  SYSTEM_ADMIN: ADMIN,
} as const;

function baseActivities(rdoId: string) {
  return [
    {
      id: `${rdoId}-act-1`,
      rdoId,
      category: "Concretagem",
      description: "Lançamento de concreto magro na fundação do setor A, conforme projeto estrutural.",
      status: "COMPLETED" as const,
      aiSuggestionUsed: false,
      createdAt: "2026-06-15T08:00:00.000Z",
      updatedAt: "2026-06-15T08:00:00.000Z",
    },
  ];
}

function baseProfessionals(rdoId: string) {
  return [
    {
      id: `${rdoId}-prof-1`,
      rdoId,
      name: "João Duarte",
      function: "Pedreiro",
      startTime: "07:00",
      endTime: "16:00",
      createdAt: "2026-06-15T08:00:00.000Z",
      updatedAt: "2026-06-15T08:00:00.000Z",
    },
    {
      id: `${rdoId}-prof-2`,
      rdoId,
      name: "Marcos Vinícius Pereira",
      function: "Servente",
      startTime: "07:00",
      endTime: "16:00",
      createdAt: "2026-06-15T08:00:00.000Z",
      updatedAt: "2026-06-15T08:00:00.000Z",
    },
  ];
}

function baseEquipments(rdoId: string) {
  return [
    {
      id: `${rdoId}-eq-1`,
      rdoId,
      name: "Escavadeira hidráulica",
      identifier: "EX-104",
      operator: "J. Silva",
      startTime: "07:00",
      endTime: "15:30",
      status: "IN_OPERATION" as const,
      createdAt: "2026-06-15T08:00:00.000Z",
      updatedAt: "2026-06-15T08:00:00.000Z",
    },
  ];
}

function baseWeather(rdoId: string) {
  return {
    id: `${rdoId}-weather`,
    rdoId,
    morningCondition: "SUNNY" as const,
    afternoonCondition: "CLOUDY" as const,
    nightCondition: "CLOUDY" as const,
    minTemperature: 24,
    maxTemperature: 31,
    groundStatus: "DRY" as const,
    hadStoppage: false,
    createdAt: "2026-06-15T08:00:00.000Z",
    updatedAt: "2026-06-15T08:00:00.000Z",
  };
}

function baseOccurrences(rdoId: string) {
  return [
    {
      id: `${rdoId}-occ-1`,
      rdoId,
      type: "SAFETY" as const,
      location: "Setor A",
      severity: "MEDIUM" as const,
      summary: "Uso incorreto de EPI por subcontratada.",
      description: "Colaborador identificado sem capacete na área de risco durante inspeção de rotina.",
      createdAt: "2026-06-15T08:00:00.000Z",
      updatedAt: "2026-06-15T08:00:00.000Z",
    },
  ];
}

function baseNonConformities(rdoId: string) {
  return [
    {
      id: `${rdoId}-nc-1`,
      rdoId,
      code: "NC-2026-0001",
      title: "Fissuras em viga",
      description: "Identificadas fissuras longitudinais na base da viga após a desforma do trecho.",
      severity: "HIGH" as const,
      status: "IN_ANALYSIS" as const,
      createdAt: "2026-06-15T08:00:00.000Z",
      updatedAt: "2026-06-15T08:00:00.000Z",
    },
  ];
}

function baseEvidences(rdoId: string) {
  return [
    {
      id: `${rdoId}-ev-1`,
      rdoId,
      type: "PHOTO" as const,
      fileName: "evidencia-demo.png",
      sizeBytes: 284_000,
      caption: "Fundação do setor A concluída.",
      latitude: -8.3941,
      longitude: -34.9758,
      accuracyMeters: 3.5,
      location: { country: "Brasil", state: "Pernambuco", city: "Cabo de Santo Agostinho", neighborhood: "Suape" },
      geoStatus: "VALIDATED" as const,
      uploadedBy: AUTHOR,
      uploadStatus: "UPLOADED" as const,
      validationStatus: "PENDING" as const,
      createdAt: "2026-06-15T08:30:00.000Z",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    },
  ];
}

/** Descreve até onde a cadeia de aprovação avançou e o desfecho de cada etapa — usado para
 * derivar de forma consistente `approvalSteps`, `approvalHistory` e `statusHistory`. */
interface ApprovalProgress {
  /** Quantas das 3 etapas já têm decisão (aprovada). */
  approvedThrough: 0 | 1 | 2 | 3;
  /** Se a próxima etapa (approvedThrough + 1) está parada em reprovação/ajuste, em vez de seguir em aberto. */
  outcome?: "REJECTED" | "CHANGES_REQUESTED";
  outcomeComment?: string;
}

/** Quantas das 4 assinaturas já foram coletadas, em ordem. */
type SignatureProgress = 0 | 1 | 2 | 3 | 4;

function buildApprovalSteps(progress: ApprovalProgress): RdoApprovalStep[] {
  return RDO_APPROVAL_CHAIN.map((def) => {
    const actor = ACTOR_BY_ROLE[def.reviewerRole];
    const base = {
      id: `approval-step-${def.order}`,
      rdoId: "",
      order: def.order,
      reviewerRole: def.reviewerRole,
      reviewerLabel: def.reviewerLabel,
    };

    if (def.order <= progress.approvedThrough) {
      return {
        ...base,
        status: "APPROVED" as RdoApprovalStepStatus,
        action: "APPROVED" as const,
        comment: "Conferência concluída sem pendências.",
        actedBy: actor,
        actedAt: `2026-06-1${def.order}T09:00:00.000Z`,
      };
    }

    if (def.order === progress.approvedThrough + 1) {
      if (progress.outcome === "REJECTED") {
        return {
          ...base,
          status: "REJECTED" as RdoApprovalStepStatus,
          action: "REJECTED" as const,
          comment: progress.outcomeComment,
          actedBy: actor,
          actedAt: `2026-06-1${def.order}T09:00:00.000Z`,
        };
      }
      if (progress.outcome === "CHANGES_REQUESTED") {
        return {
          ...base,
          status: "CHANGES_REQUESTED" as RdoApprovalStepStatus,
          action: "CHANGES_REQUESTED" as const,
          requestedChanges: progress.outcomeComment,
          actedBy: actor,
          actedAt: `2026-06-1${def.order}T09:00:00.000Z`,
        };
      }
      return { ...base, status: "CURRENT" as RdoApprovalStepStatus };
    }

    return { ...base, status: "PENDING" as RdoApprovalStepStatus };
  });
}

function buildApprovalHistory(progress: ApprovalProgress, hasResent: boolean): RdoApprovalHistoryItem[] {
  const history: RdoApprovalHistoryItem[] = [];
  let seq = 0;
  function push(action: RdoApprovalHistoryItem["action"], actor: RdoApprovalHistoryItem["actor"], extra: Partial<RdoApprovalHistoryItem> = {}) {
    seq += 1;
    history.push({ id: `approval-hist-${seq}`, rdoId: "", action, actor, createdAt: `2026-06-1${seq}T09:00:00.000Z`, ...extra });
  }

  push("SUBMITTED", AUTHOR);
  for (let order = 1; order <= progress.approvedThrough; order += 1) {
    const def = RDO_APPROVAL_CHAIN[order - 1];
    push("APPROVED", ACTOR_BY_ROLE[def.reviewerRole], { stepOrder: order, comment: "Conferência concluída sem pendências." });
  }
  if (progress.outcome) {
    const def = RDO_APPROVAL_CHAIN[progress.approvedThrough];
    if (progress.outcome === "REJECTED") {
      push("REJECTED", ACTOR_BY_ROLE[def.reviewerRole], { stepOrder: def.order, comment: progress.outcomeComment });
    } else {
      push("CHANGES_REQUESTED", ACTOR_BY_ROLE[def.reviewerRole], { stepOrder: def.order, requestedChanges: progress.outcomeComment });
    }
    if (hasResent) push("RESENT", AUTHOR);
  }
  if (progress.approvedThrough === 3 && !progress.outcome) {
    push("LOCKED", ADMIN);
  }
  return history;
}

function buildSignatureSteps(signed: SignatureProgress, started: boolean): RdoSignatureStep[] {
  if (!started) return [];
  return RDO_SIGNATURE_CHAIN.map((def) => {
    const actor = ACTOR_BY_ROLE[def.signerRole];
    const base = { id: `signature-step-${def.order}`, rdoId: "", order: def.order, signerRole: def.signerRole, signerLabel: def.signerLabel };

    if (def.order <= signed) {
      return {
        ...base,
        status: "SIGNED" as RdoSignatureStepStatus,
        signedBy: actor,
        signedAt: `2026-06-2${def.order}T09:00:00.000Z`,
        method: "MOCK_SIGNATURE" as const,
        signatureHash: `SIG-RDO-2026-0001-${def.order}A8F92C`,
      };
    }
    if (def.order === signed + 1) {
      return { ...base, status: "CURRENT" as RdoSignatureStepStatus };
    }
    return { ...base, status: "PENDING" as RdoSignatureStepStatus };
  });
}

function buildSignatureHistory(signed: SignatureProgress, started: boolean): RdoSignatureHistoryItem[] {
  if (!started) return [];
  const history: RdoSignatureHistoryItem[] = [];
  let seq = 0;
  const firstDef = RDO_SIGNATURE_CHAIN[0];
  history.push({
    id: `signature-hist-${(seq += 1)}`,
    rdoId: "",
    signerRole: firstDef.signerRole,
    signerLabel: firstDef.signerLabel,
    action: "SIGNATURE_REQUESTED",
    actor: ADMIN,
    createdAt: "2026-06-20T09:00:00.000Z",
  });
  for (let order = 1; order <= signed; order += 1) {
    const def = RDO_SIGNATURE_CHAIN[order - 1];
    history.push({
      id: `signature-hist-${(seq += 1)}`,
      rdoId: "",
      signerRole: def.signerRole,
      signerLabel: def.signerLabel,
      action: "SIGNED",
      method: "MOCK_SIGNATURE",
      actor: ACTOR_BY_ROLE[def.signerRole],
      createdAt: `2026-06-2${order}T09:00:00.000Z`,
    });
    const next = RDO_SIGNATURE_CHAIN[order];
    if (next) {
      history.push({
        id: `signature-hist-${(seq += 1)}`,
        rdoId: "",
        signerRole: next.signerRole,
        signerLabel: next.signerLabel,
        action: "SIGNATURE_REQUESTED",
        actor: ADMIN,
        createdAt: `2026-06-2${order}T09:05:00.000Z`,
      });
    }
  }
  return history;
}

function buildStatusHistory(status: RdoStatus): RdoStatusHistoryEntry[] {
  const history: RdoStatusHistoryEntry[] = [];
  let seq = 0;
  function push(from: RdoStatus | null, to: RdoStatus, changedBy: Rdo["author"]) {
    seq += 1;
    history.push({ id: `status-hist-${seq}`, rdoId: "", fromStatus: from, toStatus: to, changedBy, createdAt: `2026-06-1${seq}T09:00:00.000Z` });
  }

  if (status === "DRAFT") return history;
  push("DRAFT", "SENT_TO_REVIEW", AUTHOR);
  push("SENT_TO_REVIEW", "UNDER_REVIEW", AUTHOR);
  return history;
}

interface RdoScenario {
  id: string;
  number: number;
  workId: string;
  workLabel: string;
  contractLabel: string;
  status: RdoStatus;
  approval: ApprovalProgress;
  /** Quantas assinaturas coletadas e se a coleta já começou (default: começou quando approvedThrough === 3 sem outcome). */
  signaturesSigned?: SignatureProgress;
  signatureStarted?: boolean;
}

const SCENARIOS: RdoScenario[] = [
  {
    id: "rdo-001",
    number: 1,
    workId: "work-005",
    workLabel: "Terminal Portuário — Expansão Fase 2",
    contractLabel: "CT-2026/0048",
    status: "DRAFT",
    approval: { approvedThrough: 0 },
  },
  {
    id: "rdo-002",
    number: 2,
    workId: "work-001",
    workLabel: "Dragagem do Canal de Acesso Norte",
    contractLabel: "CT-2026/0142",
    status: "UNDER_REVIEW",
    approval: { approvedThrough: 0 },
  },
  {
    id: "rdo-003",
    number: 3,
    workId: "work-001",
    workLabel: "Dragagem do Canal de Acesso Norte",
    contractLabel: "CT-2026/0142",
    status: "UNDER_REVIEW",
    approval: { approvedThrough: 1 },
  },
  {
    id: "rdo-004",
    number: 4,
    workId: "work-002",
    workLabel: "Recuperação Estrutural do Píer 4",
    contractLabel: "CT-2026/0098",
    status: "UNDER_REVIEW",
    approval: { approvedThrough: 2 },
  },
  {
    id: "rdo-005",
    number: 5,
    workId: "work-003",
    workLabel: "Pavimentação da Via de Acesso Industrial",
    contractLabel: "CT-2025/0211",
    status: "CHANGES_REQUESTED",
    approval: {
      approvedThrough: 0,
      outcome: "CHANGES_REQUESTED",
      outcomeComment: "Favor detalhar melhor a descrição das atividades de concretagem e anexar evidência adicional do setor B.",
    },
  },
  {
    id: "rdo-006",
    number: 6,
    workId: "work-001",
    workLabel: "Dragagem do Canal de Acesso Norte",
    contractLabel: "CT-2026/0142",
    status: "REJECTED",
    approval: {
      approvedThrough: 1,
      outcome: "REJECTED",
      outcomeComment: "Identificada divergência entre o efetivo mobilizado registrado e o vínculo real na obra. Reenviar após correção.",
    },
  },
  {
    id: "rdo-007",
    number: 7,
    workId: "work-004",
    workLabel: "Modernização da Subestação Elétrica B",
    contractLabel: "CT-2024/0356",
    status: "LOCKED",
    approval: { approvedThrough: 3 },
    signatureStarted: false,
  },
  {
    id: "rdo-008",
    number: 8,
    workId: "work-005",
    workLabel: "Terminal Portuário — Expansão Fase 2",
    contractLabel: "CT-2026/0048",
    status: "SIGNATURE_PENDING",
    approval: { approvedThrough: 3 },
    signaturesSigned: 0,
    signatureStarted: true,
  },
  {
    id: "rdo-009",
    number: 9,
    workId: "work-002",
    workLabel: "Recuperação Estrutural do Píer 4",
    contractLabel: "CT-2026/0098",
    status: "PARTIALLY_SIGNED",
    approval: { approvedThrough: 3 },
    signaturesSigned: 2,
    signatureStarted: true,
  },
  {
    id: "rdo-010",
    number: 10,
    workId: "work-003",
    workLabel: "Pavimentação da Via de Acesso Industrial",
    contractLabel: "CT-2025/0211",
    status: "COMPLETED",
    approval: { approvedThrough: 3 },
    signaturesSigned: 4,
    signatureStarted: true,
  },
];

function withRdoId<T extends { rdoId: string }>(items: T[], rdoId: string): T[] {
  return items.map((item) => ({ ...item, rdoId }));
}

export const RDOS_SEED: Rdo[] = SCENARIOS.map((scenario) => {
  const signatureStarted = scenario.signatureStarted ?? (scenario.approval.approvedThrough === 3 && !scenario.approval.outcome && scenario.status !== "LOCKED");
  const signaturesSigned = scenario.signaturesSigned ?? 0;
  const hasResent = false;

  return {
    id: scenario.id,
    organizationId: "demo-org",
    number: scenario.number,
    workId: scenario.workId,
    workLabel: scenario.workLabel,
    contractLabel: scenario.contractLabel,
    authorId: AUTHOR.id,
    author: AUTHOR,
    date: "2026-06-15",
    shift: "MORNING",
    siteEngineerName: "Carlos Mendes",
    siteEngineerRegistry: "CREA 12345",
    foremanName: "João Duarte",
    notes: "RDO de demonstração (mock front-only).",
    status: scenario.status,
    submittedAt: scenario.status === "DRAFT" ? null : "2026-06-15T08:00:00.000Z",
    activities: baseActivities(scenario.id),
    professionals: baseProfessionals(scenario.id),
    equipments: baseEquipments(scenario.id),
    weather: baseWeather(scenario.id),
    occurrences: baseOccurrences(scenario.id),
    nonConformities: baseNonConformities(scenario.id),
    evidences: baseEvidences(scenario.id),
    approvalSteps: withRdoId(buildApprovalSteps(scenario.approval), scenario.id),
    approvalHistory: withRdoId(buildApprovalHistory(scenario.approval, hasResent), scenario.id),
    signatureSteps: withRdoId(buildSignatureSteps(signaturesSigned, signatureStarted), scenario.id),
    signatureHistory: withRdoId(buildSignatureHistory(signaturesSigned, signatureStarted), scenario.id),
    statusHistory: buildStatusHistory(scenario.status).map((entry) => ({ ...entry, rdoId: scenario.id })),
    comments: [],
    createdAt: "2026-06-15T07:30:00.000Z",
    updatedAt: "2026-06-15T08:30:00.000Z",
  };
});
