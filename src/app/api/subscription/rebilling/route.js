import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription";
import { rebillQueue } from "@/lib/queues";

export async function POST() {
  await dbConnect();

  const now = new Date();
  const windowEnd = new Date(now.getTime() + 2 * 60 * 1000); // next 2 minutes

  // Fetch subscriptions due for rebill
  const dueSubscriptions = await Subscription.find({
    status: { $in: ["active", "past_due"] },
    billingInterval: "month",
    nextBillingDate: { $lte: windowEnd },
  });

  for (const sub of dueSubscriptions) {
    await rebillQueue.add("rebill-subscription", { subscriptionId: sub._id });
  }

  return NextResponse.json({
    queued: dueSubscriptions.length,
    subscriptions: dueSubscriptions.map((s) => s._id),
    datetime: windowEnd,
    message:
      "Queued active and past_due subscriptions with exact nextBillingDate",
  });
}
