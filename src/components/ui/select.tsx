import { type SelectHTMLAttributes, forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, options, error, placeholder, id, required, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-danger-500"> *</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "focus-ring h-11 w-full appearance-none rounded-lg border border-border bg-surface px-3.5 pr-10 text-sm text-foreground",
              "transition-colors disabled:bg-background disabled:text-muted-foreground",
              error && "border-danger-500",
              className,
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder ?? "Selecione"}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={errorId} className="text-sm text-danger-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
