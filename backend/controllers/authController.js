import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models.js";
dotenv.config();

export async function register(req, res) {
  try {
    const { nom, email, mot_de_passe } = req.body;
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const user = await User.create({ nom, email, mot_de_passe: hash });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req, res) {
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
}

export async function forgotPassword(req, res) {
  const { email, password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Aucun utilisateur trouvé avec cet email", type: "danger" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas", type: "danger" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.updateOne({ email }, { mot_de_passe: hashedPassword });
    res.status(200).json({ message: "Mot de passe modifié avec succès !", type: "success" });
  } catch (err) {
    console.error("Erreur lors de la réinitialisation:", err);
    res.status(500).json({ message: "Erreur serveur lors du changement de mot de passe", type: "danger" });
  }
}
