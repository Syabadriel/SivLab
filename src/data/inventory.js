import { LOCATIONS } from "./locations";

const seedItems = [
  ["PC-LAB-001", "Dell OptiPlex 7090", "komputer", "lab1", "Baik", "Tersedia", "2023-08-12", 11500000, "Dell Indonesia", "Ahmad Fauzan"],
  ["PC-LAB-002", "Dell OptiPlex 7090", "komputer", "lab1", "Baik", "Digunakan", "2023-08-12", 11500000, "Dell Indonesia", "Ahmad Fauzan"],
  ["PC-LAB-003", "Lenovo ThinkCentre M720", "komputer", "lab1", "Baik", "Digunakan", "2023-01-20", 9800000, "Lenovo Authorized Reseller", "Budi Santoso"],
  ["PC-LAB-011", "HP ProDesk 400 G7", "komputer", "lab2", "Perlu Perbaikan", "Tidak Digunakan", "2022-11-03", 8700000, "HP Store Surabaya", "Budi Santoso"],
  ["PC-LAB-023", "Lenovo ThinkCentre M720", "komputer", "lab2", "Rusak", "Tidak Digunakan", "2022-11-03", 9800000, "Lenovo Authorized Reseller", "Siti Rahma"],
  ["PC-LAB-034", "Dell OptiPlex 3080", "komputer", "lab3", "Baik", "Tersedia", "2024-02-14", 10200000, "Dell Indonesia", "Rizky Pratama"],
  ["PC-LAB-035", "Dell OptiPlex 3080", "komputer", "lab3", "Baik", "Digunakan", "2024-02-14", 10200000, "Dell Indonesia", "Rizky Pratama"],
  ["PC-SVR-001", "Dell PowerEdge T340", "komputer", "server", "Baik", "Digunakan", "2021-06-01", 42000000, "Dell Enterprise", "Siti Rahma"],
  ["MON-LAB-012", "LG 24MP400", "monitor", "lab1", "Baik", "Digunakan", "2023-08-12", 1850000, "LG Electronics Indonesia", "Ahmad Fauzan"],
  ["MON-LAB-013", "LG 24MP400", "monitor", "lab1", "Baik", "Digunakan", "2023-08-12", 1850000, "LG Electronics Indonesia", "Ahmad Fauzan"],
  ["MON-LAB-020", "ASUS VA24EHE", "monitor", "lab2", "Baik", "Tersedia", "2023-03-09", 1650000, "ASUS Store Indonesia", "Budi Santoso"],
  ["MON-LAB-021", "ASUS VA24EHE", "monitor", "lab2", "Perlu Perbaikan", "Tidak Digunakan", "2023-03-09", 1650000, "ASUS Store Indonesia", "Budi Santoso"],
  ["MON-LAB-030", "Samsung S24R350", "monitor", "lab3", "Baik", "Digunakan", "2024-02-14", 1750000, "Samsung Digital Appliances", "Rizky Pratama"],
  ["KBD-LAB-045", "Logitech K120", "keyboard", "lab1", "Baik", "Digunakan", "2023-08-12", 145000, "Logitech Official Store", "Ahmad Fauzan"],
  ["KBD-LAB-046", "Logitech K120", "keyboard", "lab1", "Baik", "Digunakan", "2023-08-12", 145000, "Logitech Official Store", "Ahmad Fauzan"],
  ["KBD-LAB-050", "Logitech K120", "keyboard", "lab2", "Rusak", "Tidak Digunakan", "2022-11-03", 145000, "Logitech Official Store", "Budi Santoso"],
  ["MSE-LAB-061", "Logitech M90", "mouse", "lab1", "Baik", "Digunakan", "2023-08-12", 85000, "Logitech Official Store", "Ahmad Fauzan"],
  ["MSE-LAB-062", "Logitech M90", "mouse", "lab2", "Baik", "Digunakan", "2023-03-09", 85000, "Logitech Official Store", "Budi Santoso"],
  ["MSE-LAB-063", "Logitech M90", "mouse", "lab3", "Hilang", "Tidak Digunakan", "2024-02-14", 85000, "Logitech Official Store", "Rizky Pratama"],
  ["PRN-LAB-005", "Canon Pixma G2010", "printer", "teknisi", "Baik", "Tersedia", "2023-05-18", 2450000, "Canon Datascrip", "Siti Rahma"],
  ["PRN-LAB-006", "Epson L3210", "printer", "gudang", "Perlu Perbaikan", "Tidak Digunakan", "2022-09-01", 2650000, "Epson Center Surabaya", "Siti Rahma"],
  ["PRJ-LAB-003", "Epson EB-X06", "proyektor", "multimedia", "Baik", "Dipinjam", "2022-04-11", 6200000, "Epson Center Surabaya", "Budi Santoso"],
  ["PRJ-LAB-004", "Epson EB-X06", "proyektor", "multimedia", "Baik", "Tersedia", "2022-04-11", 6200000, "Epson Center Surabaya", "Budi Santoso"],
  ["NET-LAB-101", "TP-Link TL-SG108", "networking", "server", "Baik", "Digunakan", "2021-06-01", 385000, "TP-Link Authorized Store", "Siti Rahma"],
  ["NET-LAB-102", "Mikrotik RB750Gr3", "networking", "server", "Baik", "Digunakan", "2021-06-01", 615000, "Mikrotik Distributor Indonesia", "Siti Rahma"],
  ["NET-LAB-103", "TP-Link Archer C6", "networking", "lab3", "Baik", "Digunakan", "2024-02-14", 445000, "TP-Link Authorized Store", "Rizky Pratama"],
  ["FUR-LAB-201", "Meja Komputer Informa", "furniture", "lab1", "Baik", "Digunakan", "2020-01-15", 950000, "Informa Furnishings", "Ahmad Fauzan"],
  ["FUR-LAB-202", "Kursi Kerja Ergotec", "furniture", "lab2", "Perlu Perbaikan", "Digunakan", "2020-01-15", 720000, "Ergotec Indonesia", "Budi Santoso"],
  ["KBL-LAB-301", "Kabel LAN Cat6 (Roll)", "kabel", "gudang", "Baik", "Tersedia", "2023-11-02", 1200000, "Belden Distributor", "Siti Rahma"],
  ["KBL-LAB-302", "Kabel HDMI 3m", "kabel", "multimedia", "Baik", "Digunakan", "2023-11-02", 95000, "Belden Distributor", "Budi Santoso"],
  ["PRP-LAB-401", "Headset Logitech H111", "peripheral", "lab3", "Baik", "Digunakan", "2024-02-14", 175000, "Logitech Official Store", "Rizky Pratama"],
  ["PRP-LAB-402", "Webcam Logitech C270", "peripheral", "multimedia", "Baik", "Tersedia", "2023-11-02", 385000, "Logitech Official Store", "Budi Santoso"],
];

function buildItems() {
  return seedItems.map((row, i) => {
    const [code, name, categoryId, locationId, condition, status, purchaseDate, price, supplier, responsible] = row;
    return {
      id: i + 1,
      code,
      name,
      categoryId,
      locationId,
      condition,
      status,
      purchaseDate,
      price,
      supplier,
      responsible,
      brand: name.split(" ")[0],
      model: name.split(" ").slice(1).join(" "),
      serial: `SN-${code}-${1000 + i}`,
      warranty: "2 Tahun",
      invoice: `INV/${purchaseDate.slice(0, 4)}/${1000 + i}`,
      description: "Perangkat operasional laboratorium, digunakan untuk kegiatan praktikum dan perkuliahan mahasiswa.",
      history: [
        { date: purchaseDate, text: "Barang dicatat masuk ke inventaris" },
        { date: "2025-01-10", text: `Barang ditempatkan di ${LOCATIONS.find(l => l.id === locationId)?.name}` },
      ],
    };
  });
}

export { buildItems, seedItems };
