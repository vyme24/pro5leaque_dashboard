import dbConnect from "@/lib/mongoose";
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
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(query);
  const items = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return NextResponse.json({ success: true, data: { items, total } });
}
