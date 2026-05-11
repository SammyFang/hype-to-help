"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Accessibility, BarChart3, CheckCircle2, Home, Play, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/fan-quest", label: "Quest", icon: Sparkles },
  { href: "/hypecheck", label: "Check", icon: CheckCircle2 },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/dashboard", label: "Impact", icon: BarChart3 },
  { href: "/accessibility", label: "Access", icon: Accessibility }
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-blue-400/20 bg-slate-950/82 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber-300 focus:px-4 focus:py-2 focus:text-slate-950"
      >
        Skip to main content
      </a>
      <nav className="mx-auto flex max-w-[96rem] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8" aria-label="Main">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-blue-300/40 bg-white/10 text-blue-100 shadow-rally-glow">
            <Image src="/fan-impact-badge.png" alt="" width={44} height={44} className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black uppercase tracking-normal text-white">
              Hype
            </span>
            <span className="block truncate text-xs font-semibold text-red-200">
              Team USA
            </span>
          </span>
        </Link>
        <div className="hidden min-w-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex min-w-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                  active
                    ? "arena-command text-white"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
        <Link
          href="/fan-quest"
          aria-label="Start Fan Quest"
          className="arena-command inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-black text-white transition focus:outline focus:outline-2 sm:px-4"
        >
          <Play aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Play</span>
        </Link>
      </nav>
      <div className="grid grid-cols-6 gap-2 border-t border-white/10 px-3 py-2 lg:hidden">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className={cn(
                "grid min-w-0 place-items-center rounded-md border px-2 py-2 text-sm font-semibold",
                active
                  ? "border-blue-300/40 bg-blue-500 text-white"
                  : "border-white/10 bg-white/10 text-slate-100"
              )}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
