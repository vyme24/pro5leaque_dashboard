"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
  RotateCcw,
  Search,
  ChevronDown,
} from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DataTable({ title, fetchUrl, columns }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState({ from: null, to: null });
  const [rangeLabel, setRangeLabel] = useState("All Time");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const presets = {
    Today: { from: startOfDay(new Date()), to: endOfDay(new Date()) },
    Yesterday: {
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    },
    "This Month": { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    "Last 3 Months": {
      from: startOfMonth(subMonths(new Date(), 2)),
      to: endOfMonth(new Date()),
    },
    "Last 6 Months": {
      from: startOfMonth(subMonths(new Date(), 5)),
      to: endOfMonth(new Date()),
    },
    "This Year": { from: startOfYear(new Date()), to: endOfYear(new Date()) },
    "All Time": { from: null, to: null },
  };

  useEffect(() => {
    loadData();
  }, [page, limit, search, date]);

  async function loadData() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        startDate: date.from ? date.from.toISOString() : "",
        endDate: date.to ? date.to.toISOString() : "",
      });
      const res = await fetch(`${fetchUrl}?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data.items);
        setTotal(json.data.total);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setDate({ from: null, to: null });
    setRangeLabel("All Time");
    setPage(1);
  }

  function selectPreset(label) {
    setDate(presets[label]);
    setRangeLabel(label);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 rounded-md pl-8 pr-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Date Preset */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/70 dark:bg-slate-800/70 text-sm font-medium flex items-center gap-1 h-8"
              >
                {rangeLabel}
                <ChevronDown className="w-4 h-4 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md">
              {Object.keys(presets).map((label) => (
                <button
                  key={label}
                  onClick={() => selectPreset(label)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition",
                    label === rangeLabel &&
                      "bg-gray-100 dark:bg-slate-800 font-medium"
                  )}
                >
                  {label}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Custom Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "text-left font-normal text-sm h-8 w-[220px] bg-white/70 dark:bg-slate-800/70",
                  !date.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd")} – {format(date.to, "LLL dd")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md"
              align="end"
            >
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>

          {/* Reset */}
          {(search || date.from || date.to) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={resetFilters}
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4 text-gray-500 dark:text-gray-300" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800/70 text-gray-700 dark:text-gray-300 border-b border-slate-200 dark:border-slate-800 text-xs uppercase">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-left p-3 font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-400">
                  No results found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row._id || i}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-gray-50/70 dark:hover:bg-slate-800/60 transition-all duration-150"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 text-slate-700 dark:text-slate-200">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-slate-600 dark:text-slate-400">
        <span>
          Showing{" "}
          <span className="font-medium">
            {Math.min((page - 1) * limit + 1, total)}–
            {Math.min(page * limit, total)}
          </span>{" "}
          of {total}
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 px-3 border-slate-200 dark:border-slate-700"
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
            className="h-8 px-3 border-slate-200 dark:border-slate-700"
          >
            Next
          </Button>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="h-8 border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 rounded-md px-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
