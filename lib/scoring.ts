import type { ImpactEvent, ImpactMetrics, MissionType, ScoreBreakdown } from "@/types";

const maxProgress = 500;

function clampProgress(value: number) {
  return Math.max(0, Math.min(maxProgress, value));
}

export function scoreBucketForMission(type: MissionType) {
  if (type === "Learn") return "learningScore";
  if (type === "Discover") return "inclusionScore";
  if (type === "Rewrite" || type === "HypeCheck") return "safetyScore";
  return "supportScore";
}

export function calculateScores(events: ImpactEvent[]): ScoreBreakdown {
  const base = {
    learningScore: 0,
    inclusionScore: 0,
    supportScore: 0,
    safetyScore: 0
  };

  for (const event of events) {
    const bucket = scoreBucketForMission(event.eventType);
    base[bucket] += event.points;

    if (event.paralympicIncluded && bucket !== "inclusionScore") {
      base.inclusionScore += Math.ceil(event.points * 0.35);
    }
  }

  const learningScore = clampProgress(base.learningScore);
  const inclusionScore = clampProgress(base.inclusionScore);
  const supportScore = clampProgress(base.supportScore);
  const safetyScore = clampProgress(base.safetyScore);
  const teamUSARallyScore = Math.round(
    learningScore * 0.24 + inclusionScore * 0.28 + supportScore * 0.28 + safetyScore * 0.2
  );

  return {
    learningScore,
    inclusionScore,
    supportScore,
    safetyScore,
    teamUSARallyScore
  };
}

export function calculateImpactMetrics(events: ImpactEvent[]): ImpactMetrics {
  const scores = calculateScores(events);
  const badges = Array.from(new Set(events.map((event) => event.badge).filter(Boolean) as string[]));

  return {
    ...scores,
    totalEvents: events.length,
    totalPoints: events.reduce((sum, event) => sum + event.points, 0),
    safeCommentsGenerated: events.filter((event) =>
      ["Rewrite", "HypeCheck"].includes(event.eventType)
    ).length,
    paralympicDiscoveries: events.filter(
      (event) => event.paralympicIncluded || event.eventType === "Discover"
    ).length,
    fanMissionsCompleted: events.length,
    verifiedSupportClicks: events.filter((event) =>
      ["Watch", "Share", "Support"].includes(event.eventType)
    ).length,
    officialViewingActions: events.filter((event) => event.eventType === "Watch").length,
    grassrootsSupportActions: events.filter((event) => event.eventType === "Support").length,
    badges,
    recentEvents: events
      .slice()
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 8)
  };
}
