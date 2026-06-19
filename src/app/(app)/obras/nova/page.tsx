import type { Metadata } from "next";
import { ObraForm } from "@/components/obras/obra-form";

export const metadata: Metadata = {
  title: "Nova Obra — Portus RDO",
};

export default function ObraNovaPage() {
  return <ObraForm />;
}
