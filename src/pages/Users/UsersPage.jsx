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
import { STATUS_STYLE } from "../../constants/statusStyles";
import Badge from "../../components/ui/Badge";

function UsersPage({ t, profiles = [], addToast }) {
  const ROLE_COLOR = {
    "Super Admin": "indigo",
    "Admin": "indigo",
    "Admin Laboratorium": "indigo",
    "Teknisi": "amber",
    "Operator": "emerald",
    "Viewer": "slate",
    "User": "slate",
    "Member": "slate",
  };

  const usersList = profiles.map((p) => ({
    id: p.id,
    name: p.fullName || p.full_name || p.full_name || "Tanpa Nama",
    email: p.email || "-",
    role: p.role || "Viewer",
    status: p.status || "Aktif",
    lastLogin: p.lastLogin || p.last_login || "-",
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Pengguna</h2>
          <p className={`text-sm mt-1 ${t.textMuted}`}>Kelola akses pengguna dengan role-based permission.</p>
        </div>
        <button onClick={() => addToast("Undangan pengguna baru dikirim")} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl">
          <Plus size={16} /> Undang Pengguna
        </button>
      </div>

      <div className={`rounded-2xl overflow-hidden ${t.card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={t.tableHead}>
                <th className="px-4 py-3 text-left font-medium">Nama</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Login Terakhir</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divide}`}>
              {usersList.map((u) => {
                const colorTone = ROLE_COLOR[u.role] || "slate";
                return (
                  <tr key={u.id} className={`transition-colors ${t.rowHover}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                          {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <span className={`font-medium ${t.text}`}>{u.name}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${t.textMuted}`}>{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${t.isDark ? `bg-${colorTone}-500/10 text-${colorTone}-400` : `bg-${colorTone}-50 text-${colorTone}-700`}`}>
                        <ShieldCheck size={11} /> {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge label={u.status} style={STATUS_STYLE} t={t} /></td>
                    <td className={`px-4 py-3 ${t.textMuted}`}>{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => addToast(`Mengedit ${u.name}`)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} ${t.textMuted}`}><Pencil size={15} /></button>
                        <button onClick={() => addToast(`${u.name} dihapus dari daftar pengguna`)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} text-red-500`}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
