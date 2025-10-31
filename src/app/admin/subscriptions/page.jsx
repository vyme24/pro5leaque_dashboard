"use client";

import DataTable from "@/components/dashboard/DataTable";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function SubscriptionsPage() {
  const columns = [
    { key: "_id", label: "Subscription ID", render: (row) => (row._id) || "N/A"},
    {
      key: "userId",
      label: "User",
      render: (row) => row.userId?.email || "N/A",
    },
    { key: "status", label: "Status", render: (row) => (
        <StatusBadge status={row.status} />
    )},
    { key: "price", label: "Plan", render: (row) => row.plan || "N/A"},
   
    {
      key: "startDate",
      label: "Subscribe Date",
      render: (row) => new Date(row.startDate).toUTCString(),
    },
    {
      key: "nextBillingDate",
      label: "Next Billing",
      render: (row) =>
        row.nextBillingDate
          ? new Date(row.nextBillingDate).toUTCString()
          : "-",
    },
    {
      key: "lastPaymentDate",
      label: "last Payment Date",
      render: (row) =>
        row.lastPaymentDate ? new Date(row.lastPaymentDate).toUTCString() : "-",}
  ];

  return (
    <div className="p-6">
      <DataTable
        title="Subscriptions"
        fetchUrl="/api/admin/subscriptions"
        columns={columns}
      />
    </div>
  );
}


function StatusBadge({ status }) {
  const map = {
    active: {
      icon: <ArrowUpRight className="w-3 h-3" />,
      class: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      label: "Active",
    },
    inactive: {
      icon: <ArrowDownRight className="w-3 h-3" />,
      class: "bg-rose-100 text-rose-700 border border-rose-200",
      label: "Failed",
    },
    canceled: {
      icon: <ArrowDownRight className="w-3 h-3 rotate-45" />,
      class: "bg-amber-100 text-amber-700 border border-amber-200",
      label: "Canceled",
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