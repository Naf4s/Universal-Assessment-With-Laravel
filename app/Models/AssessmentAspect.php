<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentAspect extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'curriculum_template_id',
        'parent_id',
        'name',
        'input_type',
        'order',
    ];

    /**
     * Mendapatkan template kurikulum yang memiliki aspek penilaian ini.
     */
    public function curriculumTemplate(): BelongsTo
    {
        return $this->belongsTo(CurriculumTemplate::class);
    }

    /**
     * Mendapatkan aspek induk (parent) dari aspek saat ini.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(AssessmentAspect::class, 'parent_id');
    }

    /**
     * Mendapatkan semua aspek anak (children) dari aspek saat ini.
     */
    public function children(): HasMany
    {
        return $this->hasMany(AssessmentAspect::class, 'parent_id');
    }
}

