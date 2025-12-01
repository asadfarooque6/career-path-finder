import express from "express";
import { getAllCareers, addCareer, getRecommendations } from "../controllers/careerController.js";

const router = express.Router();

router.get("/careers", getAllCareers);
router.post("/careers", addCareer);
router.post("/recommend", getRecommendations);

export default router;
