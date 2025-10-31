"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  UserGroupIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", icon: ChartBarIcon, path: "/admin/dashboard" },
    { name: "Users", icon: UserGroupIcon, path: "/admin/users" },
    { name: "Transactions", icon: CreditCardIcon, path: "/admin/transactions" },
    { name: "Subscriptions", icon: ClipboardDocumentListIcon, path: "/admin/subscriptions" },
  ];

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-50"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`hidden md:flex flex-col border-r border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 h-screen transition-all duration-300 ${
          expanded ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex items-center ${
            expanded ? "justify-start px-6 gap-2" : "justify-center"
          } py-5 border-b border-gray-100`}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-xl font-bold shadow-md">
            A
          </div>
          {expanded && <span className="text-lg font-semibold text-slate-800">Admin</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col py-6 space-y-1 relative">
          {navItems.map((item) => {
            const active = pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`group relative flex items-center ${
                  expanded ? "px-6 gap-3 justify-start" : "justify-center"
                } py-3 text-sm font-medium w-full transition-all`}
                title={item.name}
              >
                {/* Active Glow Background */}
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 "
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <item.icon
                  className={`w-5 h-5 relative z-10 ${
                    active
                      ? "text-cyan-600 drop-shadow-md"
                      : "text-slate-500 group-hover:text-slate-800"
                  }`}
                />
                {expanded && (
                  <span
                    className={`relative z-10 transition-colors ${
                      active
                        ? "text-slate-900 font-semibold"
                        : "text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <div
          className={`px-4 py-4 border-t border-gray-100 mt-auto flex items-center ${
            expanded ? "justify-between" : "justify-center"
          }`}
        >
          {expanded ? (
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Admin"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/20"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">Account</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          ) : (
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/20"
              title="Admin Profile"
            />
          )}

          {expanded ? (
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-600 transition"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          ) : (
            <ArrowRightOnRectangleIcon
              onClick={logout}
              className="w-6 h-6 text-slate-400 hover:text-red-600 cursor-pointer transition"
              title="Logout"
            />
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-md font-bold">
                    A
                  </div>
                  <span className="text-lg font-semibold text-slate-800">Admin</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col py-6 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.path)}
                      className={`relative flex items-center px-6 gap-3 py-3 text-sm font-medium w-full text-left transition-all ${
                        active
                          ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-cyan-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="Admin"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/20"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Vikas</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
                <ArrowRightOnRectangleIcon
                  onClick={logout}
                  className="w-5 h-5 text-slate-400 hover:text-red-600 cursor-pointer"
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
