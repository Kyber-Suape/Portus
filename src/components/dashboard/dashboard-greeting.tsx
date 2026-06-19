"use client";

import { useAuth } from "@/hooks/use-auth";
import { ROLE_LABELS } from "@/constants/roles";
import { Badge } from "@/components/ui/badge";
import { ObraSelector } from "@/components/dashboard/obra-selector";

function getSaudacao(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

/** Saudação com nome/perfil do usuário autenticado — único trecho do dashboard que depende de dados reais. */
export function DashboardGreeting() {
  const { user } = useAuth();
  const primeiroNome = user?.name.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            {getSaudacao()}
            {primeiroNome && `, ${primeiroNome}`}.
          </h1>
          {user && <Badge tone="primary">{ROLE_LABELS[user.role]}</Badge>}
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Aqui estão as pendências das obras vinculadas. O sistema está sincronizado com a base
          central.
        </p>
        <ObraSelector />
      </div>
    </div>
  );
}
