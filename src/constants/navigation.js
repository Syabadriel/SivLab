import { LayoutDashboard, Package, Tags, MapPin, ArrowLeftRight, Wrench, FileBarChart2, Users, Settings } from "../lib/icons";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inventaris", label: "Inventaris Barang", icon: Package },
  { id: "kategori", label: "Kategori", icon: Tags },
  { id: "lokasi", label: "Lokasi", icon: MapPin },
  { id: "peminjaman", label: "Peminjaman", icon: ArrowLeftRight },
  { id: "perawatan", label: "Perawatan", icon: Wrench },
  { id: "laporan", label: "Laporan", icon: FileBarChart2 },
  { id: "pengguna", label: "Pengguna", icon: Users },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

export { NAV };
