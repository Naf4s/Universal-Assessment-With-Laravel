<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_aspect_id')
                  ->constrained('assessment_aspects')
                  ->onDelete('cascade'); // Jika aspek penilaian dihapus, nilai juga terhapus
            $table->foreignId('student_id')
                  ->constrained('users')
                  ->onDelete('cascade'); // Jika siswa dihapus, nilai juga terhapus
            $table->foreignId('teacher_id')
                  ->constrained('users')
                  ->onDelete('cascade'); // Jika guru dihapus, nilai tetap ada tapi bisa dihandle di aplikasi
            $table->text('grade_value'); // Fleksibel untuk angka "85", huruf "A", teks "Tercapai", atau deskripsi
            $table->text('notes')->nullable(); // Catatan tambahan dari guru
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
