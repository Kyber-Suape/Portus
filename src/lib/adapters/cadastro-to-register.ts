import { onlyDigits } from "@/lib/validators";
import type { RegisterRequest } from "@/types/auth";
import type { OrganizationType } from "@/types/organization";
import type { UserRole } from "@/types/user";
import type { CadastroFormState, OrganizacaoTipo, UsuarioConvidado } from "@/types/cadastro";

function hasPerfil(usuario: UsuarioConvidado): usuario is UsuarioConvidado & { perfil: UserRole } {
  return usuario.perfil !== "";
}

const ORGANIZACAO_TIPO_TO_API: Record<OrganizacaoTipo, OrganizationType> = {
  suape: "SUAPE",
  fornecedor: "SUPPLIER",
  "fiscalizacao-externa": "EXTERNAL_INSPECTION",
  consultoria: "CONSULTING",
  auditoria: "AUDIT",
  outro: "OTHER",
};

/** Converte o estado do wizard de Cadastro (campos em português) para o DTO esperado por `POST /auth/register`. */
export function toRegisterRequest(values: CadastroFormState): RegisterRequest {
  return {
    organization: {
      name: values.organizacaoNome,
      legalName: values.razaoSocial,
      tradeName: values.nomeFantasia,
      cnpj: onlyDigits(values.cnpj),
      organizationType: ORGANIZACAO_TIPO_TO_API[values.organizacaoTipo as OrganizacaoTipo],
      institutionalEmail: values.organizacaoEmail,
      institutionalPhone: onlyDigits(values.organizacaoTelefone),
      cep: onlyDigits(values.cep),
      state: values.estado,
      city: values.cidade,
      district: values.bairro,
      street: values.logradouro,
      number: values.numero,
      complement: values.complemento || undefined,
      legalResponsibleName: values.responsavelNome,
      legalResponsibleCpf: onlyDigits(values.responsavelCpf),
      legalResponsibleEmail: values.responsavelEmail,
      legalResponsiblePhone: onlyDigits(values.responsavelTelefone),
      notes: values.observacoes || undefined,
    },
    admin: {
      name: values.nome,
      cpf: onlyDigits(values.cpf),
      email: values.email,
      phone: onlyDigits(values.telefone),
      password: values.senha,
    },
    invitedUsers: values.usuarios.filter(hasPerfil).map((usuario) => ({
      name: usuario.nome,
      email: usuario.email,
      phone: onlyDigits(usuario.telefone),
      role: usuario.perfil,
      password: usuario.senha,
      passwordConfirmation: usuario.confirmarSenha,
      permissionKeys: usuario.permissionKeys,
    })),
  };
}
