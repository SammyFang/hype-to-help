import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import type { Analytics } from "firebase/analytics";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function hasClientConfig(config: FirebaseOptions) {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

export function getFirebaseClientApp(): FirebaseApp | null {
  if (!hasClientConfig(firebaseConfig)) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return Promise.resolve(null);
  }

  analyticsPromise ??= (async () => {
    const app = getFirebaseClientApp();
    if (!app) return null;

    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (!(await isSupported())) return null;

    return getAnalytics(app);
  })().catch((error) => {
    console.warn("Firebase Analytics unavailable.", error);
    return null;
  });

  return analyticsPromise;
}
