import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

/**
 * Verify JWT token from request cookies and return user data.
 * @param {NextRequest} req - Next.js request object
 * @returns {Object} - { success: boolean, user?: Object, message?: string }
 */
export async function getUserFromRequest(req) {
  // Get token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return { success: false, message: "Invalid token" };
  }

  // Connect to DB
  await dbConnect();

  // Find user
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return { success: false, message: "User not found" };
  }

  return { success: true, user };
}
