import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // solo si usas password, si usas Google no lo necesitas
    googleId: { type: String }, // si quieres registrar cuentas de Google
    role: { type: String, enum: ["admin", "alumno"], default: "alumno" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
