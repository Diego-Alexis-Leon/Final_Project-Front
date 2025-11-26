import express from "express";
import Reservation from "../models/Reservation.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Crear reserva
router.post("/", verifyToken, async (req, res) => {
  try {
    const { resourceType, resourceId, startDate, endDate } = req.body;

    // Revisar si ya está reservado en esas fechas
    const overlapping = await Reservation.findOne({
      resourceType,
      resourceId,
      status: "reserved",
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlapping) {
        
      return res.status(400).json({ msg: "El recurso ya está reservado en esas fechas" });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      resourceType,
      resourceId,
      startDate,
      endDate
    });

    res.json(reservation);
  } catch (error) {
    console.error("⚠️ ERROR AL CREAR RESERVA (/):", error);
    res.status(500).json({ error: "Error al crear reserva" });
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
    console.error("⚠️ ERROR AL CREAR RESERVA (/my):", error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

router.get("/resource/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    const reservations = await Reservation.find({
      resourceType: type,
      resourceId: id,
      status: "reserved"
    }).sort({ startDate: 1 });

    res.json(reservations);
  } catch (error) {
    console.error("⚠️ ERROR AL CREAR RESERVA (/resourse):", error);
    res.status(500).json({ error: "Error al obtener disponibilidad" });
  }
});

export default router;
