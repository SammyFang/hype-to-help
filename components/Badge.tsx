import type { ReactNode } from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "blue" | "red" | "gold" | "green" | "neutral";
  icon?: ReactNode;
  className?: string;
};

const tones = {
  blue: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-100",
  red: "border-red-200 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-100",
  gold: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-100",
  green:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-100",
  neutral:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-500/40 dark:bg-white/10 dark:text-slate-100"
};

export function Badge({ children, tone = "neutral", icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold leading-none",
        tones[tone],
        className
      )}
    >
      {icon ?? <Award aria-hidden="true" className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
