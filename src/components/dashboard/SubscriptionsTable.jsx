"use client";

import { motion } from "framer-motion";

export default function SubscriptionsTable({ subscriptions = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800">
          Latest Subscriptions
        </h3>
        <span className="text-xs text-slate-500">
          {subscriptions?.length || 0} records
        </span>
      </div>

      {/* Table */}
      {subscriptions?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                <th className="py-2 px-2 text-left font-medium">User</th>
                <th className="py-2 px-2 text-left font-medium">Plan</th>
                <th className="py-2 px-2 text-left font-medium">Status</th>
                <th className="py-2 px-2 text-left font-medium">Start</th>
                <th className="py-2 px-2 text-left font-medium">Next Billing</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((s, i) => {
                const user = s.userId || s.customer || {};
                return (
                  <motion.tr
                    key={s._id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="text-[13px] font-medium text-slate-800">
                        {user.fullName || user.name || "—"}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {user.email || "—"}
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-2.5 px-2 text-[13px] font-semibold text-slate-800 capitalize">
                      {s.plan || "—"}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2">
                      <StatusBadge status={s.status} />
                    </td>

                    {/* Start */}
                    <td className="py-2.5 px-2 text-[11px] text-slate-500 whitespace-nowrap">
                      {s.startDate
                        ? new Date(s.startDate).toUTCString()
                        : "—"}
                    </td>

                    {/* Next Billing */}
                    <td className="py-2.5 px-2 text-[11px] text-slate-500 whitespace-nowrap">
                      {s.nextBillingDate
                        ? new Date(s.nextBillingDate).toUTCString()
                        : "—"}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500 py-8">
          No recent subscriptions found
        </div>
      )}
    </motion.div>
  );
}

/* ---- Compact Status Badge ---- */
function StatusBadge({ status }) {
  const map = {
    active: {
      class: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      label: "Active",
    },
    canceled: {
      class: "bg-rose-100 text-rose-700 border border-rose-200",
      label: "Canceled",
    },
    expired: {
      class: "bg-amber-100 text-amber-700 border border-amber-200",
      label: "Expired",
    },
    trialing: {
      class: "bg-blue-100 text-blue-700 border border-blue-200",
      label: "Trialing",
    },
  };

  const data =
    map[status] || {
      class: "bg-slate-100 text-slate-600 border border-slate-200",
      label: status || "Unknown",
    };

  return (
    <span
      className={`${data.class} px-2 py-0.5 rounded-full text-[11px] font-medium w-fit flex items-center gap-1`}
    >
      {data.label}
    </span>
  );
}
