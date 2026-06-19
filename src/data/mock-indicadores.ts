import { Building2, FileClock, AlertTriangle, Stamp } from "lucide-react";
import type { Indicador } from "@/types/dashboard";

export const MOCK_INDICADORES: Indicador[] = [
  {
    id: "ind-obras-ativas",
    titulo: "Obras Ativas",
    valor: 12,
    icon: Building2,
    tom: "primary",
  },
  {
    id: "ind-rdos-pendentes",
    titulo: "RDOs Pendentes",
    valor: 8,
    icon: FileClock,
    tom: "warning",
    accentStripe: "warning",
  },
  {
    id: "ind-rdos-atrasados",
    titulo: "RDOs Atrasados",
    valor: 3,
    icon: AlertTriangle,
    tom: "danger",
    accentStripe: "danger",
  },
  {
    id: "ind-aguardando-aprovacao",
    titulo: "Aguardando Aprovação",
    valor: 5,
    icon: Stamp,
    tom: "primary",
    badge: "Ação",
  },
];
