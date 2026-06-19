import { PencilRuler } from "lucide-react";

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 overflow-hidden px-1">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-900 text-white shadow-sm">
        <PencilRuler className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="truncate text-base font-extrabold text-primary-900">Portus RDO</span>
        <span className="truncate text-xs text-muted-foreground">Diário Digital de Obras</span>
      </div>
    </div>
  );
}
