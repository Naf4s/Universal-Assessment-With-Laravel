<?php

namespace App\Http\Controllers;

use App\Models\AssessmentAspect;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GradeController extends Controller
{
    /**
     * Menampilkan halaman input penilaian
     */
    public function create()
    {
        $teacher = Auth::user();
        
        // Ambil semua aspek penilaian yang tersedia
        $assessmentAspects = AssessmentAspect::with(['curriculumTemplate'])
            ->orderBy('curriculum_template_id')
            ->orderBy('order')
            ->get()
            ->groupBy('curriculum_template_id');
        
        // Ambil daftar siswa (untuk sementara ambil semua user dengan role siswa)
        // Di implementasi nyata, ini bisa difilter berdasarkan kelas yang diajar guru
        $students = User::where('role', 'siswa')
            ->orderBy('name')
            ->get();
        
        return Inertia::render('Guru/InputPenilaian/Create', [
            'assessmentAspects' => $assessmentAspects,
            'students' => $students,
            'teacher' => $teacher,
        ]);
    }

    /**
     * Menyimpan data nilai yang di-submit
     */
    public function store(Request $request)
    {
        $request->validate([
            'grades' => 'required|array',
            'grades.*.assessment_aspect_id' => 'required|exists:assessment_aspects,id',
            'grades.*.student_id' => 'required|exists:users,id',
            'grades.*.grade_value' => 'required|string',
            'grades.*.notes' => 'nullable|string',
        ]);

        $teacher = Auth::user();
        $savedGrades = [];
        $errors = [];

        foreach ($request->grades as $gradeData) {
            try {
                $grade = Grade::updateOrCreate(
                    [
                        'assessment_aspect_id' => $gradeData['assessment_aspect_id'],
                        'student_id' => $gradeData['student_id'],
                    ],
                    [
                        'teacher_id' => $teacher->id,
                        'grade_value' => $gradeData['grade_value'],
                        'notes' => $gradeData['notes'] ?? null,
                    ]
                );
                
                $savedGrades[] = $grade;
            } catch (\Exception $e) {
                $errors[] = "Error saving grade for student ID {$gradeData['student_id']}: " . $e->getMessage();
            }
        }

        if (!empty($errors)) {
            return back()->withErrors($errors)->withInput();
        }

        return redirect()->route('penilaian.create')
            ->with('success', 'Nilai berhasil disimpan!');
    }
}
