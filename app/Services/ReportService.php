<?php

namespace App\Services;

use App\Models\User;
use App\Models\Grade;
use App\Models\AssessmentAspect;
use App\Models\CurriculumTemplate;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;

class ReportService
{
    /**
     * Generate comprehensive report data for a student
     * 
     * @param User $student
     * @param int|null $year
     * @return array
     */
    public function generateReportData(User $student, ?int $year = null): array
    {
        // Set default year to current year if not provided
        $year = $year ?? now()->year;
        
        // 1. Get student data
        $studentData = $this->getStudentData($student);
        
        // 2. Get active curriculum template
        $curriculumTemplate = $this->getActiveCurriculumTemplate();
        
        // 3. Get assessment aspects structure
        $assessmentStructure = $this->getAssessmentStructure($curriculumTemplate);
        
        // 4. Get student grades for the specified year
        $studentGrades = $this->getStudentGrades($student, $year);
        
        // 5. Organize grades by assessment aspects
        $organizedGrades = $this->organizeGradesByAspects($studentGrades, $assessmentStructure);
        
        // 6. Build hierarchical report structure
        $reportStructure = $this->buildReportStructure($assessmentStructure, $organizedGrades);
        
        // 7. Calculate summary statistics
        $summaryStats = $this->calculateSummaryStats($studentGrades, $assessmentStructure);
        
        return [
            'student' => $studentData,
            'academic_year' => $year,
            'curriculum_template' => $curriculumTemplate,
            'report_structure' => $reportStructure,
            'summary_statistics' => $summaryStats,
            'generated_at' => now()->toISOString(),
        ];
    }
    
    /**
     * Get comprehensive student data
     * 
     * @param User $student
     * @return array
     */
    private function getStudentData(User $student): array
    {
        return [
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email,
            'role' => $student->role,
            'created_at' => $student->created_at,
            'updated_at' => $student->updated_at,
        ];
    }
    
    /**
     * Get active curriculum template
     * 
     * @return CurriculumTemplate|null
     */
    private function getActiveCurriculumTemplate(): ?CurriculumTemplate
    {
        return CurriculumTemplate::where('is_active', true)->first();
    }
    
    /**
     * Get hierarchical assessment structure
     * 
     * @param CurriculumTemplate|null $curriculumTemplate
     * @return array
     */
    private function getAssessmentStructure(?CurriculumTemplate $curriculumTemplate): array
    {
        if (!$curriculumTemplate) {
            return [];
        }
        
        // Get all assessment aspects for this curriculum
        $aspects = AssessmentAspect::where('curriculum_template_id', $curriculumTemplate->id)
            ->orderBy('order')
            ->get();
        
        // Build hierarchical structure
        return $this->buildHierarchicalStructure($aspects);
    }
    
    /**
     * Build hierarchical structure from flat collection
     * 
     * @param Collection $aspects
     * @return array
     */
    private function buildHierarchicalStructure(Collection $aspects): array
    {
        $hierarchy = [];
        $aspectsById = $aspects->keyBy('id');
        
        foreach ($aspects as $aspect) {
            if ($aspect->parent_id === null) {
                // This is a top-level aspect
                $hierarchy[] = $this->buildAspectNode($aspect, $aspectsById);
            }
        }
        
        return $hierarchy;
    }
    
    /**
     * Build a single aspect node with its children
     * 
     * @param AssessmentAspect $aspect
     * @param Collection $aspectsById
     * @return array
     */
    private function buildAspectNode(AssessmentAspect $aspect, Collection $aspectsById): array
    {
        $node = [
            'id' => $aspect->id,
            'name' => $aspect->name,
            'input_type' => $aspect->input_type,
            'order' => $aspect->order,
            'parent_id' => $aspect->parent_id,
            'children' => [],
        ];
        
        // Find children of this aspect
        $children = $aspectsById->where('parent_id', $aspect->id);
        foreach ($children as $child) {
            $node['children'][] = $this->buildAspectNode($child, $aspectsById);
        }
        
        return $node;
    }
    
    /**
     * Get student grades for specific year
     * 
     * @param User $student
     * @param int $year
     * @return Collection
     */
    private function getStudentGrades(User $student, int $year): Collection
    {
        return Grade::with(['assessmentAspect', 'teacher'])
            ->where('student_id', $student->id)
            ->whereYear('created_at', $year)
            ->get();
    }
    
    /**
     * Organize grades by assessment aspects
     * 
     * @param Collection $grades
     * @param array $assessmentStructure
     * @return array
     */
    private function organizeGradesByAspects(Collection $grades, array $assessmentStructure): array
    {
        $organized = [];
        
        foreach ($grades as $grade) {
            $aspectId = $grade->assessment_aspect_id;
            $organized[$aspectId] = [
                'grade_value' => $grade->grade_value,
                'notes' => $grade->notes,
                'teacher' => [
                    'id' => $grade->teacher->id,
                    'name' => $grade->teacher->name,
                ],
                'created_at' => $grade->created_at,
                'updated_at' => $grade->updated_at,
            ];
        }
        
        return $organized;
    }
    
    /**
     * Build complete report structure with grades
     * 
     * @param array $assessmentStructure
     * @param array $organizedGrades
     * @return array
     */
    private function buildReportStructure(array $assessmentStructure, array $organizedGrades): array
    {
        return $this->buildStructureWithGrades($assessmentStructure, $organizedGrades);
    }
    
    /**
     * Recursively build structure with grades
     * 
     * @param array $structure
     * @param array $organizedGrades
     * @return array
     */
    private function buildStructureWithGrades(array $structure, array $organizedGrades): array
    {
        $result = [];
        
        foreach ($structure as $aspect) {
            $node = [
                'id' => $aspect['id'],
                'name' => $aspect['name'],
                'input_type' => $aspect['input_type'],
                'order' => $aspect['order'],
                'grade_data' => $organizedGrades[$aspect['id']] ?? null,
            ];
            
            // Recursively process children
            if (!empty($aspect['children'])) {
                $node['children'] = $this->buildStructureWithGrades($aspect['children'], $organizedGrades);
            }
            
            $result[] = $node;
        }
        
        return $result;
    }
    
    /**
     * Calculate summary statistics
     * 
     * @param Collection $grades
     * @param array $assessmentStructure
     * @return array
     */
    private function calculateSummaryStats(Collection $grades, array $assessmentStructure): array
    {
        $stats = [
            'total_aspects' => $this->countTotalAspects($assessmentStructure),
            'graded_aspects' => $grades->count(),
            'completion_percentage' => 0,
            'average_numeric_score' => 0,
            'grade_distribution' => [],
        ];
        
        if ($stats['total_aspects'] > 0) {
            $stats['completion_percentage'] = round(($stats['graded_aspects'] / $stats['total_aspects']) * 100, 2);
        }
        
        // Calculate average numeric score
        $numericGrades = $grades->filter(function ($grade) {
            return is_numeric($grade->grade_value);
        });
        
        if ($numericGrades->count() > 0) {
            $stats['average_numeric_score'] = round($numericGrades->avg('grade_value'), 2);
        }
        
        // Calculate grade distribution
        $stats['grade_distribution'] = $grades->groupBy('grade_value')
            ->map(function ($group) {
                return $group->count();
            })
            ->toArray();
        
        return $stats;
    }
    
    /**
     * Count total aspects in structure
     * 
     * @param array $structure
     * @return int
     */
    private function countTotalAspects(array $structure): int
    {
        $count = 0;
        
        foreach ($structure as $aspect) {
            $count++;
            if (!empty($aspect['children'])) {
                $count += $this->countTotalAspects($aspect['children']);
            }
        }
        
        return $count;
    }
    
    /**
     * Get report data for multiple students
     * 
     * @param Collection $students
     * @param int|null $year
     * @return array
     */
    public function generateBulkReportData(Collection $students, ?int $year = null): array
    {
        $reports = [];
        
        foreach ($students as $student) {
            $reports[] = $this->generateReportData($student, $year);
        }
        
        return [
            'reports' => $reports,
            'total_students' => count($reports),
            'academic_year' => $year ?? now()->year,
            'generated_at' => now()->toISOString(),
        ];
    }
    
    /**
     * Get report data filtered by specific criteria
     * 
     * @param User $student
     * @param array $filters
     * @return array
     */
    public function generateFilteredReportData(User $student, array $filters = []): array
    {
        $year = $filters['year'] ?? now()->year;
        $aspectIds = $filters['aspect_ids'] ?? null;
        $teacherIds = $filters['teacher_ids'] ?? null;
        
        // Get base report data
        $baseData = $this->generateReportData($student, $year);
        
        // Apply filters if specified
        if ($aspectIds || $teacherIds) {
            $baseData['report_structure'] = $this->filterReportStructure(
                $baseData['report_structure'],
                $aspectIds,
                $teacherIds
            );
        }
        
        return $baseData;
    }
    
    /**
     * Filter report structure based on criteria
     * 
     * @param array $structure
     * @param array|null $aspectIds
     * @param array|null $teacherIds
     * @return array
     */
    private function filterReportStructure(array $structure, ?array $aspectIds, ?array $teacherIds): array
    {
        $filtered = [];
        
        foreach ($structure as $aspect) {
            $includeAspect = true;
            
            // Filter by aspect ID
            if ($aspectIds && !in_array($aspect['id'], $aspectIds)) {
                $includeAspect = false;
            }
            
            // Filter by teacher ID
            if ($teacherIds && $aspect['grade_data'] && 
                !in_array($aspect['grade_data']['teacher']['id'], $teacherIds)) {
                $includeAspect = false;
            }
            
            if ($includeAspect) {
                $filteredAspect = $aspect;
                
                // Recursively filter children
                if (!empty($aspect['children'])) {
                    $filteredAspect['children'] = $this->filterReportStructure(
                        $aspect['children'],
                        $aspectIds,
                        $teacherIds
                    );
                }
                
                $filtered[] = $filteredAspect;
            }
        }
        
        return $filtered;
    }
} 