import express from "express";
import Reservation from "../models/Reservation.js";
import Equipment from "../models/Equipment.js";
import Room from "../models/Rooms.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { resourceType, resourceId, startDate, endDate, day, startHour, endHour } = req.body;

    // Validar que el recurso existe
    let resource = null;

    if (resourceType === "room") {
      resource = await Room.findById(resourceId);
    } else {
      resource = await Equipment.findById(resourceId);
    }

    if (!resource) {
      return res.status(404).json({ msg: "Recurso no encontrado" });
    }

    // 🔎 Detectar solapamientos
    let overlapping;

    if (resourceType === "room") {
      overlapping = await Reservation.findOne({
        resourceType,
        resourceId,
        day,
        status: "approved",
        $or: [
          { startHour: { $lt: endHour }, endHour: { $gt: startHour } }
        ]
      });
    } else {
      overlapping = await Reservation.findOne({
        resourceType,
        resourceId,
        status: "approved",
        $or: [
          { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
      });
    }

    if (overlapping) {
      return res.status(400).json({ msg: "El recurso ya está reservado en ese horario" });
    }

    // Crear la reserva
    const reservation = await Reservation.create({
      user: req.user.id,
      resourceType,
      resourceId,
      startDate,
      endDate,
      day,
      startHour,
      endHour,
      status: "approved" // por ahora aprobadas automáticamente
    });

    res.json(reservation);

  } catch (error) {
    console.error("⚠️ ERROR AL CREAR RESERVA (/):", error, {
      body: req.body,
      user: req.user
    });
    res.status(500).json({ error: error.message });
  }
});

// Ver reservas del usuario
router.get("/my", verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("resourceId")
      .sort({ startDate: 1 });

    res.json(reservations);
  } catch (error) {
    console.error("⚠️ ERROR AL OBTENER RESERVAS (/my):", error);
    res.status(500).json({ error: error.message });
  }
});

// Ver disponibilidad de un recurso específico
router.get("/resource/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    const reservations = await Reservation.find({
      resourceType: type,
      resourceId: id,
      status: "approved"
    }).sort({ startDate: 1 });

    res.json(reservations);
  } catch (error) {
    console.error("⚠️ ERROR AL OBTENER DISPONIBILIDAD (/resource):", error);
    res.status(500).json({ error: "Error al obtener disponibilidad" });
  }
});

// Ver TODAS las reservas (solo admin)
router.get("/all", verifyToken, async (req, res) => {
  try {
    // Verificar si el usuario es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador" });
    }

    const reservations = await Reservation.find()
      .populate("resourceId")
      .populate("user", "name email") // populate user info
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    console.error("⚠️ ERROR AL OBTENER TODAS LAS RESERVAS (/all):", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;