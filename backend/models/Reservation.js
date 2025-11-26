import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  resourceType: {
    type: String,
    enum: ["camera", "light", "microphone", "speaker", "room"],
    required: true,
  },

  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // Para equipos
  startDate: Date,
  endDate: Date,

  // Para rooms
  day: Date,
  startHour: String,
  endHour: String,

  // Estado de reserva
  status: {
    type: String,
    enum: ["pending", "approved", "declined", "active", "completed", "cancelled"],
    default: "pending",
  },
});

export default mongoose.model("Reservation", ReservationSchema);
