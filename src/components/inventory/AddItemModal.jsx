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
import React, { useState, useEffect } from "react";
import { CONDITIONS, STATUSES } from "../../constants/inventory";

function AddItemModal({ t, open, onClose, onSave, categories = [], locations = [], profiles = [] }) {
  const empty = {
    name: "", code: "", categoryId: categories[0]?.id || "", brand: "", model: "", serial: "",
    locationId: locations[0]?.id || "", condition: "Baik", status: "Tersedia", responsibleId: profiles[0]?.id || "",
    purchaseDate: "", price: "", supplier: "", invoice: "", warranty: "", description: "",
  };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({
        ...empty,
        categoryId: categories[0]?.id || "",
        locationId: locations[0]?.id || "",
        responsibleId: profiles[0]?.id || "",
      });
      setErrors({});
    }
    // eslint-disable-next-line
  }, [open, categories, locations, profiles]);

  if (!open) return null;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = "Nama barang wajib diisi";
    if (!form.code) errs.code = "Kode barang wajib diisi";
    if (!form.purchaseDate) errs.purchaseDate = "Tanggal pembelian wajib diisi";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({
      ...form,
      price: Number(form.price) || 0,
      history: [{ date: form.purchaseDate || "2026-08-19", text: "Barang dicatat masuk ke inventaris" }],
      description: form.description || "Belum ada deskripsi tambahan.",
    });
  }

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className={`text-xs font-medium mb-1.5 block ${t.textMuted}`}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${t.input} ${errors[key] ? "border-red-400" : ""}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  const select = (label, key, options) => (
    <div>
      <label className={`text-xs font-medium mb-1.5 block ${t.textMuted}`}>{label}</label>
      <select value={form[key]} onChange={set(key)} className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${t.input}`}>
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start lg:items-center justify-center p-0 lg:p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className={`relative w-full lg:max-w-2xl lg:rounded-2xl shadow-2xl h-full lg:h-auto lg:max-h-[90vh] overflow-y-auto ${t.card}`}>
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b backdrop-blur ${t.border} ${t.card}`}>
          <div>
            <h3 className={`font-semibold ${t.text}`}>Tambah Barang</h3>
            <p className={`text-xs mt-0.5 ${t.textFaint}`}>Lengkapi informasi barang baru ke dalam inventaris.</p>
          </div>
          <button type="button" onClick={onClose} className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} ${t.textMuted}`}>
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-7">
          <section>
            <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${t.textFaint}`}>Informasi Dasar</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field("Nama Barang", "name", "text", "cth. Dell OptiPlex 7090")}
              {field("Kode Barang", "code", "text", "cth. PC-LAB-036")}
              {select("Kategori", "categoryId", categories.map((c) => ({ value: c.id, label: c.name })))}
              {field("Merk", "brand", "text", "cth. Dell")}
              {field("Model", "model", "text", "cth. OptiPlex 7090")}
              {field("Serial Number", "serial", "text", "cth. SN-2026-0456")}
            </div>
          </section>

          <section>
            <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${t.textFaint}`}>Informasi Inventaris</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {select("Lokasi", "locationId", locations.map((l) => ({ value: l.id, label: l.name })))}
              {select("Kondisi", "condition", CONDITIONS)}
              {select("Status", "status", STATUSES)}
              {select("Penanggung Jawab", "responsibleId", profiles.map((p) => ({ value: p.id, label: p.full_name })))}
            </div>
          </section>

          <section>
            <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${t.textFaint}`}>Informasi Pembelian</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field("Tanggal Pembelian", "purchaseDate", "date")}
              {field("Harga Pembelian (Rp)", "price", "number", "cth. 9800000")}
              {field("Supplier", "supplier", "text", "cth. Dell Indonesia")}
              {field("Nomor Invoice", "invoice", "text", "cth. INV/2026/0456")}
              {field("Masa Garansi", "warranty", "text", "cth. 2 Tahun")}
            </div>
          </section>

          <section>
            <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${t.textFaint}`}>Dokumentasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`rounded-xl border border-dashed flex flex-col items-center justify-center py-6 text-center ${t.border}`}>
                <ImageIcon size={20} className={t.textFaint} />
                <p className={`text-xs mt-2 ${t.textMuted}`}>Unggah foto barang</p>
              </div>
              <div className={`rounded-xl border border-dashed flex flex-col items-center justify-center py-6 text-center ${t.border}`}>
                <Upload size={20} className={t.textFaint} />
                <p className={`text-xs mt-2 ${t.textMuted}`}>Unggah dokumen / invoice</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${t.textFaint}`}>Deskripsi</h4>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Catatan tambahan tentang barang ini..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors ${t.input}`}
            />
          </section>
        </div>

        <div className={`sticky bottom-0 flex gap-3 px-6 py-4 border-t backdrop-blur ${t.border} ${t.card}`}>
          <button type="button" onClick={onClose} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${t.border} ${t.text} ${t.hover}`}>
            Batal
          </button>
          <button className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
            Simpan Barang
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItemModal;
