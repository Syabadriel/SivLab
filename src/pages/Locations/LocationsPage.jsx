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
import { CONDITIONS } from "../../constants/inventory";
import { CONDITION_STYLE } from "../../constants/statusStyles";
import IconTile from "../../components/ui/IconTile";
import { dbService } from "../../lib/db";

function LocationsPage({ t, items, locations = [], setLocations, currentUser, addToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSuperAdmin = currentUser?.role === "Super Admin";

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const newLoc = await dbService.addLocation(name.trim(), description.trim());
      setLocations((prev) => [...prev, newLoc]);
      addToast(`Lokasi "${name}" berhasil ditambahkan`);
      setName("");
      setDescription("");
      setShowAdd(false);
    } catch (err) {
      console.error(err);
      addToast("Gagal menambahkan lokasi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    if (!editTarget || !name.trim()) return;
    setSubmitting(true);
    try {
      const updated = await dbService.updateLocation(editTarget.id, {
        name: name.trim(),
        description: description.trim(),
      });
      setLocations((prev) => prev.map((l) => (l.id === editTarget.id ? updated : l)));
      addToast(`Lokasi "${name}" berhasil diperbarui`);
      setName("");
      setDescription("");
      setEditTarget(null);
    } catch (err) {
      console.error(err);
      addToast("Gagal memperbarui lokasi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await dbService.deleteLocation(deleteTarget.id);
      setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      addToast(`Lokasi "${deleteTarget.name}" dihapus`);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      addToast("Gagal menghapus lokasi");
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(loc) {
    setEditTarget(loc);
    setName(loc.name);
    setDescription(loc.description || loc.desc || "");
  }

  function openAdd() {
    setName("");
    setDescription("");
    setShowAdd(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Lokasi</h2>
          <p className={`text-sm mt-1 ${t.textMuted}`}>Sebaran barang di setiap ruang Laboratorium Komputer.</p>
        </div>
        {isSuperAdmin && (
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors">
            <Plus size={16} /> Tambah Lokasi
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => {
          const locItems = items.filter((i) => i.locationId === loc.id);
          const rusak = locItems.filter((i) => i.condition === "Rusak" || i.condition === "Perlu Perbaikan").length;
          return (
            <div key={loc.id} className={`rounded-2xl p-5 ${t.card} relative group`}>
              <div className="flex items-start justify-between">
                <IconTile Icon={Building2} t={t} />
                <div className="flex items-center gap-1.5">
                  {rusak > 0 && (
                    <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${t.isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"}`}>
                      {rusak} perlu perhatian
                    </span>
                  )}
                  {isSuperAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(loc)} className={`p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 ${t.hover} transition-colors`} title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteTarget(loc)} className={`p-1.5 rounded-lg text-slate-500 hover:text-red-600 ${t.hover} transition-colors`} title="Hapus">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className={`font-semibold mt-3 ${t.text}`}>{loc.name}</p>
              <p className={`text-xs mt-0.5 ${t.textFaint}`}>{loc.description || loc.desc}</p>
              <p className={`text-2xl font-semibold mt-3 tracking-tight ${t.text}`}>{locItems.length}</p>
              <p className={`text-xs ${t.textMuted}`}>Barang tercatat</p>

              <div className={`w-full h-2 rounded-full mt-4 overflow-hidden flex ${t.isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                {CONDITIONS.map((c) => {
                  const n = locItems.filter((i) => i.condition === c).length;
                  const pct = locItems.length ? (n / locItems.length) * 100 : 0;
                  return pct > 0 ? <div key={c} style={{ width: `${pct}%`, background: CONDITION_STYLE[c].ring }} /> : null;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadein_0.2s_ease-out]">
          <div className={`w-full max-w-md rounded-2xl border p-5 flex flex-col ${t.card}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`font-semibold text-base ${t.text}`}>Tambah Lokasi Baru</h3>
              <button onClick={() => setShowAdd(false)} className={`p-1 rounded-lg ${t.hover} ${t.textFaint}`}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Nama Ruang / Lokasi</label>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lab Komputer 1"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan tambahan..."
                  rows={3}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none resize-none ${t.input}`}
                />
              </div>
              <div className="flex gap-2.5 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className={`px-4 py-2 rounded-xl border text-sm font-medium ${t.border} ${t.text} ${t.hover} transition-colors`}>Batal</button>
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadein_0.2s_ease-out]">
          <div className={`w-full max-w-md rounded-2xl border p-5 flex flex-col ${t.card}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`font-semibold text-base ${t.text}`}>Edit Lokasi</h3>
              <button onClick={() => setEditTarget(null)} className={`p-1 rounded-lg ${t.hover} ${t.textFaint}`}><X size={16} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Nama Ruang / Lokasi</label>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lab Komputer 1"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan tambahan..."
                  rows={3}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none resize-none ${t.input}`}
                />
              </div>
              <div className="flex gap-2.5 justify-end pt-2">
                <button type="button" onClick={() => setEditTarget(null)} className={`px-4 py-2 rounded-xl border text-sm font-medium ${t.border} ${t.text} ${t.hover} transition-colors`}>Batal</button>
                <button disabled={submitting} type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Perbarui
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadein_0.2s_ease-out]">
          <div className={`w-full max-w-sm rounded-2xl border p-5 flex flex-col ${t.card}`}>
            <h3 className={`font-semibold text-base ${t.text}`}>Hapus Lokasi</h3>
            <p className={`text-sm mt-2 ${t.textMuted}`}>
              Apakah Anda yakin ingin menghapus lokasi <strong>{deleteTarget.name}</strong>?
            </p>
            {items.filter((i) => i.locationId === deleteTarget.id).length > 0 ? (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-red-500 flex gap-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <span>
                  Lokasi ini tidak dapat dihapus karena masih terdapat {items.filter((i) => i.locationId === deleteTarget.id).length} barang di dalamnya.
                </span>
              </div>
            ) : null}
            <div className="flex gap-2.5 justify-end mt-5">
              <button type="button" onClick={() => setDeleteTarget(null)} className={`px-4 py-2 rounded-xl border text-sm font-medium ${t.border} ${t.text} ${t.hover} transition-colors`}>Batal</button>
              <button
                disabled={submitting || items.filter((i) => i.locationId === deleteTarget.id).length > 0}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationsPage;
