<?php


namespace App\Http\Controllers;

use App\Models\CurriculumTemplate;
use App\Models\AssessmentAspect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CurriculumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Ambil semua data template kurikulum dan aspek assessment
        $templates = CurriculumTemplate::with('topLevelAssessmentAspects')
            ->withCount('assessmentAspects')
            ->latest()
            ->get();
            
        $aspects = AssessmentAspect::orderBy('name')->get();

        return Inertia::render('Kurikulum/Index', [
            'templates' => $templates,
            'aspects' => $aspects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Curriculum/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        CurriculumTemplate::create($request->all());

        return redirect()->route('curriculum-templates.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(CurriculumTemplate $curriculumTemplate): Response
    {
        return Inertia::render('Admin/Curriculum/Show', [
            'curriculumTemplate' => $curriculumTemplate->load('assessmentAspects'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CurriculumTemplate $curriculumTemplate)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CurriculumTemplate $curriculumTemplate)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CurriculumTemplate $curriculumTemplate)
    {
        //
    }

    /**
     * Store a newly created assessment aspect.
     */
    public function storeAspect(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|min:3',
            'parent_id' => 'nullable|integer|exists:assessment_aspects,id',
            'input_type' => 'required|string|in:angka,huruf,biner,teks',
        ]);

        AssessmentAspect::create([
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'input_type' => $request->input_type,
            'curriculum_template_id' => 1, // Default template ID, bisa diubah sesuai kebutuhan
        ]);

        return redirect()->back()->with('success', 'Aspek kurikulum berhasil ditambahkan');
    }

    /**
     * Update the specified assessment aspect.
     */
    public function updateAspect(Request $request, AssessmentAspect $aspect)
    {
        $request->validate([
            'name' => 'required|string|max:255|min:3',
            'parent_id' => 'nullable|integer|exists:assessment_aspects,id',
            'input_type' => 'required|string|in:angka,huruf,biner,teks',
        ]);

        $aspect->update([
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'input_type' => $request->input_type,
        ]);

        return redirect()->back()->with('success', 'Aspek kurikulum berhasil diperbarui');
    }

    /**
     * Remove the specified assessment aspect.
     */
    public function destroyAspect(AssessmentAspect $aspect)
    {
        // Cek apakah ada aspek child yang menggunakan parent_id ini
        $hasChildren = AssessmentAspect::where('parent_id', $aspect->id)->exists();
        
        if ($hasChildren) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus aspek yang memiliki sub-aspek');
        }

        $aspect->delete();

        return redirect()->back()->with('success', 'Aspek kurikulum berhasil dihapus');
    }
}
