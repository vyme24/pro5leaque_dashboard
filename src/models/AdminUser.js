import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "" },          // NEW
  phone: { type: String, default: "" },             // NEW
  role: { type: String, default: null},          // NEW: user/admin/etc.
  status : { type: String, default: "active" } ,
  resetToken: { type: String },
  resetExpires: { type: Date },
}, { timestamps: true });

export default mongoose.models.AdminUser || mongoose.model("admin_users", AdminUserSchema);


