"use client";

import { useId, useState, forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  labelAction?: ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, hint, icon: Icon, labelAction, id, required, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-danger-500"> *</span>}
          </label>
          {labelAction}
        </div>
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
            type={visible ? "text" : "password"}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              "focus-ring h-11 w-full rounded-lg border border-border bg-surface px-3.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground",
              "transition-colors disabled:bg-background disabled:text-muted-foreground",
              Icon && "pl-10",
              error && "border-danger-500",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            className="focus-ring absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {visible ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
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

PasswordInput.displayName = "PasswordInput";
