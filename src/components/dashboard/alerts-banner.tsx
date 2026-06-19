import { Alert } from "@/components/ui/alert";
import type { DashboardRdoSummary } from "@/data/mock-rdos";

export function AlertsBanner({ rdos }: { rdos: DashboardRdoSummary[] }) {
  const atrasados = rdos.filter((rdo) => rdo.status === "atrasado");
  const naoConformidades = rdos.reduce((sum, rdo) => sum + rdo.naoConformidades, 0);

  if (atrasados.length === 0 && naoConformidades === 0) return null;

  return (
    <Alert tone="warning" title="Atenção necessária">
      {atrasados.length > 0 && (
        <span>
          {atrasados.length} RDO{atrasados.length > 1 ? "s" : ""} atrasado
          {atrasados.length > 1 ? "s" : ""}
        </span>
      )}
      {atrasados.length > 0 && naoConformidades > 0 && " · "}
      {naoConformidades > 0 && (
        <span>
          {naoConformidades} não conformidade{naoConformidades > 1 ? "s" : ""}{" "}
          em aberto
        </span>
      )}
    </Alert>
  );
}
