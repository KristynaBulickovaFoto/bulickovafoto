"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  ExternalLink,
  HelpCircle,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth";

type Props = {
  profile: { full_name: string; email: string; avatar_url: string | null };
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ClientHeader({ profile }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/klient" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Kristýna Bulíčková Fotografka"
            width={140}
            height={70}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-3 pr-1 transition-colors hover:bg-muted"
              >
                <span className="hidden text-sm font-medium text-foreground sm:inline">
                  {profile.full_name}
                </span>
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-[11px] font-bold text-pink-700">
                    {getInitials(profile.full_name)}
                  </span>
                )}
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-700">
                      {getInitials(profile.full_name)}
                    </span>
                  )}
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">
                      {profile.full_name}
                    </span>
                    <span className="truncate text-[11px] font-normal text-muted-foreground">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/klient" />}>
              <UserIcon className="h-3.5 w-3.5" />
              Moje galerie
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/kontakt" />}>
              <HelpCircle className="h-3.5 w-3.5" />
              Potřebuji pomoct
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/" />}>
              <ExternalLink className="h-3.5 w-3.5" />
              Zobrazit web
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Odhlásit se
                  </button>
                </form>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
