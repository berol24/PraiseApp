import { Feedback } from "../models.js";

export async function createFeedback(req, res) {
  try {
    const { nom, message } = req.body;
    
    if (!nom || !message) {
      return res.status(400).json({ message: "Le nom et le message sont requis" });
    }

    const feedback = new Feedback({ nom, message });
    await feedback.save();
    
    res.status(201).json({ message: "Avis envoyé avec succès", feedback });
  } catch (err) {
    console.error("Erreur lors de la création du feedback:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.find().sort({ date_creation: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("Erreur lors de la récupération des feedbacks:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function deleteFeedback(req, res) {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.json({ message: "Avis supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du feedback:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
