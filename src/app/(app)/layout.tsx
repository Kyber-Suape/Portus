import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";

/**
 * Layout compartilhado por todas as rotas autenticadas (dashboard, usuários e futuras
 * telas de obras/RDOs/relatórios/auditoria) — grupo de rota `(app)`, não aparece na URL.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
