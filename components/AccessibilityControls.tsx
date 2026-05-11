"use client";

import { useEffect, useState } from "react";
import { Eye, Keyboard, Languages, MousePointer2 } from "lucide-react";
import type { AccessibilityPreferences } from "@/types";

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largerText: false,
  simpleLanguage: false,
  reducedMotion: false
};

const controls = [
  {
    key: "highContrast",
    title: "Contrast",
    description: "Strengthens text, borders, focus states, and score visibility.",
    icon: Eye
  },
  {
    key: "largerText",
    title: "Text+",
    description: "Increases base text size while preserving layout.",
    icon: Languages
  },
  {
    key: "simpleLanguage",
    title: "Simple",
    description: "Surfaces plainer support guidance where available.",
    icon: MousePointer2
  },
  {
    key: "reducedMotion",
    title: "Motion",
    description: "Minimizes transitions for motion-sensitive users.",
    icon: Keyboard
  }
] as const;

export function AccessibilityControls() {
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const stored = window.localStorage.getItem("hype-accessibility-preferences");
    if (stored) {
      setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.contrast = preferences.highContrast ? "high" : "normal";
    root.dataset.textSize = preferences.largerText ? "large" : "normal";
    root.dataset.simpleLanguage = preferences.simpleLanguage ? "true" : "false";
    root.classList.toggle("reduced-motion", preferences.reducedMotion);
    window.localStorage.setItem("hype-accessibility-preferences", JSON.stringify(preferences));
  }, [preferences]);

  function toggle(key: keyof AccessibilityPreferences) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <section className="arena-panel rounded-lg p-5" aria-labelledby="accessibility-controls-title">
      <div className="relative z-10">
      <p className="hud-label">Loadout</p>
      <h2 id="accessibility-controls-title" className="text-xl font-black text-white">
        Controls
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {controls.map((control) => {
          const Icon = control.icon;
          const key = control.key as keyof AccessibilityPreferences;
          const checked = preferences[key];
          return (
            <label
              key={control.key}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/10 p-4 transition hover:border-blue-300/35 hover:bg-blue-400/15"
            >
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-slate-300 text-rally-blue focus:ring-rally-blue"
                checked={checked}
                onChange={() => toggle(key)}
              />
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-blue-300/30 bg-blue-500/20 text-blue-100">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black text-white">{control.title}</span>
                <span className="mt-1 block text-sm rally-muted clamp-2">{control.description}</span>
              </span>
            </label>
          );
        })}
      </div>
      </div>
    </section>
  );
}
