"use client";

import Link from "next/link";
import { Zap, FilePlus2, ListChecks, FileBarChart, ShieldCheck, Building2, Map, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/user";

interface SecondaryAction {
  label: string;
  icon: LucideIcon;
  href?: string;
  tone?: "warning" | "primary" | "muted";
  roles?: UserRole[];
}

const SECONDARY_ACTIONS: SecondaryAction[] = [
  { label: "Revisar pendências", icon: ListChecks, href: "#pendencias", tone: "warning" },
  { label: "Aprovar relatórios", icon: ShieldCheck, tone: "primary" },
  { label: "Gerar PDF", icon: FileBarChart, tone: "muted" },
  { label: "Ver mapa", icon: Map, href: "#mapa-operacional", tone: "muted" },
  { label: "Gerenciar obras", icon: Building2, tone: "muted", roles: ["SYSTEM_ADMIN"] },
];

const TONE_ICON_CLASSES: Record<NonNullable<SecondaryAction["tone"]>, string> = {
  warning: "text-warning-500",
  primary: "text-primary-600",
  muted: "text-muted-foreground",
};

export function QuickActions() {
  const { user } = useAuth();
  const secondaryActions = SECONDARY_ACTIONS.filter(
    (action) => !action.roles || (user && action.roles.includes(user.role)),
  );

  return (
    <Card className="flex h-full flex-col gap-3 p-4">
      <CardTitle className="flex items-center gap-2">
        <Zap className="size-4 text-primary-600" aria-hidden="true" />
        Ações Rápidas
      </CardTitle>

      <button
        type="button"
        disabled
        title="Disponível em uma próxima etapa"
        className="flex h-12 w-full items-center justify-between rounded-lg bg-primary-900/40 px-4 text-sm font-semibold text-white"
      >
        <span className="flex items-center gap-2">
          <FilePlus2 className="size-[18px]" aria-hidden="true" />
          Novo RDO
        </span>
        <ArrowRight className="size-[18px]" aria-hidden="true" />
      </button>

      <div className="grid grid-cols-2 gap-2.5">
        {secondaryActions.map(({ label, icon: Icon, href, tone = "muted" }) =>
          href ? (
            <Link
              key={label}
              href={href}
              className="flex h-[72px] flex-col items-center justify-center gap-1 rounded-lg border border-border bg-background text-center text-xs font-medium text-foreground transition-colors hover:bg-border/40"
            >
              <Icon className={cn("size-5", TONE_ICON_CLASSES[tone])} aria-hidden="true" />
              {label}
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              disabled
              title="Disponível em uma próxima etapa"
              className="flex h-[72px] flex-col items-center justify-center gap-1 rounded-lg border border-border bg-background text-center text-xs font-medium text-muted-foreground/60"
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </button>
          ),
        )}
      </div>
    </Card>
  );
}
