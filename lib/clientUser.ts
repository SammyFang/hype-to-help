"use client";

export function getDemoUserId() {
  if (typeof window === "undefined") return "demo-server-user";

  const key = "hype-to-help-user-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `demo-${crypto.randomUUID()}`
      : `demo-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, id);
  return id;
}
