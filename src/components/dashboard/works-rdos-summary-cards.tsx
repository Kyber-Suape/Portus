"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileWarning,
  Hourglass,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { dashboardService, type WorksRdosDashboardSummary } from "@/services/dashboard.service";
import { cn } from "@/lib/utils";

type Tone = "primary" | "accent" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary-50 text-primary-600",
  accent: "bg-accent-50 text-accent-700",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

interface CardDef {
  key: keyof WorksRdosDashboardSummary;
  label: string;
  icon: LucideIcon;
  tone: Tone;
}

const CARD_DEFS: CardDef[] = [
  { key: "activeWorks", label: "Obras ativas", icon: Building2, tone: "primary" },
  { key: "contractsInProgress", label: "Contratos em andamento", icon: CheckCircle2, tone: "accent" },
  { key: "contractsNearExpiration", label: "Contratos a vencer", icon: CalendarClock, tone: "warning" },
  { key: "rdosCreated", label: "RDOs criados", icon: ClipboardList, tone: "primary" },
  { key: "rdosPending", label: "RDOs pendentes", icon: Hourglass, tone: "warning" },
  { key: "rdosOverdue", label: "RDOs atrasados", icon: Clock, tone: "danger" },
  { key: "pendingApprovals", label: "Aprovações pendentes", icon: FileWarning, tone: "warning" },
  { key: "criticalAlertsCount", label: "Alertas críticos", icon: AlertTriangle, tone: "danger" },
];

/** Indicadores de Obras/RDO computados a partir dos mocks (não são números estáticos). */
export function WorksRdosSummaryCards() {
  const [summary, setSummary] = useState<WorksRdosDashboardSummary | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      void dashboardService.getWorksRdosSummary().then(setSummary);
    });
  }, []);

  if (!summary) {
    return (
      <Card className="flex items-center justify-center p-8">
        <Spinner className="size-6" />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARD_DEFS.map(({ key, label, icon: Icon, tone }) => (
        <Card key={key} className="flex items-center gap-3 p-4">
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", TONE_CLASSES[tone])}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-foreground">{summary[key]}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
