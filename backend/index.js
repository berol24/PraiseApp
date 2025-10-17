import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Chant } from "./models.js";
import { authMiddleware } from './authMiddleware.js';


const router = express.Router();
dotenv.config();
const app = express();
app.use(express.json());
// app.use(cors({
//   origin: "*", 
//   credentials: true
// }));

const allowedOrigins = [
  "https://praiseapp.pages.dev",  
  "http://localhost:5173",      
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);  
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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
  res.json(users);
});


app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur  introuvable" });
  res.json(user);
});


app.put("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.nom = req.body.nom || user.nom;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  if (req.body.mot_de_passe && req.body.mot_de_passe.trim().length > 0) {
    user.mot_de_passe = await bcrypt.hash(req.body.mot_de_passe, 10);
  }


  await user.save();

  res.json(user);
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


// favoris

/* === Ajouter ou retirer un chant des favoris === */
app.post("/api/favoris/:chantId",authMiddleware(["client", "manager", "admin"]), async (req, res) => {
  try {
    const userId = req.user.id; // supposons que tu utilises un middleware d’authentification
    const chantId = req.params.chantId;  

    const user = await User.findById(userId); 

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifie si le chant est déjà en favori
    const index = user.favoris.indexOf(chantId);

    if (index === -1) {
      // 🔹 Ajouter le chant
      user.favoris.push(chantId);
    } else {
      // 🔸 Retirer le chant
      user.favoris.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      message: index === -1 ? "Chant ajouté aux favoris" : "Chant retiré des favoris",
      favoris: user.favoris
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/favoris", authMiddleware(["client", "manager", "admin"]), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favoris"); // 🔍 populate pour avoir les détails des chants
    
    res.status(200).json(user.favoris);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


app.listen(5000, () => console.log("🚀 Serveur backend sur http://localhost:5000"));
