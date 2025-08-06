# ReportService Documentation

## Overview

`ReportService` adalah service class yang bertanggung jawab untuk mengelola logika kompleks dalam pengambilan dan penyusunan data rapor siswa. Service ini dirancang untuk memisahkan logika bisnis dari controller dan memudahkan testing serta maintenance.

## Fitur Utama

### 1. Generate Report Data
Method utama `generateReportData()` melakukan beberapa langkah:

1. **Mengambil data siswa** - Informasi lengkap siswa
2. **Mengambil template kurikulum aktif** - Struktur kurikulum yang sedang digunakan
3. **Mengambil struktur aspek penilaian** - Hierarki aspek penilaian dari kurikulum
4. **Mengambil nilai siswa** - Semua nilai siswa untuk tahun ajaran tertentu
5. **Mengorganisir data** - Menggabungkan nilai dengan struktur aspek
6. **Membangun struktur rapor** - Menyusun data dalam format hierarkis
7. **Menghitung statistik** - Statistik ringkasan seperti persentase kelengkapan

### 2. Struktur Data Output

```php
[
    'student' => [
        'id' => 1,
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'role' => 'siswa',
        // ...
    ],
    'academic_year' => 2024,
    'curriculum_template' => [
        'id' => 1,
        'name' => 'Kurikulum Merdeka 2024',
        // ...
    ],
    'report_structure' => [
        [
            'id' => 1,
            'name' => 'Pengetahuan',
            'input_type' => 'teks',
            'grade_data' => [
                'grade_value' => '85',
                'notes' => 'Sangat baik',
                'teacher' => [
                    'id' => 2,
                    'name' => 'Guru Matematika'
                ],
                // ...
            ],
            'children' => [
                [
                    'id' => 4,
                    'name' => 'Nilai Numerik',
                    'input_type' => 'angka',
                    'grade_data' => [
                        'grade_value' => '85',
                        // ...
                    ],
                    'children' => []
                ]
            ]
        ]
    ],
    'summary_statistics' => [
        'total_aspects' => 7,
        'graded_aspects' => 5,
        'completion_percentage' => 71.43,
        'average_numeric_score' => 82.5,
        'grade_distribution' => [
            '85' => 2,
            '90' => 1,
            'Tercapai' => 2
        ]
    ],
    'generated_at' => '2024-01-15T10:30:00.000000Z'
]
```

### 3. Method-Methods Utama

#### `generateReportData(User $student, ?int $year = null)`
- **Parameter**: 
  - `$student`: Model User siswa
  - `$year`: Tahun ajaran (opsional, default tahun sekarang)
- **Return**: Array dengan data rapor lengkap

#### `generateBulkReportData(Collection $students, ?int $year = null)`
- **Parameter**: 
  - `$students`: Collection dari User siswa
  - `$year`: Tahun ajaran (opsional)
- **Return**: Array dengan data rapor untuk multiple siswa

#### `generateFilteredReportData(User $student, array $filters = [])`
- **Parameter**: 
  - `$student`: Model User siswa
  - `$filters`: Array filter (year, aspect_ids, teacher_ids)
- **Return**: Array dengan data rapor yang difilter

### 4. Struktur Hierarkis Aspek Penilaian

Service ini mendukung struktur hierarkis untuk aspek penilaian:

```
Pengetahuan (Parent)
├── Nilai Numerik (Child)
└── Deskripsi (Child)

Keterampilan (Parent)
├── Praktik (Child)
└── Proyek (Child)

Sikap (Parent)
└── (tidak ada child)
```

### 5. Statistik yang Dihitung

- **Total Aspects**: Jumlah total aspek penilaian
- **Graded Aspects**: Jumlah aspek yang sudah dinilai
- **Completion Percentage**: Persentase kelengkapan penilaian
- **Average Numeric Score**: Rata-rata nilai numerik
- **Grade Distribution**: Distribusi nilai (berapa siswa mendapat nilai tertentu)

## Penggunaan di Controller

```php
use App\Services\ReportService;

class ReportController extends Controller
{
    protected ReportService $reportService;
    
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }
    
    public function showReport(Request $request, User $student)
    {
        $year = $request->get('year', now()->year);
        $reportData = $this->reportService->generateReportData($student, $year);
        
        return Inertia::render('Reports/Show', [
            'reportData' => $reportData
        ]);
    }
}
```

## Testing

Untuk testing, gunakan TestReportController yang menyediakan endpoint:

- `/test/report-structure` - Melihat struktur data rapor
- `/test/assessment-structure` - Melihat struktur aspek penilaian
- `/test/student-grades` - Melihat nilai siswa

## Keunggulan Design

1. **Separation of Concerns**: Logika bisnis terpisah dari controller
2. **Reusability**: Service dapat digunakan di berbagai controller
3. **Testability**: Mudah untuk unit testing
4. **Maintainability**: Mudah untuk maintenance dan update
5. **Flexibility**: Mendukung berbagai jenis filter dan query
6. **Performance**: Query yang dioptimasi dengan eager loading

## Dependencies

- `App\Models\User`
- `App\Models\Grade`
- `App\Models\AssessmentAspect`
- `App\Models\CurriculumTemplate`
- `Illuminate\Support\Collection`

## Error Handling

Service ini menangani beberapa skenario error:

- Tidak ada template kurikulum aktif
- Tidak ada data siswa
- Tidak ada nilai untuk tahun tertentu
- Struktur hierarkis yang tidak valid

## Future Enhancements

1. **Caching**: Implementasi cache untuk data yang sering diakses
2. **Pagination**: Support untuk data yang sangat besar
3. **Export Formats**: Support untuk export PDF, Excel
4. **Real-time Updates**: WebSocket untuk update real-time
5. **Advanced Filtering**: Filter berdasarkan tanggal, mata pelajaran, dll 