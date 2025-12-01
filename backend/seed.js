import { getDb } from "./config/firebase.js";
import fs from "fs";
import path from "path";

const seedData = async () => {
  console.log("🔥 Seeding Firestore data...");

  try {
    const db = await getDb();

    // 1️⃣ Backup existing data before modifying anything
    const collections = ["careers", "languages", "designations"];
    const backupDir = path.join(process.cwd(), "backup");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    for (const col of collections) {
      const snapshot = await db.collection(col).get();
      const existingData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (existingData.length > 0) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupPath = path.join(backupDir, `${col}_backup_${timestamp}.json`);
        fs.writeFileSync(backupPath, JSON.stringify(existingData, null, 2));
        console.log(`💾 Backup created → ${backupPath}`);
      } else {
        console.log(`⚠️ No existing data in '${col}' — skipping backup.`);
      }
    }

    // 2️⃣ Clear collections
    for (const col of collections) {
      const snapshot = await db.collection(col).get();
      if (!snapshot.empty) {
        const batchDelete = db.batch();
        snapshot.forEach((doc) => batchDelete.delete(doc.ref));
        await batchDelete.commit();
        console.log(`🧹 Cleared collection: ${col}`);
      }
    }

    // 3️⃣ Define new data
    const careers = [
      { role: "Frontend Developer", designation: "UI Engineer", required_skills: ["HTML", "CSS", "JavaScript", "React"], next_skills: ["Next.js", "TypeScript", "Tailwind CSS"], resources: [{ title: "React Docs", link: "https://react.dev" }] },
      { role: "Backend Developer", designation: "Software Engineer", required_skills: ["Node.js", "Express", "MongoDB"], next_skills: ["SQL", "Docker", "AWS"], resources: [{ title: "Node.js Docs", link: "https://nodejs.org/en/docs" }] },
      { role: "Full Stack Developer", designation: "Software Engineer", required_skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"], next_skills: ["GraphQL", "Docker", "CI/CD"], resources: [{ title: "Full Stack Open", link: "https://fullstackopen.com/en/" }] },
      { role: "UI/UX Designer", designation: "Product Designer", required_skills: ["Figma", "Adobe XD", "Wireframing"], next_skills: ["Prototyping", "Design Systems"], resources: [{ title: "Figma Learn", link: "https://help.figma.com/" }] },
      { role: "Data Analyst", designation: "Data Engineer", required_skills: ["Excel", "SQL", "Python"], next_skills: ["Power BI", "Machine Learning"], resources: [{ title: "Kaggle Learn", link: "https://www.kaggle.com/learn" }] },
    ];

    const languages = [
      "JavaScript", "Python", "Java", "C", "C++", "C#", "TypeScript", "Ruby", "Go", "Swift",
      "Kotlin", "PHP", "Rust", "R", "Dart", "SQL", "HTML", "CSS", "JSON", "YAML",
      "Bash", "PowerShell", "R", "MATLAB", "Perl", "Scala", "Lua", "Elixir", "Haskell",
      "React", "Vue.js", "Angular", "Node.js", "Express.js", "Django", "Flask", "Spring Boot",
      "MongoDB", "PostgreSQL", "MySQL", "Firebase", "Dockerfile", "Terraform", "Kubernetes YAML",
      "TensorFlow", "PyTorch", "Keras", "NumPy", "Pandas", "Solidity", "Web3.js",
      "AWS Lambda", "Google Cloud", "Azure", "Raspberry Pi", "Arduino",
      "English", "Spanish", "French", "German", "Hindi", "Arabic", "Mandarin", "Japanese", "Korean", "Russian"
    ];

    const jobDesignations = [
      "Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer", "Mobile App Developer",
      "Game Developer", "Blockchain Developer", "DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer",
      "Machine Learning Engineer", "AI Engineer", "Data Scientist", "Data Analyst", "Database Administrator",
      "System Administrator", "Automation Engineer", "QA Engineer", "Security Engineer", "Cybersecurity Analyst",
      "UI Designer", "UX Designer", "Product Designer", "Graphic Designer", "Creative Director",
      "Project Manager", "Product Manager", "Scrum Master", "Agile Coach", "Business Analyst",
      "Network Engineer", "Hardware Engineer", "Embedded Systems Engineer", "IoT Developer", "Robotics Engineer",
      "Digital Marketing Manager", "SEO Specialist", "Content Writer", "Copywriter", "Social Media Manager",
      "Financial Analyst", "Accountant", "Investment Analyst", "HR Executive", "Recruiter", "HR Manager",
      "Lecturer", "Professor", "Research Scientist", "Video Editor", "Photographer", "Animator",
      "Entrepreneur", "Startup Founder", "Technical Writer", "Customer Support Specialist", "Operations Manager"
    ];

    // 4️⃣ Seed new data
    const batch = db.batch();

    // Careers
    careers.forEach((career) => {
      const ref = db.collection("careers").doc();
      batch.set(ref, {
        ...career,
        created_at: new Date(),
        updated_at: new Date(),
        version: "v3",
      });
    });

    // Languages
    languages.forEach((lang) => {
      const ref = db.collection("languages").doc();
      batch.set(ref, { name: lang, created_at: new Date() });
    });

    // Job Designations
    jobDesignations.forEach((job) => {
      const ref = db.collection("designations").doc();
      batch.set(ref, { title: job, created_at: new Date() });
    });

    await batch.commit();

    console.log(`✅ Firestore successfully seeded with:
    - ${careers.length} careers
    - ${languages.length} languages
    - ${jobDesignations.length} designations`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
};

seedData();
