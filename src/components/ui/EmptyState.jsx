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

function EmptyState({ t, title, desc, actionLabel, onAction, Icon = Package }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed ${t.border}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${t.isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
        <Icon size={24} />
      </div>
      <p className={`font-semibold ${t.text}`}>{title}</p>
      <p className={`text-sm mt-1 max-w-sm ${t.textMuted}`}>{desc}</p>
      {actionLabel && (
        <button onClick={onAction} className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
