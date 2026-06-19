import type { LucideIcon } from "lucide-react";

export interface Indicador {
  id: string;
  titulo: string;
  valor: string | number;
  descricao?: string;
  icon: LucideIcon;
  tendencia?: "up" | "down" | "stable";
  tom?: "primary" | "accent" | "success" | "warning" | "danger";
  accentStripe?: "warning" | "danger";
  badge?: string;
}

export type PendenciaTipo =
  | "revisao"
  | "aprovacao"
  | "assinatura"
  | "correcao";

export interface Pendencia {
  id: string;
  tipo: PendenciaTipo;
  titulo: string;
  obraNome: string;
  rdoNumero: string;
  prazo: string;
  prioridade: "alta" | "media" | "baixa";
  responsavel: string;
  acaoLabel: string;
}

export type NotificacaoTipo = "info" | "aprovacao" | "alerta" | "assinatura";

export interface Notificacao {
  id: string;
  tipo: NotificacaoTipo;
  mensagem: string;
  criadaEm: string;
  lida: boolean;
}

export interface Atividade {
  id: string;
  autor: string;
  acao: string;
  alvo: string;
  icon: LucideIcon;
  tom: "primary" | "success";
  criadaEm: string;
}
