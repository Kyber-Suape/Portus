import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Empacota um server Node mínimo em `.next/standalone` — usado pelo estágio
  // de produção do Dockerfile, sem precisar copiar node_modules completo.
  output: "standalone",
};

export default nextConfig;
