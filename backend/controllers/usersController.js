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
}

export async function deleteUser(req, res) {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Utilisateur supprimé" });
}
