"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays } from "lucide-react";

export default function SubscriptionDaysChart({ data = [], hint }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Subscription Trend (Daily)
          </h3>
        </div>
        {hint && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        )}
      </div>

      <p className="text-sm text-slate-500 mb-3">
        {hasData ? `${data.length} days tracked` : "No data available"}
      </p>

      {/* Chart */}
      {hasData ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickMargin={8}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 2px 6px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)",
                }}
                labelStyle={{ fontWeight: 600, color: "#0f172a" }}
                itemStyle={{ color: "#4f46e5" }}
              />
              <Line
                type="monotone"
                dataKey="count" // ✅ FIXED
                stroke="#4f46e5"
                strokeWidth={2.2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-10">
          No subscription data available
        </div>
      )}
    </motion.div>
  );
}
