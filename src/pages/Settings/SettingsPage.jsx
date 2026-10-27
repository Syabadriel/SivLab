import React from "react";

function SettingsPage({ t, isDark, setIsDark, currentUser }) {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className={`text-xl font-semibold tracking-tight ${t.text}`}>Pengaturan</h2>
        <p className={`text-sm mt-1 ${t.textMuted}`}>Preferensi akun dan tampilan sistem.</p>
      </div>

      <div className={`rounded-2xl p-5 ${t.card}`}>
        <h3 className={`text-sm font-semibold mb-4 ${t.text}`}>Profil</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-semibold flex items-center justify-center">
            {currentUser.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className={`font-medium ${t.text}`}>{currentUser.name}</p>
            <p className={`text-sm ${t.textFaint}`}>{currentUser.role} · {currentUser.email}</p>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 ${t.card}`}>
        <h3 className={`text-sm font-semibold mb-4 ${t.text}`}>Tampilan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${t.text}`}>Mode Gelap</p>
            <p className={`text-xs mt-0.5 ${t.textFaint}`}>Sesuaikan tampilan sistem untuk kenyamanan mata.</p>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-12 h-7 rounded-full flex items-center px-0.5 transition-colors ${isDark ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start"}`}
          >
            <span className="w-6 h-6 rounded-full bg-white block shadow" />
          </button>
        </div>
      </div>

      <div className={`rounded-2xl p-5 ${t.card}`}>
        <h3 className={`text-sm font-semibold mb-1 ${t.text}`}>Tentang Sistem</h3>
        <p className={`text-sm ${t.textFaint}`}>LabInventory v1.0 — Sistem Pengelolaan Barang Laboratorium Komputer.</p>
      </div>
    </div>
  );
}

export default SettingsPage;
