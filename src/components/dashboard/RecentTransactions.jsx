"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import formatCurrency from "./formatCurrency";

export default function RecentTransactions({ payments = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          Recent Transactions
        </h3>
        <p className="text-sm text-slate-500">
          {payments?.length || 0} recent records
        </p>
      </div>

      {/* Table */}
      {payments && payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 font-medium text-left">User</th>
                <th className="py-2.5 px-3 font-medium text-left">Amount</th>
                <th className="py-2.5 px-3 font-medium text-left">Type</th>
                <th className="py-2.5 px-3 font-medium text-left">Status</th>
                <th className="py-2.5 px-3 font-medium text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((tx, i) => (
                <motion.tr
                  key={tx._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                >
                  {/* User */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {tx.userId?.fullName || tx.fullName || "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {tx.userId?.email || tx.email || "—"}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {formatCurrency(tx.amount)}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3 text-slate-600 capitalize">
                    {tx.type || "—"}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <StatusBadge status={tx.status} />
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 text-xs text-slate-500">
                    {new Date(tx.createdAt).toUTCString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500 py-12">
          No recent transactions found
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const map = {
    success: {
      icon: <ArrowUpRight className="w-3.5 h-3.5" />,
      class:
        "bg-emerald-50 text-emerald-700 border border-emerald-200",
      label: "Success",
    },
    failed: {
      icon: <ArrowDownRight className="w-3.5 h-3.5" />,
      class: "bg-rose-50 text-rose-700 border border-rose-200",
      label: "Failed",
    },
    refunded: {
      icon: <ArrowDownRight className="w-3.5 h-3.5 rotate-45" />,
      class: "bg-amber-50 text-amber-700 border border-amber-200",
      label: "Refunded",
    },
  };

  const data = map[status] || {
    icon: null,
    class: "bg-slate-50 text-slate-600 border border-slate-200",
    label: status ? status : "Unknown",
  };

  return (
    <span
      className={`${data.class} flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit`}
    >
      {data.icon}
      {data.label}
    </span>
  );
}
