import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    available: { type: Boolean, default: true },
    description: { type: String },
    //price: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
