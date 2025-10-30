"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/dashboard/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PaymentBreakdown from "@/components/dashboard/PaymentBreakdown";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SubscriptionsTable from "@/components/dashboard/SubscriptionsTable";
import RebillChart from "@/components/dashboard/RebillChart";
import SubscriptionDaysChart from "@/components/dashboard/SubscriptionDaysChart";
import GrowthSummary from "@/components/dashboard/GrowthSummary";

function formatCurrency(v) {
  if (v == null || isNaN(v)) return "€0";
  return `€${v.toLocaleString()}`;
}

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");


  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/overview?range=${range}`);
        const json = await res.json();
        if (mounted && json.success) {
          setReport(json.data);
        } else {
          console.error("Failed to load data:", json.error || json);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [range]);

  const onRefresh = () => {
    setLoading(true);
    setRange("7d");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 flex">
    
      <main className="flex-1  p-5 space-y-10 overflow-y-auto">
        <Header range={range} setRange={setRange} onRefresh={onRefresh} />

        {/* ---- Metrics Section ---- */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 animate-pulse"
                >
                  <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
                  <div className="h-7 w-20 bg-gray-300 rounded" />
                </div>
              ))
            : (
              <>
                <MetricCard
                  label="Total Users"
                  value={report.users.total}
                  hint={`${report.users.active} active`}
                />
                <MetricCard
                  label="Transactions"
                  value={report.payments.totalTransactions}
                  hint={`${report.payments.successCount} success`}
                />
                <MetricCard
                  label="Revenue (€)"
                  value={formatCurrency(report.revenue.totalAmount)}
                  hint="Total amount"
                />
                <MetricCard
                  label="Subscriptions"
                  value={report.subscriptions.total}
                  hint={`${report.subscriptions.active} active`}
                />
              </>
            )}
        </motion.section>

        {/* Growth Section */}
        {!loading ? (
          <GrowthSummary growth={report?.growth} />
        ) : (
          <div className="h-32 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse" />
        )}

        {/* ---- Charts Section ---- */}
        <motion.section
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <>
              <div className="lg:col-span-2 h-72 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse" />
              <div className="h-72 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse" />
              <div className="lg:col-span-2 h-72 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse" />
            </>
          ) : (
            <>
              <div className="lg:col-span-2">
                <RevenueChart
                  data={report.revenue.trend}
                  total={report.revenue.totalAmount}
                />
              </div>
              <RebillChart
                failed={report.rebill.failed}
                success={report.rebill.success}
              />
              <PaymentBreakdown payments={report.payments} />

              <div className="lg:col-span-2">
                <SubscriptionDaysChart
                  data={report.subscriptions.dailyTrend}
                  hint={`${report.subscriptions.active} active, ${report.subscriptions.canceled} canceled`}
                />
              </div>
            </>
          )}
        </motion.section>

        {/* ---- Tables Section ---- */}
        <motion.section
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            [...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 animate-pulse"
              >
                <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                {[...Array(5)].map((__, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-100 rounded mb-2 last:mb-0 w-full"
                  />
                ))}
              </div>
            ))
          ) : (
            <>
              <RecentTransactions payments={report.recentTransactions} />
              <SubscriptionsTable subscriptions={report.latestSubscriptions} />
            </>
          )}
        </motion.section>
      </main>
    </div>
  );
}
