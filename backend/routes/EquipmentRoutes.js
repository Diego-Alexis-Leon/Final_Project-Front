import express from "express";

import Equipment from "../models/Equipment.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener equipo disponible
router.get("/", async (req, res) => {
  try {
    const items = await Equipment.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el equipo" });
  }
});

// Agregar equipo nuevo (solo admin)
//router.post("/", verifyToken, async (req, res) => {
router.post("/", async (req, res) => {
  try {
    const newItem = await Equipment.create(req.body);
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Error al crear equipo" });
  }
});

// Renta de equipo
router.post("/rent/:id", verifyToken, async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);

    if (!item) return res.status(304).json({ message: "Equipo no encontrado" });
    if (!item.available)
      return res.status(400).json({ message: "Equipo no disponible" });

    item.available = false;
    await item.save();

    res.json({ message: "Equipo rentado", item });
  } catch (err) {
    res.status(500).json({ error: "Error al rentar equipo" });
  }
});

export default router;
