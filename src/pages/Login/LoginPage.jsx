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
import { dbService } from "../../lib/db";

function LoginPage({ t, isDark, setIsDark, onLogin }) {
  const [email, setEmail] = useState("ahmad.fauzan@labkom.ac.id");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const profile = await dbService.signIn(email, password);
      onLogin({
        name: profile.full_name,
        role: profile.role,
        email: profile.email,
        id: profile.id
      });
    } catch (err) {
      console.error(err);
      setError("Email atau kata sandi salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen w-full flex ${t.appBg}`}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 text-white flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Boxes size={18} />
          </div>
          <span className="font-semibold tracking-tight text-lg">LabInventory</span>
        </div>

        <div className="relative max-w-md">
          <div className="flex items-center gap-2 mb-6">
            {[Cpu, Monitor, Server, Cable].map((Icon, i) => (
              <div key={i} className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                <Icon size={17} className="text-indigo-300" />
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight">
            Satu sistem untuk seluruh inventaris laboratorium komputer.
          </h1>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            Catat, lacak, dan rawat setiap perangkat — dari unit komputer hingga kabel jaringan —
            dalam satu tampilan yang selalu mencerminkan kondisi lab yang sebenarnya.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-slate-500">
          <span>© 2026 LabInventory</span>
          <span>Politeknik &amp; Universitas Mitra</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-6">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${t.border} ${t.hover} ${t.textMuted}`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-16">
          <form onSubmit={submit} className="w-full max-w-sm">
            <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Boxes size={18} />
              </div>
              <span className={`font-semibold tracking-tight text-lg ${t.text}`}>LabInventory</span>
            </div>

            <h2 className={`text-2xl font-semibold tracking-tight ${t.text}`}>Selamat Datang Kembali</h2>
            <p className={`text-sm mt-2 ${t.textMuted}`}>Masuk untuk mengelola inventaris Laboratorium Komputer.</p>

            {error && (
              <div className="mt-5 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <AlertTriangle size={15} className="shrink-0" /> {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${t.textMuted}`}>Email</label>
                <div className="relative">
                  <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textFaint}`} />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="nama@labkom.ac.id"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${t.input}`}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-medium ${t.textMuted}`}>Kata Sandi</label>
                  <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textFaint}`} />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Masukkan kata sandi"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${t.input}`}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="w-4 h-4 rounded accent-indigo-600" />
                <span className={`text-sm ${t.textMuted}`}>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <button
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Memeriksa akun..." : "Masuk"}
            </button>

            <p className={`text-xs text-center mt-6 ${t.textFaint}`}>
              Gunakan kredensial demo yang sudah terisi, lalu klik Masuk.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
