import type { UserRole } from "@/types/user";

export type OrganizacaoTipo =
  | "suape"
  | "fornecedor"
  | "fiscalizacao-externa"
  | "consultoria"
  | "auditoria"
  | "outro";

export interface UsuarioConvidado {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: UserRole | "";
  senha: string;
  confirmarSenha: string;
  /** `undefined` = usa o padrão de permissões do perfil selecionado; definido = lista customizada. */
  permissionKeys?: string[];
}

export interface CadastroFormState {
  // Etapa 1 — Administrador do Sistema (quem está preenchendo o cadastro)
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;

  // Etapa 2 — Organização
  organizacaoNome: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  organizacaoTipo: OrganizacaoTipo | "";
  organizacaoEmail: string;
  organizacaoTelefone: string;

  // Etapa 2 — Endereço
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;

  // Etapa 2 — Responsável legal
  responsavelNome: string;
  responsavelCpf: string;
  responsavelEmail: string;
  responsavelTelefone: string;

  // Etapa 2 — Observações (opcional)
  observacoes: string;

  // Etapa 3 — Usuários convidados (opcional)
  usuarios: UsuarioConvidado[];

  // Etapa 4 — Revisão
  declaracao: boolean;
}

export type CadastroFormErrors = Partial<Record<keyof CadastroFormState, string>>;

export type UsuarioConvidadoErrors = Partial<Record<keyof Omit<UsuarioConvidado, "id">, string>>;

export const CADASTRO_INITIAL_STATE: CadastroFormState = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  senha: "",
  confirmarSenha: "",

  organizacaoNome: "",
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  organizacaoTipo: "",
  organizacaoEmail: "",
  organizacaoTelefone: "",

  cep: "",
  estado: "",
  cidade: "",
  bairro: "",
  logradouro: "",
  numero: "",
  complemento: "",

  responsavelNome: "",
  responsavelCpf: "",
  responsavelEmail: "",
  responsavelTelefone: "",

  observacoes: "",

  usuarios: [],
  declaracao: false,
};

export function createUsuarioConvidado(): UsuarioConvidado {
  return {
    id: crypto.randomUUID(),
    nome: "",
    email: "",
    telefone: "",
    perfil: "",
    senha: "",
    confirmarSenha: "",
    permissionKeys: undefined,
  };
}
