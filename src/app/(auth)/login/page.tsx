"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">Odkaz odeslán!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Na <strong>{email}</strong> jsme poslali přihlašovací odkaz.
            Klikněte na něj pro přihlášení.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Nevidíte e-mail? Zkontrolujte spam, nebo{" "}
          <button
            type="button"
            className="text-primary underline"
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="vas@email.cz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
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
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          <span className="text-foreground">Kristýna</span>
          <span className="text-primary">Foto</span>
        </CardTitle>
        <CardDescription>
          Zadejte e-mail a pošleme vám přihlašovací odkaz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="h-32" />}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
