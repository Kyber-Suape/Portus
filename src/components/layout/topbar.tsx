"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials, formatRelativeToNow } from "@/lib/format";
import { ROLE_LABELS } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { useClickOutside } from "@/hooks/use-click-outside";
import { LiveStatus } from "@/components/ui/live-status";
import type { Notificacao } from "@/types/dashboard";

interface TopbarProps {
  notificacoes: Notificacao[];
}

export function Topbar({ notificacoes }: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationsRef, () => setNotificationsOpen(false));
  useClickOutside(userMenuRef, () => setUserMenuOpen(false));

  const unreadCount = notificacoes.filter((n) => !n.lida).length;

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push(ROUTES.login);
  }

  return (
    <header className="sticky top-0 z-30 hidden h-16 shrink-0 items-center gap-3 border-b border-border bg-surface/90 px-6 backdrop-blur-md lg:flex">
      <div className="relative max-w-xl flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="busca-global" className="sr-only">
          Buscar RDOs, obras ou documentos
        </label>
        <input
          id="busca-global"
          type="search"
          placeholder="Buscar RDOs, Obras, Documentos..."
          className="focus-ring h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <LiveStatus label="Online" />

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((v) => !v)}
              aria-expanded={notificationsOpen}
              aria-haspopup="true"
              aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ""}`}
              className="focus-ring relative rounded-full p-2 text-muted-foreground hover:bg-background"
            >
              <Bell className="size-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-border bg-surface p-2 shadow-lg">
                <p className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                  Notificações
                </p>
                <ul className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
                  {notificacoes.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-sm",
                        !n.lida && "bg-primary-50",
                      )}
                    >
                      <p className="text-foreground">{n.mensagem}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatRelativeToNow(n.criadaEm)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              className="focus-ring flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-background"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary-900 text-xs font-semibold text-white">
                {getInitials(user.name)}
              </span>
              <span className="hidden text-left xl:block">
                <span className="block text-sm font-medium leading-tight text-foreground">
                  {user.name.split(" ")[0]}
                </span>
                <span className="block text-xs leading-tight text-muted-foreground">
                  {ROLE_LABELS[user.role]}
                </span>
              </span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-border bg-surface p-1.5 shadow-lg">
                <div className="px-2.5 py-2">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Link
                  href={ROUTES.perfil}
                  onClick={() => setUserMenuOpen(false)}
                  className="focus-ring flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground hover:bg-background"
                >
                  <UserIcon className="size-4" aria-hidden="true" />
                  Meu perfil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="focus-ring flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
