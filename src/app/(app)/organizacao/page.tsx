import type { Metadata } from "next";
import { OrganizacaoPageContent } from "@/components/organizacao/organizacao-page-content";

export const metadata: Metadata = {
  title: "Organização — Portus RDO",
};

export default function OrganizacaoPage() {
  return <OrganizacaoPageContent />;
}
