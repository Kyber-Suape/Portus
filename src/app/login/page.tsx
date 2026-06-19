import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { GuestRoute } from "@/components/auth/guest-route";

export const metadata: Metadata = {
  title: "Portus — Portus RDO",
};

export default function LoginPage() {
  return (
    <GuestRoute>
      <AuthShell>
        <LoginForm />
      </AuthShell>
    </GuestRoute>
  );
}
