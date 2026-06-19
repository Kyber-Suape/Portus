"use client";

import { useState } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { WORKS_SEED } from "@/mocks/works.mock";

export function ObraSelector() {
  const [obraId, setObraId] = useState(WORKS_SEED[0].id);

  return (
    <div className="relative inline-flex">
      <label htmlFor="obra-selector" className="sr-only">
        Obra ou contrato selecionado
      </label>
      <Building2
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary-600"
        aria-hidden="true"
      />
      <select
        id="obra-selector"
        value={obraId}
        onChange={(e) => setObraId(e.target.value)}
        className="focus-ring h-10 appearance-none rounded-lg border border-border bg-surface pl-9 pr-9 text-sm font-medium text-foreground"
      >
        {WORKS_SEED.map((obra) => (
          <option key={obra.id} value={obra.id}>
            {obra.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}
