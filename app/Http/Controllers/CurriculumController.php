<?php


namespace App\Http\Controllers;

use App\Models\CurriculumTemplate;
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
        // Ambil semua data template kurikulum, urutkan dari yang terbaru,
        // lalu kirim ke view Inertia.
        return Inertia::render('Admin/Curriculum/Index', [
            'curriculumTemplates' => CurriculumTemplate::with('topLevelAssessmentAspects')->latest()->get(),
        ]);
    }

    /**
    /**
     * Display the specified resource.
     */
    public function show(CurriculumTemplate $curriculumTemplate)
    {
        //
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
}

