"use client";

import { ImageUp, Play, Upload, WandSparkles } from "lucide-react";
import { demoScenarios } from "@/lib/demoData";

type ContentInputCardProps = {
  value: string;
  onValueChange: (value: string) => void;
  onAnalyze: () => void;
  onImageChange?: (dataUrl: string | undefined, name?: string) => void;
  loading?: boolean;
  imageName?: string;
};

export function ContentInputCard({
  value,
  onValueChange,
  onAnalyze,
  onImageChange,
  loading,
  imageName
}: ContentInputCardProps) {
  async function handleFile(file?: File) {
    if (!file || !onImageChange) {
      onImageChange?.(undefined);
      return;
    }

    if (!file.type.startsWith("image/")) {
      onImageChange(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onImageChange(String(reader.result), file.name);
    reader.readAsDataURL(file);
  }

  return (
    <section className="arena-panel rounded-lg p-4 sm:p-5" aria-labelledby="quest-input-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="relative z-10">
          <p className="hud-label">Input</p>
          <h2 id="quest-input-title" className="mt-1 text-2xl font-black text-white">
            Quest Feed
          </h2>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onValueChange(scenario.text)}
              className="arena-chip truncate"
            >
              {scenario.title}
            </button>
          ))}
        </div>
      </div>
      <label htmlFor="fan-content" className="sr-only">
        Olympic or Paralympic fan content
      </label>
      <textarea
        id="fan-content"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        rows={6}
        className="relative z-10 mt-4 min-h-40 w-full resize-y rounded-lg border border-blue-300/25 bg-slate-950/74 p-4 text-base font-semibold leading-7 text-white shadow-inner focus:border-rally-blue focus:outline focus:outline-2"
        placeholder="Example: Team USA swimming looked strong tonight. I want to cheer them on and learn more before LA28."
      />
      <div className="relative z-10 mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="rounded-md border border-blue-300/20 bg-black/20 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="hud-label">Signal</span>
            <span className="text-xs font-black text-blue-100">{Math.min(100, Math.max(8, Math.round(value.length / 8)))}%</span>
          </div>
          <div className="hud-meter h-2 rounded-md">
            <span style={{ width: `${Math.min(100, Math.max(8, Math.round(value.length / 8)))}%` }} />
          </div>
        </div>
        <label className="inline-flex min-w-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-300/25 bg-white/10 px-4 py-3 text-sm font-bold text-slate-100 transition hover:bg-blue-400/20">
          {imageName ? <ImageUp aria-hidden="true" className="h-4 w-4" /> : <Upload aria-hidden="true" className="h-4 w-4" />}
          <span className="max-w-44 truncate">{imageName ? imageName : "Image"}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </label>
      </div>
      <div className="relative z-10 mt-4">
        <button
          type="button"
          aria-label="Analyze with Gemini"
          onClick={onAnalyze}
          disabled={loading}
          className="arena-command inline-flex w-full items-center justify-between gap-3 rounded-md px-5 py-4 text-lg font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-3">
            <WandSparkles aria-hidden="true" className="h-5 w-5" />
            {loading ? "Scanning..." : "Scan"}
          </span>
          <Play aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
