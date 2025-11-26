import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    available: { type: Boolean, default: true },
    description: { type: String },
    resourceType: {
      type: String,
      default: "room",
      immutable: true  // ⭐ evita que se cambie accidentalmente
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
