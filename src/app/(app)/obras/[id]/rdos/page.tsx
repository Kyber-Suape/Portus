"use client";

import { useParams } from "next/navigation";
import { ObraRdosPageContent } from "@/components/obras/obra-rdos-page-content";

export default function ObraRdosPage() {
  const params = useParams<{ id: string }>();
  return <ObraRdosPageContent workId={params.id} />;
}
