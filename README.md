# Hype-to-Help: Team USA Fan Impact League

Hype-to-Help is a Gemini-powered fan engagement MVP that turns Olympic and Paralympic attention into safe, inclusive, and measurable Team USA support. Fans can paste posts, comments, headlines, captions, athlete stories, sport topics, or upload an image; Gemini returns structured HypeScan results, a Paralympic Twin, Fan Impact Missions, safe rewrites, accessibility support, and measurable impact scoring.

## Core MVP Flow

1. Open the landing page and select **Start Fan Quest**.
2. Paste a demo fan post or upload an Olympic/Paralympic-related image.
3. Run **Analyze with Gemini**.
4. Review Topic, Safety, Paralympic Twin, Support Router, Mission, and Impact Score cards.
5. Complete a mission to earn points and a badge.
6. Open the Impact Dashboard to see the Team USA Rally Score update.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Gemini API via `@google/genai`
- Firebase Admin SDK / Cloud Firestore
- Cloud Run compatible standalone build
- Firebase Hosting framework config included

## Required Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

```bash
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
FIREBASE_PROJECT_ID=your_firebase_project_id
GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_ga_measurement_id
```

Keep real values in `.env.local` or your deployment provider secrets. Do not commit real API keys, service account keys, or project-specific Firebase web config to `.env.example`.

For local Firestore writes, either authenticate with Application Default Credentials:

```bash
gcloud auth application-default login
gcloud config set project <PROJECT_ID>
```

or set a service account:

```bash
FIREBASE_CLIENT_EMAIL=your_service_account_client_email
FIREBASE_PRIVATE_KEY=replace_with_escaped_private_key
```

If Gemini or Firestore credentials are missing, the app uses safe deterministic demo fallbacks so the 3-minute demo still works.

## Firestore Collections

The app writes these collections through server routes:

- `users`: `id`, `displayName`, `createdAt`, `totalScore`, `accessibilityPreferences`
- `analyses`: `id`, `userId`, `inputType`, `originalContent`, `topic`, `sport`, `sentiment`, `riskLevel`, `possibleIssues`, `missingContext`, `paralympicTwin`, `recommendedFanActions`, `safeSummary`, `createdAt`
- `missions`: `id`, `userId`, `analysisId`, `missionTitle`, `missionTheme`, `missions`, `completed`, `score`, `badges`, `createdAt`
- `impactEvents`: `id`, `userId`, `eventType`, `points`, `sport`, `paralympicIncluded`, `createdAt`, `supportImpact`
- `settings`: intended for accessibility defaults and demo flags

Recommended Firestore setup for this MVP:

1. In Firebase Console, create a Firestore database for your Firebase project.
2. Choose production mode.
3. Use server-side Firebase Admin writes from Cloud Run or Firebase Hosting backend.
4. Do not expose service account credentials to the browser.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run typecheck
npm run build
```

## API Routes

- `POST /api/analyze`: HypeScan text and optional image analysis
- `POST /api/hypecheck`: safe comment review and rewrite
- `POST /api/paralympic-twin`: Paralympic Twin generation
- `POST /api/generate-mission`: Fan Impact Mission generation
- `POST /api/accessibility`: alt text, simple-language summary, label, notes, inclusive language check
- `POST /api/save-impact`: completed mission event and score save
- `GET /api/impact`: aggregate dashboard metrics

Gemini responses are requested as structured JSON and validated with Zod. Invalid JSON is repaired once through Gemini when possible, then replaced by safe defaults if needed.

## Demo Scenarios

The Fan Quest input includes three demo samples:

- Positive Team USA fan post
- Harmful or overly harsh fan comment after a poor result
- General Olympic sport topic that needs a Paralympic Twin

The HypeCheck page also includes a harsh-comment demo.

## Deploy to Cloud Run

Build and deploy with the included `Dockerfile`:

```bash
gcloud builds submit --tag gcr.io/<PROJECT_ID>/<SERVICE_NAME>
gcloud run deploy <SERVICE_NAME> \
  --image gcr.io/<PROJECT_ID>/<SERVICE_NAME> \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=<PROJECT_ID>,GOOGLE_CLOUD_PROJECT=<PROJECT_ID>,GEMINI_MODEL=gemini-2.5-flash-lite \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

Grant the Cloud Run service account access to Firestore. Prefer Secret Manager for `GEMINI_API_KEY`.

## Deploy with Firebase Hosting

This repository includes two Firebase deployment modes.

The default `firebase.json` deploys the static export in `out/`. This works on the free Spark plan and keeps the live demo usable through client-side safe demo fallbacks when `/api/*` is not available.

```bash
# The static build temporarily excludes app/api, then restores it.
# PowerShell example:
$workspace = (Resolve-Path .).Path
$api = Join-Path $workspace "app\api"
$disabled = Join-Path $workspace "app\_api_disabled"
Move-Item -LiteralPath $api -Destination $disabled
try {
  $env:STATIC_EXPORT="true"
  npm run build
} finally {
  Move-Item -LiteralPath $disabled -Destination $api
}

firebase deploy --only hosting --project <PROJECT_ID>
```

The full-stack Next.js SSR/API deployment config is preserved in `firebase.fullstack.json`. It requires Blaze billing because Firebase must create Cloud Functions and supporting Google Cloud services.

```bash
firebase experiments:enable webframeworks
firebase deploy --config firebase.fullstack.json --only hosting --project <PROJECT_ID>
```

For production Gemini API routes, use the full-stack Firebase config after upgrading to Blaze, or deploy the included `Dockerfile` to Cloud Run.

## Safety and Inclusion Guardrails

The app is designed not to:

- Rank athletes by race, gender, disability, body type, nationality, age, or predicted performance.
- Predict athlete success from biometrics.
- Make medical claims, eligibility judgments, or classification judgments.
- Encourage harassment, pile-ons, hostile fan behavior, or speculative claims.
- Treat Paralympic athletes as secondary, inspirational objects, or side content.
- Claim unofficial merchandise, random crowdfunding, or unverified campaigns directly support athletes.

The app encourages fans to use official context before judging athletes, rules, performance, fairness, classification, or outcomes.
