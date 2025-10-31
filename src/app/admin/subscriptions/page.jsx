"use client";

import DataTable from "@/components/dashboard/DataTable";

export default function SubscriptionsPage() {
  const columns = [
    { key: "_id", label: "Subscription ID" },
    {
      key: "userId",
      label: "User",
      render: (row) => row.userId?.email || "N/A",
    },
    { key: "status", label: "Status", render: (row) => (
        <span className={row.status === "active" ? "text-green-500" : "text-red-500"}>{row.status == "inactive" ? "Past Due" : row.status}</span>
    )},
    { key: "price", label: "Price (€)" },
   
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
