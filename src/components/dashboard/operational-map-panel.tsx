import { Map, Maximize2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WORKS_SEED } from "@/mocks/works.mock";
import { WORK_STATUS_CONFIG } from "@/constants/work";

const MARKER_POSITIONS = [
  { top: "38%", left: "28%" },
  { top: "58%", left: "62%" },
  { top: "72%", left: "32%" },
  { top: "26%", left: "70%" },
];

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "bg-success-500",
  PAUSED: "bg-warning-500",
  COMPLETED: "bg-muted-foreground",
  CANCELED: "bg-danger-500",
  EXPIRED: "bg-muted-foreground",
  DRAFT: "bg-muted-foreground",
};

export function OperationalMapPanel() {
  const obras = WORKS_SEED.slice(0, 4);

  return (
    <Card id="mapa-operacional" className="flex min-h-[260px] flex-1 flex-col overflow-hidden p-0">
      <div className="z-10 flex items-center justify-between border-b border-border bg-surface/90 p-3 backdrop-blur">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
          <Map className="size-4" aria-hidden="true" />
          Mapa Operacional
        </h3>
        <button
          type="button"
          aria-label="Expandir mapa"
          className="focus-ring rounded p-1 text-primary-600 hover:bg-background"
        >
          <Maximize2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex-1 bg-background"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,22,41,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,22,41,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {obras.map((obra, index) => (
          <div
            key={obra.id}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={MARKER_POSITIONS[index]}
          >
            <span className="mb-1 whitespace-nowrap rounded border border-border bg-surface px-2 py-1 text-xs font-semibold text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              {obra.name}
            </span>
            <span
              className={cn(
                "size-3.5 rounded-full border-2 border-white shadow-md",
                STATUS_DOT[obra.status],
              )}
            />
          </div>
        ))}

        <div className="absolute bottom-3 right-3 flex flex-col gap-1 rounded-lg border border-border/60 bg-surface/85 p-2 text-xs backdrop-blur">
          {Object.entries(WORK_STATUS_CONFIG).map(([status, config]) => (
            <span key={status} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", STATUS_DOT[status])} aria-hidden="true" />
              {config.label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
