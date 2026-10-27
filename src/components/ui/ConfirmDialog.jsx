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

function ConfirmDialog({ t, open, title, desc, onCancel, onConfirm, confirmLabel = "Hapus", danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative w-full max-w-sm rounded-2xl p-6 shadow-2xl ${t.card}`}>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${danger ? (t.isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600") : (t.isDark ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-600")}`}>
          <AlertTriangle size={20} />
        </div>
        <h3 className={`font-semibold text-lg ${t.text}`}>{title}</h3>
        <p className={`text-sm mt-2 ${t.textMuted}`}>{desc}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${t.border} ${t.text} ${t.hover}`}>
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${danger ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
