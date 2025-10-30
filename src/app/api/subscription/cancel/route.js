// File: src/app/api/subscription/cancel/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription";
import { getUserFromRequest } from "@/utils/auth";
import { logToFile } from "@/email-templates/config";
import { cancelSubscription } from "@/email-templates/cancel-subscription";

export async function POST(req) {
 
  try {
    await dbConnect();

    // Authenticate user
    const { success, user, message } = await getUserFromRequest(req);
    if (!success) {
      return NextResponse.json({ success: false, message }, { status: 401 });
    }

    const subscription = await Subscription.findOne({ userId: user._id });

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: "No active subscription found" },
        { status: 404 }
      );
    }

    if (subscription.status === "canceled") {
      return NextResponse.json(
        { success: false, message: "Subscription already canceled" },
        { status: 400 }
      );
    }

    // Update subscription
    subscription.status = "canceled";
    subscription.canceledAt = new Date();
    await subscription.save();
    logToFile(`Subscription ${subscription._id} for user ${user._id} canceled.`);
    console.log(`Subscription ${subscription._id} for user ${user._id} canceled.`);
    // Callback to external product
    try {
     const response = await fetch(
        "https://roar-digital-ae-39fcbbi.hyvesdp.com/api/auth/vserve/cancel",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription_id: subscription._id.toString(),
            user_id: user._id.toString(),
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Subscription cancel callback failed");
      }
      const data = await response.json();
      console.log("Subscription cancel callback response:", data);
      logToFile("Subscription cancel callback response: " + JSON.stringify(data));
    
    } catch (callbackErr) {
      console.error("Subscription cancel callback failed:", callbackErr);
      logToFile("Subscription cancel callback failed: " + callbackErr);
    }
  
    // Send cancellation email
    try {
      await cancelSubscription({email: user.email, name: user.fullName });
    } catch (emailErr) {
      console.error("Cancellation email failed:", emailErr);
      logToFile("Cancellation email failed: " + emailErr);
    }


    return NextResponse.json({
      success: true,
      message: "Subscription canceled successfully",
      subscriptionStatus: subscription.status,
    });
  } catch (err) {
  
    console.error("Cancel subscription error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
