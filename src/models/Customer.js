import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true, required: true }, // UUID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    address: { type: String },
    city: { type: String },
    zip: { type: String },
    country: { type: String },
    state: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
