import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Portus RDO — Diário Digital de Obras e Serviços",
  description:
    "Plataforma institucional para registro, fiscalização, aprovação, assinatura e auditoria de Relatórios Diários de Obra do Complexo Industrial Portuário de Suape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
