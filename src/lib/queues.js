import { Queue, Worker } from "bullmq"; // removed QueueScheduler
import crypto from "crypto";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import PaymentHistory from "@/models/paymentHistory";
import { callAcquiredApi } from "@/utils/acquiredService";

// ==============================
// Redis / Queue config
// ==============================
const REDIS_URL ="redis://default:MXGVnWzV3FcX3LyWgzVvUKcPi43mFhI2hr9phf2FmGYAZQYqbmPc8EzE5chHK2pC@r4c88kw0scswgos0so4oooko:6379/0"; // make sure port is 6379

const connection = {
  connection: {
    url: REDIS_URL,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
};

// Create Queue
export const rebillQueue = new Queue("rebill-queue", connection);

// ==============================
// Helper: Check if billing is due
// ==============================
function isBillingDue(nextBillingDate) {
  if (!nextBillingDate) return false;
  const now = new Date();
  const billing = new Date(nextBillingDate);

  // Trigger if current time is equal to or after the nextBillingDate
  return now.getTime() >= billing.getTime();
}


// Retry delay for past_due: 7 days
const RETRY_DELAY_MS = 7 * 24 * 60 * 60 * 1000;
// Maximum retries
const MAX_RETRIES = 3;

// ==============================
// Worker: Rebill subscription
// ==============================
export const rebillWorker = new Worker(
  "rebill-queue",
  async (job) => {
    await dbConnect();
    const { subscriptionId } = job.data;
    if (!subscriptionId) return console.warn("⚠️ Missing subscriptionId");

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) return console.warn(`❌ Subscription not found: ${subscriptionId}`);

    if (!["active", "past_due"].includes(subscription.status)) {
      console.log(`⚠️ Skipping subscription with status: ${subscription.status}`);
      return;
    }

    if (!isBillingDue(subscription.nextBillingDate)) {
      console.log(`⏳ Not billing time for ${subscription._id}`);
      return;
    }

    const user = await User.findById(subscription.userId).lean();
    if (!user) return console.warn(`⚠️ User not found for subscription ${subscription._id}`);

    const lastPayment = await PaymentHistory.findOne({
      userId: user._id,
      subscriptionId: subscription._id,
      status: "success",
      card_id: { $exists: true },
    }).sort({ paymentDate: -1 });

    if (!lastPayment?.card_id) return console.warn(`⚠️ No card_id for ${subscription._id}`);

    // Call Acquired API
    const orderId = crypto.randomUUID();
    const payload = {
      transaction: {
        currency: subscription.currency || "EUR",
        capture: true,
        order_id: orderId,
        amount: subscription.price,
      },
      payment: {
        card_id: lastPayment.card_id,
        reference: `rebill-${subscription._id}`,
        subscription_reason: "recurring",
      },
      customer: { customer_id: subscription.customerId },
    };

    const acquiredResponse = await callAcquiredApi("payments/recurring", payload);
    const { status = "failed", transaction_id = null } = acquiredResponse || {};

    await PaymentHistory.create({
      subscriptionId: subscription._id,
      userId: user._id,
      amount: subscription.price,
      currency: subscription.currency || "EUR",
      type: "recurring",
      status: status === "success" ? "success" : "failed",
      method: "card",
      transactionId: transaction_id,
      notes: status === "success" ? "Rebill successful" : "Rebill failed",
      card_id: lastPayment.card_id,
      paymentDate: new Date(),
      json_data: acquiredResponse,
    });

    if (status === "success") {
      const nextBillingDate = new Date(subscription.nextBillingDate);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      subscription.status = "active";
      subscription.lastPaymentDate = new Date();
      subscription.nextBillingDate = nextBillingDate;
      subscription.retryCount = 0;
      await subscription.save();

      console.log(`✅ Rebill successful for subscription ${subscription._id}`);
    } else {
      subscription.retryCount = (subscription.retryCount || 0) + 1;

      if (subscription.retryCount > MAX_RETRIES) {
        subscription.status = "failed";
        await subscription.save();
        console.error(`❌ Subscription ${subscription._id} failed after ${MAX_RETRIES} retries`);
      } else {
        subscription.status = "past_due";
        await subscription.save();

        console.warn(`⚠️ Rebill failed for subscription ${subscription._id} (Retry #${subscription.retryCount})`);

        // Schedule retry after 7 days
        await rebillQueue.add(
          `rebill-retry-${subscription._id}-${Date.now()}`,
          { subscriptionId: subscription._id },
          { delay: RETRY_DELAY_MS }
        );

        console.log(`⏱ Scheduled retry for ${subscription._id} in 7 days`);
      }
    }
  },
  { ...connection, concurrency: 5 }
);

rebillWorker.on("completed", (job) => console.log(`✅ Job ${job.id} completed`));
rebillWorker.on("failed", (job, err) =>
  console.error(`💥 Job ${job?.id || "unknown"} failed: ${err.message}`)
);
