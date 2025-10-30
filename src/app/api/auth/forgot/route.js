import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate secure token + expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour validity

    // Save token in user document
    user.resetToken = resetToken;
    user.resetExpires = resetExpires;
    await user.save();

    // // Send email using the template
    // await forgotPassword({
    //   email: user.email,
    //   full_name: user.fullName || "User",
    //   reset_password_token: resetToken,
    // });

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while sending reset email." },
      { status: 500 }
    );
  }
}
