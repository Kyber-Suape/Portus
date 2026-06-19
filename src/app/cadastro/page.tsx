import type { Metadata } from "next";
import { CadastroShell } from "@/components/cadastro/cadastro-shell";
import { CadastroForm } from "@/components/auth/cadastro-form";
import { GuestRoute } from "@/components/auth/guest-route";

export const metadata: Metadata = {
  title: "Solicitação de Acesso — Portus RDO",
};

export default function CadastroPage() {
  return (
    <GuestRoute>
      <CadastroShell>
        <CadastroForm />
      </CadastroShell>
    </GuestRoute>
  );
}
