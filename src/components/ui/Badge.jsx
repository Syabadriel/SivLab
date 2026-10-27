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
import { CONDITION_STYLE } from "../../constants/statusStyles";

function Badge({ label, style, t, dot }) {
  const s = style[label] || style.Tersedia;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        t.isDark ? `${s.bgDark} ${s.textDark}` : `${s.bg} ${s.text}`
      }`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${CONDITION_STYLE[label]?.dot || "bg-slate-400"}`} />}
      {label}
    </span>
  );
}

export default Badge;
