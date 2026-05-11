export type Sentiment = "positive" | "neutral" | "negative" | "mixed";
export type RiskLevel = "low" | "medium" | "high";
export type SafetyRating = "safe" | "needs_context" | "harmful";

export type MissionType =
  | "Learn"
  | "Cheer"
  | "Discover"
  | "Watch"
  | "Share"
  | "Rewrite"
  | "Support"
  | "Invite"
  | "HypeCheck";

export interface ParalympicTwinSummary {
  sportOrTopic: string;
  explanation: string;
}

export interface HypeScanResult {
  topic: string;
  sport: string;
  teamUSARelevance: string;
  contentType: string;
  sentiment: Sentiment;
  riskLevel: RiskLevel;
  possibleIssues: string[];
  missingContext: string[];
  paralympicTwin: ParalympicTwinSummary;
  recommendedFanActions: string[];
  safeSummary: string;
}

export interface HypeCheckResult {
  originalComment: string;
  safetyRating: SafetyRating;
  issuesDetected: string[];
  whyItMatters: string;
  supportiveRewrite: string;
  shortTeamUSAMessage: string;
  postingGuidance: string;
}

export interface ParalympicTwinResult {
  inputTopic: string;
  olympicConnection: string;
  paralympicTwin: string;
  whyThisConnectionMatters: string;
  classificationOrRuleInsight: string;
  fanDiscoveryMission: string;
  inclusiveMessage: string;
}

export interface MissionItem {
  type: MissionType;
  title: string;
  description: string;
  points: number;
  badge: string;
  supportImpact: string;
}

export interface MissionGenerationResult {
  missionTitle: string;
  missionTheme: string;
  missions: MissionItem[];
  teamUSARallyMessage: string;
  paralympicRepresentationIncluded: boolean;
}

export interface AccessibilityResult {
  altText: string;
  simpleLanguageSummary: string;
  screenReaderFriendlyLabel: string;
  accessibilityNotes: string[];
  inclusiveLanguageCheck: string;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  largerText: boolean;
  simpleLanguage: boolean;
  reducedMotion: boolean;
}

export interface DemoUser {
  id: string;
  displayName: string;
  createdAt: string;
  totalScore: number;
  accessibilityPreferences: AccessibilityPreferences;
}

export interface AnalysisRecord extends HypeScanResult {
  id: string;
  userId: string;
  inputType: "text" | "image" | "multimodal";
  originalContent: string;
  createdAt: string;
}

export interface MissionRecord extends MissionGenerationResult {
  id: string;
  userId: string;
  analysisId?: string;
  completed: boolean;
  score: number;
  badges: string[];
  createdAt: string;
}

export interface ImpactEvent {
  id: string;
  userId: string;
  eventType: MissionType;
  points: number;
  sport: string;
  paralympicIncluded: boolean;
  createdAt: string;
  supportImpact: string;
  badge?: string;
}

export interface ScoreBreakdown {
  learningScore: number;
  inclusionScore: number;
  supportScore: number;
  safetyScore: number;
  teamUSARallyScore: number;
}

export interface ImpactMetrics extends ScoreBreakdown {
  totalEvents: number;
  totalPoints: number;
  safeCommentsGenerated: number;
  paralympicDiscoveries: number;
  fanMissionsCompleted: number;
  verifiedSupportClicks: number;
  officialViewingActions: number;
  grassrootsSupportActions: number;
  badges: string[];
  recentEvents: ImpactEvent[];
}

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  text: string;
}
