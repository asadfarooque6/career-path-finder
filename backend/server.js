import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initializeDatabase } from "./config/firebase.js";
import careerRoutes from "./routes/careerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Initialize Firebase
(async () => {
  try {
    await initializeDatabase();
    console.log("✅ Connected to Firebase Firestore");
  } catch (err) {
    console.error("❌ Firebase connection error:", err);
  }
})();

// API Routes
app.use("/api", careerRoutes);

// Serve Frontend
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
