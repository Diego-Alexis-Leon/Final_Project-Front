import express from "express";


import Rooms from "../models/Rooms.js";
const router = express.Router();

// GET - obtener todos los cuartos
router.get("/", async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener habitacion" });
  }
});

// POST - crear un cuarto nuevo
router.post("/", async (req, res) => {
  try {
    const newRoom = new Rooms(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: "Error al crear habitación" });
  }
});

// PATCH - actualizar disponibilidad (rentar / liberar)
router.patch("/:id", async (req, res) => {
  try {
    const updatedRoom = await Rooms.findByIdAndUpdate(
      req.params.id,
      { available: req.body.available },
      { new: true }
    );

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar habitación" });
  }
});

export default router;
