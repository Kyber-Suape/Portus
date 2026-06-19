import type { Notificacao } from "@/types/dashboard";

export const MOCK_NOTIFICACOES: Notificacao[] = [
  {
    id: "ntf-001",
    tipo: "aprovacao",
    mensagem: "RDO-1042 foi enviado para sua aprovação final.",
    criadaEm: "2026-06-17T08:15:00",
    lida: false,
  },
  {
    id: "ntf-002",
    tipo: "alerta",
    mensagem: "RDO-1038 está atrasado em 5 dias.",
    criadaEm: "2026-06-17T07:00:00",
    lida: false,
  },
  {
    id: "ntf-003",
    tipo: "assinatura",
    mensagem: "RDO-1041 está disponível para coleta de assinaturas.",
    criadaEm: "2026-06-16T16:00:00",
    lida: false,
  },
  {
    id: "ntf-004",
    tipo: "info",
    mensagem: "Novo fiscal externo vinculado à obra Dragagem do Canal Norte.",
    criadaEm: "2026-06-15T11:30:00",
    lida: true,
  },
];
