import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PaymentHistory from "@/models/paymentHistory";

export async function GET() {
  await dbConnect();

  try {
    const payments = await PaymentHistory.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: payments });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
