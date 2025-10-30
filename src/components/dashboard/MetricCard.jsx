"use client";

import { motion } from "framer-motion";

export default function MetricCard({ label, value, hint, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-slate-600">{label}</h4>
        {Icon && <Icon className="w-5 h-5 text-teal-500" />}
      </div>

      <div className={color ? `text-2xl font-semibold ${color}` : "text-2xl font-semibold"}>
        {typeof value === "number" || value ? value : "—"}
      </div>

      {hint && (
        <div className="text-xs text-slate-500 mt-1 font-medium">{hint}</div>
      )}
    </motion.div>
  );
}
