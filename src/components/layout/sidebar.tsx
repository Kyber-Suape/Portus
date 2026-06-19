"use client";

import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { useAuth } from "@/hooks/use-auth";
import { SidebarBrand } from "@/components/layout/sidebar-brand";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { NewRdoButton } from "@/components/layout/new-rdo-button";
import { SidebarShortcuts } from "@/components/layout/sidebar-shortcuts";
import { SidebarFooter } from "@/components/layout/sidebar-footer";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function isItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <SidebarBrand />
        <button
          type="button"
          onClick={onCloseMobile}
          className="focus-ring rounded-md p-1.5 text-muted-foreground hover:bg-background lg:hidden"
          aria-label="Fechar menu"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="px-3 pt-3">
        <NewRdoButton />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Navegação principal">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <SidebarNavItem item={item} isActive={isItemActive(pathname, item.href)} />
            </li>
          ))}
        </ul>

        <div className="my-3 border-t border-border" aria-hidden="true" />

        <SidebarShortcuts />
      </nav>

      <SidebarFooter />
    </div>
  );

  return (
    <>
      <div className="sidebar-enter hidden h-screen shrink-0 border-r border-border bg-surface lg:block">
        {content}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative h-full w-72 bg-surface shadow-xl">{content}</div>
        </div>
      )}
    </>
  );
}
