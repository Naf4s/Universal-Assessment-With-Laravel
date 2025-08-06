<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    protected ReportService $reportService;
    
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $user = Auth::user();
        $classes = [];

        if ($user->role === 'guru') {
            // Assuming a teacher has a 'classes' relationship
            // Replace with your actual logic to get teacher's classes
            // For example: $classes = $user->taughtClasses()->get();
            // Untuk demonstrasi, kita akan mengambil semua kelas sementara
            $classes = \App\Models\Grade::select('class_id')->distinct()->with('class')->get()->pluck('class')->filter()->unique();
        } elseif ($user->role === 'kepsek') {
            // For the principal, get all unique classes from the grades table or a dedicated classes table
            $classes = \App\Models\Grade::select('class_id')->distinct()->with('class')->get()->pluck('class')->filter()->unique();
        }

        return Inertia::render('Laporan/Create', [
            'classes' => $classes,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $studentId
     * @param  int  $year
     * @return \Inertia\Response
     */
    public function show($studentId, $year)
    {
        $student = User::findOrFail($studentId);
        $this->authorizeViewReport($student);

        $reportData = $this->reportService->generateReportData($student, $year);

        return Inertia::render('Reports/Show', [
            'reportData' => $reportData,
            'student' => $student,
            'selectedYear' => $year,
        ]);
    }
    
    /**
     * Display student report page
     */
    public function showStudentReport(Request $request, User $student = null): Response
    {
        // If no student specified, use authenticated user (for students viewing their own report)
        if (!$student) {
            $student = Auth::user();
        }
        
        // Check if user has permission to view this report
        $this->authorizeViewReport($student);
        
        $year = $request->get('year', now()->year);
        
        // Generate report data
        $reportData = $this->reportService->generateReportData($student, $year);
        
        return Inertia::render('Reports/StudentReport', [
            'reportData' => $reportData,
            'student' => $student,
            'selectedYear' => $year,
        ]);
    }
    
    /**
     * Display bulk reports for multiple students (for teachers/principals)
     */
    public function showBulkReports(Request $request): Response
    {
        $this->authorize('viewAny', User::class);
        
        $year = $request->get('year', now()->year);
        $studentIds = $request->get('student_ids', []);
        
        // Get students based on filters
        $students = User::where('role', 'siswa');
        
        if (!empty($studentIds)) {
            $students = $students->whereIn('id', $studentIds);
        }
        
        $students = $students->get();
        
        // Generate bulk report data
        $bulkReportData = $this->reportService->generateBulkReportData($students, $year);
        
        return Inertia::render('Reports/BulkReports', [
            'bulkReportData' => $bulkReportData,
            'students' => $students,
            'selectedYear' => $year,
        ]);
    }
    
    /**
     * Display filtered report
     */
    public function showFilteredReport(Request $request, User $student): Response
    {
        $this->authorizeViewReport($student);
        
        $filters = [
            'year' => $request->get('year', now()->year),
            'aspect_ids' => $request->get('aspect_ids'),
            'teacher_ids' => $request->get('teacher_ids'),
        ];
        
        // Generate filtered report data
        $filteredReportData = $this->reportService->generateFilteredReportData($student, $filters);
        
        return Inertia::render('Reports/FilteredReport', [
            'filteredReportData' => $filteredReportData,
            'student' => $student,
            'filters' => $filters,
        ]);
    }
    
    /**
     * Export report as JSON
     */
    public function exportReport(Request $request, User $student = null)
    {
        if (!$student) {
            $student = Auth::user();
        }
        
        $this->authorizeViewReport($student);
        
        $year = $request->get('year', now()->year);
        $reportData = $this->reportService->generateReportData($student, $year);
        
        $filename = "report_{$student->name}_{$year}.json";
        
        return response()->json($reportData)
            ->header('Content-Disposition', "attachment; filename={$filename}");
    }
    
    /**
     * Export bulk reports as JSON
     */
    public function exportBulkReports(Request $request)
    {
        $this->authorize('viewAny', User::class);
        
        $year = $request->get('year', now()->year);
        $studentIds = $request->get('student_ids', []);
        
        $students = User::where('role', 'siswa');
        
        if (!empty($studentIds)) {
            $students = $students->whereIn('id', $studentIds);
        }
        
        $students = $students->get();
        $bulkReportData = $this->reportService->generateBulkReportData($students, $year);
        
        $filename = "bulk_reports_{$year}.json";
        
        return response()->json($bulkReportData)
            ->header('Content-Disposition', "attachment; filename={$filename}");
    }
    
    /**
     * Get available years for reports
     */
    public function getAvailableYears(Request $request, User $student = null)
    {
        if (!$student) {
            $student = Auth::user();
        }
        
        $this->authorizeViewReport($student);
        
        // Get years from grades table
        $years = \App\Models\Grade::where('student_id', $student->id)
            ->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');
        
        return response()->json([
            'years' => $years,
            'current_year' => now()->year,
        ]);
    }

    /**
     * Get students by class ID.
     *
     * @param  int  $classId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudentsByClass(int $classId)
    {
        // Asumsi ada kolom 'class_id' di tabel users atau relasi ke tabel kelas
        $students = User::where('class_id', $classId)
                        ->where('role', 'siswa')
                        ->select('id', 'name') // Pilih kolom yang dibutuhkan saja
                        ->get();

        return response()->json($students);
    }
    
    /**
     * Get report statistics
     */
    public function getReportStats(Request $request, User $student = null)
    {
        if (!$student) {
            $student = Auth::user();
        }
        
        $this->authorizeViewReport($student);
        
        $year = $request->get('year', now()->year);
        $reportData = $this->reportService->generateReportData($student, $year);
        
        return response()->json([
            'summary_statistics' => $reportData['summary_statistics'],
            'academic_year' => $year,
        ]);
    }
    
    /**
     * Authorize user to view report
     */
    private function authorizeViewReport(User $student): void
    {
        $user = Auth::user();
        
        // Students can only view their own reports
        if ($user->role === 'siswa' && $user->id !== $student->id) {
            abort(403, 'You can only view your own reports.');
        }
        
        // Teachers can view reports of students they teach
        if ($user->role === 'guru') {
            // For now, allow teachers to view any student report
            // In a real implementation, you'd check if the teacher teaches this student
            return;
        }
        
        // Principals and admins can view any report
        if (in_array($user->role, ['kepsek', 'admin'])) {
            return;
        }
        
        abort(403, 'You are not authorized to view this report.');
    }
}