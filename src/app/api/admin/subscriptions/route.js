import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const { search, page = 1, limit = 10, startDate, endDate } = Object.fromEntries(
    req.nextUrl.searchParams
  );

  const query = {};

  if (search) {
    query.$or = [
      { plan: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
    ];
  }

  if (startDate && endDate) {
    query.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const skip = (page - 1) * limit;
  const total = await Subscription.countDocuments(query);
  const items = await Subscription.find(query)
    .populate("userId", "fullName email")
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(Number(limit));

  return NextResponse.json({ success: true, data: { items, total } });
}
