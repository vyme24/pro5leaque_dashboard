"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDaysIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const ranges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7d" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "3m" },
  { label: "This Year", value: "year" },
];

export default function DateRangeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = ranges.find((r) => r.value === value) || ranges[2]; // default 7d

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-md bg-white hover:bg-slate-50 focus:outline-none"
      >
        <CalendarDaysIcon className="w-4 h-4 text-slate-500" />
        <span>{selected.label}</span>
        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 shadow-md rounded-md z-50"
          >
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  onChange?.(r.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                  r.value === value ? "bg-slate-50 font-medium text-slate-800" : "text-slate-600"
                }`}
              >
                {r.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
