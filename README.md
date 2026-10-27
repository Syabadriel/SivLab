# LabInventory — split React source

Kode sumber LabInventory dari satu file besar telah dipecah berdasarkan tanggung jawab:

- `src/data` — mock/static data
- `src/constants` — konfigurasi navigasi, status, kondisi, dan metadata halaman
- `src/components/ui` — komponen UI reusable
- `src/components/layout` — Sidebar dan Topbar
- `src/components/inventory` — modal dan drawer inventaris
- `src/pages` — halaman aplikasi
- `src/hooks` — custom hooks
- `src/utils` — utility
- `src/lib` — re-export library icons/chart

## Menjalankan

```bash
npm install
npm run dev
```

## Catatan

Behavior dan markup utama dipertahankan dari sumber asli. Pemecahan dilakukan terutama pada boundary module/import-export; belum dilakukan redesign atau migrasi ke backend.
