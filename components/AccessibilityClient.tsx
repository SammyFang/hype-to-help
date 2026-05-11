"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { createDemoAccessibility } from "@/lib/demoData";
import type { AccessibilityResult } from "@/types";

export function AccessibilityClient() {
  const [text, setText] = useState(
    "Team USA had an amazing night. I want to share a highlight and include the Paralympic connection clearly."
  );
  const [imageDescription, setImageDescription] = useState("");
  const [result, setResult] = useState<AccessibilityResult>();
  const [loading, setLoading] = useState(false);

  async function runAssistant() {
    setLoading(true);
    try {
      const response = await fetch("/api/accessibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, imageDescription })
      });
      if (!response.ok) throw new Error("Accessibility API unavailable.");
      const data = (await response.json()) as { result: AccessibilityResult };
      setResult(data.result);
    } catch {
      setResult(createDemoAccessibility([text, imageDescription].filter(Boolean).join("\n")));
    }
    setLoading(false);
  }

  return (
    <div className="arena-page mx-auto grid max-w-[96rem] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="space-y-5">
        <AccessibilityControls />
        <section className="arena-panel rounded-lg p-5" aria-labelledby="accessibility-assistant-title">
          <div className="relative z-10">
          <p className="hud-label">Assist</p>
          <h1 id="accessibility-assistant-title" className="text-3xl font-black text-white">
            Access Lab
          </h1>
          <label htmlFor="accessibility-text" className="mt-5 block text-sm font-black text-white">
            Text
          </label>
          <textarea
            id="accessibility-text"
            rows={6}
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-2 w-full rounded-lg border border-blue-300/25 bg-slate-950/74 p-4 font-semibold leading-7 text-white shadow-inner focus:outline focus:outline-2"
          />
          <label htmlFor="image-description" className="mt-4 block text-sm font-black text-white">
            Image note
          </label>
          <input
            id="image-description"
            value={imageDescription}
            onChange={(event) => setImageDescription(event.target.value)}
            className="mt-2 w-full rounded-lg border border-blue-300/25 bg-slate-950/74 p-3 text-white shadow-inner focus:outline focus:outline-2"
            placeholder="Example: A Team USA relay celebration on a track."
          />
          <button
            type="button"
            aria-label="Generate accessibility support"
            onClick={runAssistant}
            disabled={loading}
            className="arena-command mt-4 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Sparkles aria-hidden="true" className="h-4 w-4" />}
            Generate
          </button>
          </div>
        </section>
      </div>
      <div className="space-y-5" aria-live="polite">
        <section className="arena-panel rounded-lg p-5">
          <div className="relative z-10">
          <p className="hud-label">Controls</p>
          <h2 className="text-xl font-black text-white">Access tools</h2>
          <div className="mt-4 grid gap-3">
            {[
              "Keyboard",
              "Labels",
              "Contrast",
              "Motion",
              "Alt text"
            ].map((feature) => (
              <p key={feature} className="rounded-md border border-white/10 bg-white/10 p-3 text-sm font-black text-white">
                {feature}
              </p>
            ))}
          </div>
          </div>
        </section>
        {result ? (
          <section className="arena-panel rounded-lg p-5">
            <div className="relative z-10">
            <p className="hud-label text-emerald-100">Generated</p>
            <h2 className="text-xl font-black text-white">Accessibility Agent result</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-md border border-blue-300/25 bg-blue-500/10 p-4">
                <p className="text-sm font-black text-white">Alt</p>
                <p className="mt-1 text-sm rally-muted clamp-2">{result.altText}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-black text-white">Simple</p>
                <p className="mt-1 text-sm rally-muted clamp-2">{result.simpleLanguageSummary}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-black text-white">Label</p>
                <p className="mt-1 text-sm rally-muted clamp-2">{result.screenReaderFriendlyLabel}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-black text-white">Inclusive</p>
                <p className="mt-1 text-sm rally-muted clamp-2">{result.inclusiveLanguageCheck}</p>
              </div>
              <ul className="space-y-2">
                {result.accessibilityNotes.map((note) => (
                  <li key={note} className="rounded-md border border-white/10 bg-white/10 p-3 text-sm rally-muted clamp-2">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
