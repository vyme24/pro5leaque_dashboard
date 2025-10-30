import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {

 
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-1 overflow-y-auto">{children}</main>
    </div>
  );
}
