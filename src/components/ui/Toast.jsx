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

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 items-end">
      {toasts.map((tst) => (
        <div
          key={tst.id}
          className="flex items-center gap-2.5 bg-slate-900 text-white text-sm font-medium pl-3 pr-4 py-3 rounded-xl shadow-2xl border border-slate-800 animate-[fadein_0.2s_ease-out]"
        >
          <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
          {tst.text}
        </div>
      ))}
    </div>
  );
}

export default Toast;
