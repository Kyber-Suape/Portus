import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300",
  accent:
    "bg-accent-500 text-primary-900 hover:bg-accent-600 active:bg-accent-700 disabled:bg-accent-200",
  outline:
    "border border-border bg-surface text-foreground hover:bg-background disabled:text-muted-foreground",
  ghost:
    "bg-transparent text-foreground hover:bg-black/5 disabled:text-muted-foreground",
  danger:
    "bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-500/40",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

/** Classes do Button, reutilizáveis em CTAs renderizadas como <Link>. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "focus-ring inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-not-allowed",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "focus-ring inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-not-allowed",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
