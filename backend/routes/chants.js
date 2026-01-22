import express from "express";
import {
  getChants,
  getChantById,
  createChant,
  updateChant,
  deleteChant,
  toggleFavoris,
  getFavoris,
  getFilters,
  getSimilarChants,
} from "../controllers/chantsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes spécifiques doivent être déclarées AVANT les routes avec paramètres
router.get("/", getChants);
router.get("/filters", getFilters);
// Favoris routes must be declared before the param route to avoid 'favoris' being treated as an ID
router.get("/favoris", authMiddleware(["client", "manager", "admin"]), getFavoris);
router.post("/favoris/:chantId", authMiddleware(["client", "manager", "admin"]), toggleFavoris);

router.post("/", authMiddleware(["admin","client"]), createChant);
// Routes avec paramètres (specifics before generic /:id)
router.get("/:id/similar", getSimilarChants);
router.put("/:id", authMiddleware(["admin","client"]), updateChant);
router.delete("/:id", authMiddleware(["admin","client"]), deleteChant);
router.get("/:id", getChantById);

export default router;
