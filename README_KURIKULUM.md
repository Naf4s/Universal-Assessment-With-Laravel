# Fitur Manajemen Kurikulum

## Deskripsi
Fitur manajemen kurikulum memungkinkan admin/operator untuk mengelola template kurikulum dan struktur aspek assessment. Fitur ini terdiri dari dua tampilan utama: "Daftar Template" dan "Editor Struktur".

## Komponen yang Dibuat

### 1. Halaman Utama (`resources/js/pages/Kurikulum/Index.tsx`)
- **Tampilan Daftar Template**: Menampilkan kartu-kartu template kurikulum dengan informasi lengkap
- **Tampilan Editor Struktur**: Menampilkan daftar aspek kurikulum dengan kemampuan CRUD
- **Toggle View**: Beralih antara dua tampilan menggunakan useState
- **Layout Admin**: Menggunakan AdminLayout untuk konsistensi UI

### 2. Modal Aspek (`resources/js/pages/Kurikulum/AspekModal.tsx`)
- **Form Tambah/Edit Aspek**: Modal dengan form lengkap untuk menambah atau mengedit aspek
- **Validasi Form**: Validasi client-side untuk nama aspek (min 3 karakter)
- **Dropdown Parent**: Pilihan aspek induk dengan filter untuk menghindari circular reference
- **Tipe Input**: Dropdown untuk memilih tipe input (angka, huruf, biner, teks)

### 3. TypeScript Types (`resources/js/types/curriculum.ts`)
- **CurriculumTemplate**: Interface untuk template kurikulum
- **CurriculumAspect**: Interface untuk aspek assessment
- **Request Types**: Interface untuk request create dan update

## Backend Implementation

### 1. Controller (`app/Http/Controllers/CurriculumController.php`)
- **Method Index**: Menampilkan halaman dengan data templates dan aspects
- **Method storeAspect**: Menambah aspek baru dengan validasi
- **Method updateAspect**: Mengupdate aspek yang ada
- **Method destroyAspect**: Menghapus aspek dengan validasi child

### 2. Routes (`routes/web.php`)
- **GET /admin/curriculum**: Halaman utama manajemen kurikulum
- **POST /admin/curriculum/aspects**: Menambah aspek baru
- **PUT /admin/curriculum/aspects/{aspect}**: Mengupdate aspek
- **DELETE /admin/curriculum/aspects/{aspect}**: Menghapus aspek

### 3. Database
- **CurriculumTemplate**: Model untuk template kurikulum
- **AssessmentAspect**: Model untuk aspek assessment dengan relasi parent-child
- **Migration**: Struktur tabel dengan foreign key constraints
- **Seeder**: Data dummy untuk testing

## Fitur Utama

### 1. Tampilan Daftar Template
- Kartu template dengan informasi lengkap (nama, deskripsi, status, jumlah aspek)
- Badge status aktif/nonaktif
- Tombol aksi (Lihat, Edit, Atur)
- Card untuk menambah template baru

### 2. Tampilan Editor Struktur
- Daftar aspek kurikulum dengan informasi tipe input dan parent
- Tombol edit dan hapus untuk setiap aspek
- Tombol tambah aspek baru
- Empty state ketika belum ada aspek

### 3. Modal Form Aspek
- Form dengan validasi real-time
- Dropdown untuk memilih aspek induk
- Dropdown untuk memilih tipe input
- Handling untuk mode tambah dan edit

### 4. Integrasi dengan Backend
- Menggunakan Inertia.js untuk komunikasi dengan Laravel
- Router untuk POST, PUT, DELETE requests
- Flash messages untuk feedback user
- Validasi server-side di controller

## Cara Penggunaan

### 1. Akses Halaman
- Login sebagai user dengan role 'operator'
- Akses URL `/admin/curriculum`

### 2. Menambah Aspek
- Klik tombol "Tambah Aspek" di Editor Struktur
- Isi form dengan nama aspek (min 3 karakter)
- Pilih aspek induk (opsional)
- Pilih tipe input
- Klik "Tambah Aspek"

### 3. Mengedit Aspek
- Klik tombol edit pada aspek yang ingin diedit
- Ubah data sesuai kebutuhan
- Klik "Update Aspek"

### 4. Menghapus Aspek
- Klik tombol hapus pada aspek
- Konfirmasi penghapusan
- Aspek tidak bisa dihapus jika memiliki sub-aspek

## Testing Data
- **User Operator**: `operator@example.com` / `password`
- **Template Kurikulum**: 2 template (Kurikulum Merdeka 2024, Kurikulum 2013)
- **Aspek Assessment**: 9 aspek dengan struktur hierarki

## Teknologi yang Digunakan
- **Frontend**: React + TypeScript + Inertia.js
- **UI Components**: Radix UI + Tailwind CSS
- **Backend**: Laravel 12 + PHP 8.2
- **Database**: SQLite (development)
- **Build Tool**: Vite

## Struktur File
```
resources/js/pages/Kurikulum/
├── Index.tsx              # Halaman utama
└── AspekModal.tsx         # Modal form aspek

resources/js/types/
└── curriculum.ts          # TypeScript interfaces

app/Http/Controllers/
└── CurriculumController.php # Controller untuk CRUD

database/
├── migrations/            # Migration files
└── seeders/
    └── CurriculumTemplateSeeder.php # Data dummy
``` 