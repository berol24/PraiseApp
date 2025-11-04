import mongoose from "mongoose";

/* === Schéma utilisateur === */
const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  role: { type: String, enum: ["admin","manager" ,"client"], default: "client" },
  date_inscription: { type: Date, default: Date.now },
  favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chant" }]
});
export const User = mongoose.model("User", UserSchema);

/* === Schéma chant === */
const ChantSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  auteur: { type: String },
  langue: { type: String, default: "français" },
  categories: [{ type: String }],
  rythme: { type: String },
  structure: [
    {
      type: {
        type: String,
        enum: ["couplet", "refrain", "solo", "ass", "autre"],
        required: true
      },
      numero: { type: Number },
      contenu: { type: String, required: true }
    }
  ],
  fichiers: {
    partition_pdf: { type: String },
    audio_mp3: { type: String },
    video_youtube: { type: String }
  },
  ajoute_par: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date_creation: { type: Date, default: Date.now },
  date_mise_a_jour: { type: Date, default: Date.now }
});
export const Chant = mongoose.model("Chant", ChantSchema);
