import type { Metadata } from "next";
import { MOCK_INDICADORES } from "@/data/mock-indicadores";
import { MOCK_PENDENCIAS } from "@/data/mock-pendencias";
import { MOCK_RDOS } from "@/data/mock-rdos";
import { MOCK_ATIVIDADES } from "@/data/mock-atividades";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SyncStatusCard } from "@/components/dashboard/sync-status-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PendingList } from "@/components/dashboard/pending-list";
import { RdoFlowTimeline } from "@/components/dashboard/rdo-flow-timeline";
import { OperationalMapPanel } from "@/components/dashboard/operational-map-panel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AlertsBanner } from "@/components/dashboard/alerts-banner";
import { WorksRdosSummaryCards } from "@/components/dashboard/works-rdos-summary-cards";

export const metadata: Metadata = {
  title: "Dashboard — Portus RDO",
};

// Indicadores, pendências, RDOs e atividades ainda não têm endpoint na API — usam os
// mocks de `src/data` como fallback temporário, bem separados dos dados reais de
// usuário/organização (que vêm de `useAuth()` via `DashboardGreeting`/`Topbar`/`Sidebar`).
export default function DashboardPage() {
  const ultimaSincronizacao = MOCK_RDOS[0]?.atualizadoEm ?? new Date().toISOString();

  return (
    <div className="flex flex-col gap-6">
      <DashboardGreeting />

      <AlertsBanner rdos={MOCK_RDOS} />

      <WorksRdosSummaryCards />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="grid grid-cols-2 gap-4 md:col-span-8 lg:grid-cols-3">
          {MOCK_INDICADORES.map((indicador) => (
            <MetricCard key={indicador.id} indicador={indicador} />
          ))}
          <SyncStatusCard atualizadoEm={ultimaSincronizacao} />
        </div>
        <div className="md:col-span-4">
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PendingList pendencias={MOCK_PENDENCIAS} />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-4">
          <RdoFlowTimeline />
          <OperationalMapPanel />
        </div>
      </div>

      <ActivityFeed atividades={MOCK_ATIVIDADES} />
    </div>
  );
}
