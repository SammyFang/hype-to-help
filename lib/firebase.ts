import { randomUUID } from "node:crypto";
import { cert, getApp, initializeApp, applicationDefault, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type {
  AnalysisRecord,
  DemoUser,
  ImpactEvent,
  MissionRecord,
  AccessibilityPreferences
} from "@/types";
import { calculateImpactMetrics } from "@/lib/scoring";

type DemoStore = {
  users: DemoUser[];
  analyses: AnalysisRecord[];
  missions: MissionRecord[];
  impactEvents: ImpactEvent[];
};

const globalStore = globalThis as typeof globalThis & {
  __hypeToHelpStore?: DemoStore;
  __hypeToHelpDb?: Firestore | null;
};

export type PersistenceMode = "firestore" | "memory";

type Persisted<T> = {
  record: T;
  persistence: PersistenceMode;
};

function store() {
  if (!globalStore.__hypeToHelpStore) {
    globalStore.__hypeToHelpStore = {
      users: [],
      analyses: [],
      missions: [],
      impactEvents: []
    };
  }
  return globalStore.__hypeToHelpStore;
}

function now() {
  return new Date().toISOString();
}

function privateKeyFromEnv() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function projectIdFromEnv() {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  if (process.env.GOOGLE_CLOUD_PROJECT) return process.env.GOOGLE_CLOUD_PROJECT;
  if (process.env.GCLOUD_PROJECT) return process.env.GCLOUD_PROJECT;
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  try {
    const firebaseConfig = process.env.FIREBASE_CONFIG
      ? (JSON.parse(process.env.FIREBASE_CONFIG) as { projectId?: string })
      : undefined;
    return firebaseConfig?.projectId;
  } catch {
    return undefined;
  }
}

function memoryResult<T>(record: T): Persisted<T> {
  return { record, persistence: "memory" };
}

function firestoreResult<T>(record: T): Persisted<T> {
  return { record, persistence: "firestore" };
}

function getOrInitializeDefaultApp(projectId: string): App {
  try {
    return getApp();
  } catch {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = privateKeyFromEnv();

    return initializeApp({
      projectId,
      credential:
        clientEmail && privateKey
          ? cert({ projectId, clientEmail, privateKey })
          : applicationDefault()
    });
  }
}

export function getAdminDb() {
  if (globalStore.__hypeToHelpDb !== undefined) {
    return globalStore.__hypeToHelpDb;
  }

  try {
    const projectId = projectIdFromEnv();

    if (!projectId) {
      globalStore.__hypeToHelpDb = null;
      return null;
    }

    globalStore.__hypeToHelpDb = getFirestore(getOrInitializeDefaultApp(projectId));
    return globalStore.__hypeToHelpDb;
  } catch (error) {
    console.warn("Firestore unavailable, using demo memory store.", error);
    globalStore.__hypeToHelpDb = null;
    return null;
  }
}

export async function getFirestoreHealth() {
  const projectId = projectIdFromEnv();
  const db = getAdminDb();

  if (!db) {
    return {
      ok: false,
      projectId,
      persistence: "memory" as const,
      reason: projectId ? "firestore_unavailable" : "missing_project_id"
    };
  }

  try {
    const ref = db.collection("_health").doc("firestore");
    await ref.set({ checkedAt: now(), projectId }, { merge: true });
    const snap = await ref.get();
    return {
      ok: snap.exists,
      projectId,
      persistence: "firestore" as const
    };
  } catch (error) {
    return {
      ok: false,
      projectId,
      persistence: "memory" as const,
      reason: error instanceof Error ? error.message : "unknown_firestore_error"
    };
  }
}

export function createAnonymousUser(id?: string) {
  const preferences: AccessibilityPreferences = {
    highContrast: false,
    largerText: false,
    simpleLanguage: false,
    reducedMotion: false
  };

  return {
    id: id || `demo-${randomUUID()}`,
    displayName: "Demo Fan",
    createdAt: now(),
    totalScore: 0,
    accessibilityPreferences: preferences
  };
}

export async function ensureUser(userId?: string) {
  const id = userId || `demo-${randomUUID()}`;
  const db = getAdminDb();
  const fallbackUser = createAnonymousUser(id);

  if (!db) {
    const existing = store().users.find((user) => user.id === id);
    if (existing) return existing;
    store().users.push(fallbackUser);
    return fallbackUser;
  }

  try {
    const ref = db.collection("users").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set(fallbackUser);
      return fallbackUser;
    }
    return snap.data() as DemoUser;
  } catch (error) {
    console.warn("Could not ensure Firestore user, using demo memory store.", error);
    const existing = store().users.find((user) => user.id === id);
    if (existing) return existing;
    store().users.push(fallbackUser);
    return fallbackUser;
  }
}

export async function saveAnalysisRecord(record: Omit<AnalysisRecord, "id" | "createdAt">) {
  const analysis: AnalysisRecord = {
    ...record,
    id: randomUUID(),
    createdAt: now()
  };
  const db = getAdminDb();

  if (!db) {
    store().analyses.push(analysis);
    return memoryResult(analysis);
  }

  try {
    await db.collection("analyses").doc(analysis.id).set(analysis);
    return firestoreResult(analysis);
  } catch (error) {
    console.warn("Could not save analysis to Firestore.", error);
    store().analyses.push(analysis);
    return memoryResult(analysis);
  }
}

export async function saveMissionRecord(record: Omit<MissionRecord, "id" | "createdAt">) {
  const mission: MissionRecord = {
    ...record,
    id: randomUUID(),
    createdAt: now()
  };
  const db = getAdminDb();

  if (!db) {
    store().missions.push(mission);
    return memoryResult(mission);
  }

  try {
    await db.collection("missions").doc(mission.id).set(mission);
    return firestoreResult(mission);
  } catch (error) {
    console.warn("Could not save missions to Firestore.", error);
    store().missions.push(mission);
    return memoryResult(mission);
  }
}

export async function saveImpactEvent(record: Omit<ImpactEvent, "id" | "createdAt">) {
  await ensureUser(record.userId);

  const event: ImpactEvent = {
    ...record,
    id: randomUUID(),
    createdAt: now()
  };
  const db = getAdminDb();

  if (!db) {
    store().impactEvents.push(event);
    return memoryResult(event);
  }

  try {
    await db.collection("impactEvents").doc(event.id).set(event);
    const userRef = db.collection("users").doc(event.userId);
    const userSnap = await userRef.get();
    const previous = userSnap.exists ? Number(userSnap.data()?.totalScore || 0) : 0;
    await userRef.set({ totalScore: previous + event.points }, { merge: true });
    return firestoreResult(event);
  } catch (error) {
    console.warn("Could not save impact event to Firestore.", error);
    store().impactEvents.push(event);
    return memoryResult(event);
  }
}

export async function getImpactMetricsWithPersistence(userId?: string) {
  const db = getAdminDb();
  if (!db) {
    const events = userId
      ? store().impactEvents.filter((event) => event.userId === userId)
      : store().impactEvents;
    return { metrics: calculateImpactMetrics(events), persistence: "memory" as const };
  }

  try {
    const snapshot = userId
      ? await db.collection("impactEvents").where("userId", "==", userId).get()
      : await db.collection("impactEvents").get();
    const events = snapshot.docs.map((doc) => doc.data() as ImpactEvent);
    return { metrics: calculateImpactMetrics(events), persistence: "firestore" as const };
  } catch (error) {
    console.warn("Could not load Firestore impact metrics.", error);
    const events = userId
      ? store().impactEvents.filter((event) => event.userId === userId)
      : store().impactEvents;
    return { metrics: calculateImpactMetrics(events), persistence: "memory" as const };
  }
}

export async function getImpactMetrics(userId?: string) {
  return (await getImpactMetricsWithPersistence(userId)).metrics;
}
