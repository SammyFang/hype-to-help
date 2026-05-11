"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  HeartHandshake,
  Play,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";

const stageItems = [
  { label: "Scan", icon: Activity, done: true },
  { label: "Safe", icon: ShieldCheck, done: true },
  { label: "Twin", icon: HeartHandshake, done: true },
  { label: "Move", icon: Dumbbell, done: false }
];

const modes = [
  { label: "Cheer", value: "Support", icon: Trophy },
  { label: "Move", value: "8 min", icon: Dumbbell },
  { label: "Store", value: "Gear", icon: ShoppingBag }
];

const orbitStats = [
  { label: "Scan", value: "86", icon: Activity },
  { label: "Safe", value: "92", icon: ShieldCheck },
  { label: "Twin", value: "88", icon: HeartHandshake },
  { label: "Team", value: "12K", icon: Users }
];

export function Hero() {
  const [activeMode, setActiveMode] = useState(modes[0].label);
  const active = modes.find((mode) => mode.label === activeMode) ?? modes[0];
  const ActiveIcon = active.icon;

  return (
    <section className="arena-page relative overflow-hidden border-b border-blue-400/20">
      <div className="mx-auto grid min-h-[calc(100vh-4.75rem)] max-w-[96rem] gap-4 px-4 py-5 sm:px-6 lg:px-8 xl:grid-cols-[0.72fr_1.12fr_0.78fr]">
        <aside className="arena-panel order-2 flex min-h-[28rem] flex-col justify-between rounded-lg p-4 sm:p-5 xl:order-1">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-blue-200/40 bg-white/10">
                <Image src="/fan-impact-badge.png" alt="" width={48} height={48} className="h-full w-full object-cover" priority />
              </span>
              <div className="min-w-0">
                <p className="hud-label">Hype-to-Help</p>
                <p className="truncate text-sm font-black text-red-100">Team USA</p>
              </div>
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[0.9] text-white sm:text-6xl xl:text-7xl">
              Fan
              <br />
              Arena
            </h1>
            <p className="mt-4 max-w-sm text-lg font-black text-blue-100">
              Cheer. Move. Support.
            </p>
          </div>

          <div className="relative z-10 mt-6">
            <div className="grid grid-cols-3 gap-2">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.label}
                    type="button"
                    data-active={activeMode === mode.label}
                    onClick={() => setActiveMode(mode.label)}
                    className="arena-chip"
                    aria-pressed={activeMode === mode.label}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="hud-label">Mode</p>
                  <p className="mt-1 text-2xl font-black text-white">{active.value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-amber-200/35 bg-amber-300/15 text-amber-100">
                  <ActiveIcon aria-hidden="true" className="h-6 w-6" />
                </span>
              </div>
              <div className="hud-meter mt-4 h-2 rounded-md">
                <span style={{ width: activeMode === "Store" ? "72%" : activeMode === "Move" ? "64%" : "86%" }} />
              </div>
            </div>

            <Link
              href="/fan-quest"
              aria-label="Start Fan Quest"
              className="arena-command mt-4 inline-flex w-full items-center justify-between rounded-md px-5 py-4 text-lg font-black text-white"
            >
              <span className="inline-flex items-center gap-3">
                <Play aria-hidden="true" className="h-5 w-5" />
                Play
              </span>
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </aside>

        <div className="arena-panel relative order-1 grid min-h-[31rem] place-items-center rounded-lg p-4 sm:p-6 xl:order-2 xl:min-h-[32rem]">
          <div className="arena-scan pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3" />
          <div className="relative z-10 grid w-full place-items-center">
            <div className="arena-badge arena-float aspect-square w-[min(76vw,31rem)] p-2 sm:w-[min(58vw,34rem)] xl:w-[min(34vw,36rem)]">
              <Image
                src="/fan-impact-badge.png"
                alt="Team USA fan impact badge"
                width={900}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 mx-auto grid max-w-[36rem] grid-cols-4 gap-2 rounded-lg border border-white/10 bg-slate-950/72 p-2 backdrop-blur-xl">
              {stageItems.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.label} className="arena-icon-tile gap-1 px-2 py-3 text-center">
                    <Icon aria-hidden="true" className={stage.done ? "h-5 w-5 text-blue-100" : "h-5 w-5 text-slate-400"} />
                    <span className="text-xs font-black text-white">{stage.label}</span>
                    {stage.done ? <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-200" /> : <span className="h-4 w-4 rounded-full border border-white/20" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="order-3 grid gap-4">
          <section className="arena-panel rounded-lg p-4">
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="hud-label">Rally</p>
                <p className="text-3xl font-black text-white">12,450</p>
              </div>
              <Sparkles aria-hidden="true" className="h-8 w-8 text-amber-100" />
            </div>
            <div className="hud-meter relative z-10 mt-4 h-2 rounded-md">
              <span style={{ width: "82%" }} />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            {orbitStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="arena-panel rounded-lg p-3 text-center">
                  <div className="relative z-10 grid place-items-center gap-2">
                    <Icon aria-hidden="true" className="h-5 w-5 text-blue-100" />
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-xs font-black text-slate-300">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="arena-panel rounded-lg p-4">
            <div className="relative z-10">
              <p className="hud-label text-amber-100">Loop</p>
              <div className="mt-3 grid gap-2">
                {[
                  ["Cheer", Trophy],
                  ["Health", Dumbbell],
                  ["Shop", ShoppingBag],
                  ["Team", HeartHandshake]
                ].map(([label, Icon]) => {
                  const TileIcon = Icon as typeof Trophy;
                  return (
                    <div key={label as string} className="flex items-center justify-between rounded-md border border-white/10 bg-white/10 px-3 py-2">
                      <span className="inline-flex min-w-0 items-center gap-2 text-sm font-black text-white">
                        <TileIcon aria-hidden="true" className="h-4 w-4 text-blue-100" />
                        {label as string}
                      </span>
                      <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-200" />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
