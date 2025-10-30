import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import PaymentHistory from "@/models/paymentHistory";

/* 
  Helper: build date range dynamically
*/
function getDateRange(range, customStart, customEnd) {
  const now = new Date();
  let start, end;

  switch (range) {
    case "today":
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date();
      break;
    case "yesterday":
      start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
      break;
    case "7d":
      start = new Date();
      start.setDate(start.getDate() - 7);
      end = new Date();
      break;
    case "30d":
    case "month":
      start = new Date();
      start.setDate(start.getDate() - 30);
      end = new Date();
      break;
    case "3m":
      start = new Date();
      start.setMonth(start.getMonth() - 3);
      end = new Date();
      break;
    case "6m":
      start = new Date();
      start.setMonth(start.getMonth() - 6);
      end = new Date();
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date();
      break;
    case "custom":
      start = customStart ? new Date(customStart) : new Date(0);
      end = customEnd ? new Date(customEnd) : new Date();
      break;
    default:
      start = new Date(0);
      end = new Date();
  }

  // Calculate previous period
  const diff = end.getTime() - start.getTime();
  const prevStart = new Date(start.getTime() - diff);
  const prevEnd = new Date(start.getTime());

  return { start, end, prevStart, prevEnd };
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";
    const customStart = searchParams.get("start");
    const customEnd = searchParams.get("end");

    const { start, end, prevStart, prevEnd } = getDateRange(range, customStart, customEnd);

    // ===== USERS =====
    const [totalUsers, activeUsers, prevUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ createdAt: { $gte: prevStart, $lte: prevEnd } }),
    ]);
    const inactiveUsers = totalUsers - activeUsers;

    // ===== PAYMENTS =====
    const [payments, prevPayments] = await Promise.all([
      PaymentHistory.find({ createdAt: { $gte: start, $lte: end } }).lean(),
      PaymentHistory.find({ createdAt: { $gte: prevStart, $lte: prevEnd } }).lean(),
    ]);

    const successPayments = payments.filter((p) => p.status === "success");
    const failedPayments = payments.filter((p) => p.status === "failed");
    const refundedPayments = payments.filter((p) => p.status === "refunded");

    const totalTransactions = payments.length;
    const totalAmount = successPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const prevTotalAmount = prevPayments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

        // ===== REBILL =====
    const rebillPayments = payments.filter((p) => p.type === "recurring");
    const rebillSuccess = rebillPayments.filter(
      (p) => p.status === "success"
    ).length;
    const rebillFailed = rebillPayments.filter(
      (p) => p.status === "failed"
    ).length;
     

    // ===== SUBSCRIPTIONS =====
    const [subs, prevSubs] = await Promise.all([
      Subscription.find({ createdAt: { $gte: start, $lte: end } })
        .populate("userId", "fullName email")
        .lean(),
      Subscription.find({ createdAt: { $gte: prevStart, $lte: prevEnd } }).lean(),
    ]);

    const totalSubs = subs.length;
    const activeSubs = subs.filter((s) => s.status === "active").length;
    const canceledSubs = subs.filter((s) => s.status === "canceled").length;
    const expiredSubs = subs.filter((s) => s.status === "expired").length;

    // ===== SUBSCRIPTION TREND =====
    const subsTrendMap = {};
    subs.forEach((s) => {
      const key = new Date(s.createdAt).toLocaleDateString("en-GB");
      subsTrendMap[key] = (subsTrendMap[key] || 0) + 1;
    });
    const subsDailyTrend = Object.entries(subsTrendMap)
      .map(([date, count]) => ({ date, count }))
      .sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")) -
          new Date(b.date.split("/").reverse().join("-"))
      );

    // ===== REVENUE TREND (SUCCESS + FAILED) =====
    const trendMap = {};
    payments.forEach((p) => {
      const key = new Date(p.createdAt).toLocaleDateString("en-GB");
      trendMap[key] = trendMap[key] || { revenue: 0, failed: 0 };
      if (p.status === "success") trendMap[key].revenue += p.amount || 0;
      if (p.status === "failed") trendMap[key].failed += 1;
    });

    const revenueTrend = Object.entries(trendMap)
      .map(([day, { revenue, failed }]) => ({ day, revenue, failed }))
      .sort(
        (a, b) =>
          new Date(a.day.split("/").reverse().join("-")) -
          new Date(b.day.split("/").reverse().join("-"))
      );

    // ===== RECENT DATA =====
    const [recentTransactions, latestSubscriptions] = await Promise.all([
      PaymentHistory.find({})
        .select("-card_id")
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Subscription.find({})
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    // ===== GROWTH SUMMARY =====
    const calcGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    const growth = {
      revenueGrowth: calcGrowth(totalAmount, prevTotalAmount),
      subscriptionGrowth: calcGrowth(totalSubs, prevSubs.length),
      userGrowth: calcGrowth(totalUsers, prevUsers),
      transactionGrowth: calcGrowth(totalTransactions, prevPayments.length),
    };

    // ===== RETURN =====
    return NextResponse.json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers, inactive: inactiveUsers },
        payments: {
          totalTransactions,
          totalAmount,
          successCount: successPayments.length,
          failedCount: failedPayments.length,
          refundedCount: refundedPayments.length,
        },
        subscriptions: {
          total: totalSubs,
          active: activeSubs,
          canceled: canceledSubs,
          expired: expiredSubs,
          dailyTrend: subsDailyTrend,
        },
        revenue: { totalAmount, trend: revenueTrend },
        rebill: { success: rebillSuccess, failed: rebillFailed },

        growth, // ✅ NEW GROWTH SUMMARY
        recentTransactions,
        latestSubscriptions,
        range: { start, end, prevStart, prevEnd },
      },
    });
  } catch (error) {
    console.error("Admin Overview API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
