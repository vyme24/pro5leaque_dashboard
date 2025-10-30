import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "" },          // NEW
  phone: { type: String, default: "" },             // NEW
  role: { type: String, default: "user" },          // NEW: user/admin/etc.
  status : { type: String, default: "active" } ,
  resetToken: { type: String },
  resetExpires: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);


