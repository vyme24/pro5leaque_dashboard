"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CreditCard } from "lucide-react";

const COLORS = {
  Success: "#10b981",
  Failed: "#ef4444",
  Refunded: "#f59e0b",
  Other: "#6366f1",
};

export default function PaymentBreakdown({ payments }) {
  if (!payments) return null;

  const total = payments.totalTransactions || 0;
  const breakdownData = [
    { name: "Success", value: payments.successCount || 0 },
    { name: "Failed", value: payments.failedCount || 0 },
    { name: "Refunded", value: payments.refundedCount || 0 },
    {
      name: "Other",
      value:
        total -
        ((payments.successCount || 0) +
          (payments.failedCount || 0) +
          (payments.refundedCount || 0)),
    },
  ].filter((d) => d.value > 0);

  const totalLabel = total.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-semibold text-slate-800">
            Payment Breakdown
          </h3>
        </div>
        <span className="text-sm text-slate-500">
          {totalLabel} total transactions
        </span>
      </div>

      {breakdownData.length > 0 ? (
        <div className="relative h-[260px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={55}
                paddingAngle={2}
                dataKey="value"
              >
                {breakdownData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} (${((value / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  fontSize: "0.8rem",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  marginTop: "1rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute text-center">
            <p className="text-2xl font-semibold text-slate-800">
              {totalLabel}
            </p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500 py-10">
          No payment data available
        </div>
      )}
    </motion.div>
  );
}
