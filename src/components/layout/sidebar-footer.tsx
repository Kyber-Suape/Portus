"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";

export function SidebarFooter() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push(ROUTES.login);
  }

  return (
    <div className="mt-auto flex flex-col gap-1 border-t border-border p-3">
      <Link
        href={ROUTES.configuracoes}
        className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-background"
      >
        <Settings className="size-4 shrink-0" aria-hidden="true" />
        Configurações
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-600 transition-colors duration-200 ease-out hover:bg-danger-50"
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        Sair
      </button>
    </div>
  );
}
