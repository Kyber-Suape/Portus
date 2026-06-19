import type { ApiErrorDetail } from "@/types/api";
import type { CadastroFormErrors, CadastroFormState, UsuarioConvidadoErrors } from "@/types/cadastro";

export interface RegisterErrorMapping {
  errors: CadastroFormErrors;
  usuarioErrors: Record<string, UsuarioConvidadoErrors>;
  generalMessages: string[];
}

const ORGANIZATION_FIELD_MAP: Record<string, keyof CadastroFormState> = {
  name: "organizacaoNome",
  legalName: "razaoSocial",
  tradeName: "nomeFantasia",
  cnpj: "cnpj",
  organizationType: "organizacaoTipo",
  institutionalEmail: "organizacaoEmail",
  institutionalPhone: "organizacaoTelefone",
  cep: "cep",
  state: "estado",
  city: "cidade",
  district: "bairro",
  street: "logradouro",
  number: "numero",
  complement: "complemento",
  legalResponsibleName: "responsavelNome",
  legalResponsibleCpf: "responsavelCpf",
  legalResponsibleEmail: "responsavelEmail",
  legalResponsiblePhone: "responsavelTelefone",
  notes: "observacoes",
};

const ADMIN_FIELD_MAP: Record<string, keyof CadastroFormState> = {
  name: "nome",
  cpf: "cpf",
  email: "email",
  phone: "telefone",
  password: "senha",
};

const INVITED_FIELD_MAP: Record<string, keyof UsuarioConvidadoErrors> = {
  name: "nome",
  email: "email",
  phone: "telefone",
  role: "perfil",
  password: "senha",
  passwordConfirmation: "confirmarSenha",
};

const INVITED_PATH_PATTERN = /^invitedUsers\.(\d+)\.(\w+)$/;

/** Converte os `errors` retornados por `POST /auth/register` (paths como "organization.cnpj") nos campos do wizard. */
export function mapRegisterApiErrors(
  apiErrors: ApiErrorDetail[] | undefined,
  values: CadastroFormState,
): RegisterErrorMapping {
  const errors: CadastroFormErrors = {};
  const usuarioErrors: Record<string, UsuarioConvidadoErrors> = {};
  const generalMessages: string[] = [];

  for (const detail of apiErrors ?? []) {
    if (!detail.field) {
      generalMessages.push(detail.message);
      continue;
    }

    const invitedMatch = INVITED_PATH_PATTERN.exec(detail.field);
    if (invitedMatch) {
      const [, indexStr, subField] = invitedMatch;
      const usuario = values.usuarios[Number(indexStr)];
      const mappedField = INVITED_FIELD_MAP[subField];
      if (usuario && mappedField) {
        usuarioErrors[usuario.id] = { ...usuarioErrors[usuario.id], [mappedField]: detail.message };
      } else {
        generalMessages.push(detail.message);
      }
      continue;
    }

    if (detail.field.startsWith("organization.")) {
      const mappedField = ORGANIZATION_FIELD_MAP[detail.field.slice("organization.".length)];
      if (mappedField) errors[mappedField] = detail.message;
      else generalMessages.push(detail.message);
      continue;
    }

    if (detail.field.startsWith("admin.")) {
      const mappedField = ADMIN_FIELD_MAP[detail.field.slice("admin.".length)];
      if (mappedField) errors[mappedField] = detail.message;
      else generalMessages.push(detail.message);
      continue;
    }

    generalMessages.push(detail.message);
  }

  return { errors, usuarioErrors, generalMessages };
}

const STEP_1_FIELDS: (keyof CadastroFormState)[] = ["nome", "cpf", "email", "telefone", "senha", "confirmarSenha"];
const STEP_2_FIELDS: (keyof CadastroFormState)[] = Object.values(ORGANIZATION_FIELD_MAP);

/** Primeiro passo do wizard que contém algum erro mapeado — usado para navegar o usuário até ele. */
export function firstStepWithError(mapping: RegisterErrorMapping): number | null {
  const fieldKeys = Object.keys(mapping.errors);
  if (fieldKeys.some((key) => STEP_1_FIELDS.includes(key as keyof CadastroFormState))) return 1;
  if (fieldKeys.some((key) => STEP_2_FIELDS.includes(key as keyof CadastroFormState))) return 2;
  if (Object.keys(mapping.usuarioErrors).length > 0) return 3;
  if (fieldKeys.length > 0) return 4;
  return null;
}
