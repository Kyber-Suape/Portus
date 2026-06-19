import { delay } from "@/lib/mock-delay";
import { WORKS_SEED } from "@/mocks/works.mock";
import type {
  AddWorkAdditiveInput,
  AddWorkDocumentInput,
  AddWorkTeamMemberInput,
  CreateWorkInput,
  ListWorksQuery,
  UpdateWorkInput,
  UpdateWorkTeamMemberInput,
  Work,
  WorkAdditive,
  WorkDocument,
  WorkTeamMember,
} from "@/types/work";

/** Front-only: nenhuma chamada à API. Estado mutável em memória, reseta a cada reload — comportamento esperado de um mock. */
let works: Work[] = WORKS_SEED.map((work) => ({ ...work }));

function nowIso(): string {
  return new Date().toISOString();
}

function findWorkOrThrow(id: string): Work {
  const work = works.find((w) => w.id === id);
  if (!work) throw new Error("Obra não encontrada.");
  return work;
}

export const worksService = {
  async list(query: ListWorksQuery = {}): Promise<Work[]> {
    await delay();
    return works.filter((work) => {
      if (query.status && work.status !== query.status) return false;
      if (query.q) {
        const q = query.q.toLowerCase();
        const haystack = [work.name, work.contractNumber, work.contractedCompanyName, work.suapeInspectorName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  },

  async getById(id: string): Promise<Work> {
    await delay();
    return { ...findWorkOrThrow(id) };
  },

  async create(input: CreateWorkInput): Promise<Work> {
    await delay();
    const work: Work = {
      id: crypto.randomUUID(),
      ...input,
      team: [],
      documents: [],
      additives: [],
      rdoCount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    works = [work, ...works];
    return work;
  },

  async update(id: string, input: UpdateWorkInput): Promise<Work> {
    await delay();
    const existing = findWorkOrThrow(id);
    const updated: Work = { ...existing, ...input, updatedAt: nowIso() };
    works = works.map((w) => (w.id === id ? updated : w));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    const work = findWorkOrThrow(id);
    if (work.rdoCount > 0) {
      throw new Error("Não é possível excluir uma obra com RDOs vinculados. Cancele ou inative a obra em vez de excluí-la.");
    }
    works = works.filter((w) => w.id !== id);
  },

  async listTeam(workId: string): Promise<WorkTeamMember[]> {
    await delay();
    return findWorkOrThrow(workId).team;
  },

  async addTeamMember(workId: string, input: AddWorkTeamMemberInput): Promise<WorkTeamMember> {
    await delay();
    const work = findWorkOrThrow(workId);
    if (work.team.some((member) => member.userId === input.userId && member.status !== "REMOVED")) {
      throw new Error("Este usuário já está vinculado à equipe da obra.");
    }
    const member: WorkTeamMember = {
      id: crypto.randomUUID(),
      workId,
      userId: input.userId,
      userName: input.userName,
      userEmail: input.userEmail,
      function: input.function,
      status: "ACTIVE",
      createdAt: nowIso(),
    };
    works = works.map((w) => (w.id === workId ? { ...w, team: [...w.team, member], updatedAt: nowIso() } : w));
    return member;
  },

  async updateTeamMember(workId: string, memberId: string, input: UpdateWorkTeamMemberInput): Promise<WorkTeamMember> {
    await delay();
    const work = findWorkOrThrow(workId);
    const member = work.team.find((m) => m.id === memberId);
    if (!member) throw new Error("Membro da equipe não encontrado nesta obra.");
    const updated: WorkTeamMember = { ...member, ...input };
    works = works.map((w) =>
      w.id === workId ? { ...w, team: w.team.map((m) => (m.id === memberId ? updated : m)), updatedAt: nowIso() } : w,
    );
    return updated;
  },

  async removeTeamMember(workId: string, memberId: string): Promise<void> {
    await delay();
    findWorkOrThrow(workId);
    works = works.map((w) =>
      w.id === workId
        ? { ...w, team: w.team.map((m) => (m.id === memberId ? { ...m, status: "REMOVED" as const } : m)), updatedAt: nowIso() }
        : w,
    );
  },

  async listDocuments(workId: string): Promise<WorkDocument[]> {
    await delay();
    return findWorkOrThrow(workId).documents;
  },

  async addDocument(workId: string, input: AddWorkDocumentInput): Promise<WorkDocument> {
    await delay();
    findWorkOrThrow(workId);
    const document: WorkDocument = {
      id: crypto.randomUUID(),
      workId,
      title: input.title,
      type: input.type,
      fileName: input.fileName,
      url: "#",
      createdAt: nowIso(),
    };
    works = works.map((w) => (w.id === workId ? { ...w, documents: [...w.documents, document], updatedAt: nowIso() } : w));
    return document;
  },

  async removeDocument(workId: string, documentId: string): Promise<void> {
    await delay();
    findWorkOrThrow(workId);
    works = works.map((w) =>
      w.id === workId ? { ...w, documents: w.documents.filter((d) => d.id !== documentId), updatedAt: nowIso() } : w,
    );
  },

  async listAdditives(workId: string): Promise<WorkAdditive[]> {
    await delay();
    return findWorkOrThrow(workId).additives;
  },

  async addAdditive(workId: string, input: AddWorkAdditiveInput): Promise<WorkAdditive> {
    await delay();
    findWorkOrThrow(workId);
    const additive: WorkAdditive = {
      id: crypto.randomUUID(),
      workId,
      description: input.description,
      type: input.type,
      newEndDate: input.newEndDate,
      createdAt: nowIso(),
    };
    works = works.map((w) => (w.id === workId ? { ...w, additives: [...w.additives, additive], updatedAt: nowIso() } : w));
    if (input.newEndDate) {
      works = works.map((w) => (w.id === workId ? { ...w, contractEndDate: input.newEndDate as string } : w));
    }
    return additive;
  },

  /** Usado pelo `rdosService` mock para incrementar a contagem de RDOs e validar status ao criar um RDO. */
  _internal: {
    getRawWork: findWorkOrThrow,
    incrementRdoCount(workId: string): void {
      works = works.map((w) => (w.id === workId ? { ...w, rdoCount: w.rdoCount + 1 } : w));
    },
  },
};
