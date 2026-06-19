import {
  LayoutDashboard,
  Building2,
  UserCog,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  FilePlus2,
  ListChecks,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/user";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  implemented: boolean;
  roles?: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    implemented: true,
  },
  {
    label: "Obras",
    href: ROUTES.obras,
    icon: Building2,
    implemented: true,
  },
  {
    label: "Gestão de Usuários",
    href: ROUTES.usuarios,
    icon: UserCog,
    implemented: true,
    roles: ["SYSTEM_ADMIN"],
  },
  {
    label: "RDOs",
    href: ROUTES.rdos,
    icon: ClipboardList,
    implemented: true,
  },
  {
    label: "Relatórios",
    href: ROUTES.relatorios,
    icon: BarChart3,
    implemented: false,
  },
  {
    label: "Auditorias",
    href: ROUTES.auditoria,
    icon: ShieldCheck,
    implemented: false,
  },
];

/** Itens do chrome mobile (bottom nav): subconjunto reduzido para navegação por toque. */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Início", href: ROUTES.dashboard, icon: LayoutDashboard, implemented: true },
  { label: "Obras", href: ROUTES.obras, icon: Building2, implemented: true },
  { label: "Novo RDO", href: ROUTES.rdoNovo, icon: FilePlus2, implemented: true },
  { label: "Pendências", href: `${ROUTES.dashboard}#pendencias`, icon: ListChecks, implemented: true },
  { label: "Perfil", href: "#", icon: User, implemented: false },
];
