<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestReportController extends Controller
{
    protected ReportService $reportService;
    
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }
    
    /**
     * Test method to see the structure of report data
     * This is for development/testing purposes only
     */
    public function testReportStructure(Request $request)
    {
        // Only allow in development environment
        if (!app()->environment('local')) {
            abort(404);
        }
        
        $studentId = $request->get('student_id');
        $year = $request->get('year', now()->year);
        
        // Get student
        $student = User::where('role', 'siswa')->first();
        if ($studentId) {
            $student = User::find($studentId);
        }
        
        if (!$student) {
            return response()->json([
                'error' => 'No student found',
                'available_students' => User::where('role', 'siswa')->get(['id', 'name', 'email'])
            ]);
        }
        
        // Generate report data
        $reportData = $this->reportService->generateReportData($student, $year);
        
        return response()->json([
            'message' => 'Report structure test',
            'student' => $student->only(['id', 'name', 'email']),
            'year' => $year,
            'report_data' => $reportData,
            'structure_summary' => [
                'total_aspects' => $this->countAspects($reportData['report_structure']),
                'graded_aspects' => $this->countGradedAspects($reportData['report_structure']),
                'completion_percentage' => $reportData['summary_statistics']['completion_percentage'],
            ]
        ]);
    }
    
    /**
     * Test method to see assessment structure
     */
    public function testAssessmentStructure()
    {
        if (!app()->environment('local')) {
            abort(404);
        }
        
        $curriculumTemplate = \App\Models\CurriculumTemplate::where('is_active', true)->first();
        
        if (!$curriculumTemplate) {
            return response()->json([
                'error' => 'No active curriculum template found',
                'available_templates' => \App\Models\CurriculumTemplate::all(['id', 'name', 'is_active'])
            ]);
        }
        
        $aspects = \App\Models\AssessmentAspect::where('curriculum_template_id', $curriculumTemplate->id)
            ->orderBy('order')
            ->get();
        
        return response()->json([
            'curriculum_template' => $curriculumTemplate,
            'aspects' => $aspects,
            'hierarchical_structure' => $this->buildHierarchicalStructure($aspects),
        ]);
    }
    
    /**
     * Test method to see student grades
     */
    public function testStudentGrades(Request $request)
    {
        if (!app()->environment('local')) {
            abort(404);
        }
        
        $studentId = $request->get('student_id');
        $year = $request->get('year', now()->year);
        
        $student = User::where('role', 'siswa')->first();
        if ($studentId) {
            $student = User::find($studentId);
        }
        
        if (!$student) {
            return response()->json([
                'error' => 'No student found',
                'available_students' => User::where('role', 'siswa')->get(['id', 'name', 'email'])
            ]);
        }
        
        $grades = \App\Models\Grade::with(['assessmentAspect', 'teacher'])
            ->where('student_id', $student->id)
            ->whereYear('created_at', $year)
            ->get();
        
        return response()->json([
            'student' => $student->only(['id', 'name', 'email']),
            'year' => $year,
            'grades' => $grades,
            'grades_count' => $grades->count(),
            'grade_distribution' => $grades->groupBy('grade_value')->map->count(),
        ]);
    }
    
    /**
     * Helper method to count aspects in structure
     */
    private function countAspects(array $structure): int
    {
        $count = 0;
        foreach ($structure as $aspect) {
            $count++;
            if (!empty($aspect['children'])) {
                $count += $this->countAspects($aspect['children']);
            }
        }
        return $count;
    }
    
    /**
     * Helper method to count graded aspects
     */
    private function countGradedAspects(array $structure): int
    {
        $count = 0;
        foreach ($structure as $aspect) {
            if (!empty($aspect['grade_data'])) {
                $count++;
            }
            if (!empty($aspect['children'])) {
                $count += $this->countGradedAspects($aspect['children']);
            }
        }
        return $count;
    }
    
    /**
     * Helper method to build hierarchical structure
     */
    private function buildHierarchicalStructure($aspects): array
    {
        $hierarchy = [];
        $aspectsById = $aspects->keyBy('id');
        
        foreach ($aspects as $aspect) {
            if ($aspect->parent_id === null) {
                $hierarchy[] = $this->buildAspectNode($aspect, $aspectsById);
            }
        }
        
        return $hierarchy;
    }
    
    /**
     * Helper method to build aspect node
     */
    private function buildAspectNode($aspect, $aspectsById): array
    {
        $node = [
            'id' => $aspect->id,
            'name' => $aspect->name,
            'input_type' => $aspect->input_type,
            'order' => $aspect->order,
            'parent_id' => $aspect->parent_id,
            'children' => [],
        ];
        
        $children = $aspectsById->where('parent_id', $aspect->id);
        foreach ($children as $child) {
            $node['children'][] = $this->buildAspectNode($child, $aspectsById);
        }
        
        return $node;
    }
} 