import { PenLine, ThumbsUp, FileCheck2 } from "lucide-react";
import type { Atividade } from "@/types/dashboard";

export const MOCK_ATIVIDADES: Atividade[] = [
  {
    id: "atv-001",
    autor: "Você",
    acao: "assinou o RDO #1042",
    alvo: "Dragagem do Canal de Acesso Norte",
    icon: PenLine,
    tom: "primary",
    criadaEm: "2026-06-18T09:30:00",
  },
  {
    id: "atv-002",
    autor: "Eng. Roberto",
    acao: "aprovou evidências fotográficas",
    alvo: "Recuperação Estrutural do Píer 4",
    icon: ThumbsUp,
    tom: "primary",
    criadaEm: "2026-06-17T16:45:00",
  },
  {
    id: "atv-003",
    autor: "Consultoria Técnica Recife",
    acao: "finalizou a revisão do RDO #1037",
    alvo: "Pavimentação da Via de Acesso Industrial",
    icon: FileCheck2,
    tom: "success",
    criadaEm: "2026-06-16T11:10:00",
  },
];
