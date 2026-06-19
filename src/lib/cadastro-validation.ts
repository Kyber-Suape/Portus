import { isValidEmail, isValidPhone, isValidCnpj, isValidCep } from "@/lib/validators";
import type {
  CadastroFormState,
  CadastroFormErrors,
  UsuarioConvidado,
  UsuarioConvidadoErrors,
} from "@/types/cadastro";

export interface CadastroStepValidation {
  errors: CadastroFormErrors;
  usuarioErrors: Record<string, UsuarioConvidadoErrors>;
}

function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

function validateUsuario(usuario: UsuarioConvidado): UsuarioConvidadoErrors {
  const errors: UsuarioConvidadoErrors = {};
  if (!usuario.nome.trim()) errors.nome = "Informe o nome.";
  if (!usuario.email.trim()) errors.email = "Informe o e-mail.";
  else if (!isValidEmail(usuario.email)) errors.email = "E-mail inválido.";
  if (!usuario.perfil) errors.perfil = "Selecione o perfil.";
  if (!usuario.senha) errors.senha = "Crie uma senha de acesso.";
  else if (usuario.senha.length < 8) errors.senha = "A senha deve ter ao menos 8 caracteres.";
  if (usuario.confirmarSenha !== usuario.senha) errors.confirmarSenha = "As senhas não coincidem.";
  return errors;
}

function validateStep1(values: CadastroFormState): CadastroFormErrors {
  const errors: CadastroFormErrors = {};

  if (!values.nome.trim()) errors.nome = "Informe seu nome completo.";
  if (!values.cpf.trim()) errors.cpf = "Informe seu CPF.";
  else if (digitsOf(values.cpf).length !== 11) errors.cpf = "Informe um CPF válido.";
  if (!values.email.trim()) errors.email = "Informe seu e-mail institucional.";
  else if (!isValidEmail(values.email)) errors.email = "Informe um e-mail válido.";
  if (!values.telefone.trim()) errors.telefone = "Informe um telefone para contato.";
  else if (!isValidPhone(values.telefone)) errors.telefone = "Informe um telefone válido com DDD.";
  if (!values.senha) errors.senha = "Crie uma senha de acesso.";
  else if (values.senha.length < 8) errors.senha = "A senha deve ter ao menos 8 caracteres.";
  if (values.confirmarSenha !== values.senha) errors.confirmarSenha = "As senhas não coincidem.";

  return errors;
}

function validateStep2(values: CadastroFormState): CadastroFormErrors {
  const errors: CadastroFormErrors = {};

  if (!values.organizacaoNome.trim()) errors.organizacaoNome = "Informe o nome da organização.";
  if (!values.cnpj.trim()) errors.cnpj = "Informe o CNPJ.";
  else if (!isValidCnpj(values.cnpj)) errors.cnpj = "Informe um CNPJ válido.";
  if (!values.razaoSocial.trim()) errors.razaoSocial = "Informe a razão social.";
  if (!values.nomeFantasia.trim()) errors.nomeFantasia = "Informe o nome fantasia.";
  if (!values.organizacaoTipo) errors.organizacaoTipo = "Selecione o tipo de organização.";
  if (!values.organizacaoEmail.trim()) errors.organizacaoEmail = "Informe o e-mail institucional.";
  else if (!isValidEmail(values.organizacaoEmail)) errors.organizacaoEmail = "Informe um e-mail válido.";
  if (!values.organizacaoTelefone.trim()) errors.organizacaoTelefone = "Informe o telefone institucional.";
  else if (!isValidPhone(values.organizacaoTelefone)) errors.organizacaoTelefone = "Informe um telefone válido.";

  if (!values.cep.trim()) errors.cep = "Informe o CEP.";
  else if (!isValidCep(values.cep)) errors.cep = "Informe um CEP válido.";
  if (!values.estado) errors.estado = "Selecione o estado.";
  if (!values.cidade.trim()) errors.cidade = "Informe a cidade.";
  if (!values.bairro.trim()) errors.bairro = "Informe o bairro.";
  if (!values.logradouro.trim()) errors.logradouro = "Informe o logradouro.";
  if (!values.numero.trim()) errors.numero = "Informe o número.";

  if (!values.responsavelNome.trim()) errors.responsavelNome = "Informe o responsável legal.";
  if (!values.responsavelCpf.trim()) errors.responsavelCpf = "Informe o CPF do responsável legal.";
  else if (digitsOf(values.responsavelCpf).length !== 11) {
    errors.responsavelCpf = "Informe um CPF válido.";
  }
  if (!values.responsavelEmail.trim()) errors.responsavelEmail = "Informe o e-mail do responsável legal.";
  else if (!isValidEmail(values.responsavelEmail)) errors.responsavelEmail = "Informe um e-mail válido.";
  if (!values.responsavelTelefone.trim()) {
    errors.responsavelTelefone = "Informe o telefone do responsável legal.";
  } else if (!isValidPhone(values.responsavelTelefone)) {
    errors.responsavelTelefone = "Informe um telefone válido.";
  }

  return errors;
}

function validateStep3(values: CadastroFormState): Record<string, UsuarioConvidadoErrors> {
  const usuarioErrors: Record<string, UsuarioConvidadoErrors> = {};

  for (const usuario of values.usuarios) {
    const errors = validateUsuario(usuario);
    if (Object.keys(errors).length > 0) usuarioErrors[usuario.id] = errors;
  }

  return usuarioErrors;
}

function validateStep4(values: CadastroFormState): CadastroFormErrors {
  const errors: CadastroFormErrors = {};
  if (!values.declaracao) {
    errors.declaracao = "É necessário aceitar a declaração para continuar.";
  }
  return errors;
}

export function validateCadastroStep(step: number, values: CadastroFormState): CadastroStepValidation {
  if (step === 1) return { errors: validateStep1(values), usuarioErrors: {} };
  if (step === 2) return { errors: validateStep2(values), usuarioErrors: {} };
  if (step === 3) return { errors: {}, usuarioErrors: validateStep3(values) };
  return { errors: validateStep4(values), usuarioErrors: {} };
}
