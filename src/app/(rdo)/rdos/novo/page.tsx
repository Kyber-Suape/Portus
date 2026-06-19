"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { RdoTopbar } from "@/components/rdos/rdo-topbar";
import { useAuth } from "@/hooks/use-auth";
import { useRdo } from "@/hooks/use-rdo";
import { ROUTES } from "@/constants/routes";

/**
 * Cria um RDO em rascunho (mock) vinculado à obra escolhida via `?workId=` (definida pelo
 * `SelectObraModal` em `/rdos`) e redireciona para `/rdos/[id]`, onde o wizard assume.
 */
export default function NovoRdoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workId = searchParams.get("workId");
  const { user } = useAuth();
  const { create } = useRdo(null);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || !user) return;
    if (!workId) {
      router.replace(ROUTES.rdos);
      return;
    }
    startedRef.current = true;

    // Adiado para um microtask para não disparar setState síncrono dentro do efeito.
    queueMicrotask(() => {
      void create({
        workId,
        date: new Date().toISOString().slice(0, 10),
        shift: "MORNING",
        siteEngineerName: user.name,
      })
        .then((rdo) => router.replace(`${ROUTES.rdos}/${rdo.id}`))
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "Não foi possível criar o RDO.");
        });
    });
  }, [user, workId, create, router]);

  return (
    <>
      <RdoTopbar title="Novo RDO" />
      {error ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <Alert tone="danger">{error}</Alert>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      )}
    </>
  );
}
