import express from "express";
import { register, login, forgotPassword } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

// Debug route to inspect decoded token / user info (protected)
router.get("/me", authMiddleware(), (req, res) => {
	res.json({ user: req.user });
});

export default router;
