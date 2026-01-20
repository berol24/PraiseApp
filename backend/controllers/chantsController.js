import mongoose from "mongoose";
import { Chant, User } from "../models.js";

export async function getChants(req, res) {
  try {
    // Vérifier la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: "Service temporairement indisponible. Reconnexion à la base de données en cours..." 
      });
    }
    const chants = await Chant.find().populate("ajoute_par", "nom email");
    res.json(chants);
  } catch (err) {
    console.error("Erreur getChants:", err);
    res.status(500).json({ 
      message: err.message || "Erreur lors de la récupération des chants" 
    });
  }
}

export async function getChantById(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: "Service temporairement indisponible. Reconnexion à la base de données en cours..." 
      });
    }
    const chant = await Chant.findById(req.params.id).populate("ajoute_par", "nom email").populate("modifie_par", "nom email");
    if (!chant) return res.status(404).json({ message: "Chant introuvable" });
    res.json(chant);
  } catch (err) {
    console.error("Erreur getChantById:", err);
    res.status(500).json({ 
      message: err.message || "Erreur lors de la récupération du chant" 
    });
  }
}

export async function createChant(req, res) {
  try {
    const chant = await Chant.create({ ...req.body, ajoute_par: req.user.id });
    res.status(201).json(chant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateChant(req, res) {
  try {
    const updateData = {
      ...req.body,
      date_mise_a_jour: new Date(),
      modifie_par: req.user?.id || null
    };
    
    const chant = await Chant.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).populate("ajoute_par", "nom email").populate("modifie_par", "nom email");
    
    if (!chant) return res.status(404).json({ message: "Chant introuvable" });
    res.json(chant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteChant(req, res) {
  await Chant.findByIdAndDelete(req.params.id);
  res.json({ message: "Chant supprimé" });
}

export async function toggleFavoris(req, res) {
  try {
    const userId = req.user?.id;
    const chantId = req.params?.chantId;

    if (!userId) return res.status(401).json({ message: "Utilisateur non identifié" });
    if (!chantId || !mongoose.Types.ObjectId.isValid(chantId)) {
      return res.status(400).json({ message: "Identifiant de chant invalide" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const favorisStr = (user.favoris || []).map((id) => id.toString());
    const exists = favorisStr.includes(chantId);

    if (!exists) {
      user.favoris.push(new mongoose.Types.ObjectId(chantId));
    } else {
      user.favoris = user.favoris.filter((id) => id.toString() !== chantId);
    }

    await user.save();

    const favorisDocs = await Chant.find({ _id: { $in: user.favoris } });
    res.status(200).json({ message: !exists ? "Chant ajouté aux favoris" : "Chant retiré des favoris", favoris: favorisDocs });
  } catch (error) {
    console.error("Erreur toggleFavoris:", error && error.stack ? error.stack : error);
    res.status(500).json({ message: "Erreur serveur", error: error?.message });
  }
}

export async function getFavoris(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Utilisateur non identifié" });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const rawFavoris = Array.isArray(user.favoris) ? user.favoris : [];
    const validIds = rawFavoris.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) return res.status(200).json([]);

    const favoris = await Chant.find({ _id: { $in: validIds } });
    res.status(200).json(favoris);
  } catch (error) {
    console.error("Erreur getFavoris:", error && error.stack ? error.stack : error);
    res.status(500).json({ message: "Erreur serveur", error: error?.message });
  }
}
