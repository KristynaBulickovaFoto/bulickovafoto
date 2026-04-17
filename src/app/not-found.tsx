import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="font-display text-7xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-2xl font-bold">Stránka nenalezena</h1>
          <p className="mt-2 text-muted-foreground">
            Omlouváme se, ale stránka, kterou hledáte, neexistuje.
          </p>
          <Button nativeButton={false} render={<Link href="/" />} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět na úvod
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
