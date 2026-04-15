"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-destructive">Chyba</p>
        <h1 className="mt-4 text-2xl font-bold">Něco se pokazilo</h1>
        <p className="mt-2 text-muted-foreground">
          Omlouváme se za potíže. Zkuste to prosím znovu.
        </p>
        <Button onClick={reset} className="mt-6">
          Zkusit znovu
        </Button>
      </div>
    </div>
  );
}
