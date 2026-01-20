import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import chantsRoutes from "./routes/chants.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://praiseapp.pages.dev",
  "http://localhost:5173", // Port par défaut de Vite pour le frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      // Autoriser localhost sur n'importe quel port en développement
      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// === Connexion MongoDB ===
// Mongoose gère automatiquement la reconnexion, pas besoin de système personnalisé
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chantdb", {
  serverSelectionTimeoutMS: 10000, // Timeout de 10 secondes pour la sélection du serveur
  socketTimeoutMS: 45000, // Timeout de 45 secondes pour les opérations socket
  maxPoolSize: 10, // Nombre maximum de connexions dans le pool
  minPoolSize: 2, // Nombre minimum de connexions dans le pool
})
  .then(() => {
    console.log("✅ Connecté à MongoDB");
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB:", err.message);
    // Mongoose va automatiquement essayer de se reconnecter
  });

// Gestion des événements de connexion MongoDB (pour les logs uniquement)
let lastConnectionState = mongoose.connection.readyState;

mongoose.connection.on("disconnected", () => {
  // Ne logger que si c'est une vraie déconnexion (pas juste un changement d'état)
  if (lastConnectionState === 1) {
    console.warn("⚠️ MongoDB déconnecté. Reconnexion automatique en cours...");
  }
  lastConnectionState = mongoose.connection.readyState;
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Erreur MongoDB:", err.message);
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnecté");
  lastConnectionState = mongoose.connection.readyState;
});

mongoose.connection.on("connected", () => {
  if (lastConnectionState !== 1) {
    console.log("✅ Connecté à MongoDB");
  }
  lastConnectionState = mongoose.connection.readyState;
});

// Routes
app.use("/api", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chants", chantsRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(PORT, () => console.log(`🚀 Serveur backend sur http://localhost:${PORT}`));
