import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import chantsRoutes from "./routes/chants.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://praiseapp.pages.dev",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
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
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/chantdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// Routes
app.use("/api", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/chants", chantsRoutes);

app.listen(PORT, () => console.log(`🚀 Serveur backend sur http://localhost:${PORT}`));
