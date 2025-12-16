import express from "express";
import {
  getChants,
  getChantById,
  createChant,
  updateChant,
  deleteChant,
  toggleFavoris,
  getFavoris,
} from "../controllers/chantsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getChants);
// Favoris routes must be declared before the param route to avoid 'favoris' being treated as an ID
router.post("/favoris/:chantId", authMiddleware(["client", "manager", "admin"]), toggleFavoris);
router.get("/favoris", authMiddleware(["client", "manager", "admin"]), getFavoris);

router.post("/", authMiddleware(["admin","client"]), createChant);
router.put("/:id", authMiddleware(["admin","client"]), updateChant);
router.delete("/:id", authMiddleware(["admin","client"]), deleteChant);
router.get("/:id", getChantById);

export default router;
