import { isRdoEditable, isRdoReopenable } from "@/constants/rdo";
import { RDO_APPROVAL_CHAIN } from "@/constants/rdo-approval";
import { RDO_SIGNATURE_CHAIN, generateMockSignatureHash } from "@/constants/rdo-signature";
import { delay } from "@/lib/mock-delay";
import { RDOS_SEED } from "@/mocks/rdos.mock";
import { worksService } from "@/services/works.service";
import type { PaginatedData } from "@/types/api";
import type {
  ApproveStepRequest,
  CreateCommentRequest,
  CreateRdoRequest,
  EvidenceUploadMeta,
  ListRdosQuery,
  Rdo,
  RdoApprovalHistoryItem,
  RdoApprovalStep,
  RdoAuthorSummary,
  RdoComment,
  RdoEvidence,
  RdoSignatureHistoryItem,
  RdoSignatureStep,
  RdoStatus,
  RdoStatusHistoryEntry,
  RdoSummary,
  RejectStepRequest,
  ReopenRdoRequest,
  RequestChangesStepRequest,
  SignStepRequest,
  UpdateEvidenceRequest,
  UpdateRdoRequest,
} from "@/types/rdo";

/** Front-only: nenhuma chamada à API. Estado mutável em memória, reimplementa as regras de transição de status que existiam no backend. */
let rdos: Rdo[] = RDOS_SEED.map((rdo) => ({ ...rdo }));

const FALLBACK_ACTOR: RdoAuthorSummary = { id: "system", name: "Sistema", role: "SYSTEM_ADMIN" };

function nowIso(): string {
  return new Date().toISOString();
}

function findRdoOrThrow(id: string): Rdo {
  const rdo = rdos.find((r) => r.id === id);
  if (!rdo) throw new Error("RDO não encontrado.");
  return rdo;
}

function assertEditable(rdo: Rdo) {
  if (!isRdoEditable(rdo.status)) {
    throw new Error("Este RDO não pode ser editado no status atual.");
  }
}

function nextNumber(): number {
  return rdos.reduce((max, rdo) => Math.max(max, rdo.number), 0) + 1;
}

function pushStatusHistory(rdo: Rdo, to: RdoStatus, changedBy: RdoAuthorSummary, reason?: string): Rdo {
  const entry: RdoStatusHistoryEntry = {
    id: crypto.randomUUID(),
    rdoId: rdo.id,
    fromStatus: rdo.status,
    toStatus: to,
    reason,
    changedBy,
    createdAt: nowIso(),
  };
  return { ...rdo, status: to, statusHistory: [...rdo.statusHistory, entry], updatedAt: nowIso() };
}

function pushApprovalHistory(rdo: Rdo, entry: Omit<RdoApprovalHistoryItem, "id" | "rdoId" | "createdAt">): Rdo {
  const item: RdoApprovalHistoryItem = { id: crypto.randomUUID(), rdoId: rdo.id, createdAt: nowIso(), ...entry };
  return { ...rdo, approvalHistory: [...rdo.approvalHistory, item] };
}

function pushSignatureHistory(rdo: Rdo, entry: Omit<RdoSignatureHistoryItem, "id" | "rdoId" | "createdAt">): Rdo {
  const item: RdoSignatureHistoryItem = { id: crypto.randomUUID(), rdoId: rdo.id, createdAt: nowIso(), ...entry };
  return { ...rdo, signatureHistory: [...rdo.signatureHistory, item] };
}

function save(updated: Rdo): Rdo {
  rdos = rdos.map((r) => (r.id === updated.id ? updated : r));
  return updated;
}

function buildEvidenceObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

/** Reinicia a cadeia de aprovação do zero (1º aprovador como `CURRENT`) — usado tanto no
 * primeiro envio quanto no reenvio após ajustes/reprovação, a opção mais simples e auditável
 * para a demo (ver seção 1 da especificação do fluxo). */
function freshApprovalSteps(): RdoApprovalStep[] {
  return RDO_APPROVAL_CHAIN.map((def) => ({
    id: crypto.randomUUID(),
    rdoId: "",
    order: def.order,
    reviewerRole: def.reviewerRole,
    reviewerLabel: def.reviewerLabel,
    status: def.order === 1 ? "CURRENT" : "PENDING",
  }));
}

function findCurrentApprovalStep(rdo: Rdo) {
  const step = rdo.approvalSteps.find((s) => s.status === "CURRENT");
  if (!step) throw new Error("Não há etapa de aprovação em análise neste RDO.");
  return step;
}

function findCurrentSignatureStep(rdo: Rdo) {
  const step = rdo.signatureSteps.find((s) => s.status === "CURRENT");
  if (!step) throw new Error("Não há assinatura disponível neste RDO no momento.");
  return step;
}

export const rdosService = {
  async list(query: ListRdosQuery = {}): Promise<PaginatedData<RdoSummary>> {
    await delay();
    const filtered = rdos.filter((rdo) => {
      if (query.workId && rdo.workId !== query.workId) return false;
      if (query.status && rdo.status !== query.status) return false;
      if (query.q) {
        const q = query.q.toLowerCase();
        const haystack = [rdo.workLabel, rdo.contractLabel, rdo.siteEngineerName].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    const items: RdoSummary[] = filtered
      .slice()
      .sort((a, b) => b.number - a.number)
      .slice(start, start + pageSize)
      .map((rdo) => ({
        id: rdo.id,
        number: rdo.number,
        workId: rdo.workId,
        workLabel: rdo.workLabel,
        contractLabel: rdo.contractLabel,
        date: rdo.date,
        shift: rdo.shift,
        status: rdo.status,
        author: rdo.author,
        evidenceCount: rdo.evidences.length,
        nonConformityCount: rdo.nonConformities.length,
        submittedAt: rdo.submittedAt,
        createdAt: rdo.createdAt,
        updatedAt: rdo.updatedAt,
      }));

    return {
      items,
      meta: { page, pageSize, total: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)) },
    };
  },

  async create(payload: CreateRdoRequest, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const work = await worksService.getById(payload.workId);
    if (work.status === "COMPLETED" || work.status === "CANCELED") {
      throw new Error("Não é possível criar um RDO em uma obra concluída ou cancelada.");
    }

    const author = actor ?? FALLBACK_ACTOR;
    const rdo: Rdo = {
      id: crypto.randomUUID(),
      organizationId: "demo-org",
      number: nextNumber(),
      workId: payload.workId,
      workLabel: work.name,
      contractLabel: work.contractNumber,
      authorId: author.id,
      author,
      date: payload.date,
      shift: payload.shift,
      siteEngineerName: payload.siteEngineerName,
      siteEngineerRegistry: payload.siteEngineerRegistry,
      foremanName: payload.foremanName,
      notes: payload.notes,
      status: "DRAFT",
      submittedAt: null,
      activities: [],
      professionals: [],
      equipments: [],
      weather: null,
      occurrences: [],
      nonConformities: [],
      evidences: [],
      approvalSteps: [],
      approvalHistory: [],
      signatureSteps: [],
      signatureHistory: [],
      statusHistory: [],
      comments: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    rdos = [rdo, ...rdos];
    worksService._internal.incrementRdoCount(payload.workId);
    return rdo;
  },

  async getById(id: string): Promise<Rdo> {
    await delay();
    return { ...findRdoOrThrow(id) };
  },

  async update(id: string, payload: UpdateRdoRequest): Promise<Rdo> {
    await delay();
    const existing = findRdoOrThrow(id);
    assertEditable(existing);

    const updated: Rdo = {
      ...existing,
      date: payload.date ?? existing.date,
      shift: payload.shift ?? existing.shift,
      siteEngineerName: payload.siteEngineerName ?? existing.siteEngineerName,
      siteEngineerRegistry: payload.siteEngineerRegistry ?? existing.siteEngineerRegistry,
      foremanName: payload.foremanName ?? existing.foremanName,
      notes: payload.notes ?? existing.notes,
      activities: payload.activities
        ? payload.activities.map((a) => ({
            id: crypto.randomUUID(),
            rdoId: id,
            category: a.category,
            description: a.description,
            status: a.status ?? "IN_PROGRESS",
            aiSuggestionUsed: a.aiSuggestionUsed ?? false,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          }))
        : existing.activities,
      professionals: payload.professionals
        ? payload.professionals.map((p) => ({
            id: crypto.randomUUID(),
            rdoId: id,
            workUserId: p.workUserId,
            name: p.name,
            function: p.function,
            startTime: p.startTime,
            endTime: p.endTime,
            notes: p.notes,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          }))
        : existing.professionals,
      equipments: payload.equipments
        ? payload.equipments.map((e) => ({
            id: crypto.randomUUID(),
            rdoId: id,
            name: e.name,
            identifier: e.identifier,
            operator: e.operator,
            startTime: e.startTime,
            endTime: e.endTime,
            status: e.status ?? "IDLE",
            notes: e.notes,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          }))
        : existing.equipments,
      weather: payload.weather
        ? {
            id: existing.weather?.id ?? crypto.randomUUID(),
            rdoId: id,
            morningCondition: payload.weather.morningCondition,
            afternoonCondition: payload.weather.afternoonCondition,
            nightCondition: payload.weather.nightCondition,
            minTemperature: payload.weather.minTemperature,
            maxTemperature: payload.weather.maxTemperature,
            groundStatus: payload.weather.groundStatus ?? "DRY",
            hadStoppage: payload.weather.hadStoppage ?? false,
            stoppageReason: payload.weather.stoppageReason,
            createdAt: existing.weather?.createdAt ?? nowIso(),
            updatedAt: nowIso(),
          }
        : existing.weather,
      occurrences: payload.occurrences
        ? payload.occurrences.map((o) => ({
            id: crypto.randomUUID(),
            rdoId: id,
            type: o.type,
            location: o.location,
            severity: o.severity,
            summary: o.summary,
            description: o.description,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          }))
        : existing.occurrences,
      nonConformities: payload.nonConformities
        ? payload.nonConformities.map((n, index) => ({
            id: crypto.randomUUID(),
            rdoId: id,
            code: `NC-${new Date().getFullYear()}-${String(index + 1).padStart(4, "0")}`,
            title: n.title,
            description: n.description,
            severity: n.severity,
            status: n.status ?? "OPEN",
            createdAt: nowIso(),
            updatedAt: nowIso(),
          }))
        : existing.nonConformities,
      updatedAt: nowIso(),
    };

    return save(updated);
  },

  async remove(id: string): Promise<void> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "DRAFT") {
      throw new Error("Só é possível remover RDOs em rascunho.");
    }
    save(pushStatusHistory(rdo, "CANCELED", FALLBACK_ACTOR));
  },

  /** Envia para revisão (1º envio) ou reenvia após ajustes/reprovação — a cadeia de aprovação
   * sempre recomeça do 1º aprovador, a abordagem mais simples e auditável para a demo. */
  async submit(id: string, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (!isRdoEditable(rdo.status)) {
      throw new Error("Este RDO não pode ser enviado para revisão no status atual.");
    }
    const by = actor ?? FALLBACK_ACTOR;
    const isResend = rdo.status !== "DRAFT";

    let next = pushStatusHistory(rdo, "SENT_TO_REVIEW", by);
    next = pushStatusHistory(next, "UNDER_REVIEW", by);
    next = pushApprovalHistory(next, { action: isResend ? "RESENT" : "SUBMITTED", actor: by });
    next = {
      ...next,
      approvalSteps: freshApprovalSteps().map((step) => ({ ...step, rdoId: id })),
      submittedAt: nowIso(),
    };
    return save(next);
  },

  async approveStep(id: string, payload: ApproveStepRequest = {}, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "UNDER_REVIEW") throw new Error("Este RDO não está em análise de aprovação.");
    const by = actor ?? FALLBACK_ACTOR;
    const step = findCurrentApprovalStep(rdo);
    const isLastStep = step.order === RDO_APPROVAL_CHAIN.length;

    let next: Rdo = {
      ...rdo,
      approvalSteps: rdo.approvalSteps.map((s) =>
        s.id === step.id ? { ...s, status: "APPROVED", action: "APPROVED", comment: payload.comment, actedBy: by, actedAt: nowIso() } : s,
      ),
    };
    next = pushApprovalHistory(next, { stepOrder: step.order, action: "APPROVED", comment: payload.comment, actor: by });

    const transientStatus = `APPROVED_BY_REVIEWER_${step.order}` as RdoStatus;
    next = pushStatusHistory(next, transientStatus, by);

    if (isLastStep) {
      next = pushStatusHistory(next, "FINAL_APPROVED", by);
      next = pushStatusHistory(next, "LOCKED", by);
      next = pushApprovalHistory(next, { action: "LOCKED", actor: by });
      const firstSigner = RDO_SIGNATURE_CHAIN[0];
      next = {
        ...next,
        signatureSteps: RDO_SIGNATURE_CHAIN.map((def) => ({
          id: crypto.randomUUID(),
          rdoId: id,
          order: def.order,
          signerRole: def.signerRole,
          signerLabel: def.signerLabel,
          status: def.order === 1 ? "CURRENT" : "PENDING",
        })),
      };
      next = pushSignatureHistory(next, { signerRole: firstSigner.signerRole, signerLabel: firstSigner.signerLabel, action: "SIGNATURE_REQUESTED", actor: by });
      next = pushStatusHistory(next, "SIGNATURE_PENDING", by);
    } else {
      next = {
        ...next,
        approvalSteps: next.approvalSteps.map((s) => (s.order === step.order + 1 ? { ...s, status: "CURRENT" } : s)),
      };
      next = pushStatusHistory(next, "UNDER_REVIEW", by);
    }

    return save(next);
  },

  async rejectStep(id: string, payload: RejectStepRequest, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "UNDER_REVIEW") throw new Error("Este RDO não está em análise de aprovação.");
    const by = actor ?? FALLBACK_ACTOR;
    const step = findCurrentApprovalStep(rdo);

    let next: Rdo = {
      ...rdo,
      approvalSteps: rdo.approvalSteps.map((s) =>
        s.id === step.id ? { ...s, status: "REJECTED", action: "REJECTED", comment: payload.comment, actedBy: by, actedAt: nowIso() } : s,
      ),
    };
    next = pushApprovalHistory(next, { stepOrder: step.order, action: "REJECTED", comment: payload.comment, actor: by });
    next = pushStatusHistory(next, "REJECTED", by, payload.comment);
    return save(next);
  },

  async requestChangesStep(id: string, payload: RequestChangesStepRequest, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "UNDER_REVIEW") throw new Error("Este RDO não está em análise de aprovação.");
    const by = actor ?? FALLBACK_ACTOR;
    const step = findCurrentApprovalStep(rdo);

    let next: Rdo = {
      ...rdo,
      approvalSteps: rdo.approvalSteps.map((s) =>
        s.id === step.id
          ? { ...s, status: "CHANGES_REQUESTED", action: "CHANGES_REQUESTED", requestedChanges: payload.requestedChanges, actedBy: by, actedAt: nowIso() }
          : s,
      ),
    };
    next = pushApprovalHistory(next, { stepOrder: step.order, action: "CHANGES_REQUESTED", requestedChanges: payload.requestedChanges, actor: by });
    next = pushStatusHistory(next, "CHANGES_REQUESTED", by, payload.requestedChanges);
    return save(next);
  },

  async signStep(id: string, payload: SignStepRequest, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "SIGNATURE_PENDING" && rdo.status !== "PARTIALLY_SIGNED") {
      throw new Error("Este RDO não está com assinaturas em aberto.");
    }
    const by = actor ?? FALLBACK_ACTOR;
    const step = findCurrentSignatureStep(rdo);
    const isLastStep = step.order === RDO_SIGNATURE_CHAIN.length;
    const hash = generateMockSignatureHash(rdo.number);

    let next: Rdo = {
      ...rdo,
      signatureSteps: rdo.signatureSteps.map((s) =>
        s.id === step.id ? { ...s, status: "SIGNED", signedBy: by, signedAt: nowIso(), method: payload.method, signatureHash: hash } : s,
      ),
    };
    next = pushSignatureHistory(next, { signerRole: step.signerRole, signerLabel: step.signerLabel, action: "SIGNED", method: payload.method, actor: by });

    if (isLastStep) {
      next = pushStatusHistory(next, "SIGNED", by);
      next = pushStatusHistory(next, "COMPLETED", by);
    } else {
      const nextSigner = RDO_SIGNATURE_CHAIN[step.order];
      next = {
        ...next,
        signatureSteps: next.signatureSteps.map((s) => (s.order === step.order + 1 ? { ...s, status: "CURRENT" } : s)),
      };
      next = pushSignatureHistory(next, { signerRole: nextSigner.signerRole, signerLabel: nextSigner.signerLabel, action: "SIGNATURE_REQUESTED", actor: by });
      next = pushStatusHistory(next, "PARTIALLY_SIGNED", by);
    }

    return save(next);
  },

  async reopen(id: string, payload: ReopenRdoRequest, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (!isRdoReopenable(rdo.status)) {
      throw new Error("Este RDO não pode ser reaberto no status atual.");
    }
    const by = actor ?? FALLBACK_ACTOR;
    const hadSignatures = rdo.signatureSteps.some((s) => s.status === "SIGNED");

    let next = pushStatusHistory(rdo, "REOPENED", by, payload.reason);
    next = pushApprovalHistory(next, { action: "REOPENED", comment: payload.reason, actor: by });
    if (hadSignatures) {
      next = { ...next, signatureSteps: [] };
    }
    return save(next);
  },

  async addComment(id: string, payload: CreateCommentRequest, actor?: RdoAuthorSummary | null): Promise<RdoComment> {
    await delay();
    const rdo = findRdoOrThrow(id);
    const by = actor ?? FALLBACK_ACTOR;
    const comment: RdoComment = { id: crypto.randomUUID(), rdoId: id, authorId: by.id, author: by, body: payload.body, createdAt: nowIso() };
    save({ ...rdo, comments: [...rdo.comments, comment], updatedAt: nowIso() });
    return comment;
  },

  async listComments(id: string): Promise<RdoComment[]> {
    await delay();
    return findRdoOrThrow(id).comments;
  },

  async listHistory(id: string): Promise<RdoStatusHistoryEntry[]> {
    await delay();
    return findRdoOrThrow(id).statusHistory;
  },

  async uploadEvidence(rdoId: string, file: File, meta: EvidenceUploadMeta, actor?: RdoAuthorSummary | null): Promise<RdoEvidence> {
    await delay();
    const rdo = findRdoOrThrow(rdoId);
    const by = actor ?? FALLBACK_ACTOR;
    const evidence: RdoEvidence = {
      id: crypto.randomUUID(),
      rdoId,
      type: meta.type,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      caption: meta.caption,
      latitude: meta.latitude,
      longitude: meta.longitude,
      accuracyMeters: meta.accuracyMeters,
      altitudeMeters: meta.altitudeMeters,
      location: meta.location,
      geoStatus: meta.geoStatus ?? "UNAVAILABLE",
      capturedAt: meta.capturedAt ?? nowIso(),
      uploadedBy: by,
      uploadStatus: "UPLOADED",
      validationStatus: "PENDING",
      createdAt: nowIso(),
      url: buildEvidenceObjectUrl(file),
    };
    save({ ...rdo, evidences: [...rdo.evidences, evidence], updatedAt: nowIso() });
    return evidence;
  },

  async listEvidences(rdoId: string): Promise<RdoEvidence[]> {
    await delay();
    return findRdoOrThrow(rdoId).evidences;
  },

  async updateEvidence(rdoId: string, evidenceId: string, payload: UpdateEvidenceRequest, actor?: RdoAuthorSummary | null): Promise<RdoEvidence> {
    await delay();
    const rdo = findRdoOrThrow(rdoId);
    const evidence = rdo.evidences.find((e) => e.id === evidenceId);
    if (!evidence) throw new Error("Evidência não encontrada neste RDO.");
    const by = actor ?? FALLBACK_ACTOR;
    const updated: RdoEvidence = {
      ...evidence,
      caption: payload.caption ?? evidence.caption,
      ...(payload.validationStatus
        ? { validationStatus: payload.validationStatus, validatedBy: by, validatedAt: nowIso() }
        : {}),
    };
    save({ ...rdo, evidences: rdo.evidences.map((e) => (e.id === evidenceId ? updated : e)), updatedAt: nowIso() });
    return updated;
  },

  async deleteEvidence(rdoId: string, evidenceId: string): Promise<void> {
    await delay();
    const rdo = findRdoOrThrow(rdoId);
    save({ ...rdo, evidences: rdo.evidences.filter((e) => e.id !== evidenceId), updatedAt: nowIso() });
  },
};
