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
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "../../lib/charts";
import * as Icons from "../../lib/icons";
import { CONDITIONS } from "../../constants/inventory";
import { CONDITION_STYLE } from "../../constants/statusStyles";
import { ACTIVITIES, MONTHLY_ADDITIONS } from "../../data/notifications";
import Badge from "../../components/ui/Badge";
import IconTile from "../../components/ui/IconTile";

function Dashboard({ t, items, borrowings, maintenance, categories = [], locations = [], setPage }) {
  const total = items.length;
  const byCondition = CONDITIONS.map((c) => ({ name: c, value: items.filter((i) => i.condition === c).length }));
  const baik = items.filter((i) => i.condition === "Baik").length;
  const perbaikan = items.filter((i) => i.condition === "Perlu Perbaikan").length;
  const rusak = items.filter((i) => i.condition === "Rusak").length;
  const dipinjam = items.filter((i) => i.status === "Dipinjam").length;
  const needsMaintenance = items.filter((i) => i.condition === "Perlu Perbaikan").length;

  const stats = [
    { label: "Total Barang", value: total, delta: "+0 bulan ini", tone: "indigo", Icon: Boxes, up: true },
    { label: "Barang Baik", value: baik, delta: `${total > 0 ? Math.round((baik / total) * 100) : 0}% dari total`, tone: "emerald", Icon: CheckCircle2, up: true },
    { label: "Perlu Perbaikan", value: perbaikan, delta: "+0 minggu ini", tone: "amber", Icon: AlertTriangle, up: false },
    { label: "Barang Rusak", value: rusak, delta: "-0 bulan ini", tone: "red", Icon: XCircle, up: true },
    { label: "Sedang Dipinjam", value: dipinjam, delta: `${borrowings.filter((b) => b.status === "Terlambat").length} terlambat`, tone: "sky", Icon: ArrowLeftRight, up: false },
  ];

  const COLORS = { Baik: "#10b981", "Perlu Perbaikan": "#f59e0b", Rusak: "#ef4444", Hilang: "#64748b" };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Selamat datang kembali, Admin</h2>
        <p className={`text-sm mt-1 ${t.textMuted}`}>Pantau kondisi dan inventaris Laboratorium Komputer secara real-time.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 transition-colors ${t.card} ${t.cardHover}`}>
            <div className="flex items-start justify-between">
              <IconTile Icon={s.Icon} tone={s.tone} t={t} />
            </div>
            <p className={`text-2xl font-semibold mt-3 tracking-tight ${t.text}`}>{s.value}</p>
            <p className={`text-xs mt-0.5 ${t.textMuted}`}>{s.label}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${s.up ? "text-emerald-600" : "text-amber-600"}`}>
              {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {needsMaintenance > 0 && (
        <button
          onClick={() => setPage("perawatan")}
          className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 border text-left transition-colors ${t.isDark ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15" : "bg-amber-50 border-amber-100 hover:bg-amber-100/70"
            }`}
        >
          <Wrench size={17} className="text-amber-600 shrink-0" />
          <span className="text-sm font-medium text-amber-700">
            {needsMaintenance} barang membutuhkan perawatan — kondisi "Perlu Perbaikan" belum dijadwalkan.
          </span>
          <ChevronRight size={16} className="text-amber-600 ml-auto shrink-0" />
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className={`lg:col-span-2 rounded-2xl p-5 ${t.card}`}>
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold text-sm ${t.text}`}>Grafik Kondisi Barang</h3>
          </div>
          <p className={`text-xs mb-2 ${t.textFaint}`}>Distribusi kondisi seluruh {total} barang</p>
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCondition} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} strokeWidth={0}>
                  {byCondition.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    background: t.isDark ? "#1e293b" : "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 12,
                    color: t.isDark ? "#e2e8f0" : "#0f172a",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-semibold ${t.text}`}>{total}</span>
              <span className={`text-xs ${t.textFaint}`}>Total Unit</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {byCondition.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[c.name] }} />
                <span className={t.textMuted}>{c.name}</span>
                <span className={`ml-auto font-medium ${t.text}`}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`lg:col-span-3 rounded-2xl p-5 ${t.card}`}>
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold text-sm ${t.text}`}>Grafik Inventaris</h3>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <TrendingUp size={13} /> Tren naik
            </span>
          </div>
          <p className={`text-xs mb-2 ${t.textFaint}`}>Barang baru ditambahkan per bulan</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: "Jan", jumlah: 0 },
                { month: "Feb", jumlah: 0 },
                { month: "Mar", jumlah: 0 },
                { month: "Apr", jumlah: 0 },
                { month: "Mei", jumlah: 0 },
                { month: "Jun", jumlah: 0 },
                { month: "Jul", jumlah: 0 },
                { month: "Agst", jumlah: 0 }
              ]} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.isDark ? "#64748b" : "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.isDark ? "#64748b" : "#94a3b8" }} width={28} />
                <RTooltip
                  cursor={{ fill: t.isDark ? "#1e293b" : "#f8fafc" }}
                  contentStyle={{ background: t.isDark ? "#1e293b" : "#fff", border: "none", borderRadius: 10, fontSize: 12, color: t.isDark ? "#e2e8f0" : "#0f172a" }}
                />
                <Bar dataKey="jumlah" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className={`lg:col-span-3 rounded-2xl overflow-hidden ${t.card}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
            <h3 className={`font-semibold text-sm ${t.text}`}>Barang Terbaru</h3>
            <button onClick={() => setPage("inventaris")} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              Lihat semua
            </button>
          </div>
          <div className={`divide-y ${t.divide}`}>
            {items.slice(-5).reverse().map((it) => (
              <div key={it.id} className={`flex items-center gap-3 px-5 py-3 transition-colors ${t.rowHover}`}>
                <IconTile Icon={(() => { const cat = categories.find((c) => c.id === it.categoryId); return cat ? (Icons[cat.icon] || Package) : Package; })()} tone="indigo" t={t} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${t.text}`}>{it.name}</p>
                  <p className={`text-xs truncate ${t.textFaint}`}>{it.code} · {locations.find((l) => l.id === it.locationId)?.name}</p>
                </div>
                <Badge label={it.condition} style={CONDITION_STYLE.hasOwnProperty ? CONDITION_STYLE : CONDITION_STYLE} t={t} dot />
              </div>
            ))}
          </div>
        </div>

        <div className={`lg:col-span-2 rounded-2xl overflow-hidden ${t.card}`}>
          <div className={`px-5 py-4 border-b ${t.border}`}>
            <h3 className={`font-semibold text-sm ${t.text}`}>Aktivitas Terbaru</h3>
          </div>
          <div className={`divide-y ${t.divide}`}>
            <div className={`px-5 py-8 text-center text-xs ${t.textMuted}`}>Tidak ada aktivitas terbaru</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
