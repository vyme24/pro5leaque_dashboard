"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#ef4444", "#10b981"]; // red for failed, green for success

export default function RebillChart({ failed = 0, success = 0 }) {
  const data = [
    { name: "Failed", value: failed },
    { name: "Success", value: success },
  ];

  const total = failed + success || 1;
  const successRate = ((success / total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Rebill Summary</h3>
        <p className="text-sm text-slate-500">
          {failed} failed, {success} success
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}`, name]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-500">Success Rate</p>
        <p className="text-2xl font-bold text-emerald-600">{successRate}%</p>
      </div>

      <div className="flex justify-center gap-4 mt-3 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          Success
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
          Failed
        </span>
      </div>
    </motion.div>
  );
}
