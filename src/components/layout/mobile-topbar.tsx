"use client";

import { Menu, RefreshCw, Bell } from "lucide-react";
import { getInitials } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import type { Notificacao } from "@/types/dashboard";

interface MobileTopbarProps {
  notificacoes: Notificacao[];
  onOpenMobileMenu: () => void;
}

export function MobileTopbar({ notificacoes, onOpenMobileMenu }: MobileTopbarProps) {
  const { user } = useAuth();
  const unreadCount = notificacoes.filter((n) => !n.lida).length;

  if (!user) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md lg:hidden">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="focus-ring rounded-md p-2 text-muted-foreground hover:bg-background"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <span className="text-lg font-bold text-primary-900">Portus RDO</span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Sincronizar"
          className="focus-ring rounded-full p-2 text-primary-900 hover:bg-background"
        >
          <RefreshCw className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ""}`}
          className="focus-ring relative rounded-full p-2 text-primary-900 hover:bg-background"
        >
          <Bell className="size-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger-500" />
          )}
        </button>
        <span className="ml-1 flex size-8 items-center justify-center rounded-full bg-primary-900 text-xs font-semibold text-white">
          {getInitials(user.name)}
        </span>
      </div>
    </header>
  );
}
