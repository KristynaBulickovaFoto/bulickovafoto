"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink } from "@/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(
    authError === "auth" ? "Přihlášení se nezdařilo. Zkuste to znovu." : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Zadejte platný e-mail.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await sendMagicLink(email, redirectTo);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSent(true);
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold">Odkaz odeslán!</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Na <strong className="text-foreground">{email}</strong> jsme poslali
            přihlašovací odkaz. Klikněte na něj pro přihlášení.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Nevidíte e-mail? Zkontrolujte spam, nebo{" "}
          <button
            type="button"
            className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
            onClick={() => {
              setSent(false);
              setError(null);
            }}
          >
            zkuste to znovu
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="vas@email.cz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
          autoFocus
        />
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="h-11 w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Poslat přihlašovací odkaz
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight">
          <span className="text-foreground">Klientský</span>{" "}
          <span className="text-primary">portál</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Zadejte e-mail a pošleme vám přihlašovací odkaz
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-muted/20 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <Suspense fallback={<div className="h-32" />}>
          <LoginForm />
        </Suspense>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  );
}
