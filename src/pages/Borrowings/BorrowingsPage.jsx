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
import { STATUS_STYLE } from "../../constants/statusStyles";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import { dbService } from "../../lib/db";

function BorrowingsPage({ t, borrowings, setBorrowings, items, setItems, profiles, currentUser, addToast }) {
  const [detail, setDetail] = useState(null);
  const flow = ["Menunggu", "Disetujui", "Dipinjam", "Dikembalikan"];

  async function updateStatus(code, newStatus, itemCode) {
    const borrowing = borrowings.find((b) => b.code === code);
    if (!borrowing) return;
    try {
      // 1. Update borrowing record
      await dbService.updateBorrowing(borrowing.id, { status: newStatus });
      setBorrowings((prev) => prev.map((b) => (b.code === code ? { ...b, status: newStatus } : b)));

      // 2. Sync corresponding item status
      const it = items.find((i) => i.code === itemCode);
      if (it) {
        let nextItemStatus = it.status;
        if (newStatus === "Dikembalikan") {
          nextItemStatus = "Tersedia";
        } else if (newStatus === "Dipinjam") {
          nextItemStatus = "Dipinjam";
        }
        if (nextItemStatus !== it.status) {
          await dbService.updateItem(it.id, { status: nextItemStatus });
          setItems((prev) => prev.map((x) => (x.code === itemCode ? { ...x, status: nextItemStatus } : x)));
        }
      }

      addToast(`Peminjaman ${code} diperbarui menjadi ${newStatus}`);
    } catch (err) {
      console.error(err);
      addToast("Gagal memperbarui status peminjaman");
    }
    setDetail(null);
  }

  const [showAdd, setShowAdd] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  const isAdminOrSuper = currentUser?.role === "Admin Laboratorium" || currentUser?.role === "Super Admin";
  const availableItems = items.filter((i) => i.status === "Tersedia");

  async function handleAddBorrowing(e) {
    e.preventDefault();
    if (!selectedItemId || !borrowerName.trim() || !purpose.trim() || !borrowDate || !returnDate) return;
    setSubmitting(true);
    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newCode = `PJ-${randomDigits}`;

    try {
      const payload = {
        code: newCode,
        itemId: selectedItemId,
        borrowerName: borrowerName.trim(),
        purpose: purpose.trim(),
        borrowDate,
        returnDate,
        status: "Dipinjam",
      };

      // 1. Add borrowing
      const created = await dbService.addBorrowing(payload);

      // 2. Set item status to Dipinjam
      const updatedItem = await dbService.updateItem(selectedItemId, { status: "Dipinjam" });

      // 3. Update parent states
      setBorrowings((prev) => [created, ...prev]);
      setItems((prev) => prev.map((x) => (x.id === selectedItemId ? updatedItem : x)));

      addToast(`Peminjaman ${newCode} berhasil dibuat`);
      setShowAdd(false);
      setSelectedItemId("");
      setBorrowerName("");
      setPurpose("");
      setBorrowDate(new Date().toISOString().split("T")[0]);
      setReturnDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
    } catch (err) {
      console.error(err);
      addToast(`Gagal memuat peminjaman baru: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Peminjaman</h2>
          <p className={`text-sm mt-1 ${t.textMuted}`}>Kelola pengajuan, persetujuan, dan pengembalian barang.</p>
        </div>
        {isAdminOrSuper && (
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors">
            <Plus size={16} /> Tambah Peminjaman
          </button>
        )}
      </div>

      {borrowings.length === 0 ? (
        <EmptyState t={t} Icon={ArrowLeftRight} title="Belum ada peminjaman" desc="Pengajuan peminjaman barang akan muncul di sini." />
      ) : (
        <div className={`rounded-2xl overflow-hidden ${t.card}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={t.tableHead}>
                  <th className="px-4 py-3 text-left font-medium">Kode</th>
                  <th className="px-4 py-3 text-left font-medium">Barang</th>
                  <th className="px-4 py-3 text-left font-medium">Peminjam</th>
                  <th className="px-4 py-3 text-left font-medium">Tgl Pinjam</th>
                  <th className="px-4 py-3 text-left font-medium">Tgl Kembali</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${t.divide}`}>
                {borrowings.map((b) => {
                  const item = items.find((i) => i.id === b.itemId || i.code === b.itemCode);
                  return (
                    <tr key={b.code} className={`transition-colors ${t.rowHover}`}>
                      <td className={`px-4 py-3 font-mono text-xs ${t.textMuted}`}>{b.code}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setDetail(b)} className={`font-medium hover:text-indigo-600 text-left ${t.text}`}>{item?.name || b.itemName || b.itemCode}</button>
                      </td>
                      <td className={`px-4 py-3 ${t.textMuted}`}>{b.borrower}</td>
                      <td className={`px-4 py-3 ${t.textMuted}`}>{b.borrowDate}</td>
                      <td className={`px-4 py-3 ${t.textMuted}`}>{b.returnDate}</td>
                      <td className="px-4 py-3"><Badge label={b.status} style={STATUS_STYLE} t={t} /></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setDetail(b)} className={`text-xs font-medium text-indigo-600 hover:text-indigo-700`}>Detail</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${t.card}`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-semibold ${t.text}`}>Peminjaman {detail.code}</h3>
              <button onClick={() => setDetail(null)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.hover} ${t.textMuted}`}><X size={17} /></button>
            </div>
            <p className={`text-sm mb-5 ${t.textMuted}`}>{items.find((i) => i.id === detail.itemId || i.code === detail.itemCode)?.name || detail.itemName} · {detail.borrower}</p>

            <div className="flex items-center mb-6">
              {flow.map((s, i) => {
                const currentIdx = flow.indexOf(detail.status === "Terlambat" ? "Dipinjam" : detail.status === "Dibatalkan" ? "Dibatalkan" : detail.status);
                const active = i <= currentIdx;
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${active ? "bg-indigo-600 text-white" : t.isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                        {active ? <Check size={13} /> : i + 1}
                      </div>
                      <span className={`text-[10px] text-center leading-tight ${active ? t.text : t.textFaint}`}>{s}</span>
                    </div>
                    {i < flow.length - 1 && <div className={`flex-1 h-0.5 mb-4 ${i < currentIdx ? "bg-indigo-600" : t.isDark ? "bg-slate-800" : "bg-slate-200"}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <div className={`space-y-2 text-sm rounded-xl p-3.5 mb-5 ${t.isDark ? "bg-slate-800/50" : "bg-slate-50"}`}>
              <div className="flex justify-between gap-3"><span className={`shrink-0 ${t.textFaint}`}>Tujuan</span><span className={`font-medium text-right ${t.text}`}>{detail.purpose}</span></div>
              <div className="flex justify-between"><span className={t.textFaint}>Tanggal Pinjam</span><span className={`font-medium ${t.text}`}>{detail.borrowDate}</span></div>
              <div className="flex justify-between"><span className={t.textFaint}>Tanggal Kembali</span><span className={`font-medium ${t.text}`}>{detail.returnDate}</span></div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {detail.status === "Menunggu" && (
                <>
                  <button onClick={() => updateStatus(detail.code, "Dipinjam", detail.itemCode)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">Setujui</button>
                  <button onClick={() => updateStatus(detail.code, "Dibatalkan", detail.itemCode)} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border ${t.border} text-red-500 ${t.hover} transition-colors`}>Tolak</button>
                </>
              )}
              {(detail.status === "Dipinjam" || detail.status === "Terlambat") && (
                <button onClick={() => updateStatus(detail.code, "Dikembalikan", detail.itemCode)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">Tandai Dikembalikan</button>
              )}
              {detail.status === "Dikembalikan" && (
                <p className={`text-sm text-center flex-1 py-2 ${t.textMuted}`}>Peminjaman ini telah selesai.</p>
              )}
              {detail.status === "Dibatalkan" && (
                <p className={`text-sm text-center flex-1 py-2 text-rose-500`}>Peminjaman ini dibatalkan.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Borrowing Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadein_0.2s_ease-out]">
          <div className={`w-full max-w-md rounded-2xl border p-5 flex flex-col ${t.card}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`font-semibold text-base ${t.text}`}>Tambah Catatan Peminjaman</h3>
              <button type="button" onClick={() => setShowAdd(false)} className={`p-1 rounded-lg ${t.hover} ${t.textFaint}`}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddBorrowing} className="space-y-4 mt-4">
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Pilih Barang yang Tersedia</label>
                <select
                  required
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${t.input}`}
                >
                  <option value="">-- Pilih Barang --</option>
                  {availableItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} - {item.name}
                    </option>
                  ))}
                </select>
                {availableItems.length === 0 && (
                  <p className="text-xs text-rose-500 mt-1">Tidak ada unit barang berstatus "Tersedia" saat ini.</p>
                )}
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Nama Peminjam</label>
                <input
                  required
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Masukkan nama peminjam secara manual..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${t.input}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Tujuan Peminjaman</label>
                <input
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Contoh: Praktikum Pemrograman Web"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Tgl Peminjaman</label>
                  <input
                    required
                    type="date"
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold uppercase tracking-wide block mb-1.5 ${t.textMuted}`}>Tgl Pengembalian</label>
                  <input
                    required
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${t.input}`}
                  />
                </div>
              </div>
              <div className="flex gap-2.5 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className={`px-4 py-2 rounded-xl border text-sm font-medium ${t.border} ${t.text} ${t.hover} transition-colors`}>Batal</button>
                <button disabled={submitting || availableItems.length === 0} type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BorrowingsPage;
