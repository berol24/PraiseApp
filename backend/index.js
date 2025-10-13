import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Chant } from "./models.js";
import { authMiddleware } from './authMiddleware.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", // ou "*" si tu veux autoriser tout le monde
  credentials: true
}));

// === Connexion MongoDB ===
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chantdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch(err => console.error("❌ Erreur MongoDB :", err));


// === Routes Utilisateur ===
app.post("/api/register", async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const user = await User.create({ nom, email, mot_de_passe: hash });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );
    res.json({ token, user });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Routes Users ===
app.get("/api/users", async (_, res) => {
  const users = await User.find();
  console.log(users);
  
  res.json(users);
});


app.delete("/api/users/:id", authMiddleware(["admin"]), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  console.log("utilisateur supprimé",req.params.id );
  
  res.json({ message: "Chant supprimé" });
});



// === Routes Chants ===
app.get("/api/chants", async (_, res) => {
  const chants = await Chant.find().populate("ajoute_par", "nom email");
  res.json(chants);
});

app.get("/api/chants/:id", async (req, res) => {
  const chant = await Chant.findById(req.params.id);
  if (!chant) return res.status(404).json({ message: "Chant introuvable" });
  res.json(chant);
});

app.post("/api/chants", authMiddleware(["admin"]), async (req, res) => {
  try {
    const chant = await Chant.create({ ...req.body, ajoute_par: req.user.id });
    res.status(201).json(chant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/chants/:id", authMiddleware(["admin"]), async (req, res) => {
  const chant = await Chant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(chant);
});

app.delete("/api/chants/:id", authMiddleware(["admin"]), async (req, res) => {
  await Chant.findByIdAndDelete(req.params.id);
  res.json({ message: "Chant supprimé" });
});

app.listen(5000, () => console.log("🚀 Serveur backend sur http://localhost:5000"));
