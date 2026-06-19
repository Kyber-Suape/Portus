"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { LiveStatus } from "@/components/ui/live-status";
import { ROUTES } from "@/constants/routes";
import { isValidEmail } from "@/lib/validators";
import { useLogin } from "@/hooks/use-login";

interface FormErrors {
  email?: string;
  senha?: string;
}

const FOOTER_LINKS = ["Termos de Uso", "Política de Privacidade", "Suporte TI"];

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors: FormErrors = {};
    if (!email.trim()) validationErrors.email = "Informe seu e-mail.";
    else if (!isValidEmail(email)) validationErrors.email = "Informe um e-mail válido.";
    if (!senha) validationErrors.senha = "Informe sua senha.";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await login(email, senha, lembrar);
      router.push(ROUTES.dashboard);
    } catch {
      // erro amigável já exposto via `error` do useLogin
    }
  }

  return (
    <div className="relative w-full rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="absolute right-5 top-5">
        <LiveStatus label="Online" />
      </div>

      <div className="mb-6 mt-1">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Acesso Restrito</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Insira suas credenciais para continuar.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          type="email"
          icon={BadgeCheck}
          placeholder="nome.sobrenome@suape.pe.gov.br"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <PasswordInput
          label="Senha"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          error={errors.senha}
          labelAction={
            <Link
              href="#"
              className="focus-ring text-xs font-medium text-primary-600 hover:text-primary-800"
            >
              Esqueceu a senha?
            </Link>
          }
        />

        <Checkbox
          label="Manter conectado"
          checked={lembrar}
          onChange={(e) => setLembrar(e.target.checked)}
        />

        {error && <Alert tone="danger">{error}</Alert>}

        <div className="flex flex-col gap-2.5 pt-1">
          <Button type="submit" size="lg" loading={isLoading}>
            {isLoading ? (
              "Entrando…"
            ) : (
              <>
                Entrar
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </Button>
          <Link
            href={ROUTES.cadastro}
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-border text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            Solicitar acesso
          </Link>
        </div>
      </form>

      <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-border/70 p-3">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">
          Todas as ações são registradas em trilha de auditoria vinculada ao seu usuário.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2.5 text-xs text-muted-foreground">
        {FOOTER_LINKS.map((label, index) => (
          <span key={label} className="flex items-center gap-2.5">
            <Link href="#" className="hover:text-foreground">
              {label}
            </Link>
            {index < FOOTER_LINKS.length - 1 && <span aria-hidden="true">·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
