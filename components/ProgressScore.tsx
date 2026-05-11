import { cn, percent } from "@/lib/utils";

type ProgressScoreProps = {
  label: string;
  value: number;
  max?: number;
  tone?: "blue" | "red" | "gold" | "green";
  description?: string;
};

const bars = {
  blue: "bg-blue-600",
  red: "bg-red-500",
  gold: "bg-amber-400",
  green: "bg-emerald-500"
};

export function ProgressScore({
  label,
  value,
  max = 500,
  tone = "blue",
  description
}: ProgressScoreProps) {
  const width = percent(value, max);

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">{label}</p>
          {description ? <p className="text-xs rally-muted">{description}</p> : null}
        </div>
        <p className="text-sm font-bold text-slate-950 dark:text-white">{value}</p>
      </div>
      <div
        aria-label={`${label}: ${width}%`}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        role="progressbar"
        className="h-3 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-700"
      >
        <div className={cn("h-full rounded-md transition-all duration-500", bars[tone])} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
