import { rdosService } from "@/services/rdos.service";
import { worksService } from "@/services/works.service";
import type { RdoStatus } from "@/types/rdo";

const PENDING_STATUSES: RdoStatus[] = ["SENT_TO_REVIEW", "UNDER_REVIEW", "CHANGES_REQUESTED"];
const CONTRACT_EXPIRATION_WINDOW_DAYS = 30;
const OVERDUE_DRAFT_DAYS = 2;

export interface WorksRdosDashboardSummary {
  activeWorks: number;
  contractsInProgress: number;
  contractsNearExpiration: number;
  rdosCreated: number;
  rdosPending: number;
  rdosOverdue: number;
  pendingApprovals: number;
  criticalAlertsCount: number;
}

/** Front-only: computa os indicadores a partir do estado atual dos mocks de Works/RDOs (não são números estáticos). */
export const dashboardService = {
  async getWorksRdosSummary(): Promise<WorksRdosDashboardSummary> {
    const [works, rdosPage] = await Promise.all([worksService.list(), rdosService.list({ pageSize: 200 })]);
    const rdos = rdosPage.items;

    const now = Date.now();
    const expirationWindowMs = CONTRACT_EXPIRATION_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    const overdueDraftCutoffMs = OVERDUE_DRAFT_DAYS * 24 * 60 * 60 * 1000;

    const activeWorks = works.filter((w) => w.status === "ACTIVE");
    const contractsNearExpiration = activeWorks.filter((w) => {
      const end = new Date(w.contractEndDate).getTime();
      return end >= now && end - now <= expirationWindowMs;
    });

    const rdosPending = rdos.filter((r) => PENDING_STATUSES.includes(r.status));
    const rdosOverdue = rdos.filter((r) => r.status === "DRAFT" && now - new Date(r.createdAt).getTime() > overdueDraftCutoffMs);
    const pendingApprovals = rdos.filter((r) => r.status === "UNDER_SUAPE_REVIEW");

    return {
      activeWorks: activeWorks.length,
      contractsInProgress: activeWorks.length,
      contractsNearExpiration: contractsNearExpiration.length,
      rdosCreated: rdos.length,
      rdosPending: rdosPending.length,
      rdosOverdue: rdosOverdue.length,
      pendingApprovals: pendingApprovals.length,
      criticalAlertsCount: contractsNearExpiration.length + rdosOverdue.length,
    };
  },
};
