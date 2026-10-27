const CONDITION_STYLE = {
  Baik: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", bgDark: "bg-emerald-500/10", textDark: "text-emerald-400", ring: "#10b981" },
  "Perlu Perbaikan": { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", bgDark: "bg-amber-500/10", textDark: "text-amber-400", ring: "#f59e0b" },
  Rusak: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50", bgDark: "bg-red-500/10", textDark: "text-red-400", ring: "#ef4444" },
  Hilang: { dot: "bg-slate-500", text: "text-slate-700", bg: "bg-slate-100", bgDark: "bg-slate-500/10", textDark: "text-slate-400", ring: "#64748b" },
};

const STATUS_STYLE = {
  Tersedia: { text: "text-emerald-700", bg: "bg-emerald-50", bgDark: "bg-emerald-500/10", textDark: "text-emerald-400" },
  Digunakan: { text: "text-indigo-700", bg: "bg-indigo-50", bgDark: "bg-indigo-500/10", textDark: "text-indigo-400" },
  Dipinjam: { text: "text-sky-700", bg: "bg-sky-50", bgDark: "bg-sky-500/10", textDark: "text-sky-400" },
  "Tidak Digunakan": { text: "text-slate-600", bg: "bg-slate-100", bgDark: "bg-slate-500/10", textDark: "text-slate-400" },
  Menunggu: { text: "text-amber-700", bg: "bg-amber-50", bgDark: "bg-amber-500/10", textDark: "text-amber-400" },
  Dikembalikan: { text: "text-emerald-700", bg: "bg-emerald-50", bgDark: "bg-emerald-500/10", textDark: "text-emerald-400" },
  Terlambat: { text: "text-red-700", bg: "bg-red-50", bgDark: "bg-red-500/10", textDark: "text-red-400" },
  Terjadwal: { text: "text-amber-700", bg: "bg-amber-50", bgDark: "bg-amber-500/10", textDark: "text-amber-400" },
  "Sedang Dikerjakan": { text: "text-sky-700", bg: "bg-sky-50", bgDark: "bg-sky-500/10", textDark: "text-sky-400" },
  Selesai: { text: "text-emerald-700", bg: "bg-emerald-50", bgDark: "bg-emerald-500/10", textDark: "text-emerald-400" },
  Dibatalkan: { text: "text-slate-600", bg: "bg-slate-100", bgDark: "bg-slate-500/10", textDark: "text-slate-400" },
  Aktif: { text: "text-emerald-700", bg: "bg-emerald-50", bgDark: "bg-emerald-500/10", textDark: "text-emerald-400" },
  Nonaktif: { text: "text-slate-600", bg: "bg-slate-100", bgDark: "bg-slate-500/10", textDark: "text-slate-400" },
};

export { CONDITION_STYLE, STATUS_STYLE };
