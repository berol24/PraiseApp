import bcrypt from "bcrypt";
import { User } from "../models.js";

export async function getUsers(req, res) {
  const users = await User.find();
  res.json(users);
}

export async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur  introuvable" });
  res.json(user);
}

export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.nom !== undefined) user.nom = req.body.nom;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.role !== undefined) user.role = req.body.role;

    if (req.body.mot_de_passe && req.body.mot_de_passe.trim().length > 0) {
      user.mot_de_passe = await bcrypt.hash(req.body.mot_de_passe, 10);
    }
    
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ message: err.message || "Erreur lors de la mise à jour de l'utilisateur" });
  }
}

export async function deleteUser(req, res) {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Utilisateur supprimé" });
}
