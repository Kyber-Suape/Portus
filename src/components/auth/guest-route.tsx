"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { Spinner } from "@/components/ui/spinner";

/** Usado em telas como login/cadastro: usuários já autenticados são redirecionados direto ao dashboard. */
export function GuestRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(ROUTES.dashboard);
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <>{children}</>;
}
