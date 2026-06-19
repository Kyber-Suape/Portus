import { type InputHTMLAttributes, forwardRef, useId } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon: Icon, id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-danger-500"> *</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              "focus-ring h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground",
              "transition-colors disabled:bg-background disabled:text-muted-foreground",
              Icon && "pl-10",
              error && "border-danger-500",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={errorId} className="text-sm text-danger-600">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
