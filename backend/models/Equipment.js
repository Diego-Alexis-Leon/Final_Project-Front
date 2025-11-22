import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // camera, lens, light...
  //price: { type: Number, required: true }, // renta por día
  available: { type: Boolean, default: true },
  //image: { type: String }, // URL de imagen opcional
});

export default mongoose.model("Equipment", EquipmentSchema);
