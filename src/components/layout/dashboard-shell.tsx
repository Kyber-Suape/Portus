"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileTopbar } from "@/components/layout/mobile-topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MOCK_NOTIFICACOES } from "@/data/mock-notificacoes";

// Notificações ainda não têm endpoint na API — mock temporário, independente do
// usuário/organização reais (que vêm de `useAuth()` dentro de Sidebar/Topbar/MobileTopbar).
export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <MobileTopbar notificacoes={MOCK_NOTIFICACOES} onOpenMobileMenu={() => setMobileOpen(true)} />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Topbar notificacoes={MOCK_NOTIFICACOES} />
        <main className="flex-1 overflow-y-auto bg-background p-4 pb-24 pt-20 sm:p-6 lg:p-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
