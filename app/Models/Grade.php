<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'assessment_aspect_id',
        'student_id',
        'teacher_id',
        'grade_value',
        'notes',
    ];

    /**
     * Mendapatkan aspek penilaian yang terkait dengan nilai ini.
     */
    public function assessmentAspect(): BelongsTo
    {
        return $this->belongsTo(AssessmentAspect::class);
    }

    /**
     * Mendapatkan siswa yang mendapatkan nilai ini.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Mendapatkan guru yang memberikan nilai ini.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
