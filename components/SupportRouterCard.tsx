import { ExternalLink, ShieldCheck } from "lucide-react";
import type { HypeScanResult } from "@/types";
import { Badge } from "@/components/Badge";

type SupportRouterCardProps = {
  result?: HypeScanResult;
};

const routes = [
  "Official streams",
  "Team USA channels",
  "Athlete-led posts",
  "Verified support",
  "Captioned shares"
];

export function SupportRouterCard({ result }: SupportRouterCardProps) {
  const actions = result?.recommendedFanActions?.length ? result.recommendedFanActions : routes;

  return (
    <article className="rally-surface rounded-lg p-5 shadow-rally-card" aria-labelledby="support-router-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-600 text-white">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 id="support-router-title" className="text-xl font-black text-slate-950 dark:text-white">
              Support Router
            </h2>
            <p className="text-sm rally-muted">Verified first</p>
          </div>
        </div>
        <Badge tone="green" icon={<ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />}>
          verified
        </Badge>
      </div>
      <ul className="mt-5 grid gap-3">
        {actions.map((action) => (
          <li key={action} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium rally-muted dark:border-white/10 dark:bg-white/5 clamp-2">
            {action}
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-50 clamp-2">
        Official paths only.
      </p>
    </article>
  );
}
