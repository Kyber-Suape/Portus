"use client";

import { useParams } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { RdoTopbar } from "@/components/rdos/rdo-topbar";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { useRdo } from "@/hooks/use-rdo";
import { isRdoEditable } from "@/constants/rdo";
import { RdoWizard } from "@/components/rdos/rdo-wizard";
import { RdoReviewView } from "@/components/rdos/rdo-review-view";

export default function RdoDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { can } = usePermissions();
  const { rdo, isLoading, error, setRdo } = useRdo(params.id);

  if (isLoading) {
    return (
      <>
        <RdoTopbar title="RDO" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </>
    );
  }

  if (error || !rdo) {
    return (
      <>
        <RdoTopbar title="RDO" />
        <div className="flex-1 p-6">
          <EmptyState
            icon={FileQuestion}
            title="RDO não encontrado"
            description={error ?? "Este RDO não existe ou você não tem acesso a ele."}
          />
        </div>
      </>
    );
  }

  const isAuthor = rdo.authorId === user?.id;
  const canEdit = isRdoEditable(rdo.status) && (isAuthor ? can("rdo:update") : can("rdo:manage_all"));

  return (
    <>
      <RdoTopbar
        title={`RDO #${rdo.number}`}
        rdoNumber={rdo.number}
        workLabel={rdo.workLabel}
        contractLabel={rdo.contractLabel}
        status={rdo.status}
        lastSavedAt={rdo.updatedAt}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        {canEdit ? <RdoWizard rdo={rdo} onSaved={setRdo} /> : <RdoReviewView rdo={rdo} onUpdated={setRdo} />}
      </main>
    </>
  );
}
