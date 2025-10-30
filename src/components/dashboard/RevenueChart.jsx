"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";
import formatCurrency from "./formatCurrency";

export default function RevenueChart({ data = [], total = 0 }) {
  // Create placeholder data if none
  const chartData =
    data && data.length > 0
      ? data
      : Array.from({ length: 7 }).map((_, i) => ({
          day: `D${i + 1}`,
          revenue: Math.round(total / 8 + Math.random() * 50),
          failed: Math.round(Math.random() * 20),
        }));

  const totalFailed = chartData.reduce((sum, d) => sum + (d.failed || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-semibold text-slate-800">
            Revenue Trend
          </h3>
        </div>
        <div className="text-right">
        
          <p className="text-xs text-rose-500 flex items-center justify-end gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {totalFailed} failed transactions
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.8rem",
            }}
            formatter={(value, name) =>
              name === "Revenue"
                ? [formatCurrency(value), name]
                : [`${value} failed`, name]
            }
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              fontSize: "0.8rem",
              color: "#64748b",
              marginBottom: "1rem",
            }}
          />

          {/* Revenue Line */}
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* Failed Transactions Line */}
          <Line
            type="monotone"
            dataKey="failed"
            name="Failed"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
