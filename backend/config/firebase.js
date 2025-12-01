import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

let db;

export async function initializeDatabase() {
  if (db) return db;

  if (admin.apps.length === 0) {
    const keyPath = "./backend/config/serviceAccountKey.json";

    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const decoded = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
      );
      admin.initializeApp({
        credential: admin.credential.cert(decoded),
      });
    } else {
      throw new Error(
        "❌ No Firebase service account provided. Add backend/config/serviceAccountKey.json or set FIREBASE_SERVICE_ACCOUNT in .env"
      );
    }
  }

  db = admin.firestore();
  return db;
}

export function getDb() {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}
