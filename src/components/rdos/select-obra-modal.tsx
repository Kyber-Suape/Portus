"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useWorks } from "@/hooks/use-works";
import { ROUTES } from "@/constants/routes";

interface SelectObraModalProps {
  onClose: () => void;
}

/** Passo obrigatório antes de criar um RDO: escolher a obra ativa à qual ele será vinculado. */
export function SelectObraModal({ onClose }: SelectObraModalProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { works, isLoading } = useWorks({ status: "ACTIVE" });

  const filtered = works.filter((work) => {
    if (!q.trim()) return true;
    const haystack = [work.name, work.contractNumber, work.contractedCompanyName, work.suapeInspectorName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q.trim().toLowerCase());
  });

  function handleContinue() {
    if (!selectedId) return;
    router.push(`${ROUTES.rdoNovo}?workId=${selectedId}`);
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Selecionar obra" description="Escolha a obra ativa para a qual este RDO será registrado.">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="select-obra-busca" className="sr-only">
            Buscar por nome, contrato, empresa ou responsável
          </label>
          <input
            id="select-obra-busca"
            type="search"
            placeholder="Buscar por nome, contrato, empresa ou responsável..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="focus-ring h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Building2} title="Nenhuma obra ativa encontrada" description="Ajuste a busca ou cadastre uma nova obra." />
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((work) => (
                <li key={work.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(work.id)}
                    className={`focus-ring flex w-full flex-col gap-0.5 rounded-lg border p-3 text-left transition-colors ${
                      selectedId === work.id ? "border-primary-600 bg-primary-50" : "border-border bg-surface hover:bg-background"
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground">{work.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {work.contractNumber} · {work.contractedCompanyName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" disabled={!selectedId} onClick={handleContinue}>
            Continuar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
