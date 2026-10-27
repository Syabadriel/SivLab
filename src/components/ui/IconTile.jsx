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

function IconTile({ Icon, tone = "indigo", t }) {
  const tones = {
    indigo: t.isDark ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-600",
    emerald: t.isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600",
    amber: t.isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-600",
    red: t.isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600",
    sky: t.isDark ? "bg-sky-500/15 text-sky-400" : "bg-sky-50 text-sky-600",
  };
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
      <Icon size={20} strokeWidth={2} />
    </div>
  );
}

export default IconTile;
