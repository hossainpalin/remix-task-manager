import "dotenv/config";
import admin from "firebase-admin";
import {
  getApp as getAdminApp,
  getApps as getAdminApps,
  initializeApp as initializeAdminApp
} from "firebase-admin/app";
import {
  getApp as getClientApp,
  getApps as getClientApps,
  initializeApp as initializeClientApp
} from "firebase/app";

// Firebase service credential
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string
);

const adminApp = getAdminApps().length
  ? getAdminApp()
  : initializeAdminApp({
      credential: admin.credential.cert(serviceAccount)
    });

if (!adminApp) {
  throw new Error("Firebase application could not initialized!");
}

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

const clientApp = getClientApps().length
  ? getClientApp()
  : initializeClientApp(firebaseConfig);

const adminAuth = admin.auth();
const db = admin.firestore();

export { db, adminAuth, clientApp, adminApp };
