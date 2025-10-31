"use client";
import DataTable from "@/components/dashboard/DataTable";

export default function TransactionsPage() {
  const columns = [
    { key: "transactionId", label: "Txn ID" },
    { key: "subscriptionId", label: "Subscription ID", render: (row) => row.subscriptionId || "N/A"},
    { key: "userId.email", label: "User", render: (row) => row.userId?.email || "N/A"},
    { key: "amount", label: "Amount (€)" },
    { key: "status", label: "Status", render: (row) =>  (
        <span className={row.status === "success" ? "text-green-500" : "text-red-500"}>{row.status}</span>
    )},
    { key: "type", label: "Type", render: (row) =>  (
        <span className={row.type === "recurring" ? "text-blue-500" : "text-green-500"}>{row.type}</span>
    )},
    { key : "refundAmount", label : "Refund Amount (€)"},
    {
      key: "paymentDate",
      label: "Date",
      render: (row) => new Date(row.paymentDate).toUTCString(),
    },
  ];

  return (
    <div className="p-6">
      <DataTable title="Transactions" fetchUrl="/api/admin/transactions" columns={columns} />
    </div>
  );
}
