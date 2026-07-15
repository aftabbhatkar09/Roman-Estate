"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Users,
  Menu,
  X,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import type { Role } from "@/lib/session";

const baseItems = [
  { name: "Dashboard",   href: "/admin",             icon: LayoutDashboard },
  { name: "Properties",  href: "/admin/properties",  icon: Home },
  { name: "Blogs",       href: "/admin/blogs",        icon: FileText },
  { name: "Partners",    href: "/admin/partners",     icon: Users },
  { name: "Inquiries",   href: "/admin/inquiries",    icon: MessageSquare },
  { name: "Settings",    href: "/admin/settings",     icon: Settings },
];

const superAdminItems = [
  { name: "Users", href: "/admin/users", icon: UserCog },
];

function SidebarContent({
  pathname,
  role,
  email,
  onLogout,
  loggingOut,
  onClose,
}: {
  pathname: string;
  role: Role;
  email: string;
  onLogout: () => void;
  loggingOut: boolean;
  onClose?: () => void;
}) {
  const navItems = role === "super_admin"
    ? [...baseItems, ...superAdminItems]
    : baseItems;

  return (
    <>
      <div className="p-6 border-b border-gray-100 shrink-0">
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-black tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Roman<span className="text-[#6366f1]">.</span>
          </span>
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.25em] uppercase mt-0.5">
            Admin Panel
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
          role === "super_admin"
            ? "bg-indigo-50 text-indigo-700"
            : "bg-cyan-50 text-cyan-700"
        }`}>
          {role === "super_admin"
            ? <ShieldCheck className="w-3.5 h-3.5" />
            : <Users className="w-3.5 h-3.5" />
          }
          {role === "super_admin" ? "Super Admin" : "Admin"}
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 shrink-0 space-y-1">
        <div className="px-4 py-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
          <p className="text-sm font-semibold text-gray-700 truncate">{email}</p>
        </div>
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </>
  );
}

export default function AdminLayoutClient({
  children,
  role,
  email,
}: {
  children: React.ReactNode;
  role: Role;
  email: string;
}) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch {
      setLoggingOut(false);
    }
  };

  const currentPage =
    [...baseItems, ...superAdminItems].find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href)
    )?.name ?? "Admin";

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
        <SidebarContent
          pathname={pathname}
          role={role}
          email={email}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              pathname={pathname}
              role={role}
              email={email}
              onLogout={handleLogout}
              loggingOut={loggingOut}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-gray-900">{currentPage}</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                {role === "super_admin" ? "Super Admin" : "Administrator"}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                {email.charAt(0).toUpperCase()}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-11 z-20 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{email}</p>
                    <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      role === "super_admin"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-cyan-50 text-cyan-700"
                    }`}>
                      {role === "super_admin" ? "Super Admin" : "Admin"}
                    </span>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {loggingOut ? "Signing out…" : "Sign Out"}
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
