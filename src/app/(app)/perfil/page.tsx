import type { Metadata } from "next";
import { PerfilPageContent } from "@/components/perfil/perfil-page-content";

export const metadata: Metadata = {
  title: "Meu Perfil — Portus RDO",
};

export default function PerfilPage() {
  return <PerfilPageContent />;
}
