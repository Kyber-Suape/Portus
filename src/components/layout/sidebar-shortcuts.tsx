import Link from "next/link";
import { Inbox, ClipboardCheck, MapPinned, CloudCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { MOCK_PENDENCIAS } from "@/data/mock-pendencias";

interface ShortcutLink {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
}

export function SidebarShortcuts() {
  const pendenciasCount = MOCK_PENDENCIAS.length;
  const aprovacoesCount = MOCK_PENDENCIAS.filter((p) => p.tipo === "aprovacao").length;

  const shortcuts: ShortcutLink[] = [
    { label: "Pendências", icon: Inbox, href: `${ROUTES.dashboard}#pendencias`, badge: pendenciasCount },
    { label: "Aprovações", icon: ClipboardCheck, badge: aprovacoesCount },
    { label: "Mapa de Obras", icon: MapPinned, href: `${ROUTES.dashboard}#mapa-operacional` },
  ];

  return (
    <div className="mt-2 flex flex-col gap-0.5">
      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        Atalhos
      </p>

      {shortcuts.map((shortcut) =>
        shortcut.href ? (
          <Link
            key={shortcut.label}
            href={shortcut.href}
            className="focus-ring group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 ease-out hover:translate-x-0.5 hover:bg-background hover:text-foreground"
          >
            <shortcut.icon className="size-3.5 shrink-0 opacity-70 group-hover:opacity-100" aria-hidden="true" />
            <span className="flex-1 truncate">{shortcut.label}</span>
            {!!shortcut.badge && <ShortcutBadge value={shortcut.badge} />}
          </Link>
        ) : (
          <span
            key={shortcut.label}
            title="Disponível em uma próxima etapa"
            className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground/50"
          >
            <shortcut.icon className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
            <span className="flex-1 truncate">{shortcut.label}</span>
            {!!shortcut.badge && <ShortcutBadge value={shortcut.badge} muted />}
          </span>
        ),
      )}

      <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground">
        <CloudCheck className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
        <span className="flex-1 truncate">Sincronização</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-success-600">
          <span className="size-1.5 rounded-full bg-success-500" aria-hidden="true" />
          Sincronizado
        </span>
      </div>
    </div>
  );
}

function ShortcutBadge({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <span
      className={cn(
        "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold",
        muted ? "bg-background text-muted-foreground/70" : "bg-primary-50 text-primary-900",
      )}
    >
      {value}
    </span>
  );
}
