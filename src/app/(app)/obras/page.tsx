import type { Metadata } from "next";
import { ObrasPageContent } from "@/components/obras/obras-page-content";

export const metadata: Metadata = {
  title: "Obras — Portus RDO",
};

export default function ObrasPage() {
  return <ObrasPageContent />;
}
