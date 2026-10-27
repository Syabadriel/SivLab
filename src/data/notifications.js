const NOTIFICATIONS = [
  { id: 1, text: "PC-LAB-023 membutuhkan perbaikan segera", time: "5 menit lalu", unread: true, tone: "danger" },
  { id: 2, text: "Pengembalian Epson EB-X06 (PRJ-LAB-003) jatuh tempo hari ini", time: "1 jam lalu", unread: true, tone: "warning" },
  { id: 3, text: "5 barang belum memiliki foto dokumentasi", time: "3 jam lalu", unread: true, tone: "info" },
  { id: 4, text: "Maintenance PC-LAB-011 telah selesai dijadwalkan ulang", time: "kemarin", unread: false, tone: "success" },
  { id: 5, text: "Peminjaman PMJ-0088 menunggu persetujuan Anda", time: "kemarin", unread: false, tone: "info" },
];

const ACTIVITIES = [
  { text: "Ahmad Fauzan menambahkan Dell OptiPlex 3080 (PC-LAB-035)", time: "5 menit lalu" },
  { text: "Rizky Pratama meminjam Epson EB-X06 (PRJ-LAB-003)", time: "2 jam lalu" },
  { text: "Budi Santoso memperbarui status PC-LAB-023 menjadi Rusak", time: "4 jam lalu" },
  { text: "Siti Rahma menyelesaikan perawatan PC-LAB-011", time: "kemarin" },
  { text: "Budi Santoso memindahkan ASUS VA24EHE ke Lab Komputer 2", time: "kemarin" },
];

const MONTHLY_ADDITIONS = [
  { month: "Mar", jumlah: 14 }, { month: "Apr", jumlah: 9 }, { month: "Mei", jumlah: 21 },
  { month: "Jun", jumlah: 12 }, { month: "Jul", jumlah: 18 }, { month: "Agu", jumlah: 12 },
];

export { NOTIFICATIONS, ACTIVITIES, MONTHLY_ADDITIONS };
