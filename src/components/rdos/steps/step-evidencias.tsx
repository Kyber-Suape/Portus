"use client";

import { useRef, useState } from "react";
import { Camera, FileUp, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { useRdoEvidences } from "@/hooks/use-rdo-evidences";
import { ApiError } from "@/lib/api/client";
import type { RdoEvidenceType } from "@/types/rdo";
import { EvidenceCard } from "../evidence-card";

interface StepEvidenciasProps {
  rdoId: string;
}

function readCurrentPosition(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      { timeout: 5000 },
    );
  });
}

export function StepEvidencias({ rdoId }: StepEvidenciasProps) {
  const { evidences, isLoading, error, isUploading, upload } = useRdoEvidences(rdoId);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(type: RdoEvidenceType, fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploadError(null);

    const position = await readCurrentPosition();

    try {
      await upload(file, {
        type,
        latitude: position?.coords.latitude,
        longitude: position?.coords.longitude,
        accuracyMeters: position?.coords.accuracy,
        altitudeMeters: position?.coords.altitude ?? undefined,
        capturedAt: new Date().toISOString(),
      });
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Não foi possível enviar a evidência.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-bold text-primary-900">5. Evidências Técnicas</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Anexe fotos, vídeos ou arquivos — a localização é capturada automaticamente quando disponível.
        </p>
      </div>

      {uploadError && <Alert tone="danger">{uploadError}</Alert>}

      <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center">
        <Upload className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-foreground">Adicionar Evidência</p>
        <p className="mt-1 text-sm text-muted-foreground">Capture fotos/vídeos ou envie arquivos do dispositivo.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button type="button" size="sm" loading={isUploading} onClick={() => photoInputRef.current?.click()}>
            <Camera className="size-4" aria-hidden="true" />
            Tirar Foto
          </Button>
          <Button type="button" size="sm" loading={isUploading} onClick={() => videoInputRef.current?.click()}>
            <Video className="size-4" aria-hidden="true" />
            Gravar Vídeo
          </Button>
          <Button type="button" variant="outline" size="sm" loading={isUploading} onClick={() => fileInputRef.current?.click()}>
            <FileUp className="size-4" aria-hidden="true" />
            Enviar Arquivo
          </Button>
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => void handleFileSelected("PHOTO", e.target.files)}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={(e) => void handleFileSelected("VIDEO", e.target.files)}
        />
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => void handleFileSelected("FILE", e.target.files)} />
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Galeria de Campo</h4>
        <span className="text-xs text-muted-foreground">{evidences.length} itens capturados</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      ) : error ? (
        <Alert tone="danger">{error}</Alert>
      ) : evidences.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma evidência enviada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {evidences.map((evidence) => (
            <EvidenceCard key={evidence.id} evidence={evidence} />
          ))}
        </div>
      )}
    </div>
  );
}
