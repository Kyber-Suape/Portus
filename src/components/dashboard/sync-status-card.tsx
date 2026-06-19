import { CloudCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LiveStatus } from "@/components/ui/live-status";
import { formatDateTime } from "@/lib/format";

export function SyncStatusCard({ atualizadoEm }: { atualizadoEm: string }) {
  return (
    <Card className="relative col-span-2 flex flex-col justify-between overflow-hidden p-5 lg:col-span-2">
      <CloudCheck
        className="absolute -bottom-4 -right-4 size-28 text-primary-900/5"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-lg bg-background text-muted-foreground">
            <CloudCheck className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">Status do Sistema</span>
        </div>
        <LiveStatus label="" tone="success" className="border-none bg-transparent p-0" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">Sincronizado</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Última att: {formatDateTime(atualizadoEm)}
        </p>
      </div>
    </Card>
  );
}
