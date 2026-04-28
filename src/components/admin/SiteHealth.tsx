import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ImageOff,
  FileWarning,
  Mail,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type HealthIssue = {
  id: string;
  severity: "high" | "medium" | "low";
  icon: "mail" | "send" | "image" | "file" | "clock";
  title: string;
  detail?: string;
  href?: string;
};

const ICONS = {
  mail: Mail,
  send: Send,
  image: ImageOff,
  file: FileWarning,
  clock: Clock,
};

export function SiteHealth({ issues }: { issues: HealthIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-700">Vše v pořádku</p>
          <p className="text-xs text-emerald-600/80">
            Žádné neodbavené úkoly ani prošlé koncepty.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold">Co řešit</h3>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          {issues.length}
        </span>
      </div>
      <ul className="divide-y divide-border/40">
        {issues.slice(0, 8).map((issue) => {
          const Icon = ICONS[issue.icon];
          const inner = (
            <div
              className={cn(
                "flex items-start gap-3 px-4 py-2.5 text-xs transition-colors",
                issue.href && "hover:bg-muted/50",
              )}
            >
                <div
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    issue.severity === "high" && "bg-pink-100 text-pink-700",
                    issue.severity === "medium" && "bg-amber-100 text-amber-700",
                    issue.severity === "low" && "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{issue.title}</p>
                  {issue.detail && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {issue.detail}
                    </p>
                  )}
                </div>
            </div>
          );
          return (
            <li key={issue.id}>
              {issue.href ? <Link href={issue.href}>{inner}</Link> : inner}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
