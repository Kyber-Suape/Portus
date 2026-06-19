import type { Metadata } from "next";
import { UsersPageContent } from "@/components/usuarios/users-page-content";

export const metadata: Metadata = {
  title: "Gestão de Usuários — Portus RDO",
};

export default function UsuariosPage() {
  return <UsersPageContent />;
}
