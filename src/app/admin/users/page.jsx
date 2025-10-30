"use client";
import DataTable from "@/components/dashboard/DataTable";

export default function UsersPage() {
  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", render: (row) =>  (
        <span className={row.status === "active" ? "text-green-500" : "text-red-500"}>{row.status}</span>
    )},
    { key: "role", label: "Role" },
    {
      key: "createdAt",
      label: "Joined",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6">
      <DataTable title="Users" fetchUrl="/api/admin/users" columns={columns} />
    </div>
  );
}
