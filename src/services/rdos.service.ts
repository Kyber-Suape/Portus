import { delay } from "@/lib/mock-delay";
import { RDOS_SEED } from "@/mocks/rdos.mock";
import { worksService } from "@/services/works.service";
import type { PaginatedData } from "@/types/api";
import type {
  CreateCommentRequest,
  CreateRdoRequest,
  EvidenceUploadMeta,
  ListRdosQuery,
  Rdo,
  RdoAuthorSummary,
  RdoComment,
  RdoEvidence,
  RdoStatusHistoryEntry,
  RdoStatus,
  RdoSummary,
  ReopenRdoRequest,
  ReviewActionRequest,
  UpdateEvidenceRequest,
  UpdateRdoRequest,
} from "@/types/rdo";

/** Front-only: nenhuma chamada à API. Estado mutável em memória, reimplementa as regras de transição de status que existiam no backend. */
let rdos: Rdo[] = RDOS_SEED.map((rdo) => ({ ...rdo }));

const EDITABLE_STATUSES: RdoStatus[] = ["DRAFT", "REJECTED_BY_EXTERNAL", "REJECTED_BY_SUAPE", "REOPENED"];
const REOPENABLE_STATUSES: RdoStatus[] = ["APPROVED", "REJECTED_BY_SUAPE", "REJECTED_BY_EXTERNAL"];

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
  if (!EDITABLE_STATUSES.includes(rdo.status)) {
    throw new Error("Este RDO não pode ser editado no status atual.");
  }
}

function nextNumber(): number {
  return rdos.reduce((max, rdo) => Math.max(max, rdo.number), 0) + 1;
}

function pushHistory(rdo: Rdo, from: RdoStatus | null, to: RdoStatus, changedBy: RdoAuthorSummary, reason?: string): Rdo {
  const entry: RdoStatusHistoryEntry = {
    id: crypto.randomUUID(),
    rdoId: rdo.id,
    fromStatus: from,
    toStatus: to,
    reason,
    changedBy,
    createdAt: nowIso(),
  };
  return { ...rdo, status: to, statusHistory: [...rdo.statusHistory, entry], updatedAt: nowIso() };
}

function save(updated: Rdo): Rdo {
  rdos = rdos.map((r) => (r.id === updated.id ? updated : r));
  return updated;
}

function buildEvidenceObjectUrl(file: File): string {
  return URL.createObjectURL(file);
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
      teams: [],
      equipments: [],
      weather: null,
      occurrences: [],
      nonConformities: [],
      evidences: [],
      reviews: [],
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
      teams: payload.teams
        ? payload.teams.map((t) => ({
            id: crypto.randomUUID(),
            rdoId: id,
            workUserId: t.workUserId,
            name: t.name,
            function: t.function,
            quantity: t.quantity,
            startTime: t.startTime,
            endTime: t.endTime,
            company: t.company,
            notes: t.notes,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          }))
        : existing.teams,
      equipments: payload.equipments
        ? payload.equipments.map((e) => ({
            id: crypto.randomUUID(),
            rdoId: id,
            name: e.name,
            identifier: e.identifier,
            quantity: e.quantity ?? 1,
            operator: e.operator,
            hours: e.hours,
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
    save(pushHistory(rdo, rdo.status, "CANCELED", FALLBACK_ACTOR));
  },

  async submit(id: string, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (!EDITABLE_STATUSES.includes(rdo.status)) {
      throw new Error("Este RDO não pode ser enviado para revisão no status atual.");
    }
    const by = actor ?? FALLBACK_ACTOR;
    let next = pushHistory(rdo, rdo.status, "SENT_TO_REVIEW", by);
    next = pushHistory(next, "SENT_TO_REVIEW", "UNDER_EXTERNAL_REVIEW", by);
    next = { ...next, submittedAt: nowIso() };
    return save(next);
  },

  async externalApprove(id: string, payload: ReviewActionRequest = {}, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "UNDER_EXTERNAL_REVIEW") throw new Error("Este RDO não está em revisão externa.");
    const by = actor ?? FALLBACK_ACTOR;
    let next: Rdo = {
      ...rdo,
      reviews: [
        ...rdo.reviews,
        { id: crypto.randomUUID(), rdoId: id, stage: "EXTERNAL", decision: "APPROVED", comments: payload.comments, reviewer: by, createdAt: nowIso() },
      ],
    };
    next = pushHistory(next, rdo.status, "EXTERNAL_APPROVED", by, payload.comments);
    next = pushHistory(next, "EXTERNAL_APPROVED", "UNDER_SUAPE_REVIEW", by);
    return save(next);
  },

  async externalReject(id: string, payload: ReviewActionRequest, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "UNDER_EXTERNAL_REVIEW") throw new Error("Este RDO não está em revisão externa.");
    const by = actor ?? FALLBACK_ACTOR;
    let next: Rdo = {
      ...rdo,
      reviews: [
        ...rdo.reviews,
        { id: crypto.randomUUID(), rdoId: id, stage: "EXTERNAL", decision: "REJECTED", comments: payload.comments, reviewer: by, createdAt: nowIso() },
      ],
    };
    next = pushHistory(next, rdo.status, "REJECTED_BY_EXTERNAL", by, payload.comments);
    return save(next);
  },

  async suapeApprove(id: string, payload: ReviewActionRequest = {}, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "UNDER_SUAPE_REVIEW") throw new Error("Este RDO não está em revisão SUAPE.");
    const by = actor ?? FALLBACK_ACTOR;
    let next: Rdo = {
      ...rdo,
      reviews: [
        ...rdo.reviews,
        { id: crypto.randomUUID(), rdoId: id, stage: "SUAPE", decision: "APPROVED", comments: payload.comments, reviewer: by, createdAt: nowIso() },
      ],
    };
    next = pushHistory(next, rdo.status, "APPROVED", by, payload.comments);
    return save(next);
  },

  async suapeReject(id: string, payload: ReviewActionRequest, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (rdo.status !== "UNDER_SUAPE_REVIEW") throw new Error("Este RDO não está em revisão SUAPE.");
    const by = actor ?? FALLBACK_ACTOR;
    let next: Rdo = {
      ...rdo,
      reviews: [
        ...rdo.reviews,
        { id: crypto.randomUUID(), rdoId: id, stage: "SUAPE", decision: "REJECTED", comments: payload.comments, reviewer: by, createdAt: nowIso() },
      ],
    };
    next = pushHistory(next, rdo.status, "REJECTED_BY_SUAPE", by, payload.comments);
    return save(next);
  },

  async reopen(id: string, payload: ReopenRdoRequest = {}, actor?: RdoAuthorSummary | null): Promise<Rdo> {
    await delay();
    const rdo = findRdoOrThrow(id);
    if (!REOPENABLE_STATUSES.includes(rdo.status)) {
      throw new Error("Este RDO não pode ser reaberto no status atual.");
    }
    const by = actor ?? FALLBACK_ACTOR;
    return save(pushHistory(rdo, rdo.status, "REOPENED", by, payload.reason));
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
