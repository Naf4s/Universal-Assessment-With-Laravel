<?php

namespace Database\Seeders;

use App\Models\CurriculumTemplate;
use App\Models\AssessmentAspect;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CurriculumTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat template kurikulum
        $template = CurriculumTemplate::create([
            'name' => 'Kurikulum Merdeka 2024',
            'description' => 'Template kurikulum berdasarkan Kurikulum Merdeka untuk tahun ajaran 2024/2025',
            'is_active' => true,
        ]);

        // Buat aspek assessment
        $aspects = [
            [
                'name' => 'Pengetahuan',
                'parent_id' => null,
                'input_type' => 'teks',
                'curriculum_template_id' => $template->id,
            ],
            [
                'name' => 'Keterampilan',
                'parent_id' => null,
                'input_type' => 'teks',
                'curriculum_template_id' => $template->id,
            ],
            [
                'name' => 'Sikap',
                'parent_id' => null,
                'input_type' => 'teks',
                'curriculum_template_id' => $template->id,
            ],
            [
                'name' => 'Nilai Numerik',
                'parent_id' => 1, // Child dari Pengetahuan
                'input_type' => 'angka',
                'curriculum_template_id' => $template->id,
            ],
            [
                'name' => 'Deskripsi',
                'parent_id' => 1, // Child dari Pengetahuan
                'input_type' => 'teks',
                'curriculum_template_id' => $template->id,
            ],
            [
                'name' => 'Praktik',
                'parent_id' => 2, // Child dari Keterampilan
                'input_type' => 'teks',
                'curriculum_template_id' => $template->id,
            ],
            [
                'name' => 'Proyek',
                'parent_id' => 2, // Child dari Keterampilan
                'input_type' => 'teks',
                'curriculum_template_id' => $template->id,
            ],
        ];

        foreach ($aspects as $aspect) {
            AssessmentAspect::create($aspect);
        }

        // Buat template kedua
        $template2 = CurriculumTemplate::create([
            'name' => 'Kurikulum 2013',
            'description' => 'Template kurikulum berdasarkan Kurikulum 2013',
            'is_active' => false,
        ]);

        $aspects2 = [
            [
                'name' => 'Kompetensi Inti',
                'parent_id' => null,
                'input_type' => 'teks',
                'curriculum_template_id' => $template2->id,
            ],
            [
                'name' => 'Kompetensi Dasar',
                'parent_id' => null,
                'input_type' => 'teks',
                'curriculum_template_id' => $template2->id,
            ],
        ];

        foreach ($aspects2 as $aspect) {
            AssessmentAspect::create($aspect);
        }
    }
}
