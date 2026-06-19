import { ShieldCheck, CheckCircle2, FileCheck2, Gavel } from "lucide-react";
import { SuapePattern } from "@/components/brand/suape-pattern";

const GUIDELINES = [
  { icon: CheckCircle2, text: "Utilize preferencialmente e-mails corporativos rastreáveis." },
  { icon: FileCheck2, text: "Todos os dados anexados são submetidos a análise prévia." },
  {
    icon: Gavel,
    text: "Sistema em conformidade com a LGPD e normas de compliance portuário.",
  },
];

export function AccessGuidelinesPanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="relative flex h-32 items-end overflow-hidden bg-primary-900 p-3">
        <SuapePattern tone="light" className="opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent" />
        <ShieldCheck className="relative z-10 size-7 text-white" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h2 className="text-base font-bold text-primary-900">Diretrizes de Acesso</h2>
        <p className="text-sm text-muted-foreground">
          O Portus RDO é uma plataforma restrita e auditável. O acesso é concedido
          exclusivamente a colaboradores, fornecedores e auditores credenciados.
        </p>
        <ul className="mt-1 flex flex-col gap-2">
          {GUIDELINES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Icon className="mt-0.5 size-4 shrink-0 text-success-600" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 rounded-lg border border-border bg-background p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Suporte Técnico
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Em caso de dúvidas sobre qual perfil solicitar, contate a gerência do seu
            contrato ou a TI Suape.
          </p>
        </div>
      </div>
    </div>
  );
}
