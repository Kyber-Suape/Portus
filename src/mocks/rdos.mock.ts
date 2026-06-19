import type { Rdo } from "@/types/rdo";

const AUTHOR = { id: "demo-fornecedor", name: "Fornecedor Demo", role: "SUPPLIER" as const };
const EXTERNAL_REVIEWER = { id: "demo-fiscal-externo", name: "Fiscal Externo Demo", role: "EXTERNAL_INSPECTOR" as const };
const SUAPE_REVIEWER = { id: "demo-fiscal-suape", name: "Fiscal SUAPE Demo", role: "SUAPE_INSPECTOR" as const };

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

function baseTeams(rdoId: string) {
  return [
    {
      id: `${rdoId}-team-1`,
      rdoId,
      name: "Equipe Alfa",
      function: "Pedreiro",
      quantity: 8,
      startTime: "07:00",
      endTime: "16:00",
      company: "Construtora Demo Ltda.",
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
      name: "Escavadeira 320",
      identifier: "EX-104",
      quantity: 1,
      operator: "J. Silva",
      hours: 8.5,
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
      caption: "Fundação do setor A concluída.",
      latitude: -8.3941,
      longitude: -34.9758,
      accuracyMeters: 3.5,
      uploadedBy: AUTHOR,
      uploadStatus: "UPLOADED" as const,
      validationStatus: "PENDING" as const,
      createdAt: "2026-06-15T08:30:00.000Z",
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    },
  ];
}

interface RdoScenario {
  id: string;
  number: number;
  workId: string;
  workLabel: string;
  contractLabel: string;
  status: Rdo["status"];
}

const SCENARIOS: RdoScenario[] = [
  { id: "rdo-001", number: 1, workId: "work-005", workLabel: "Terminal Portuário — Expansão Fase 2", contractLabel: "CT-2026/0048", status: "DRAFT" },
  { id: "rdo-002", number: 2, workId: "work-001", workLabel: "Dragagem do Canal de Acesso Norte", contractLabel: "CT-2026/0142", status: "UNDER_EXTERNAL_REVIEW" },
  { id: "rdo-003", number: 3, workId: "work-001", workLabel: "Dragagem do Canal de Acesso Norte", contractLabel: "CT-2026/0142", status: "REJECTED_BY_EXTERNAL" },
  { id: "rdo-004", number: 4, workId: "work-002", workLabel: "Recuperação Estrutural do Píer 4", contractLabel: "CT-2026/0098", status: "UNDER_SUAPE_REVIEW" },
  { id: "rdo-005", number: 5, workId: "work-003", workLabel: "Pavimentação da Via de Acesso Industrial", contractLabel: "CT-2025/0211", status: "APPROVED" },
];

function buildStatusHistory(rdoId: string, status: Rdo["status"]): Rdo["statusHistory"] {
  const history: Rdo["statusHistory"] = [];
  let seq = 0;
  function push(from: Rdo["status"] | null, to: Rdo["status"], changedBy: Rdo["author"]) {
    seq += 1;
    history.push({
      id: `${rdoId}-hist-${seq}`,
      rdoId,
      fromStatus: from,
      toStatus: to,
      changedBy,
      createdAt: `2026-06-1${seq}T09:00:00.000Z`,
    });
  }

  if (status === "DRAFT") return history;
  push("DRAFT", "SENT_TO_REVIEW", AUTHOR);
  push("SENT_TO_REVIEW", "UNDER_EXTERNAL_REVIEW", AUTHOR);
  if (status === "UNDER_EXTERNAL_REVIEW") return history;
  if (status === "REJECTED_BY_EXTERNAL") {
    push("UNDER_EXTERNAL_REVIEW", "REJECTED_BY_EXTERNAL", EXTERNAL_REVIEWER);
    return history;
  }
  push("UNDER_EXTERNAL_REVIEW", "EXTERNAL_APPROVED", EXTERNAL_REVIEWER);
  push("EXTERNAL_APPROVED", "UNDER_SUAPE_REVIEW", EXTERNAL_REVIEWER);
  if (status === "UNDER_SUAPE_REVIEW") return history;
  if (status === "APPROVED") {
    push("UNDER_SUAPE_REVIEW", "APPROVED", SUAPE_REVIEWER);
  }
  return history;
}

function buildReviews(rdoId: string, status: Rdo["status"]): Rdo["reviews"] {
  const reviews: Rdo["reviews"] = [];
  if (status === "REJECTED_BY_EXTERNAL") {
    reviews.push({
      id: `${rdoId}-rev-1`,
      rdoId,
      stage: "EXTERNAL",
      decision: "REJECTED",
      comments: "Favor revisar a geometria da fundação antes de reenviar.",
      reviewer: EXTERNAL_REVIEWER,
      createdAt: "2026-06-13T09:00:00.000Z",
    });
  }
  if (status === "UNDER_SUAPE_REVIEW" || status === "APPROVED") {
    reviews.push({
      id: `${rdoId}-rev-1`,
      rdoId,
      stage: "EXTERNAL",
      decision: "APPROVED",
      comments: "Conferência técnica concluída sem pendências.",
      reviewer: EXTERNAL_REVIEWER,
      createdAt: "2026-06-13T09:00:00.000Z",
    });
  }
  if (status === "APPROVED") {
    reviews.push({
      id: `${rdoId}-rev-2`,
      rdoId,
      stage: "SUAPE",
      decision: "APPROVED",
      comments: "Aprovação de governança concluída.",
      reviewer: SUAPE_REVIEWER,
      createdAt: "2026-06-14T09:00:00.000Z",
    });
  }
  return reviews;
}

export const RDOS_SEED: Rdo[] = SCENARIOS.map((scenario) => ({
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
  teams: baseTeams(scenario.id),
  equipments: baseEquipments(scenario.id),
  weather: baseWeather(scenario.id),
  occurrences: baseOccurrences(scenario.id),
  nonConformities: baseNonConformities(scenario.id),
  evidences: baseEvidences(scenario.id),
  reviews: buildReviews(scenario.id, scenario.status),
  statusHistory: buildStatusHistory(scenario.id, scenario.status),
  comments: [],
  createdAt: "2026-06-15T07:30:00.000Z",
  updatedAt: "2026-06-15T08:30:00.000Z",
}));
