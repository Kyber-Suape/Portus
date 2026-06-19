import type { CadastroFormState, CadastroFormErrors } from "@/types/cadastro";

export interface CadastroStepProps {
  values: CadastroFormState;
  errors: CadastroFormErrors;
  onChange: <K extends keyof CadastroFormState>(field: K, value: CadastroFormState[K]) => void;
}
