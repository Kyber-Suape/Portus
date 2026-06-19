import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AccessGuidelinesPanel } from "@/components/cadastro/access-guidelines-panel";

export function CadastroShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
        <Logo showSlogan={false} />
        <button
          type="button"
          aria-label="Ajuda"
          className="focus-ring rounded-full p-2 text-muted-foreground hover:bg-background"
        >
          <HelpCircle className="size-5" aria-hidden="true" />
        </button>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 pb-12 pt-24 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24">
            <AccessGuidelinesPanel />
          </div>
        </aside>
        <section className="flex flex-col gap-4 lg:col-span-8">{children}</section>
      </main>
    </div>
  );
}
