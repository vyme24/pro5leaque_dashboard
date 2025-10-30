import { NextResponse } from "next/server";

export async function GET(req) {
  // Set the 'Allow' header to indicate that only POST is permitted
  const headers = {
    Allow: "POST",
  };
  return NextResponse.json(
    { status: "error", message: "Method Not Allowed" },
    { status: 405, headers },
  );
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email is required" },
        { status: 400 },
      );
    }

    // In a real application, you would add your logic here to unsubscribe the user from your database or mailing list.

    return NextResponse.json(
      { status: "success", message: "Unsubscribed successfully", "subscription" : {
        status : "cancelled",
        endDate : new Date()
      } },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
