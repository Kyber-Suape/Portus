export type DashboardRdoSummaryStatus =
  | "rascunho"
  | "em-revisao-fiscal-externo"
  | "em-aprovacao-suape"
  | "reprovado"
  | "aguardando-assinatura"
  | "finalizado"
  | "atrasado";

/**
 * Resumo simplificado de RDO usado só pelos widgets do dashboard atual (alertas,
 * sincronização). Deliberadamente desacoplado de `types/rdo.ts` (o tipo real da
 * feature de RDO) — o dashboard ainda não foi migrado para consumir a API real.
 */
export interface DashboardRdoSummary {
  id: string;
  numero: string;
  obraId: string;
  obraNome: string;
  data: string;
  responsavel: string;
  status: DashboardRdoSummaryStatus;
  clima?: string;
  naoConformidades: number;
  atualizadoEm: string;
}

export const MOCK_RDOS: DashboardRdoSummary[] = [
  {
    id: "rdo-1042",
    numero: "RDO-1042",
    obraId: "obra-001",
    obraNome: "Dragagem do Canal de Acesso Norte",
    data: "2026-06-16",
    responsavel: "Hidroviária Engenharia Ltda.",
    status: "em-aprovacao-suape",
    clima: "Ensolarado",
    naoConformidades: 0,
    atualizadoEm: "2026-06-16T17:42:00",
  },
  {
    id: "rdo-1041",
    numero: "RDO-1041",
    obraId: "obra-002",
    obraNome: "Recuperação Estrutural do Píer 4",
    data: "2026-06-16",
    responsavel: "Construtora Atlântico Sul",
    status: "aguardando-assinatura",
    clima: "Nublado",
    naoConformidades: 1,
    atualizadoEm: "2026-06-16T15:10:00",
  },
  {
    id: "rdo-1040",
    numero: "RDO-1040",
    obraId: "obra-003",
    obraNome: "Pavimentação da Via de Acesso Industrial",
    data: "2026-06-15",
    responsavel: "Pavinorte Construções",
    status: "reprovado",
    clima: "Chuva",
    naoConformidades: 2,
    atualizadoEm: "2026-06-15T18:30:00",
  },
  {
    id: "rdo-1039",
    numero: "RDO-1039",
    obraId: "obra-001",
    obraNome: "Dragagem do Canal de Acesso Norte",
    data: "2026-06-15",
    responsavel: "Hidroviária Engenharia Ltda.",
    status: "em-revisao-fiscal-externo",
    clima: "Ensolarado",
    naoConformidades: 0,
    atualizadoEm: "2026-06-15T14:05:00",
  },
  {
    id: "rdo-1038",
    numero: "RDO-1038",
    obraId: "obra-002",
    obraNome: "Recuperação Estrutural do Píer 4",
    data: "2026-06-12",
    responsavel: "Construtora Atlântico Sul",
    status: "atrasado",
    clima: "Nublado",
    naoConformidades: 0,
    atualizadoEm: "2026-06-12T09:00:00",
  },
  {
    id: "rdo-1037",
    numero: "RDO-1037",
    obraId: "obra-003",
    obraNome: "Pavimentação da Via de Acesso Industrial",
    data: "2026-06-11",
    responsavel: "Pavinorte Construções",
    status: "finalizado",
    clima: "Ensolarado",
    naoConformidades: 0,
    atualizadoEm: "2026-06-11T20:00:00",
  },
];
