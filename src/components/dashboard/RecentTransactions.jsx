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
      className="rounded-2xl border border-slate-200 shadow-sm bg-white p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800">
          Recent Transactions
        </h3>
        <span className="text-xs text-slate-500">
          {payments?.length || 0} records
        </span>
      </div>

      {/* Table */}
      {payments?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                <th className="py-2 px-2 text-left font-medium">User</th>
                <th className="py-2 px-2 text-left font-medium">Amount / Type</th>
                <th className="py-2 px-2 text-left font-medium">Status</th>
                <th className="py-2 px-2 text-left font-medium">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((tx, i) => (
                <motion.tr
                  key={tx._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  {/* User */}
                  <td className="py-2.5 px-2 whitespace-nowrap">
                    <div className="text-[13px] font-medium text-slate-800">
                      {tx.userId?.fullName || tx.fullName || "—"}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                      {tx.userId?.email || tx.email || "—"}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 px-2">
                    <div className="text-[13px] font-semibold text-slate-800">
                      {formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {tx.type || "—"}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-2">
                    <StatusBadge status={tx.status} />
                  </td>

                  {/* Date */}
                  <td className="py-2.5 px-2 text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(tx.createdAt).toUTCString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500 py-8">
          No recent transactions found
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const map = {
    success: {
      icon: <ArrowUpRight className="w-3 h-3" />,
      class: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      label: "Success",
    },
    failed: {
      icon: <ArrowDownRight className="w-3 h-3" />,
      class: "bg-rose-100 text-rose-700 border border-rose-200",
      label: "Failed",
    },
    refunded: {
      icon: <ArrowDownRight className="w-3 h-3 rotate-45" />,
      class: "bg-amber-100 text-amber-700 border border-amber-200",
      label: "Refunded",
    },
  };

  const data =
    map[status] || {
      icon: null,
      class: "bg-slate-100 text-slate-600 border border-slate-200",
      label: status || "Unknown",
    };

  return (
    <span
      className={`${data.class} flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium w-fit`}
    >
      {data.icon}
      {data.label}
    </span>
  );
}
