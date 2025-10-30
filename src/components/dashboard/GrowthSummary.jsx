"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, CreditCard, Repeat } from "lucide-react";

export default function GrowthSummary({ growth }) {
  if (!growth) return null;

  const items = [
    {
      title: "Revenue Growth",
      value: `${growth.revenueGrowth}%`,
      icon: CreditCard,
      positive: growth.revenueGrowth >= 0,
      desc: "vs. previous period",
    },
    {
      title: "Subscription Growth",
      value: `${growth.subscriptionGrowth}%`,
      icon: Repeat,
      positive: growth.subscriptionGrowth >= 0,
      desc: "New subscriptions trend",
    },
    {
      title: "User Growth",
      value: `${growth.userGrowth}%`,
      icon: Users,
      positive: growth.userGrowth >= 0,
      desc: "New users joined",
    },
    {
      title: "Transaction Growth",
      value: `${growth.transactionGrowth}%`,
      icon: TrendingUp,
      positive: growth.transactionGrowth >= 0,
      desc: "Transaction activity",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isPositive = Number(item.value.replace("%", "")) >= 0;

        return (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.title}
              </div>
              <Icon className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-semibold ${
                  isPositive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {item.value}
              </span>
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              )}
            </div>
            <div className="text-xs text-neutral-500 mt-1">{item.desc}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
