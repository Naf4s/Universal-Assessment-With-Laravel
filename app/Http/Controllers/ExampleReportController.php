<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExampleReportController extends Controller
{
    protected ReportService $reportService;
    
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }
    
    /**
     * Contoh: Halaman rapor untuk siswa melihat nilai sendiri
     */
    public function studentSelfReport(Request $request)
    {
        $student = Auth::user();
        $year = $request->get('year', now()->year);
        
        // Generate report data
        $reportData = $this->reportService->generateReportData($student, $year);
        
        return Inertia::render('Reports/StudentSelfReport', [
            'reportData' => $reportData,
            'selectedYear' => $year,
        ]);
    }
    
    /**
     * Contoh: Halaman rapor untuk guru melihat nilai siswa
     */
    public function teacherStudentReport(Request $request, User $student)
    {
        // Check if teacher has permission to view this student's report
        $this->authorize('viewStudentReport', $student);
        
        $year = $request->get('year', now()->year);
        $reportData = $this->reportService->generateReportData($student, $year);
        
        return Inertia::render('Reports/TeacherStudentReport', [
            'reportData' => $reportData,
            'student' => $student,
            'selectedYear' => $year,
        ]);
    }
    
    /**
     * Contoh: Halaman rapor untuk kepala sekolah melihat semua siswa
     */
    public function principalAllStudentsReport(Request $request)
    {
        $this->authorize('viewAllReports');
        
        $year = $request->get('year', now()->year);
        $studentIds = $request->get('student_ids', []);
        
        // Get students
        $students = User::where('role', 'siswa');
        if (!empty($studentIds)) {
            $students = $students->whereIn('id', $studentIds);
        }
        $students = $students->get();
        
        // Generate bulk report
        $bulkReportData = $this->reportService->generateBulkReportData($students, $year);
        
        return Inertia::render('Reports/PrincipalAllStudentsReport', [
            'bulkReportData' => $bulkReportData,
            'students' => $students,
            'selectedYear' => $year,
        ]);
    }
    
    /**
     * Contoh: API endpoint untuk mendapatkan statistik rapor
     */
    public function getReportStats(Request $request, User $student = null)
    {
        if (!$student) {
            $student = Auth::user();
        }
        
        $year = $request->get('year', now()->year);
        $reportData = $this->reportService->generateReportData($student, $year);
        
        return response()->json([
            'success' => true,
            'data' => [
                'student_name' => $student->name,
                'academic_year' => $year,
                'summary_statistics' => $reportData['summary_statistics'],
                'curriculum_template' => $reportData['curriculum_template']['name'] ?? 'N/A',
            ]
        ]);
    }
    
    /**
     * Contoh: API endpoint untuk mendapatkan data rapor terfilter
     */
    public function getFilteredReport(Request $request, User $student)
    {
        $filters = [
            'year' => $request->get('year', now()->year),
            'aspect_ids' => $request->get('aspect_ids'),
            'teacher_ids' => $request->get('teacher_ids'),
        ];
        
        $filteredReportData = $this->reportService->generateFilteredReportData($student, $filters);
        
        return response()->json([
            'success' => true,
            'data' => $filteredReportData,
            'filters_applied' => $filters,
        ]);
    }
    
    /**
     * Contoh: Export rapor dalam format JSON
     */
    public function exportReportJson(Request $request, User $student = null)
    {
        if (!$student) {
            $student = Auth::user();
        }
        
        $year = $request->get('year', now()->year);
        $reportData = $this->reportService->generateReportData($student, $year);
        
        $filename = "rapor_{$student->name}_{$year}.json";
        
        return response()->json($reportData)
            ->header('Content-Disposition', "attachment; filename={$filename}")
            ->header('Content-Type', 'application/json');
    }
    
    /**
     * Contoh: Dashboard dengan ringkasan rapor
     */
    public function reportDashboard(Request $request)
    {
        $user = Auth::user();
        $year = $request->get('year', now()->year);
        
        $dashboardData = [];
        
        if ($user->role === 'siswa') {
            // Dashboard untuk siswa
            $reportData = $this->reportService->generateReportData($user, $year);
            $dashboardData = [
                'type' => 'student',
                'summary' => $reportData['summary_statistics'],
                'curriculum' => $reportData['curriculum_template']['name'] ?? 'N/A',
                'completion_percentage' => $reportData['summary_statistics']['completion_percentage'],
            ];
        } elseif ($user->role === 'guru') {
            // Dashboard untuk guru
            $students = User::where('role', 'siswa')->get();
            $dashboardData = [
                'type' => 'teacher',
                'total_students' => $students->count(),
                'students_with_grades' => $students->filter(function ($student) use ($year) {
                    return $student->receivedGrades()->whereYear('created_at', $year)->exists();
                })->count(),
            ];
        } elseif ($user->role === 'kepsek') {
            // Dashboard untuk kepala sekolah
            $students = User::where('role', 'siswa')->get();
            $bulkReportData = $this->reportService->generateBulkReportData($students, $year);
            
            $dashboardData = [
                'type' => 'principal',
                'total_students' => $students->count(),
                'average_completion' => collect($bulkReportData['reports'])
                    ->avg('summary_statistics.completion_percentage'),
                'curriculum_template' => $bulkReportData['reports'][0]['curriculum_template']['name'] ?? 'N/A',
            ];
        }
        
        return Inertia::render('Reports/Dashboard', [
            'dashboardData' => $dashboardData,
            'selectedYear' => $year,
        ]);
    }
    
    /**
     * Contoh: Perbandingan rapor antar tahun
     */
    public function compareYears(Request $request, User $student = null)
    {
        if (!$student) {
            $student = Auth::user();
        }
        
        $years = $request->get('years', [now()->year - 1, now()->year]);
        $comparisonData = [];
        
        foreach ($years as $year) {
            $reportData = $this->reportService->generateReportData($student, $year);
            $comparisonData[$year] = [
                'completion_percentage' => $reportData['summary_statistics']['completion_percentage'],
                'average_numeric_score' => $reportData['summary_statistics']['average_numeric_score'],
                'total_aspects' => $reportData['summary_statistics']['total_aspects'],
                'graded_aspects' => $reportData['summary_statistics']['graded_aspects'],
            ];
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'student_name' => $student->name,
                'comparison' => $comparisonData,
            ]
        ]);
    }
} 