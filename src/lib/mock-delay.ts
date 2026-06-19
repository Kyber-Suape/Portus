/** Simula latência de rede para os services mock de Obras/RDO — só para o loading/feedback visual parecer real. */
export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
