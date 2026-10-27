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
import * as Icons from "../../lib/icons";
import { CONDITION_STYLE, STATUS_STYLE } from "../../constants/statusStyles";
import Badge from "../ui/Badge";
import money from "../../utils/currency";

function ItemDetail({ t, item, categories = [], locations = [], onClose, onBorrow, onDelete }) {
  if (!item) return null;
  const cat = categories.find((c) => c.id === item.categoryId);
  const loc = locations.find((l) => l.id === item.locationId);
  const IconComponent = cat ? (Icons[cat.icon] || Icons.Package) : Icons.Package;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full sm:max-w-lg h-full overflow-y-auto shadow-2xl ${t.card}`}>
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b backdrop-blur ${t.border} ${t.card}`}>
          <h3 className={`font-semibold ${t.text}`}>Detail Barang</h3>
          <button onClick={onClose} className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} ${t.textMuted}`}>
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${t.isDark ? "bg-slate-800" : "bg-slate-100"}`}>
              {IconComponent && <IconComponent size={28} className={t.textFaint} />}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`font-semibold text-lg leading-tight ${t.text}`}>{item.name}</h4>
              <p className={`text-sm mt-0.5 ${t.textFaint}`}>{item.code}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge label={item.condition} style={CONDITION_STYLE} t={t} dot />
                <Badge label={item.status} style={STATUS_STYLE} t={t} />
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-4 rounded-2xl p-4 ${t.isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
            {[
              ["Kategori", cat?.name], ["Merk", item.brand], ["Model", item.model || "-"],
              ["Serial Number", item.serial], ["Lokasi", loc?.name], ["Penanggung Jawab", item.responsible],
              ["Harga Pembelian", money(item.price)], ["Tanggal Pembelian", item.purchaseDate],
              ["Garansi", item.warranty], ["No. Invoice", item.invoice],
            ].map(([label, val]) => (
              <div key={label}>
                <p className={`text-xs ${t.textFaint}`}>{label}</p>
                <p className={`text-sm font-medium mt-0.5 ${t.text}`}>{val}</p>
              </div>
            ))}
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textFaint}`}>Deskripsi</p>
            <p className={`text-sm leading-relaxed ${t.textMuted}`}>{item.description}</p>
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5 ${t.textFaint}`}>
              <History size={13} /> Riwayat Barang
            </p>
            <div className="space-y-4">
              {item.history.slice().reverse().map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                    {i < item.history.length - 1 && <div className={`w-px flex-1 mt-1 ${t.isDark ? "bg-slate-700" : "bg-slate-200"}`} />}
                  </div>
                  <div className="pb-4">
                    <p className={`text-xs ${t.textFaint}`}>{h.date}</p>
                    <p className={`text-sm mt-0.5 ${t.text}`}>{h.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`sticky bottom-0 flex gap-3 px-6 py-4 border-t backdrop-blur ${t.border} ${t.card}`}>
          <button
            onClick={() => onDelete(item)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 ${t.border} text-red-500 ${t.hover}`}
          >
            <Trash2 size={15} /> Hapus
          </button>
          <button
            disabled={item.status !== "Tersedia"}
            onClick={() => onBorrow(item)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            {item.status === "Tersedia" ? "Tandai Dipinjam" : "Tidak Tersedia untuk Dipinjam"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
