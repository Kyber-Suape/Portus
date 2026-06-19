import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function NewRdoButton() {
  return (
    <Link
      href={ROUTES.rdoNovo}
      className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-900 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:bg-primary-800 active:scale-[0.98]"
    >
      <FilePlus2 className="size-4" aria-hidden="true" />
      Novo RDO
    </Link>
  );
}
