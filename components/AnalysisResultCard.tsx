import { FileSearch, Lightbulb, ShieldAlert } from "lucide-react";
import type { HypeScanResult } from "@/types";
import { Badge } from "@/components/Badge";

type AnalysisResultCardProps = {
  result: HypeScanResult;
  source?: string;
};

export function AnalysisResultCard({ result, source }: AnalysisResultCardProps) {
  return (
    <article className="rally-surface rounded-lg p-5 shadow-rally-card" aria-labelledby="topic-card-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-rally-navy text-white">
            <FileSearch aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 id="topic-card-title" className="text-xl font-black text-slate-950 dark:text-white">
              Topic Card
            </h2>
            <p className="text-sm rally-muted">Signal map</p>
          </div>
        </div>
        {source ? <Badge tone={source === "gemini" ? "green" : "gold"}>{source.replace("_", " ")}</Badge> : null}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-black uppercase text-rally-blue">Topic</p>
          <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{result.topic}</p>
          <p className="mt-1 text-sm rally-muted clamp-2">{result.teamUSARelevance}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-black uppercase text-rally-red">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="blue">Sport: {result.sport}</Badge>
            <Badge tone="neutral">Type: {result.contentType}</Badge>
            <Badge tone={result.sentiment === "positive" ? "green" : result.sentiment === "negative" ? "red" : "gold"}>
              {result.sentiment}
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-400/30 dark:bg-blue-500/10">
        <div className="flex items-start gap-3">
          <Lightbulb aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rally-blue" />
          <p className="text-sm font-medium text-slate-800 dark:text-blue-50 clamp-3">{result.safeSummary}</p>
        </div>
      </div>
      {result.missingContext.length ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/30 dark:bg-amber-400/10">
          <div className="flex items-start gap-3">
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-200" />
            <div>
              <p className="text-sm font-black text-amber-950 dark:text-amber-100">Check</p>
              <ul className="mt-2 space-y-1 text-sm text-amber-950 dark:text-amber-50">
                {result.missingContext.map((item) => (
                  <li key={item} className="clamp-2">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
