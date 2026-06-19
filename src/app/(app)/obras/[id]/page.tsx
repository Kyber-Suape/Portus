"use client";

import { useParams } from "next/navigation";
import { ObraDetalhes } from "@/components/obras/obra-detalhes";

export default function ObraDetalhesPage() {
  const params = useParams<{ id: string }>();
  return <ObraDetalhes workId={params.id} />;
}
