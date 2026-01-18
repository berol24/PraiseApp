import express from "express";
import { createFeedback, getFeedbacks, deleteFeedback } from "../controllers/feedbackController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route publique pour créer un feedback
router.post("/", createFeedback);

// Routes protégées pour les admins
router.get("/all", authMiddleware(["admin"]), getFeedbacks);
router.delete("/:id", authMiddleware(["admin"]), deleteFeedback);

export default router;
