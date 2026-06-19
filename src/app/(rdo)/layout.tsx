import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";

/**
 * Layout próprio para criar/editar/revisar um RDO — sem o chrome global do dashboard
 * (sidebar/topbar/bottom nav). A listagem `/rdos` continua no grupo `(app)`.
 */
export default function RdoLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-background">{children}</div>
    </ProtectedRoute>
  );
}
