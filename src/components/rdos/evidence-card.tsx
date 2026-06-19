"use client";

import { useState } from "react";
import { CheckCircle2, FileText, MapPin, Trash2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RDO_EVIDENCE_GEO_STATUS_CONFIG, RDO_EVIDENCE_VALIDATION_CONFIG } from "@/constants/rdo";
import { formatEvidenceTimestamp, formatFileSize } from "@/lib/format";
import type { RdoEvidence } from "@/types/rdo";

export interface EvidenceCardProps {
  evidence: RdoEvidence;
  /** Quando informado, exibe botões de validar/rejeitar a evidência (gated por `evidences:validate_geo` no chamador). */
  onValidate?: (validationStatus: "VALIDATED" | "REJECTED") => void;
  isValidating?: boolean;
  onCaptionChange?: (caption: string) => void;
  onRemove?: () => void;
}

export function EvidenceCard({ evidence, onValidate, isValidating, onCaptionChange, onRemove }: EvidenceCardProps) {
  const validation = RDO_EVIDENCE_VALIDATION_CONFIG[evidence.validationStatus];
  const geo = RDO_EVIDENCE_GEO_STATUS_CONFIG[evidence.geoStatus];
  const [caption, setCaption] = useState(evidence.caption ?? "");

  const locationLine = [evidence.location?.city, evidence.location?.state].filter(Boolean).join(" — ");
  const hasCoordinates = evidence.latitude != null && evidence.longitude != null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative flex aspect-video items-center justify-center bg-background">
        {evidence.type === "PHOTO" ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL local (data:/blob:), não suportada por next/image
          <img src={evidence.url} alt={evidence.caption ?? evidence.fileName} className="size-full object-cover" />
        ) : evidence.type === "VIDEO" ? (
          <video src={evidence.url} controls className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
            <FileText className="size-8" aria-hidden="true" />
            <span className="text-xs font-medium uppercase">{evidence.fileName.split(".").pop() ?? "Arquivo"}</span>
          </div>
        )}

        <span className="absolute right-2 top-2">
          <Badge tone={validation.tone}>{validation.label}</Badge>
        </span>

        {hasCoordinates && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
            <MapPin className="size-3" aria-hidden="true" />
            {evidence.latitude!.toFixed(4)}, {evidence.longitude!.toFixed(4)}
          </span>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remover evidência"
            className="focus-ring absolute right-2 bottom-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-danger-600"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">{evidence.fileName}</p>
          {evidence.sizeBytes != null && (
            <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(evidence.sizeBytes)}</span>
          )}
        </div>

        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={() => onCaptionChange?.(caption)}
          placeholder="Adicionar legenda técnica..."
          disabled={!onCaptionChange}
          className="focus-ring h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground disabled:cursor-default disabled:opacity-70"
        />

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{evidence.capturedAt ? formatEvidenceTimestamp(evidence.capturedAt) : "—"}</span>
          {locationLine && <span className="truncate">{locationLine}</span>}
        </div>

        <Badge tone={geo.tone} className="self-start">
          {geo.label}
        </Badge>

        {onValidate && (
          <div className="mt-1 flex gap-1.5">
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
