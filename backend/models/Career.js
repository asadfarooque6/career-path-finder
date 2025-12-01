import { getDb } from "../config/firebase.js";

export default class Career {
  static async add(career) {
    const db = await getDb();
    return db.collection("careers").add({
      role: career.role,
      designation: career.designation,
      required_skills: career.required_skills || [],
      next_skills: career.next_skills || [],
      resources: career.resources || [],
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  static async getAll() {
    const db = await getDb();
    const snapshot = await db.collection("careers").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async seed(careers) {
    const db = await getDb();
    const batch = db.batch();
    careers.forEach((c) => {
      const ref = db.collection("careers").doc();
      batch.set(ref, {
        role: c.role,
        designation: c.designation,
        required_skills: c.required_skills || [],
        next_skills: c.next_skills || [],
        resources: c.resources || [],
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
    await batch.commit();
  }
}
