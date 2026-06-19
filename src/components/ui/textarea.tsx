import { type TextareaHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, required, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-danger-500"> *</span>}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          rows={rows}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "focus-ring resize-none rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors disabled:bg-background disabled:text-muted-foreground",
            error && "border-danger-500",
            className,
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";
