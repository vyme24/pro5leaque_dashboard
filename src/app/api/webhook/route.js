import crypto from "crypto";
import mongoose from "mongoose";
import PaymentHistory from "@/models/paymentHistory";
import dbConnect from "@/lib/mongoose";

const APP_KEY = process.env.ACQUIRED_APP_KEY;

export async function GET(req) {
  return new Response("OK", { status: 200 });
}

export async function POST(req) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse raw body
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const headers = Object.fromEntries(req.headers);
    const receivedHash = headers["hash"];
    const webhookVersion = headers["webhook-version"];

    // Verify webhook signature
    if (webhookVersion === "2") {
      const generatedHash = crypto
        .createHmac("sha256", APP_KEY)
        .update(rawBody.replace(/\s+/g, ""))
        .digest("hex");

      if (generatedHash !== receivedHash) {
        console.error("❌ Webhook hash mismatch");
        return new Response(
          JSON.stringify({ error: "Invalid webhook signature" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const { webhook_type, webhook_body, timestamp } = body;

    // Common mapping for PaymentHistory
    const updateData = {
      json_data: webhook_body, // only store webhook_body
      paymentDate: new Date(timestamp * 1000),
    };

    switch (webhook_type) {
      case "status_update": {
        updateData.transactionId = webhook_body.transaction_id;
        updateData.status =
          webhook_body.status === "declined" ? "failed" : webhook_body.status;
        updateData.orderId = webhook_body.order_id;

        await PaymentHistory.findOneAndUpdate(
          { transactionId: webhook_body.transaction_id },
          { $set: updateData }
        );

        console.log("📢 Payment Status Updated:", webhook_body);
        break;
      }

      case "customer_new": {
        // updateData.transactionId = webhook_body.transaction_id || null;
        // updateData.customerId = webhook_body.customer_id;
        // updateData.status =
        //   webhook_body.status === "declined" ? "failed" : webhook_body.status;
        // updateData.orderId = webhook_body.order_id;

        // await PaymentHistory.findOneAndUpdate(
        //   { transactionId: webhook_body.transaction_id || new mongoose.Types.ObjectId() },
        //   { $set: updateData },
        //   { new: true, upsert: true }
        // );

        // console.log("👤 New Customer Recorded:", webhook_body);
        break;
      }

      case "card_new": {
        // updateData.transactionId = webhook_body.transaction_id;
        // updateData.card_id = webhook_body.card_id;
        // updateData.status =
        //   webhook_body.status === "declined" ? "failed" : webhook_body.status;
        // updateData.orderId = webhook_body.order_id;

        // await PaymentHistory.findOneAndUpdate(
        //   { transactionId: webhook_body.transaction_id },
        //   { $set: updateData },
        //   { new: true, upsert: true }
        // );

       // console.log("💳 New Card Recorded:", webhook_body);
        break;
      }

      case "funds_received": {
        // updateData.transactionId = webhook_body.transaction_id;
        // updateData.status =
        //   webhook_body.status === "declined" ? "failed" : webhook_body.status;
        // updateData.orderId = webhook_body.order_id;
        // updateData.amount = body.transaction?.amount || 0;
        // updateData.currency = body.transaction?.currency || "EUR";

        // await PaymentHistory.findOneAndUpdate(
        //   { transactionId: webhook_body.transaction_id },
        //   { $set: updateData },
        //   { new: true, upsert: true }
        // );

        // console.log("💰 Funds Received:", webhook_body);
        break;
      }

      default:
        console.log("⚠️ Unhandled webhook type:", webhook_type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
