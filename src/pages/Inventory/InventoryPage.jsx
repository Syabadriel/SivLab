import {
  LayoutDashboard, Package, Tags, MapPin, ArrowLeftRight, Wrench, FileBarChart2,
  Users, Settings, Search, Bell, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  Menu, X, Plus, Filter, Download, MoreVertical, Pencil, Trash2, Eye, Copy, ArrowUpRight,
  ArrowDownRight, CheckCircle2, AlertTriangle, XCircle, Clock, Sun, Moon, LogOut,
  Monitor, Server, Calendar, DollarSign, Upload, Image as ImageIcon, FileText,
  Building2, Boxes, TrendingUp, GraduationCap, Cpu, Cable, Printer, PanelLeftClose,
  PanelLeft, Mail, Lock, User, Loader2, Info, ShieldCheck, ClipboardList, History,
  SlidersHorizontal, Check,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import * as Icons from "../../lib/icons";
import { CONDITIONS, STATUSES } from "../../constants/inventory";
import { CONDITION_STYLE, STATUS_STYLE } from "../../constants/statusStyles";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import ItemDetail from "../../components/inventory/ItemDetail";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import IconTile from "../../components/ui/IconTile";

import { dbService } from "../../lib/db";

function InventoryPage({ t, items, setItems, categories = [], locations = [], currentUser, openAdd, addToast, onClone }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [page, setPageNum] = useState(1);
  const [selected, setSelected] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let list = items.filter((it) => {
      const matchQ = !q || `${it.name} ${it.code} ${it.serial}`.toLowerCase().includes(q.toLowerCase());
      const matchCat = category === "all" || it.categoryId === category;
      const matchCond = condition === "all" || it.condition === condition;
      const matchLoc = location === "all" || it.locationId === location;
      const matchStatus = status === "all" || it.status === status;
      return matchQ && matchCat && matchCond && matchLoc && matchStatus;
    });
    list = list.slice().sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "date") return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      if (sortKey === "price") return b.price - a.price;
      return 0;
    });
    return list;
  }, [items, q, category, condition, location, status, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPageNum(1); }, [q, category, condition, location, status]);

  function toggleSelect(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function toggleAll() {
    setSelected(selected.length === paged.length ? [] : paged.map((p) => p.id));
  }

  async function handleBorrow(item) {
    try {
      // 1. Update item status to Dipinjam in database
      await dbService.updateItem(item.id, { status: "Dipinjam" });

      // 2. Create borrowing record in database
      await dbService.addBorrowing({
        code: `PMJ-${Math.floor(1000 + Math.random() * 9000)}`,
        itemId: item.id,
        borrowerId: currentUser?.id || null,
        purpose: "Penggunaan laboratorium",
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "Dipinjam"
      });

      // 3. Update local items state
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "Dipinjam" } : it)));
      addToast(`${item.name} berhasil ditandai sebagai dipinjam`);
    } catch (err) {
      console.error(err);
      addToast("Gagal memproses peminjaman");
    }
    setDetailItem(null);
  }

  async function handleDeleteConfirmed() {
    try {
      await dbService.deleteItem(confirmDelete.id);
      setItems((prev) => prev.filter((it) => it.id !== confirmDelete.id));
      addToast(`${confirmDelete.name} dihapus dari inventaris`);
    } catch (err) {
      console.error(err);
      addToast("Gagal menghapus barang");
    }
    setConfirmDelete(null);
    setDetailItem(null);
  }

  async function bulkDelete() {
    try {
      await Promise.all(selected.map((id) => dbService.deleteItem(id)));
      setItems((prev) => prev.filter((it) => !selected.includes(it.id)));
      addToast(`${selected.length} barang dihapus dari inventaris`);
      setSelected([]);
    } catch (err) {
      console.error(err);
      addToast("Beberapa barang gagal dihapus");
    }
  }

  const hasFilters = category !== "all" || condition !== "all" || location !== "all" || status !== "all" || q;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Inventaris Barang</h2>
          <p className={`text-sm mt-1 ${t.textMuted}`}>Kelola seluruh aset dan perangkat Laboratorium Komputer.</p>
        </div>
        <button onClick={openAdd} className="sm:hidden inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl">
          <Plus size={16} /> Tambah Barang
        </button>
      </div>

      <div className={`rounded-2xl p-4 ${t.card}`}>
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.textFaint}`} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama, kode, atau serial number..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none transition-colors ${t.input}`}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
            <option value="all">Semua Kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className={`px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
            <option value="all">Semua Kondisi</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className={`px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
            <option value="all">Semua Lokasi</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
            <option value="all">Semua Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className={`px-3 py-2 rounded-xl border text-sm outline-none ${t.input}`}>
            <option value="name">Urutkan: Nama</option>
            <option value="date">Urutkan: Tanggal Masuk</option>
            <option value="price">Urutkan: Harga</option>
          </select>
          <button onClick={() => addToast("Data diekspor ke file Excel")} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${t.border} ${t.text} ${t.hover}`}>
            <Download size={15} /> Export
          </button>
          <button onClick={openAdd} className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl">
            <Plus size={16} /> Tambah Barang
          </button>
        </div>

        {selected.length > 0 && (
          <div className={`flex items-center gap-3 mt-3 pt-3 border-t text-sm ${t.border}`}>
            <span className={t.textMuted}>{selected.length} barang dipilih</span>
            <button onClick={bulkDelete} className="text-red-500 font-medium hover:text-red-600 inline-flex items-center gap-1.5">
              <Trash2 size={14} /> Hapus terpilih
            </button>
            <button onClick={() => setSelected([])} className={`ml-auto ${t.textFaint} hover:${t.text}`}>Batalkan</button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          t={t}
          title={hasFilters ? "Tidak ada barang yang cocok" : "Belum ada barang"}
          desc={hasFilters ? "Coba ubah kata kunci atau filter pencarian Anda." : "Tambahkan barang pertama untuk mulai mengelola inventaris laboratorium."}
          actionLabel={hasFilters ? undefined : "Tambah Barang"}
          onAction={openAdd}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className={`hidden md:block rounded-2xl overflow-hidden ${t.card}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={t.tableHead}>
                    <th className="px-4 py-3 text-left w-10">
                      <input type="checkbox" checked={selected.length === paged.length && paged.length > 0} onChange={toggleAll} className="w-4 h-4 rounded accent-indigo-600" />
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Kode</th>
                    <th className="px-4 py-3 text-left font-medium">Nama Barang</th>
                    <th className="px-4 py-3 text-left font-medium">Kategori</th>
                    <th className="px-4 py-3 text-left font-medium">Lokasi</th>
                    <th className="px-4 py-3 text-left font-medium">Kondisi</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Tgl Masuk</th>
                    <th className="px-4 py-3 text-left font-medium">Penanggung Jawab</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${t.divide}`}>
                  {paged.map((it) => (
                    <tr key={it.id} className={`transition-colors ${t.rowHover}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(it.id)} onChange={() => toggleSelect(it.id)} className="w-4 h-4 rounded accent-indigo-600" />
                      </td>
                      <td className={`px-4 py-3 font-mono text-xs ${t.textMuted}`}>{it.code}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setDetailItem(it)} className={`font-medium hover:text-indigo-600 text-left ${t.text}`}>{it.name}</button>
                      </td>
                      <td className={`px-4 py-3 ${t.textMuted}`}>{categories.find((c) => c.id === it.categoryId)?.name}</td>
                      <td className={`px-4 py-3 ${t.textMuted}`}>{locations.find((l) => l.id === it.locationId)?.name}</td>
                      <td className="px-4 py-3"><Badge label={it.condition} style={CONDITION_STYLE} t={t} dot /></td>
                      <td className="px-4 py-3"><Badge label={it.status} style={STATUS_STYLE} t={t} /></td>
                      <td className={`px-4 py-3 ${t.textMuted}`}>{it.purchaseDate}</td>
                      <td className={`px-4 py-3 ${t.textMuted}`}>{it.responsible}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setDetailItem(it)} title="Lihat Detail" className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} ${t.textMuted}`}><Eye size={15} /></button>
                          <button onClick={() => setDetailItem(it)} title="Edit" className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} ${t.textMuted}`}><Pencil size={15} /></button>
                          <button onClick={() => onClone && onClone(it)} title="Clone/Duplikat" className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} ${t.textMuted}`}><Copy size={15} /></button>
                          <button onClick={() => setConfirmDelete(it)} title="Hapus" className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} text-red-500`}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`flex items-center justify-between px-4 py-3 border-t text-sm ${t.border}`}>
              <span className={t.textFaint}>
                Menampilkan {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} dari {filtered.length} barang
              </span>
              <div className="flex items-center gap-1.5">
                <button disabled={page === 1} onClick={() => setPageNum((p) => p - 1)} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${t.hover} ${t.textMuted}`}>
                  <ChevronLeft size={15} />
                </button>
                <span className={`px-2 text-xs font-medium ${t.text}`}>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPageNum((p) => p + 1)} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${t.hover} ${t.textMuted}`}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paged.map((it) => (
              <button key={it.id} onClick={() => setDetailItem(it)} className={`w-full text-left rounded-2xl p-4 ${t.card}`}>
                <div className="flex items-start gap-3">
                  <IconTile Icon={(() => { const cat = categories.find((c) => c.id === it.categoryId); return cat ? (Icons[cat.icon] || Package) : Package; })()} t={t} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium text-sm truncate ${t.text}`}>{it.name}</p>
                    <p className={`text-xs mt-0.5 ${t.textFaint}`}>{it.code} · {locations.find((l) => l.id === it.locationId)?.name}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <Badge label={it.condition} style={CONDITION_STYLE} t={t} dot />
                      <Badge label={it.status} style={STATUS_STYLE} t={t} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <button disabled={page === 1} onClick={() => setPageNum((p) => p - 1)} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 border ${t.border} ${t.textMuted}`}>
                <ChevronLeft size={15} />
              </button>
              <span className={`px-2 text-xs font-medium ${t.text}`}>{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPageNum((p) => p + 1)} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 border ${t.border} ${t.textMuted}`}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}

      {detailItem && (
        <ItemDetail
          t={t}
          item={items.find((i) => i.id === detailItem.id) || detailItem}
          categories={categories}
          locations={locations}
          onClose={() => setDetailItem(null)}
          onBorrow={handleBorrow}
          onDelete={(it) => setConfirmDelete(it)}
          onClone={(it) => {
            setDetailItem(null);
            if (onClone) onClone(it);
          }}
        />
      )}

      <ConfirmDialog
        t={t}
        open={!!confirmDelete}
        title="Apakah Anda yakin ingin menghapus barang ini?"
        desc={`"${confirmDelete?.name}" akan dihapus permanen dari inventaris beserta seluruh riwayatnya. Tindakan ini tidak dapat dibatalkan.`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}

export default InventoryPage;
