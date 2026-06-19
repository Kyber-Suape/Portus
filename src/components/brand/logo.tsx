import { cn } from "@/lib/utils";
import { SuapeMark } from "@/components/brand/suape-mark";

export interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  tone?: "default" | "inverted";
}

export function Logo({ className, showSlogan = true, tone = "default" }: LogoProps) {
  const textColor =
    tone === "inverted" ? "text-white" : "text-primary-900";
  const mutedColor =
    tone === "inverted" ? "text-white/75" : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <SuapeMark
        className="size-10 shrink-0"
        background={tone === "inverted" ? "var(--color-primary-700)" : "var(--color-surface)"}
      />
      <div className="flex flex-col leading-tight">
        <span className={cn("text-lg font-bold tracking-tight", textColor)}>
          Portus RDO
        </span>
        {showSlogan && (
          <span className={cn("text-xs font-medium", mutedColor)}>
            Diário Digital de Obras e Serviços
          </span>
        )}
      </div>
    </div>
  );
}
