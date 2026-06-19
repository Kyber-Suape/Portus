import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/constants/status";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  dotted?: boolean;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  primary: "bg-primary-50 text-primary-700",
  accent: "bg-accent-50 text-accent-800",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
  muted: "bg-background text-muted-foreground",
};

const DOT_CLASSES: Record<StatusTone, string> = {
  primary: "bg-primary-600",
  accent: "bg-accent-600",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  muted: "bg-muted-foreground",
};

export function Badge({
  className,
  tone = "muted",
  dotted = true,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    >
      {dotted && (
        <span
          className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
