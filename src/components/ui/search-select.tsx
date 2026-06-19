"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SearchSelectProps {
  label: string;
  options: SearchSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

/** Select com busca textual sobre uma lista de opções (nome + descrição), sem dependência externa. */
export function SearchSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado.",
  required,
  disabled,
  error,
  hint,
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const buttonId = `${generatedId}-button`;
  const errorId = `${generatedId}-error`;

  const selected = options.find((option) => option.value === value);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((option) => `${option.label} ${option.description ?? ""}`.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label htmlFor={buttonId} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-danger-500"> *</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          id={buttonId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "focus-ring flex h-11 w-full items-center justify-between rounded-lg border border-border bg-surface px-3.5 text-left text-sm transition-colors",
            "disabled:bg-background disabled:text-muted-foreground",
            selected ? "text-foreground" : "text-muted-foreground",
            error && "border-danger-500",
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>

        {open && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
            <div className="relative border-b border-border p-2">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="focus-ring h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <ul role="listbox" className="max-h-56 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-muted-foreground">{emptyMessage}</li>
              ) : (
                filtered.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.value === value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "focus-ring flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-background",
                        option.value === value && "bg-primary-50",
                      )}
                    >
                      <span className="flex flex-col">
                        <span className="font-medium text-foreground">{option.label}</span>
                        {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
                      </span>
                      {option.value === value && <Check className="size-4 shrink-0 text-primary-600" aria-hidden="true" />}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-danger-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
