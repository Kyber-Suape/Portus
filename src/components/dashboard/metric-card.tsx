import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Indicador } from "@/types/dashboard";

const TONE_ICON_CLASSES: Record<NonNullable<Indicador["tom"]>, string> = {
  primary: "bg-primary-50 text-primary-600",
  accent: "bg-accent-50 text-accent-700",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
};

const STRIPE_CLASSES: Record<NonNullable<Indicador["accentStripe"]>, string> = {
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export function MetricCard({ indicador }: { indicador: Indicador }) {
  const { titulo, valor, descricao, icon: Icon, tendencia, tom = "primary", accentStripe, badge } = indicador;

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between gap-3 overflow-hidden p-5",
        accentStripe && "pl-6",
      )}
    >
      {accentStripe && (
        <span
          className={cn("absolute inset-y-0 left-0 w-1", STRIPE_CLASSES[accentStripe])}
          aria-hidden="true"
        />
      )}
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            TONE_ICON_CLASSES[tom],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {badge ? (
          <span className="rounded-full bg-danger-500 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
            {badge}
          </span>
        ) : (
          tendencia &&
          tendencia !== "stable" && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                tendencia === "up" ? "text-danger-600" : "text-success-600",
              )}
            >
              {tendencia === "up" ? (
                <TrendingUp className="size-3.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="size-3.5" aria-hidden="true" />
              )}
            </span>
          )
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-bold text-foreground">{valor}</p>
        <p className="text-sm font-medium text-foreground">{titulo}</p>
        {descricao && <p className="text-xs text-muted-foreground">{descricao}</p>}
      </div>
    </Card>
  );
}
