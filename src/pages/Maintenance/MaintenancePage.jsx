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
import money from "../../utils/currency";

function MaintenancePage({ t, maintenance, setMaintenance, items, setItems, currentUser, addToast }) {
  const grouped = ["Terjadwal", "Sedang Dikerjakan", "Selesai", "Dibatalkan"];

  const [showAdd, setShowAdd] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [type, setType] = useState("");
  const [cost, setCost] = useState("0");
  const [mStatus, setMStatus] = useState("Terjadwal");
  const [technician, setTechnician] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  const isAdminOrSuper = currentUser?.role === "Admin Laboratorium" || currentUser?.role === "Super Admin";

  async function advance(code) {
    const m = maintenance.find((x) => x.code === code);
    if (!m) return;
    const next = m.status === "Terjadwal" ? "Sedang Dikerjakan" : m.status === "Sedang Dikerjakan" ? "Selesai" : m.status;
    try {
      await dbService.updateMaintenance(m.id, { status: next });
      setMaintenance((prev) => prev.map((x) => (x.code === code ? { ...x, status: next } : x)));

      if (next === "Selesai" && setItems) {
        const it = items.find((i) => i.id === m.itemId || i.code === m.itemCode);
        if (it) {
          await dbService.updateItem(it.id, { condition: "Baik" });
          setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, condition: "Baik" } : x)));
        }
      }
      addToast(`Perawatan ${code} diperbarui`);
    } catch (err) {
      console.error(err);
      addToast("Gagal memperbarui perawatan");
    }
  }

  async function handleAddMaintenance(e) {
    e.preventDefault();
    if (!selectedItemId || !type.trim() || !date || !mStatus) return;
    setSubmitting(true);

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newCode = `MT-${randomDigits}`;

    try {
      const payload = {
        code: newCode,
        itemId: selectedItemId,
        type: type.trim(),
        cost: parseInt(cost) || 0,
        date,
        status: mStatus,
        technician: technician.trim() || "Teknisi Lab",
      };

      // 1. Add maintenance log
      const created = await dbService.addMaintenance(payload);

      // 2. Unless newly added maintenance is "Selesai", update item condition to "Perlu Perbaikan"
      let updatedItem = null;
      if (mStatus !== "Selesai") {
        updatedItem = await dbService.updateItem(selectedItemId, { condition: "Perlu Perbaikan" });
      }

      // 3. Update parental state representation
      setMaintenance((prev) => [created, ...prev]);
      if (updatedItem && setItems) {
        setItems((prev) => prev.map((x) => (x.id === selectedItemId ? updatedItem : x)));
      }

      addToast(`Perawatan ${newCode} berhasil dijadwalkan`);
      setShowAdd(false);
      setSelectedItemId("");
      setType("");
      setCost("0");
      setMStatus("Terjadwal");
      setTechnician("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error(err);
      addToast(`Gagal menambahkan perawatan: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  const needsCount = items.filter((i) => i.condition === "Perlu Perbaikan").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Perawatan Barang</h2>
          <p className={`text-sm mt-1 ${t.textMuted}`}>Jadwalkan dan pantau proses perbaikan serta pemeliharaan rutin.</p>
        </div>
        {isAdminOrSuper && (
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors">
            <Plus size={16} /> Tambah Perawatan
          </button>
        )}
      </div>

      {needsCount > 0 && (
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${t.isDark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-100"}`}>
          <Wrench size={17} className="text-amber-600 shrink-0" />
          <span className="text-sm font-medium text-amber-700">{needsCount} barang membutuhkan perawatan</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {grouped.map((status) => (
          <div key={status} className={`rounded-2xl p-3 ${t.isDark ? "bg-slate-900/50" : "bg-slate-50"}`}>
            <div className="flex items-center justify-between px-1 mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wide ${t.textFaint}`}>{status}</span>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${t.isDark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500"}`}>
                {maintenance.filter((m) => m.status === status).length}
              </span>
            </div>
            <div className="space-y-2.5">
              {maintenance.filter((m) => m.status === status).map((m) => {
                const item = items.find((i) => i.id === m.itemId || i.code === m.itemCode);
                return (
                  <div key={m.code} className={`rounded-xl p-3.5 ${t.card}`}>
                    <p className={`text-xs font-mono ${t.textFaint}`}>{m.code}</p>
                    <p className={`text-sm font-medium mt-1 ${t.text}`}>{item?.name || m.itemName || m.itemCode}</p>
                    <p className={`text-xs mt-1 ${t.textMuted}`}>{m.type}</p>
                    <div className={`flex items-center justify-between text-xs mt-2.5 ${t.textFaint}`}>
                      <span>{m.technician}</span>
                      <span>{m.date}</span>
                    </div>
                    {m.cost > 0 && <p className={`text-xs mt-1 font-medium ${t.text}`}>{money(m.cost)}</p>}
                    {(status === "Terjadwal" || status === "Sedang Dikerjakan") && (
                      <button onClick={() => advance(m.code)} className="mt-3 w-full text-xs font-medium text-indigo-600 hover:text-indigo-700 border-t pt-2.5 flex items-center justify-center gap-1 border-slate-200 dark:border-slate-800">
                        {status === "Terjadwal" ? "Mulai Pengerjaan" : "Tandai Selesai"} <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
              {maintenance.filter((m) => m.status === status).length === 0 && (
                <p className={`text-xs text-center py-6 ${t.textFaint}`}>Tidak ada data</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Maintenance Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadein_0.2s_ease-out]">
          <div className={`w-full max-w-md rounded-2xl border p-5 flex flex-col ${t.card}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`font-semibold text-base ${t.text}`}>Tambah Tugas Perawatan</h3>
              <button type="button" onClick={() => setShowAdd(false)} className={`p-1 rounded-lg ${t.hover} ${t.textFaint}`}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddMaintenance} className="space-y-4 mt-4">
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Pilih Barang</label>
                <select
                  required
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${t.input}`}
                >
                  <option value="">-- Pilih Barang --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} - {item.name} ({item.condition})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Jenis / Deskripsi Perawatan</label>
                <input
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Contoh: Pembersihan Debu / Pergantian LCD"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Estimasi Biaya (Rp)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Status Awal</label>
                  <select
                    value={mStatus}
                    onChange={(e) => setMStatus(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${t.input}`}
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                    <option value="Selesai">Selesai (Baik)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Teknisi Penanggung Jawab</label>
                  <input
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    placeholder="Contoh: Rudi (Staff Lab)"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Tanggal Mulai</label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                  />
                </div>
              </div>
              <div className="flex gap-2.5 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className={`px-4 py-2 rounded-xl border text-sm font-medium ${t.border} ${t.text} ${t.hover} transition-colors`}>Batal</button>
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Jadwalkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenancePage;
