import { delay } from "@/lib/mock-delay";

export interface RdoTextSuggestionRequest {
  category?: string;
  context?: string;
}

const SUGGESTIONS_BY_CATEGORY: Record<string, string> = {
  Terraplenagem: "Durante o período, foi realizada a escavação e movimentação de terra no setor indicado, sem intercorrências.",
  Fundação: "Executada a escavação para as sapatas da fundação, com conferência topográfica de cotas e alinhamento.",
  Concretagem: "Realizado o lançamento de concreto na estrutura prevista, com retirada de corpos de prova para controle tecnológico.",
  Alvenaria: "Executado o levantamento de alvenaria conforme projeto, com verificação de prumo e nível.",
};

const GENERIC_SUGGESTION =
  "Durante o período, a equipe executou as atividades programadas no cronograma, sem ocorrências que comprometessem o andamento da obra.";

/** Front-only: nenhuma chamada à API. Texto canned — placeholder estrutural para uma integração de IA real no futuro. */
export const aiService = {
  async generateRdoTextSuggestion(payload: RdoTextSuggestionRequest): Promise<{ suggestion: string }> {
    await delay(600);
    const byCategory = payload.category ? SUGGESTIONS_BY_CATEGORY[payload.category] : undefined;
    return { suggestion: byCategory ?? GENERIC_SUGGESTION };
  },

  async transcribeAudio(_file: Blob): Promise<{ transcript: string }> {
    await delay(900);
    return {
      transcript:
        "Transcrição de exemplo: equipe concluiu a etapa prevista para o turno, sem ocorrências de segurança a registrar.",
    };
  },
};
