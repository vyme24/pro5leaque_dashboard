import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerId: { type: String},
  plan: { type: String, default: "Trial" },
  price: { type: Number, default: 0 },
  currency: { type: String, default: "EUR" },
  status: { type: String, enum: ["inactive", "active", "canceled", "expired"], default: "inactive" },
  startDate: { type: Date, default: Date.now },
  nextBillingDate: { type: Date },
  lastPaymentDate: { type: Date },
  retryCount: { type: Number, default: 0 },
  billingInterval: { type: String, enum: ["day", "week", "month", "year"], default: "month" },
  canceledAt: { type: Date },
  refundedAmount: { type: Number, default: 0 },
}, { timestamps: true });


// Update timestamp on findOneAndUpdate
subscriptionSchema.pre("findOneAndUpdate", function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
