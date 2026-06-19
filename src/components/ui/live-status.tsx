import { cn } from "@/lib/utils";

export interface LiveStatusProps {
  label: string;
  tone?: "success" | "muted";
  className?: string;
}

/** Pill com ponto pulsante, usado para indicar conexão/sincronização em tempo real. */
export function LiveStatus({ label, tone = "success", className }: LiveStatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-60",
            tone === "success" ? "bg-success-500" : "bg-muted-foreground",
          )}
        />
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            tone === "success" ? "bg-success-500" : "bg-muted-foreground",
          )}
        />
      </span>
      {label}
    </span>
  );
}
