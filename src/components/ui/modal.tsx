"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-foreground">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="focus-ring shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-background"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
