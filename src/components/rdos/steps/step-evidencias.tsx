"use client";

import { useRef, useState } from "react";
import { Camera, Cloud, FileUp, ImageIcon, MapPin, ShieldCheck, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { useRdoEvidences } from "@/hooks/use-rdo-evidences";
import { geolocationService, type GeoCaptureResult } from "@/services/geolocation.service";
import { ApiError } from "@/lib/api/client";
import type { RdoEvidenceType } from "@/types/rdo";
import { EvidenceCard } from "../evidence-card";

interface StepEvidenciasProps {
  rdoId: string;
}

interface PendingUpload {
  id: string;
  fileName: string;
  type: RdoEvidenceType;
  previewUrl: string;
  progress: number;
}

export function StepEvidencias({ rdoId }: StepEvidenciasProps) {
  const { evidences, isLoading, error, upload, update, remove } = useRdoEvidences(rdoId);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [lastLocation, setLastLocation] = useState<GeoCaptureResult | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(type: RdoEvidenceType, fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploadError(null);

    const id = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);
    setPending((prev) => [...prev, { id, fileName: file.name, type, previewUrl, progress: 0 }]);

    const progressTimer = setInterval(() => {
      setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: Math.min(92, p.progress + 8) } : p)));
    }, 150);

    try {
      const geo = await geolocationService.getCurrentLocation();
      setLastLocation(geo);
      await upload(file, {
        type,
        latitude: geo.latitude,
        longitude: geo.longitude,
        accuracyMeters: geo.accuracyMeters,
        altitudeMeters: geo.altitudeMeters,
        location: geo.location,
        geoStatus: geo.geoStatus,
        capturedAt: new Date().toISOString(),
      });
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Não foi possível enviar a evidência.");
    } finally {
      clearInterval(progressTimer);
      setPending((prev) => prev.filter((p) => p.id !== id));
      URL.revokeObjectURL(previewUrl);
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center">
            <Upload className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-2 text-sm font-medium text-foreground">Adicionar Evidência</p>
            <p className="mt-1 text-sm text-muted-foreground">Capture fotos/vídeos ou envie arquivos do dispositivo.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button type="button" size="sm" onClick={() => photoInputRef.current?.click()}>
                <Camera className="size-4" aria-hidden="true" />
                Tirar Foto
              </Button>
              <Button type="button" size="sm" onClick={() => videoInputRef.current?.click()}>
                <Video className="size-4" aria-hidden="true" />
                Gravar Vídeo
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
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
            <span className="text-xs text-muted-foreground">{evidences.length + pending.length} itens capturados</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : error ? (
            <Alert tone="danger">{error}</Alert>
          ) : evidences.length === 0 && pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma evidência enviada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pending.map((item) => (
                <PendingEvidenceCard key={item.id} item={item} />
              ))}
              {evidences.map((evidence) => (
                <EvidenceCard
                  key={evidence.id}
                  evidence={evidence}
                  onCaptionChange={(caption) => void update(evidence.id, { caption })}
                  onRemove={() => void remove(evidence.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-4 lg:self-start">
          <LocationPanel location={lastLocation} />
          <SyncPanel pendingCount={pending.length} totalCount={evidences.length + pending.length} />
        </div>
      </div>
    </div>
  );
}

function PendingEvidenceCard({ item }: { item: PendingUpload }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative flex aspect-video items-center justify-center bg-background">
        {item.type === "PHOTO" ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: URL local, não suportado por next/image
          <img src={item.previewUrl} alt={item.fileName} className="size-full object-cover" />
        ) : item.type === "VIDEO" ? (
          <video src={item.previewUrl} className="size-full object-cover" muted />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="truncate text-sm font-medium text-foreground">{item.fileName}</p>
        <ProgressBar value={item.progress} />
        <p className="text-xs text-muted-foreground">Enviando... {item.progress}%</p>
      </div>
    </div>
  );
}

function LocationPanel({ location }: { location: GeoCaptureResult | null }) {
  const isValidated = location?.geoStatus === "VALIDATED";

  return (
    <div className="rounded-xl border border-success-200 bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-50">
          <ShieldCheck className="size-4 text-success-600" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-foreground">Localização Segura</p>
          <p className="text-xs font-medium uppercase tracking-wide text-success-600">
            {location ? (isValidated ? "Georreferenciamento ativo" : "Aguardando sinal de GPS") : "Pronto para capturar"}
          </p>
        </div>
      </div>

      <div className="relative mb-3 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary-100 to-primary-300">
        <span className="absolute right-2 top-2">
          <Badge tone={isValidated ? "success" : "warning"}>{isValidated ? "Validado" : "Pendente"}</Badge>
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border-2 border-white/80">
          <MapPin className="size-5 text-primary-900" aria-hidden="true" />
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Latitude</dt>
        <dd className="text-right font-medium text-foreground">{location?.latitude?.toFixed(6) ?? "—"}</dd>
        <dt className="text-muted-foreground">Longitude</dt>
        <dd className="text-right font-medium text-foreground">{location?.longitude?.toFixed(6) ?? "—"}</dd>
        <dt className="text-muted-foreground">Precisão</dt>
        <dd className="text-right font-medium text-foreground">
          {location?.accuracyMeters != null ? `+/- ${location.accuracyMeters.toFixed(1)}m` : "—"}
        </dd>
        <dt className="text-muted-foreground">Altitude</dt>
        <dd className="text-right font-medium text-foreground">
          {location?.altitudeMeters != null ? `${location.altitudeMeters.toFixed(0)}m` : "—"}
        </dd>
      </dl>

      <p className="mt-3 text-xs italic text-muted-foreground">
        A localização é capturada pelo GPS do dispositivo a cada evidência. Quando indisponível, uma localização aproximada é
        usada como referência.
      </p>
    </div>
  );
}

function SyncPanel({ pendingCount, totalCount }: { pendingCount: number; totalCount: number }) {
  const progress = totalCount === 0 ? 100 : Math.round(((totalCount - pendingCount) / totalCount) * 100);

  return (
    <div className="rounded-xl bg-primary-900 p-4 text-white">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Cloud className="size-4" aria-hidden="true" />
          Sincronização
        </span>
        <span className="text-xs text-primary-200">
          {totalCount - pendingCount}/{totalCount}
        </span>
      </div>
      <ProgressBar value={progress} trackClassName="bg-primary-700" barClassName="bg-accent-400" />
      <p className="mt-2 text-xs text-primary-200">
        {pendingCount > 0 ? "Enviando evidências capturadas neste turno..." : "Todas as evidências estão sincronizadas."}
      </p>
    </div>
  );
}
