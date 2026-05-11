import { z } from "zod";

export const sentimentSchema = z.enum(["positive", "neutral", "negative", "mixed"]);
export const riskLevelSchema = z.enum(["low", "medium", "high"]);
export const safetyRatingSchema = z.enum(["safe", "needs_context", "harmful"]);
export const missionTypeSchema = z.enum([
  "Learn",
  "Cheer",
  "Discover",
  "Watch",
  "Share",
  "Rewrite",
  "Support",
  "Invite",
  "HypeCheck"
]);

export const hypeScanSchema = z.object({
  topic: z.string().min(1),
  sport: z.string().min(1),
  teamUSARelevance: z.string().min(1),
  contentType: z.string().min(1),
  sentiment: sentimentSchema,
  riskLevel: riskLevelSchema,
  possibleIssues: z.array(z.string()),
  missingContext: z.array(z.string()),
  paralympicTwin: z.object({
    sportOrTopic: z.string().min(1),
    explanation: z.string().min(1)
  }),
  recommendedFanActions: z.array(z.string()),
  safeSummary: z.string().min(1)
});

export const hypeCheckSchema = z.object({
  originalComment: z.string(),
  safetyRating: safetyRatingSchema,
  issuesDetected: z.array(z.string()),
  whyItMatters: z.string(),
  supportiveRewrite: z.string(),
  shortTeamUSAMessage: z.string(),
  postingGuidance: z.string()
});

export const paralympicTwinSchema = z.object({
  inputTopic: z.string(),
  olympicConnection: z.string(),
  paralympicTwin: z.string(),
  whyThisConnectionMatters: z.string(),
  classificationOrRuleInsight: z.string(),
  fanDiscoveryMission: z.string(),
  inclusiveMessage: z.string()
});

export const missionItemSchema = z.object({
  type: missionTypeSchema,
  title: z.string(),
  description: z.string(),
  points: z.number().int().min(1).max(100),
  badge: z.string(),
  supportImpact: z.string()
});

export const missionGenerationSchema = z.object({
  missionTitle: z.string(),
  missionTheme: z.string(),
  missions: z.array(missionItemSchema).min(3).max(5),
  teamUSARallyMessage: z.string(),
  paralympicRepresentationIncluded: z.boolean()
});

export const accessibilitySchema = z.object({
  altText: z.string(),
  simpleLanguageSummary: z.string(),
  screenReaderFriendlyLabel: z.string(),
  accessibilityNotes: z.array(z.string()),
  inclusiveLanguageCheck: z.string()
});

export const analyzeRequestSchema = z.object({
  text: z.string().optional().default(""),
  imageDataUrl: z.string().optional(),
  userId: z.string().optional()
});

export const hypeCheckRequestSchema = z.object({
  comment: z.string().min(1),
  userId: z.string().optional()
});

export const twinRequestSchema = z.object({
  topic: z.string().min(1),
  sport: z.string().optional()
});

export const missionRequestSchema = z.object({
  hypeScanResult: hypeScanSchema,
  analysisId: z.string().optional(),
  userId: z.string().optional()
});

export const accessibilityRequestSchema = z.object({
  text: z.string().optional().default(""),
  imageDescription: z.string().optional().default("")
});

export const impactEventRequestSchema = z.object({
  userId: z.string().min(1),
  eventType: missionTypeSchema,
  points: z.number().int().min(0).max(250),
  sport: z.string().default("Team USA"),
  paralympicIncluded: z.boolean().default(false),
  supportImpact: z.string().default("Positive fan support action completed."),
  badge: z.string().optional()
});
