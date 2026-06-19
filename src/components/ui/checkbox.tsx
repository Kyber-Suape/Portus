import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            aria-invalid={!!error || undefined}
            className={cn(
              "focus-ring mt-0.5 size-4 shrink-0 rounded border-border text-primary-600 accent-(--color-primary-600)",
              className,
            )}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className="text-sm leading-5 text-foreground"
          >
            {label}
          </label>
        </div>
        {error && <p className="pl-7 text-sm text-danger-600">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
