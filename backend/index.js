import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/AuthRoutes.js";
import equipmentRoutes from "./routes/EquipmentRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log("Error al conectar MongoDB:", err));

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);

app.get("/api/auth/profile", verifyToken, (req, res) => {
  res.json({ msg: "Acceso permitido", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

