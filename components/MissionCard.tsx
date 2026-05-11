"use client";

import { Check, Medal, Target } from "lucide-react";
import type { MissionItem } from "@/types";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/utils";

type MissionCardProps = {
  mission: MissionItem;
  completed?: boolean;
  onComplete?: (mission: MissionItem) => void;
};

export function MissionCard({ mission, completed, onComplete }: MissionCardProps) {
  return (
    <article
      className={cn(
        "arena-panel rounded-lg p-4 transition",
        completed && "border-emerald-300/70"
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md border ${completed ? "border-emerald-300/50 bg-emerald-500/20 text-emerald-100" : "border-blue-300/35 bg-blue-500/20 text-blue-100"}`}>
            {completed ? <Check aria-hidden="true" className="h-5 w-5" /> : <Target aria-hidden="true" className="h-5 w-5" />}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{mission.type}</Badge>
              <Badge tone="gold" icon={<Medal aria-hidden="true" className="h-3.5 w-3.5" />}>
                {mission.badge}
              </Badge>
            </div>
            <h3 className="mt-3 text-lg font-black text-white clamp-2">{mission.title}</h3>
            <p className="mt-2 text-sm leading-6 rally-muted clamp-2">{mission.description}</p>
          </div>
        </div>
        <p className="shrink-0 rounded-md border border-amber-300/40 bg-amber-400/15 px-2.5 py-1 text-sm font-black text-amber-100">
          +{mission.points}
        </p>
      </div>
      <div className="relative z-10 mt-4 rounded-md border border-white/10 bg-white/10 p-3 text-sm rally-muted clamp-2">
        {mission.supportImpact}
      </div>
      <div className="relative z-10 mt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="hud-label">Done</span>
          <span className="text-xs font-black text-slate-200">{completed ? "1 / 1" : "0 / 1"}</span>
        </div>
        <div className="hud-meter h-2 rounded-md">
          <span style={{ width: completed ? "100%" : "16%" }} />
        </div>
      </div>
      <button
        type="button"
        aria-label={completed ? "Completed" : "Complete Mission"}
        onClick={() => onComplete?.(mission)}
        disabled={completed}
        className="arena-command relative z-10 mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-black text-white transition disabled:bg-emerald-600 disabled:opacity-90"
      >
        {completed ? (
          <>
            <Check aria-hidden="true" className="h-4 w-4" />
            Completed
          </>
        ) : (
          <>
            <Target aria-hidden="true" className="h-4 w-4" />
            Complete
          </>
        )}
      </button>
    </article>
  );
}
