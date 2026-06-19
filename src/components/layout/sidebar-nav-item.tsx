import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/constants/nav";

export function SidebarNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  if (!item.implemented) {
    return (
      <span
        title="Disponível em uma próxima etapa"
        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/60"
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex flex-1 items-center justify-between">
          {item.label}
          <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] font-semibold uppercase">
            Em breve
          </span>
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "focus-ring relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-out",
        isActive
          ? "bg-primary-50 font-semibold text-primary-900"
          : "text-foreground hover:translate-x-0.5 hover:bg-background",
      )}
    >
      <Icon
        className={cn("size-4 shrink-0 transition-colors duration-200", isActive && "text-primary-900")}
        aria-hidden="true"
      />
      {item.label}
      {isActive && (
        <span
          className="absolute right-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary-900"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
