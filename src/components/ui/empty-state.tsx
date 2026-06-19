import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-background px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary-50">
        <Icon className="size-6 text-primary-600" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground">{title}</p>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
