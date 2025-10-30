import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerId: { type: String},
  subscriptionId: { type: String, default : null },
  orderId: { type: String,default : null },
  transactionId: { type: String }, // external gateway transaction ID
  amount: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  paymentDate: { type: Date, default: Date.now },
  type: { type: String, required: true }, // enum: ["initial_trial", "recurring", "refund"]
  status: { type: String, default: "success" }, //enum: ["success", "failed", "refunded"]
  method: { type: String, default: "card" }, // enum: ["card", "paypal", "apple_pay", "google_pay"]
  refundAmount: { type: Number, default: 0 },
  notes: { type: String }, // optional remarks
  card_id: { type: String, default : null }, // external gateway card ID
  json_data : { type: Object, default: {}},
}, { timestamps: true });

// Update timestamp
paymentHistorySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.models.PaymentHistory || mongoose.model("PaymentHistory", paymentHistorySchema);
