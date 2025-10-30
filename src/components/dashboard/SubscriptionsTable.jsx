"use client";

import { motion } from "framer-motion";

export default function SubscriptionsTable({ subscriptions = [] }) {
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
          Latest Subscriptions
        </h3>
        <p className="text-sm text-slate-500">
          {subscriptions?.length || 0} records
        </p>
      </div>

      {/* Table */}
      {subscriptions && subscriptions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 text-left font-medium">User</th>
                <th className="py-2.5 px-3 text-left font-medium">Plan</th>
                 <th className="py-2.5 px-3 text-left font-medium">Status</th>
                <th className="py-2.5 px-3 text-left font-medium">Start</th>
                <th className="py-2.5 px-3 text-left font-medium">
                  Next Billing
                </th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((s, i) => {
                const user = s.userId || s.customer || {};
                return (
                  <motion.tr
                    key={s._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* User Info */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800">
                        {user.fullName || user.name || "—"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.email || "—"}
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-3 font-medium text-slate-800 capitalize">
                      {s.plan || "—"}
                     
                    
                    </td>

                  

                    {/* Status */}
                    <td className="py-3 px-3">
                      <StatusBadge status={s.status} />
                    </td>

                    {/* Start */}
                    <td className="py-3 px-3 text-xs text-slate-600">
                      {s.startDate
                        ? new Date(s.startDate).toUTCString()
                        : "—"}
                    </td>

                    {/* Next Billing */}
                    <td className="py-3 px-3 text-xs text-slate-600">
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
        <div className="text-center text-sm text-slate-500 py-12">
          No recent subscriptions found
        </div>
      )}
    </motion.div>
  );
}

/* ---- Status Badge ---- */
function StatusBadge({ status }) {
  const map = {
    active: {
      class:
        "bg-emerald-50 text-emerald-700 border border-emerald-200",
      label: "Active",
    },
    canceled: {
      class: "bg-rose-50 text-rose-700 border border-rose-200",
      label: "Canceled",
    },
    expired: {
      class: "bg-amber-50 text-amber-700 border border-amber-200",
      label: "Expired",
    },
    trialing: {
      class: "bg-blue-50 text-blue-700 border border-blue-200",
      label: "Trialing",
    },
  };

  const data =
    map[status] || {
      class: "bg-slate-50 text-slate-600 border border-slate-200",
      label: status || "Unknown",
    };

  return (
    <span
      className={`${data.class} px-2.5 py-1 rounded-full text-xs font-medium border w-fit`}
    >
      {data.label}
    </span>
  );
}
