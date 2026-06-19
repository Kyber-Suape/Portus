import Link from "next/link";
import { ArrowLeft, Cloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { RDO_STATUS_CONFIG } from "@/constants/rdo";
import type { RdoStatus } from "@/types/rdo";

interface RdoTopbarProps {
  title: string;
  rdoNumber?: number;
  workLabel?: string | null;
  contractLabel?: string | null;
  status?: RdoStatus;
  lastSavedAt?: string | null;
}

/** Topbar própria das telas de criação/edição/revisão de RDO — substitui o chrome global do dashboard nessas telas. */
export function RdoTopbar({ title, rdoNumber, workLabel, contractLabel, status, lastSavedAt }: RdoTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-2 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.rdos}
          className="focus-ring rounded-lg p-2 text-muted-foreground hover:bg-background"
          aria-label="Voltar para RDOs"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-foreground">{rdoNumber ? `RDO #${rdoNumber}` : title}</h1>
            {status && <Badge tone={RDO_STATUS_CONFIG[status].tone}>{RDO_STATUS_CONFIG[status].label}</Badge>}
          </div>
          {(workLabel ?? contractLabel) && (
            <p className="text-xs text-muted-foreground">
              {workLabel}
              {contractLabel ? ` · ${contractLabel}` : ""}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-success-500" aria-hidden="true" />
          Online
        </span>
        {lastSavedAt && (
          <span className="flex items-center gap-1.5">
            <Cloud className="size-3.5" aria-hidden="true" />
            Salvo às {new Date(lastSavedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </header>
  );
}
