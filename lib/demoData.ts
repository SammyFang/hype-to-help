import type {
  AccessibilityResult,
  DemoScenario,
  HypeCheckResult,
  HypeScanResult,
  MissionGenerationResult,
  ParalympicTwinResult
} from "@/types";

export const demoScenarios: DemoScenario[] = [
  {
    id: "positive-swim",
    title: "Positive Team USA post",
    category: "HypeScan",
    text:
      "Team USA swimming looked so strong tonight. I want to cheer them on and learn more about the athletes and events before LA28."
  },
  {
    id: "harsh-comment",
    title: "Harsh post-result comment",
    category: "HypeCheck",
    text:
      "That athlete totally choked and embarrassed Team USA. They should never compete again after that result."
  },
  {
    id: "paralympic-twin",
    title: "Olympic topic needing a Paralympic Twin",
    category: "Twin Engine",
    text:
      "I am getting into track and field for LA28. What is a respectful way to follow the Olympic and Paralympic side together?"
  }
];

const twinMap: Record<string, { sport: string; explanation: string; rule: string }> = {
  swimming: {
    sport: "Para swimming",
    explanation:
      "Para swimming uses the same core race formats while classification groups athletes by how impairment affects sport-specific performance.",
    rule:
      "Classification is a sport-specific system used to create fair competition groups; it is not a medical judgment or ranking of athletes."
  },
  basketball: {
    sport: "Wheelchair basketball",
    explanation:
      "Wheelchair basketball connects court strategy, spacing, passing, and shot creation with a distinct classification and chair-skill layer.",
    rule:
      "Player point totals help teams balance functional classifications on court while keeping the sport fast and tactical."
  },
  rugby: {
    sport: "Wheelchair rugby",
    explanation:
      "Wheelchair rugby brings contact, transition play, chair control, and team tactics into a high-intensity Paralympic sport.",
    rule:
      "Classification reflects sport function and role balance; fans should use official explainers before judging rules."
  },
  track: {
    sport: "Para athletics",
    explanation:
      "Para athletics shares sprint, distance, jump, and throw storylines while adding sport-specific classes and equipment considerations.",
    rule:
      "Class names describe competition groupings, not a complete description of an athlete or a medical label."
  },
  field: {
    sport: "Para athletics",
    explanation:
      "Para athletics connects directly with track and field through racing, throwing, jumping, pacing, and technical execution.",
    rule:
      "Classification is designed around activity limitations in that sport and should be discussed neutrally."
  },
  cycling: {
    sport: "Para cycling",
    explanation:
      "Para cycling pairs endurance, sprint tactics, equipment choice, and course management with road and track events.",
    rule:
      "Different cycles and sport classes support fair competition across functional profiles without making medical assumptions."
  }
};

function lower(value: string) {
  return value.toLowerCase();
}

export function inferSport(text: string) {
  const value = lower(text);
  if (value.includes("swim")) return "swimming";
  if (value.includes("basketball")) return "basketball";
  if (value.includes("rugby")) return "rugby";
  if (value.includes("track") || value.includes("athletics") || value.includes("field")) return "track";
  if (value.includes("cycling") || value.includes("bike")) return "cycling";
  if (value.includes("gymnast")) return "gymnastics";
  if (value.includes("soccer") || value.includes("football")) return "soccer";
  return "general Team USA support";
}

export function createDemoHypeScan(text: string, hasImage = false): HypeScanResult {
  const sportKey = inferSport(text);
  const twin = twinMap[sportKey] ?? {
    sport: "Paralympic athlete discovery",
    explanation:
      "The most respectful fan path is to follow Olympic and Paralympic Team USA stories together, using official explainers and athlete-led channels.",
    rule:
      "When classification or eligibility comes up, rely on official context and avoid medical assumptions."
  };
  const harsh = /choked|trash|embarrass|lazy|should never|body|weight|disabled|fake/i.test(text);
  const misleading = /guarantee|rigged|cheat|stole|obvious/i.test(text);

  return {
    topic: sportKey === "general Team USA support" ? "Team USA fan support" : `Team USA ${sportKey}`,
    sport: sportKey,
    teamUSARelevance:
      "The content is connected to Team USA attention and can be turned into respectful support, learning, and verified fan action.",
    contentType: hasImage && text ? "multimodal fan content" : hasImage ? "image upload" : "fan post or topic",
    sentiment: harsh ? "negative" : misleading ? "mixed" : "positive",
    riskLevel: harsh ? "high" : misleading ? "medium" : "low",
    possibleIssues: [
      ...(harsh ? ["Overly harsh athlete blame or pressure-heavy language"] : []),
      ...(misleading ? ["Possible missing context or unverified claim"] : [])
    ],
    missingContext: [
      "Official event context, athlete statements, and sport rule explanations should be checked before judging.",
      twin.rule
    ],
    paralympicTwin: {
      sportOrTopic: twin.sport,
      explanation: twin.explanation
    },
    recommendedFanActions: [
      "Cheer for Team USA with respectful, athlete-centered language.",
      "Look up official Team USA and Paralympic Team USA explainers before sharing claims.",
      "Discover the paired Paralympic sport and follow athlete-led or official channels.",
      "Choose verified viewing, learning, or grassroots sport support pathways."
    ],
    safeSummary: harsh
      ? "This can be reframed from blame into encouragement, context-seeking, and respectful support for athletes after a difficult result."
      : "This is a strong fan moment that can become inclusive support by pairing Olympic attention with a meaningful Paralympic connection."
  };
}

export function createDemoHypeCheck(comment: string): HypeCheckResult {
  const harmful = /choked|trash|embarrass|lazy|never compete|body|weight|disabled|fake/i.test(comment);
  const needsContext = /rigged|cheat|unfair|stole|guarantee|obvious/i.test(comment);

  return {
    originalComment: comment,
    safetyRating: harmful ? "harmful" : needsContext ? "needs_context" : "safe",
    issuesDetected: [
      ...(harmful ? ["Blame-heavy or disrespectful language"] : []),
      ...(needsContext ? ["Claim may need official context before posting"] : [])
    ],
    whyItMatters:
      "Fans can be honest about disappointment while avoiding harassment, identity-based assumptions, misinformation, and added pressure on athletes.",
    supportiveRewrite: harmful
      ? "Tough result, but I am still proud to support Team USA. I hope the athlete has the support and space they need, and I will look for official context before judging the performance."
      : needsContext
        ? "I want to understand what happened before reacting. I am checking official event and rule context, and I am still cheering for Team USA."
        : comment,
    shortTeamUSAMessage: "Proud to support Team USA with respect, context, and care.",
    postingGuidance:
      "Post the rewrite, avoid tagging athletes with criticism, and use official sources for rules, results, and classification context."
  };
}

export function createDemoTwin(topic: string): ParalympicTwinResult {
  const sportKey = inferSport(topic);
  const twin = twinMap[sportKey] ?? {
    sport: "Paralympic Team USA discovery",
    explanation:
      "General Team USA support can include equal attention to Paralympic athlete stories, events, and official content.",
    rule:
      "Use official explainers when discussing classification, rules, or eligibility."
  };

  return {
    inputTopic: topic,
    olympicConnection: sportKey === "general Team USA support" ? "Team USA fan attention" : `Olympic ${sportKey}`,
    paralympicTwin: twin.sport,
    whyThisConnectionMatters: twin.explanation,
    classificationOrRuleInsight: twin.rule,
    fanDiscoveryMission: `Spend three minutes with an official ${twin.sport} explainer, then share one respectful thing you learned.`,
    inclusiveMessage:
      "Olympic and Paralympic fan support belong in the same conversation, with equal respect for athletic skill, strategy, and preparation."
  };
}

export function createDemoMissions(scan: HypeScanResult): MissionGenerationResult {
  const twin = scan.paralympicTwin.sportOrTopic || "Paralympic Team USA";

  return {
    missionTitle: `${scan.sport} Rally Quest`,
    missionTheme: "Turn hype into learning, inclusion, safety, and verified support.",
    missions: [
      {
        type: "Learn",
        title: "Context Check",
        description: `Read one official explainer about ${scan.sport} results, rules, or event format before posting a take.`,
        points: 25,
        badge: "Context Captain",
        supportImpact: "Adds informed fan discussion and reduces misinformation risk."
      },
      {
        type: "Discover",
        title: "Paralympic Twin Unlock",
        description: `Discover ${twin} and note one strategy, rule, or athlete story from an official or athlete-led source.`,
        points: 35,
        badge: "Twin Finder",
        supportImpact: "Builds Olympic and Paralympic parity in fan attention."
      },
      {
        type: scan.riskLevel === "high" ? "Rewrite" : "Cheer",
        title: scan.riskLevel === "high" ? "Respect Rewrite" : "Respectful Rally",
        description:
          scan.riskLevel === "high"
            ? "Rewrite one harsh reaction as a supportive Team USA message that avoids blame and pressure."
            : "Post or save one supportive Team USA message that celebrates effort without harmful comparisons.",
        points: scan.riskLevel === "high" ? 40 : 20,
        badge: scan.riskLevel === "high" ? "Safe Voice" : "Rally Voice",
        supportImpact: "Creates safer fan spaces around Olympic and Paralympic athletes."
      },
      {
        type: "Watch",
        title: "Verified Watch Path",
        description:
          "Use official broadcast, Team USA, Paralympic, or LA28 channels to find a verified viewing or highlight action.",
        points: 30,
        badge: "Verified Viewer",
        supportImpact: "Routes attention toward official sport coverage and verified support pathways."
      }
    ],
    teamUSARallyMessage:
      "Your fan energy counts when it is respectful, informed, inclusive, and routed toward verified support.",
    paralympicRepresentationIncluded: true
  };
}

export function createDemoAccessibility(text: string): AccessibilityResult {
  return {
    altText:
      "Team USA fan content connected to Olympic and Paralympic support, with emphasis on respectful language and verified context.",
    simpleLanguageSummary:
      text.trim().length > 0
        ? "This content is about supporting Team USA. Use kind language, check official facts, and include Paralympic stories too."
        : "Share Team USA content in a clear, respectful way that includes Olympic and Paralympic fans.",
    screenReaderFriendlyLabel: "Team USA fan support content with safety and accessibility guidance",
    accessibilityNotes: [
      "Do not rely on color alone to show risk or completion.",
      "Use captions or transcripts for video clips.",
      "Use descriptive links such as official Team USA results instead of vague text."
    ],
    inclusiveLanguageCheck:
      "Use athlete-first, respectful language and avoid ableist, body-shaming, sexist, racist, or identity-based assumptions."
  };
}
