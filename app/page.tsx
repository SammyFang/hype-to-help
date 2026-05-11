import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Dumbbell, Link2, MessageSquareText, ShieldCheck, ShoppingBag, Sparkles, Target } from "lucide-react";
import { Hero } from "@/components/Hero";

const features = [
  {
    title: "Scan",
    copy: "Post signal",
    icon: Sparkles
  },
  {
    title: "Check",
    copy: "Safer words",
    icon: MessageSquareText
  },
  {
    title: "Twin",
    copy: "Equal depth",
    icon: Link2
  },
  {
    title: "Move",
    copy: "Health impact",
    icon: Dumbbell
  },
  {
    title: "Store",
    copy: "Official path",
    icon: ShoppingBag
  },
  {
    title: "Score",
    copy: "Rally proof",
    icon: BarChart3
  },
  {
    title: "Mission",
    copy: "Daily quest",
    icon: Target
  },
  {
    title: "Verify",
    copy: "Trusted links",
    icon: ShieldCheck
  }
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="arena-page mx-auto max-w-[96rem] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="hud-label">Systems</p>
            <h2 className="text-3xl font-black text-white">Ecosystem</h2>
          </div>
          <Link
            href="/fan-quest"
            className="arena-command inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm font-black text-white"
          >
            Play
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="arena-panel rounded-lg p-4">
                <div className="relative z-10 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-blue-300/30 bg-blue-500/20 text-blue-100">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black text-white">{feature.title}</h3>
                    <p className="truncate text-sm rally-muted">{feature.copy}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="border-y border-blue-400/20 bg-slate-950/72 py-10 text-white backdrop-blur">
        <div className="mx-auto grid max-w-[96rem] gap-6 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="hud-label text-amber-100">Run</p>
            <h2 className="text-3xl font-black">Quest loop</h2>
            <Link
              href="/fan-quest"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-rally-gold px-5 py-3 text-sm font-black text-rally-navy"
            >
              Play
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Post",
              "Scan",
              "Twin",
              "Score"
            ].map((step) => (
              <div key={step} className="rounded-lg border border-white/15 bg-white/10 p-4">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-rally-gold" />
                <p className="mt-3 text-lg font-black text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
