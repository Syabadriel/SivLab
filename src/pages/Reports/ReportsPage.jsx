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
import { CATEGORY_DEFS } from "../../data/categories";
import { LOCATIONS } from "../../data/locations";
import { CONDITIONS } from "../../constants/inventory";
import IconTile from "../../components/ui/IconTile";

function ReportsPage({ t, items, borrowings, maintenance, addToast }) {
  const reportTypes = [
    { title: "Laporan Seluruh Inventaris", desc: `${items.length} barang tercatat`, Icon: Boxes },
    { title: "Laporan per Kategori", desc: `${CATEGORY_DEFS.length} kategori aktif`, Icon: Tags },
    { title: "Laporan per Kondisi", desc: "Baik, Perlu Perbaikan, Rusak, Hilang", Icon: ClipboardList },
    { title: "Laporan per Lokasi", desc: `${LOCATIONS.length} lokasi lab`, Icon: MapPin },
    { title: "Laporan Barang Rusak", desc: `${items.filter((i) => i.condition === "Rusak").length} barang rusak`, Icon: XCircle },
    { title: "Laporan Peminjaman", desc: `${borrowings.length} transaksi tercatat`, Icon: ArrowLeftRight },
    { title: "Laporan Maintenance", desc: `${maintenance.length} riwayat perawatan`, Icon: Wrench },
    { title: "Laporan Aset per Periode", desc: "Berdasarkan rentang tanggal", Icon: Calendar },
  ];
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-08-19");
  const [cat, setCat] = useState("all");
  const [loc, setLoc] = useState("all");
  const [cond, setCond] = useState("all");

  return (
    <div className="space-y-5">
      <div>
        <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Laporan</h2>
        <p className={`text-sm mt-1 ${t.textMuted}`}>Susun dan unduh laporan inventaris sesuai kebutuhan Anda.</p>
      </div>

      <div className={`rounded-2xl p-4 ${t.card}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-1.5 ${t.text}`}><SlidersHorizontal size={15} /> Filter Laporan</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className={`text-xs mb-1.5 block ${t.textFaint}`}>Tanggal Mulai</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`} />
          </div>
          <div>
            <label className={`text-xs mb-1.5 block ${t.textFaint}`}>Tanggal Akhir</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`} />
          </div>
          <div>
            <label className={`text-xs mb-1.5 block ${t.textFaint}`}>Kategori</label>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
              <option value="all">Semua</option>
              {CATEGORY_DEFS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={`text-xs mb-1.5 block ${t.textFaint}`}>Lokasi</label>
            <select value={loc} onChange={(e) => setLoc(e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
              <option value="all">Semua</option>
              {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className={`text-xs mb-1.5 block ${t.textFaint}`}>Kondisi</label>
            <select value={cond} onChange={(e) => setCond(e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
              <option value="all">Semua</option>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((r) => (
          <div key={r.title} className={`rounded-2xl p-4 flex flex-col ${t.card}`}>
            <IconTile Icon={r.Icon} t={t} />
            <p className={`font-semibold text-sm mt-3 ${t.text}`}>{r.title}</p>
            <p className={`text-xs mt-1 flex-1 ${t.textFaint}`}>{r.desc}</p>
            <div className="flex gap-1.5 mt-4">
              <button onClick={() => addToast("Laporan diekspor ke Excel")} className={`flex-1 text-xs font-medium px-2.5 py-2 rounded-lg border ${t.border} ${t.text} ${t.hover}`}>Excel</button>
              <button onClick={() => addToast("Laporan diekspor ke PDF")} className={`flex-1 text-xs font-medium px-2.5 py-2 rounded-lg border ${t.border} ${t.text} ${t.hover}`}>PDF</button>
              <button onClick={() => addToast("Menyiapkan laporan untuk dicetak")} className={`flex-1 text-xs font-medium px-2.5 py-2 rounded-lg border ${t.border} ${t.text} ${t.hover}`}>Print</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;
