import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ORGANIZACAO_TIPO_OPTIONS, UF_OPTIONS } from "@/constants/cadastro";
import { formatCnpjInput, formatCepInput, formatCpfInput, formatPhoneInput } from "@/lib/validators";
import { useCepLookup } from "@/hooks/use-cep-lookup";
import type { CadastroStepProps } from "@/components/cadastro/steps/types";

const CEP_HINT: Record<"loading" | "error", string> = {
  loading: "Buscando endereço...",
  error: "CEP não encontrado. Preencha o endereço manualmente.",
};

export function StepOrganizacao({ values, errors, onChange }: CadastroStepProps) {
  const cepStatus = useCepLookup(values.cep, (address) => {
    onChange("logradouro", address.logradouro);
    onChange("bairro", address.bairro);
    onChange("cidade", address.cidade);
    onChange("estado", address.estado);
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="border-b border-border pb-2 text-base font-bold text-primary-900">
        2. Dados da Organização
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Nome da organização"
            placeholder="Ex: Construtora Alfa"
            required
            value={values.organizacaoNome}
            onChange={(e) => onChange("organizacaoNome", e.target.value)}
            error={errors.organizacaoNome}
          />
        </div>
        <MaskedInput
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          required
          mask={formatCnpjInput}
          value={values.cnpj}
          onValueChange={(value) => onChange("cnpj", value)}
          error={errors.cnpj}
        />
        <Select
          label="Tipo de organização"
          placeholder="Selecione o tipo..."
          required
          options={ORGANIZACAO_TIPO_OPTIONS}
          value={values.organizacaoTipo}
          onChange={(e) => onChange("organizacaoTipo", e.target.value as typeof values.organizacaoTipo)}
          error={errors.organizacaoTipo}
        />
        <Input
          label="Razão social"
          placeholder="Ex: Construtora Alfa S.A."
          required
          value={values.razaoSocial}
          onChange={(e) => onChange("razaoSocial", e.target.value)}
          error={errors.razaoSocial}
        />
        <Input
          label="Nome fantasia"
          placeholder="Ex: Alfa Engenharia"
          required
          value={values.nomeFantasia}
          onChange={(e) => onChange("nomeFantasia", e.target.value)}
          error={errors.nomeFantasia}
        />
        <Input
          label="E-mail institucional"
          type="email"
          placeholder="contato@empresa.com.br"
          required
          value={values.organizacaoEmail}
          onChange={(e) => onChange("organizacaoEmail", e.target.value)}
          error={errors.organizacaoEmail}
        />
        <MaskedInput
          label="Telefone institucional"
          placeholder="(00) 00000-0000"
          required
          mask={formatPhoneInput}
          value={values.organizacaoTelefone}
          onValueChange={(value) => onChange("organizacaoTelefone", value)}
          error={errors.organizacaoTelefone}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <h4 className="text-sm font-semibold text-foreground sm:col-span-2">Endereço</h4>
        <MaskedInput
          label="CEP"
          placeholder="00000-000"
          required
          mask={formatCepInput}
          value={values.cep}
          onValueChange={(value) => onChange("cep", value)}
          error={errors.cep}
          hint={!errors.cep && cepStatus !== "idle" && cepStatus !== "success" ? CEP_HINT[cepStatus] : undefined}
        />
        <Select
          label="Estado"
          placeholder="Selecione o estado..."
          required
          options={UF_OPTIONS}
          value={values.estado}
          onChange={(e) => onChange("estado", e.target.value)}
          error={errors.estado}
        />
        <Input
          label="Cidade"
          placeholder="Ex: Ipojuca"
          required
          value={values.cidade}
          onChange={(e) => onChange("cidade", e.target.value)}
          error={errors.cidade}
        />
        <Input
          label="Bairro"
          placeholder="Ex: Suape"
          required
          value={values.bairro}
          onChange={(e) => onChange("bairro", e.target.value)}
          error={errors.bairro}
        />
        <div className="sm:col-span-2">
          <Input
            label="Logradouro"
            placeholder="Ex: Rod. PE-60, km 10"
            required
            value={values.logradouro}
            onChange={(e) => onChange("logradouro", e.target.value)}
            error={errors.logradouro}
          />
        </div>
        <Input
          label="Número"
          placeholder="Ex: 1000"
          required
          value={values.numero}
          onChange={(e) => onChange("numero", e.target.value)}
          error={errors.numero}
        />
        <Input
          label="Complemento"
          placeholder="Opcional"
          value={values.complemento}
          onChange={(e) => onChange("complemento", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <h4 className="text-sm font-semibold text-foreground sm:col-span-2">
          Responsável Legal
        </h4>
        <Input
          label="Responsável legal"
          placeholder="Nome completo"
          required
          value={values.responsavelNome}
          onChange={(e) => onChange("responsavelNome", e.target.value)}
          error={errors.responsavelNome}
        />
        <MaskedInput
          label="CPF do responsável legal"
          placeholder="000.000.000-00"
          required
          mask={formatCpfInput}
          value={values.responsavelCpf}
          onValueChange={(value) => onChange("responsavelCpf", value)}
          error={errors.responsavelCpf}
        />
        <Input
          label="E-mail do responsável legal"
          type="email"
          placeholder="responsavel@empresa.com.br"
          required
          value={values.responsavelEmail}
          onChange={(e) => onChange("responsavelEmail", e.target.value)}
          error={errors.responsavelEmail}
        />
        <MaskedInput
          label="Telefone do responsável legal"
          placeholder="(00) 00000-0000"
          required
          mask={formatPhoneInput}
          value={values.responsavelTelefone}
          onValueChange={(value) => onChange("responsavelTelefone", value)}
          error={errors.responsavelTelefone}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-foreground">
          Observações <span className="text-muted-foreground">(opcional)</span>
        </h4>
        <Textarea
          label="Observações"
          placeholder="Informações adicionais sobre a organização..."
          value={values.observacoes}
          onChange={(e) => onChange("observacoes", e.target.value)}
        />
      </div>
    </div>
  );
}
