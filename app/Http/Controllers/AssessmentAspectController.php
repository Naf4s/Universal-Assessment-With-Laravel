<?php

namespace App\Http\Controllers;

use App\Models\AssessmentAspect;
use App\Models\CurriculumTemplate;
use Illuminate\Http\Request;

class AssessmentAspectController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, CurriculumTemplate $curriculumTemplate)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:assessment_aspects,id',
            'input_type' => 'required|string|in:range,select,text',
        ]);

        $curriculumTemplate->assessmentAspects()->create($request->all());

        return redirect()->back();
    }
}
