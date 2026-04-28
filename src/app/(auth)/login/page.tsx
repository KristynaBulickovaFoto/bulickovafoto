"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    authError === "auth" ? "Přihlášení se nezdařilo. Zkuste to znovu." : null,
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
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold">Odkaz odeslán!</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Na <strong className="text-foreground">{email}</strong> jsme poslali
            přihlašovací odkaz. Klikněte na něj pro přihlášení.
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-muted/30 p-3 text-left text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Tipy:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            <li>Odkaz platí 1 hodinu</li>
            <li>Otevřete odkaz na stejném zařízení</li>
            <li>Nevidíte e-mail? Mrkněte do spamu</li>
          </ul>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-primary underline-offset-2 transition-colors hover:underline"
          onClick={() => {
            setSent(false);
            setError(null);
            setEmail("");
          }}
        >
          Použít jiný e-mail
        </button>
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

      <Button type="submit" className="h-11 w-full rounded-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Poslat přihlašovací odkaz
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
        Bez hesla, bez registrace — jednorázový odkaz na e-mail.
      </p>
    </form>
  );
}

const FEATURES = [
  {
    icon: Shield,
    title: "Bezpečné",
    text: "Bez hesla — pouze jednorázový odkaz",
  },
  {
    icon: Clock,
    title: "Rychlé",
    text: "Odkaz dorazí během pár sekund",
  },
  {
    icon: Sparkles,
    title: "Pohodlné",
    text: "Stačí kliknout a jste přihlášení",
  },
];

export default function LoginPage() {
  return (
    <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
      {/* Brand panel */}
      <div className="hidden flex-col gap-6 rounded-xl bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 p-10 shadow-sm ring-1 ring-primary/10 lg:flex">
        <div className="self-start">
          <Image
            src="/logo.png"
            alt="Kristýna Bulíčková"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <div className="flex-1" />
        <div>
          <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight">
            Vaše fotky.
            <br />
            <span className="text-primary">Vaše vzpomínky.</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Klientský portál — všechny vaše galerie přehledně na jednom místě.
          </p>
        </div>
        <ul className="mt-6 space-y-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Form panel */}
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src="/logo.png"
              alt="Kristýna Foto"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <span className="mb-3 inline-block h-1 w-12 rounded-full bg-primary" />
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-foreground">Klientský</span>{" "}
            <span className="text-primary">portál</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Zadejte e-mail a pošleme vám přihlašovací odkaz
          </p>
        </div>

        <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm sm:p-8">
          <Suspense fallback={<div className="h-32" />}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Hlavní stránka
          </Link>
          <span className="h-1 w-1 rounded-full bg-foreground/20" />
          <Link
            href="/kontakt"
            className="font-medium transition-colors hover:text-primary"
          >
            Potřebuji pomoct
          </Link>
        </div>
      </div>
    </div>
  );
}
