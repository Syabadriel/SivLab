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
import React, { useState, useMemo, useEffect } from "react";
import useTheme from "./hooks/useTheme";
import { PAGE_META } from "./constants/pages";
import LoginPage from "./pages/Login/LoginPage";
import { dbService } from "./lib/db";
import * as Icons from "./lib/icons";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard/DashboardPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import CategoriesPage from "./pages/Categories/CategoriesPage";
import LocationsPage from "./pages/Locations/LocationsPage";
import BorrowingsPage from "./pages/Borrowings/BorrowingsPage";
import MaintenancePage from "./pages/Maintenance/MaintenancePage";
import ReportsPage from "./pages/Reports/ReportsPage";
import UsersPage from "./pages/Users/UsersPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import AddItemModal from "./components/inventory/AddItemModal";
import Toast from "./components/ui/Toast";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cloneData, setCloneData] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [globalQuery, setGlobalQuery] = useState("");

  const [items, setItems] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = useTheme(isDark);

  function addToast(text) {
    const id = Date.now();
    setToasts((ts) => [...ts, { id, text }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3000);
  }

  async function loadDatabase() {
    setLoading(true);
    try {
      const cats = await dbService.fetchCategories();
      setCategories(cats);
      const locs = await dbService.fetchLocations();
      setLocations(locs);
      const profs = await dbService.fetchProfiles();
      setProfiles(profs);
      const itms = await dbService.fetchItems();
      setItems(itms);
      const bours = await dbService.fetchBorrowings();
      setBorrowings(bours);
      const maints = await dbService.fetchMaintenance();
      setMaintenance(maints);
      const notifs = await dbService.fetchNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error("Error loading database:", err);
      addToast("Gagal memuat beberapa data dari database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function checkSession() {
      try {
        const profile = await dbService.getCurrentProfile();
        if (profile) {
          setCurrentUser({
            name: profile.full_name,
            role: profile.role,
            email: profile.email,
            id: profile.id
          });
          setLoggedIn(true);
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadDatabase();
    }
  }, [loggedIn]);

  async function handleAddItem(formItem) {
    try {
      const added = await dbService.addItem(formItem);
      setItems((prev) => [...prev, added]);
      setShowAddModal(false);
      setCloneData(null);
      addToast(`${formItem.name} berhasil ditambahkan ke inventaris`);
    } catch (err) {
      console.error(err);
      addToast(`Gagal menambahkan barang: ${err.message}`);
    }
  }

  async function handleAddCategory(name) {
    try {
      const data = await dbService.addCategory(name);
      setCategories((prev) => [...prev, data]);
      addToast(`Kategori "${name}" ditambahkan`);
    } catch (err) {
      console.error(err);
      addToast("Gagal menambahkan kategori");
    }
  }

  async function handleDeleteCategory(id) {
    try {
      const cat = categories.find((c) => c.id === id);
      if (!cat) return;
      await dbService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      addToast(`Kategori "${cat.name}" dihapus`);
    } catch (err) {
      console.error(err);
      addToast("Gagal menghapus kategori");
    }
  }

  async function handleLogout() {
    try {
      await dbService.signOut();
      setCurrentUser(null);
      setLoggedIn(false);
    } catch (err) {
      console.error("Error signing out:", err);
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    function closeMenus(e) {
      if (!e.target.closest("[data-menu-root]")) { setNotifOpen(false); }
    }
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  const searchResults = useMemo(() => {
    if (!globalQuery || globalQuery.length < 2) return null;
    const q = globalQuery.toLowerCase();
    return {
      items: items.filter((i) => `${i.name} ${i.code} ${i.serial}`.toLowerCase().includes(q)).slice(0, 5),
      users: (profiles || []).filter((u) => (u.full_name || '').toLowerCase().includes(q)).slice(0, 3),
    };
  }, [globalQuery, items, profiles]);

  if (!loggedIn) {
    return (
      <div className={isDark ? "dark" : ""}>
        <LoginPage t={t} isDark={isDark} setIsDark={setIsDark} onLogin={(userProfile) => { setCurrentUser(userProfile); setLoggedIn(true); }} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${t.appBg}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={`w-10 h-10 animate-spin ${t.textMuted}`} />
          <p className={`text-sm ${t.textMuted}`}>Memproses data inventaris...</p>
        </div>
      </div>
    );
  }

  const meta = PAGE_META[page];

  return (
    <div className={`min-h-screen flex ${t.appBg}`}>
      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(6px);} to { opacity:1; transform:translateY(0);} * { font-family: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif; }`}</style>

      <Sidebar t={t} page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} currentUser={currentUser} />

      <div className="flex-1 min-w-0 flex flex-col">
        <div data-menu-root>
          <Topbar
            t={t}
            isDark={isDark}
            setIsDark={setIsDark}
            title={meta.title}
            subtitle={meta.subtitle}
            setMobileOpen={setMobileOpen}
            notifications={notifications}
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
            onSearch={setGlobalQuery}
            currentUser={currentUser}
            onLogout={handleLogout}
            primaryAction={page === "inventaris" ? { label: "Tambah Barang", onClick: () => setShowAddModal(true) } : undefined}
          />
        </div>

        {searchResults && (
          <div className={`mx-4 lg:mx-6 mt-3 rounded-2xl border overflow-hidden ${t.card}`}>
            <div className={`px-4 py-2.5 flex items-center justify-between border-b ${t.border}`}>
              <span className={`text-xs font-medium ${t.textFaint}`}>Hasil pencarian untuk "{globalQuery}"</span>
              <button onClick={() => setGlobalQuery("")} className={t.textFaint}><X size={14} /></button>
            </div>
            {searchResults.items.length === 0 && searchResults.users.length === 0 ? (
              <p className={`text-sm px-4 py-4 ${t.textMuted}`}>Tidak ditemukan hasil yang cocok.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {searchResults.items.length > 0 && (
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-wide px-4 pt-3 pb-1 ${t.textFaint}`}>Barang</p>
                    {searchResults.items.map((it) => (
                      <button key={it.id} onClick={() => { setPage("inventaris"); setGlobalQuery(""); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${t.rowHover}`}>
                        <IconTile Icon={(() => { const cat = categories.find((c) => c.id === it.categoryId); return cat ? (Icons[cat.icon] || Package) : Package; })()} t={t} />
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${t.text}`}>{it.name}</p>
                          <p className={`text-xs truncate ${t.textFaint}`}>{it.code}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.users.length > 0 && (
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-wide px-4 pt-3 pb-1 ${t.textFaint}`}>Pengguna</p>
                    {searchResults.users.map((u) => (
                      <button key={u.id} onClick={() => { setPage("pengguna"); setGlobalQuery(""); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${t.rowHover}`}>
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">{(u.full_name || 'U')[0]}</div>
                        <p className={`text-sm font-medium ${t.text}`}>{u.full_name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
          {page === "dashboard" && <Dashboard t={t} items={items} borrowings={borrowings} maintenance={maintenance} categories={categories} locations={locations} setPage={setPage} />}
          {page === "inventaris" && <InventoryPage t={t} items={items} setItems={setItems} categories={categories} locations={locations} currentUser={currentUser} openAdd={() => setShowAddModal(true)} addToast={addToast} onClone={(item) => { setCloneData(item); setShowAddModal(true); }} />}
          {page === "kategori" && <CategoriesPage t={t} items={items} categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} addToast={addToast} />}
          {page === "lokasi" && <LocationsPage t={t} items={items} locations={locations} setLocations={setLocations} currentUser={currentUser} addToast={addToast} />}
          {page === "peminjaman" && <BorrowingsPage t={t} borrowings={borrowings} setBorrowings={setBorrowings} items={items} setItems={setItems} profiles={profiles} currentUser={currentUser} addToast={addToast} />}
          {page === "perawatan" && <MaintenancePage t={t} maintenance={maintenance} setMaintenance={setMaintenance} items={items} setItems={setItems} currentUser={currentUser} addToast={addToast} />}
          {page === "laporan" && <ReportsPage t={t} items={items} borrowings={borrowings} maintenance={maintenance} addToast={addToast} />}
          {page === "pengguna" && <UsersPage t={t} profiles={profiles} addToast={addToast} />}
          {page === "pengaturan" && <SettingsPage t={t} isDark={isDark} setIsDark={setIsDark} currentUser={currentUser} />}
        </main>
      </div>

      <AddItemModal t={t} open={showAddModal} onClose={() => { setShowAddModal(false); setCloneData(null); }} onSave={handleAddItem} categories={categories} locations={locations} profiles={profiles} initialData={cloneData} />
      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
