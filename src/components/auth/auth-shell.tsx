import type { ReactNode } from "react";
import { MapPinned, Workflow, PenLine, ClipboardCheck, WifiOff, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SuapePattern } from "@/components/brand/suape-pattern";

const HIGHLIGHTS = [
  { icon: MapPinned, text: "Georreferenciamento automático" },
  { icon: Workflow, text: "Aprovação por fluxo" },
  { icon: PenLine, text: "Assinatura eletrônica" },
  { icon: ClipboardCheck, text: "Auditoria completa" },
  { icon: WifiOff, text: "Operação offline" },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="relative hidden overflow-hidden bg-primary-900 px-10 py-12 md:flex md:w-1/2 md:flex-col md:justify-between lg:w-[44%]">
        <SuapePattern tone="light" className="opacity-[0.08]" />
        <div className="relative z-10">
          <Logo tone="inverted" showSlogan={false} />
          <h2 className="mt-6 max-w-md text-xl font-semibold text-primary-100">
            Diário Digital de Obras e Serviços de Engenharia
          </h2>
        </div>
        <ul className="relative z-10 flex flex-col gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-white/90">
              <Icon className="mt-0.5 size-5 shrink-0 text-success-500" aria-hidden="true" />
              <span className="text-sm leading-6">{text}</span>
            </li>
          ))}
        </ul>
        <div className="relative z-10 flex items-center gap-2 text-primary-100">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Sistema institucional seguro
          </span>
        </div>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-10 sm:px-6">
        <div className="mb-8 md:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
