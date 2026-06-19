"use client";

import { CheckCircle2, ImageIcon, MapPin, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useAuthenticatedFileUrl } from "@/hooks/use-authenticated-file";
import { RDO_EVIDENCE_VALIDATION_CONFIG } from "@/constants/rdo";
import type { RdoEvidence } from "@/types/rdo";

export interface EvidenceCardProps {
  evidence: RdoEvidence;
  /** Quando informado, exibe botões de validar/rejeitar a evidência (gated por `evidences:validate_geo` no chamador). */
  onValidate?: (validationStatus: "VALIDATED" | "REJECTED") => void;
  isValidating?: boolean;
}

export function EvidenceCard({ evidence, onValidate, isValidating }: EvidenceCardProps) {
  const { url, isLoading } = useAuthenticatedFileUrl(evidence.url);
  const validation = RDO_EVIDENCE_VALIDATION_CONFIG[evidence.validationStatus];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex aspect-video items-center justify-center bg-background">
        {isLoading ? (
          <Spinner className="size-5" />
        ) : url && evidence.type === "PHOTO" ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: URL local, não suportado por next/image
          <img src={url} alt={evidence.caption ?? evidence.fileName} className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{evidence.caption ?? evidence.fileName}</p>
          <Badge tone={validation.tone}>{validation.label}</Badge>
        </div>
        {evidence.latitude != null && evidence.longitude != null && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden="true" />
            {evidence.latitude.toFixed(4)}, {evidence.longitude.toFixed(4)}
          </p>
        )}

        {onValidate && (
          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              disabled={isValidating}
              onClick={() => onValidate("VALIDATED")}
              aria-label="Validar evidência"
              className="focus-ring flex-1 rounded-lg border border-success-200 p-1.5 text-success-600 hover:bg-success-50 disabled:opacity-50"
            >
              <CheckCircle2 className="mx-auto size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={isValidating}
              onClick={() => onValidate("REJECTED")}
              aria-label="Rejeitar evidência"
              className="focus-ring flex-1 rounded-lg border border-danger-200 p-1.5 text-danger-600 hover:bg-danger-50 disabled:opacity-50"
            >
              <XCircle className="mx-auto size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
