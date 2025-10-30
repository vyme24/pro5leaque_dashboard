"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, ChevronDown, RotateCcw } from "lucide-react";
import { format } from "date-fns";

const ranges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "month" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "This Year", value: "year" },
  //{ label: "Custom Range", value: "custom" },
];

export default function DashboardHeader({ range, setRange, onRefresh }) {
  const [active, setActive] = useState(typeof range === "string" ? range : "custom");
  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateRange, setDateRange] = useState(
    typeof range === "object"
      ? range
      : { from: new Date(), to: new Date() }
  );

  useEffect(() => {
    if (typeof range === "object") {
      setActive("custom");
      setDateRange(range);
    } else {
      setActive(range);
    }
  }, [range]);

  const handleRangeSelect = (value) => {
    setActive(value);
    if (value === "custom") {
      setOpenCalendar(true);
    } else {
      setRange(value);
    }
  };

  const handleDateSelect = (selected) => {
    if (!selected?.from) return;
    setDateRange(selected);
    if (selected.from && selected.to) {
      setOpenCalendar(false);
      setActive("custom");
      setRange(selected); // 👈 Send custom date range to parent
    }
  };

  const formatRange = (range) => {
    if (!range?.from || !range?.to) return "";
    const sameDay = range.from.toDateString() === range.to.toDateString();
    return sameDay
      ? format(range.from, "MMM d, yyyy")
      : `${format(range.from, "MMM d")} → ${format(range.to, "MMM d, yyyy")}`;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
    >
      {/* Left side */}
      <div className="mb-4 md:mb-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-cyan-600" />
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Dashboard Overview
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Monitor user activity, payments, and subscriptions
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full flex items-center gap-2 text-slate-700 dark:text-slate-300"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="truncate">
                {active === "custom"
                  ? formatRange(dateRange)
                  : ranges.find((r) => r.value === active)?.label}
              </span>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {ranges.map((r) => (
              <DropdownMenuItem
                key={r.value}
                onClick={() => handleRangeSelect(r.value)}
                className={`cursor-pointer text-sm ${
                  active === r.value
                    ? "bg-cyan-600 text-white"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {r.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-slate-500 italic pointer-events-none">
              Quick ranges
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverContent align="end" className="p-2 w-auto">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRefresh?.()}
          className="rounded-full text-slate-500 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </motion.header>
  );
}
