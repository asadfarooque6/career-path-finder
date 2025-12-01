import { getDb } from "../config/firebase.js";

// ✅ Get all careers
export const getAllCareers = async (req, res) => {
  try {
    const db = await getDb();
    const snapshot = await db.collection("careers").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Fetch careers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a new career entry manually
export const addCareer = async (req, res) => {
  try {
    const { role, designation, required_skills, next_skills, resources } = req.body;

    if (!role || !designation || !required_skills) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await getDb();
    await db.collection("careers").add({
      role,
      designation,
      required_skills,
      next_skills: next_skills || [],
      resources: resources || [],
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({ message: "Career successfully added!" });
  } catch (error) {
    console.error("❌ Add career error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Smarter search with keyword mapping
export const getRecommendations = async (req, res) => {
  try {
    const db = await getDb();
    const input = (req.body.input || "").toLowerCase().trim();

    if (!input) {
      return res.status(400).json({ message: "Provide 'input' field in body" });
    }

    const snapshot = await db.collection("careers").get();
    const careers = snapshot.docs.map((doc) => doc.data());

    // 🔹 Keyword alias map (covers synonyms, abbreviations, etc.)
    const keywordAliases = {
      ai: "artificial intelligence",
      ml: "machine learning",
      dl: "deep learning",
      js: "javascript",
      py: "python",
      reactjs: "react",
      nodejs: "node",
      frontend: "frontend developer",
      backend: "backend developer",
      fullstack: "full stack developer",
      data: "data science",
      devops: "devops engineer",
      cloud: "cloud engineer",
    };

    const expandedInput = keywordAliases[input] || input;

    // 🔹 Smart fuzzy match: checks role, designation, skills, and keywords
    const matches = careers.filter((career) => {
      const combinedText = [
        career.role,
        career.designation,
        ...(career.required_skills || []),
        ...(career.next_skills || []),
      ]
        .join(" ")
        .toLowerCase();

      return (
        combinedText.includes(input) ||
        combinedText.includes(expandedInput) ||
        expandedInput.split(" ").some((word) => combinedText.includes(word))
      );
    });

    // 🔹 If no results, fallback logic
    if (matches.length === 0) {
      return res.status(200).json([
        {
          role: "No results found",
          designation: "-",
          required_skills: [],
          next_skills: [],
          resources: [],
        },
      ]);
    }

    // 🔹 Sort by match strength (optional)
    const rankedMatches = matches.sort((a, b) => {
      const textA = JSON.stringify(a).toLowerCase();
      const textB = JSON.stringify(b).toLowerCase();
      const scoreA = textA.includes(input) ? 1 : 0;
      const scoreB = textB.includes(input) ? 1 : 0;
      return scoreB - scoreA;
    });

    res.status(200).json(rankedMatches.map((m) => ({ ...m, source: "db" })));
  } catch (error) {
    console.error("❌ Recommendation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
