"use client";

import { useParams } from "next/navigation";
import { ObraForm } from "@/components/obras/obra-form";

export default function ObraEditarPage() {
  const params = useParams<{ id: string }>();
  return <ObraForm workId={params.id} />;
}
