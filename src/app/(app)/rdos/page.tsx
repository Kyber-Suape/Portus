import type { Metadata } from "next";
import { RdosPageContent } from "@/components/rdos/rdos-page-content";

export const metadata: Metadata = {
  title: "RDOs — Portus RDO",
};

export default function RdosPage() {
  return <RdosPageContent />;
}
