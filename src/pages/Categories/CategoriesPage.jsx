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
import * as Icons from "../../lib/icons";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import IconTile from "../../components/ui/IconTile";

function CategoriesPage({ t, items, categories, onAddCategory, onDeleteCategory, addToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function addCategory(e) {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await onAddCategory(newCat.trim());
      setNewCat("");
      setShowAdd(false);
    } catch (err) {
      console.error(err);
      addToast("Gagal menambahkan kategori");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Kategori</h2>
          <p className={`text-sm mt-1 ${t.textMuted}`}>Kelompokkan barang berdasarkan jenis untuk mempermudah pencarian.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl">
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addCategory} className={`flex gap-2 rounded-2xl p-3 ${t.card}`}>
          <input
            autoFocus
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Nama kategori baru..."
            className={`flex-1 px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
          />
          <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Simpan</button>
          <button type="button" onClick={() => setShowAdd(false)} className={`px-4 py-2 rounded-xl border text-sm font-medium ${t.border} ${t.text} ${t.hover}`}>Batal</button>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => {
          const count = items.filter((i) => i.categoryId === c.id).length;
          const IconComponent = Icons[c.icon] || Icons.Tags;
          return (
            <div key={c.id} className={`rounded-2xl p-4 group transition-colors ${t.card} ${t.cardHover}`}>
              <div className="flex items-start justify-between">
                <IconTile Icon={IconComponent} t={t} />
                <div className="relative">
                  <button onClick={() => setDeleteTarget(c)} className={`w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${t.hover} text-red-500`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className={`font-semibold mt-3 ${t.text}`}>{c.name}</p>
              <p className={`text-sm mt-0.5 ${t.textMuted}`}>{count} Barang</p>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        t={t}
        open={!!deleteTarget}
        title="Hapus kategori ini?"
        desc={`Kategori "${deleteTarget?.name}" akan dihapus. Barang yang sudah tercatat di kategori ini tidak akan terhapus, tetapi perlu dikategorikan ulang.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await onDeleteCategory(deleteTarget.id);
            setDeleteTarget(null);
          } catch (err) {
            console.error(err);
            addToast("Gagal menghapus kategori");
          }
        }}
      />
    </div>
  );
}

export default CategoriesPage;
