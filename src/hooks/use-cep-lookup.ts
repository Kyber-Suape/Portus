"use client";

import { useEffect, useRef, useState } from "react";

export interface CepAddress {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export type CepLookupStatus = "idle" | "loading" | "success" | "error";

interface CepResult {
  digits: string;
  address: CepAddress | null;
}

/**
 * Busca o endereço de um CEP (ViaCEP) assim que o valor atinge 8 dígitos.
 * O status é derivado a partir do CEP atual e do último resultado resolvido,
 * em vez de armazenado separadamente — evita setState síncrono dentro do efeito.
 */
export function useCepLookup(cep: string, onResolved: (address: CepAddress) => void): CepLookupStatus {
  const onResolvedRef = useRef(onResolved);
  useEffect(() => {
    onResolvedRef.current = onResolved;
  }, [onResolved]);

  const [result, setResult] = useState<CepResult | null>(null);
  const digits = cep.replace(/\D/g, "");

  useEffect(() => {
    if (digits.length !== 8) return;

    let cancelled = false;

    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (data.erro) {
          setResult({ digits, address: null });
          return;
        }
        const address: CepAddress = {
          logradouro: data.logradouro ?? "",
          bairro: data.bairro ?? "",
          cidade: data.localidade ?? "",
          estado: data.uf ?? "",
        };
        setResult({ digits, address });
        onResolvedRef.current(address);
      })
      .catch(() => {
        if (!cancelled) setResult({ digits, address: null });
      });

    return () => {
      cancelled = true;
    };
  }, [digits]);

  if (digits.length !== 8) return "idle";
  if (!result || result.digits !== digits) return "loading";
  return result.address ? "success" : "error";
}
