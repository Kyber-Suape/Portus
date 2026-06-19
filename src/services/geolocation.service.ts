import type { RdoEvidenceGeoStatus, RdoEvidenceLocation } from "@/types/rdo";

export interface GeoCaptureResult {
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  altitudeMeters?: number;
  location: RdoEvidenceLocation;
  geoStatus: RdoEvidenceGeoStatus;
}

/** Localizações coerentes com a região das obras demo (Suape/PE) — sem reverse geocoding real (front-only). */
const MOCK_LOCATIONS: RdoEvidenceLocation[] = [
  { country: "Brasil", state: "Pernambuco", city: "Cabo de Santo Agostinho", neighborhood: "Suape" },
  { country: "Brasil", state: "Pernambuco", city: "Ipojuca", neighborhood: "Suape" },
  { country: "Brasil", state: "Pernambuco", city: "Recife", neighborhood: "Boa Viagem" },
];

export function getMockLocationFallback(): RdoEvidenceLocation {
  return MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
}

/**
 * Captura a posição atual via Geolocation API do navegador. Nunca rejeita — se o navegador
 * não suportar ou o usuário negar a permissão, devolve um fallback mockado com o `geoStatus`
 * correspondente, para o fluxo de evidências nunca travar por causa da localização.
 */
export function getCurrentLocation(): Promise<GeoCaptureResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve({ location: getMockLocationFallback(), geoStatus: "UNAVAILABLE" });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          altitudeMeters: position.coords.altitude ?? undefined,
          location: getMockLocationFallback(),
          geoStatus: "VALIDATED",
        });
      },
      () => resolve({ location: getMockLocationFallback(), geoStatus: "PENDING" }),
      { timeout: 5000, enableHighAccuracy: true },
    );
  });
}

export const geolocationService = { getCurrentLocation, getMockLocationFallback };
