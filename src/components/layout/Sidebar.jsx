import {
  LayoutDashboard, Package, Tags, MapPin, ArrowLeftRight, Wrench, FileBarChart2,
  Users, Settings, Search, Bell, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  Menu, X, Plus, Filter, Download, MoreVertical, Pencil, Trash2, Eye, ArrowUpRight,
  ArrowDownRight, CheckCircle2, AlertTriangle, XCircle, Clock, Sun, Moon, LogOut,
  Monitor, Server, Calendar, DollarSign, Upload, Image as ImageIcon, FileText,
  Building2, Boxes, TrendingUp, GraduationCap, Cpu, Cable, Printer, PanelLeftClose,
  PanelLeft, Mail, Lock, User, Loader2, Info, ShieldCheck, ClipboardList, History,
  SlidersHorizontal, Check,
} from "lucide-react";
import React from "react";
import { NAV } from "../../constants/navigation";

function Sidebar({ t, page, setPage, collapsed, setCollapsed, mobileOpen, setMobileOpen, currentUser }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 shrink-0 flex flex-col border-r transition-all duration-200 ${t.sidebarBg} ${t.border} ${
          collapsed ? "lg:w-[76px]" : "lg:w-64"
        } w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className={`h-16 flex items-center gap-2.5 px-4 border-b shrink-0 ${t.border} ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <Boxes size={16} />
          </div>
          {!collapsed && <span className={`font-semibold tracking-tight ${t.text}`}>LabInventory</span>}
          <button onClick={() => setMobileOpen(false)} className={`ml-auto lg:hidden ${t.textMuted}`}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setMobileOpen(false);
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
                  collapsed ? "lg:justify-center" : ""
                } ${
                  active
                    ? t.isDark
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-indigo-50 text-indigo-700"
                    : `${t.textMuted} ${t.hover}`
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </button>
            );
          })}
        </nav>

        <div className={`shrink-0 border-t p-3 ${t.border}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm mb-2 transition-colors ${t.textMuted} ${t.hover} ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
            {!collapsed && <span>Ciutkan</span>}
          </button>
          <div className={`flex items-center gap-2.5 px-1 py-1.5 ${collapsed ? "lg:justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
              {currentUser.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${t.text}`}>{currentUser.name}</p>
                <p className={`text-xs truncate ${t.textFaint}`}>{currentUser.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
