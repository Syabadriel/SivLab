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
import React, { useState } from "react";

function Topbar({ t, isDark, setIsDark, title, subtitle, setMobileOpen, notifications, setNotifOpen, notifOpen, onSearch, currentUser, onLogout, primaryAction }) {
  const [userMenu, setUserMenu] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;
  const toneIcon = { danger: AlertTriangle, warning: Clock, info: Info, success: CheckCircle2 };
  const toneColor = { danger: "text-red-500", warning: "text-amber-500", info: "text-sky-500", success: "text-emerald-500" };

  return (
    <header className={`sticky top-0 z-30 h-16 flex items-center gap-3 px-4 lg:px-6 border-b backdrop-blur ${t.topbarBg} ${t.border}`}>
      <button onClick={() => setMobileOpen(true)} className={`lg:hidden ${t.textMuted}`}>
        <Menu size={20} />
      </button>

      <div className="min-w-0 mr-2 hidden sm:block">
        <h1 className={`font-semibold leading-tight truncate ${t.text}`}>{title}</h1>
        {subtitle && <p className={`text-xs truncate ${t.textFaint}`}>{subtitle}</p>}
      </div>

      <div className="flex-1 flex justify-center px-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textFaint}`} />
          <input
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari barang, kode, serial number, peminjam..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none transition-colors ${t.input}`}
          />
        </div>
      </div>

      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors shrink-0"
        >
          <Plus size={16} /> {primaryAction.label}
        </button>
      )}

      <button
        onClick={() => setIsDark(!isDark)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${t.border} ${t.hover} ${t.textMuted}`}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative shrink-0">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border relative transition-colors ${t.border} ${t.hover} ${t.textMuted}`}
        >
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border overflow-hidden ${t.card}`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${t.border}`}>
              <span className={`font-semibold text-sm ${t.text}`}>Notifikasi</span>
              <span className={`text-xs ${t.textFaint}`}>{unread} belum dibaca</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = toneIcon[n.tone];
                return (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 border-b last:border-0 ${t.border} ${n.unread ? (t.isDark ? "bg-indigo-500/5" : "bg-indigo-50/50") : ""}`}>
                    <Icon size={16} className={`mt-0.5 shrink-0 ${toneColor[n.tone]}`} />
                    <div className="min-w-0">
                      <p className={`text-sm leading-snug ${t.text}`}>{n.text}</p>
                      <p className={`text-xs mt-1 ${t.textFaint}`}>{n.time}</p>
                    </div>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 ml-auto shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="relative shrink-0">
        <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
            {currentUser.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <ChevronDown size={14} className={`hidden sm:block ${t.textFaint}`} />
        </button>
        {userMenu && (
          <div className={`absolute right-0 mt-2 w-52 rounded-xl shadow-2xl border overflow-hidden ${t.card}`}>
            <div className={`px-3.5 py-3 border-b ${t.border}`}>
              <p className={`text-sm font-medium truncate ${t.text}`}>{currentUser.name}</p>
              <p className={`text-xs truncate ${t.textFaint}`}>{currentUser.role}</p>
            </div>
            <button onClick={onLogout} className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-red-500 ${t.hover}`}>
              <LogOut size={15} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
