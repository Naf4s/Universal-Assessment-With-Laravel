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
        Schema::create('assessment_aspects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curriculum_template_id')
                  ->constrained('curriculum_templates')
                  ->onDelete('cascade'); // Jika template dihapus, aspeknya juga terhapus
            $table->foreignId('parent_id')
                  ->nullable()
                  ->constrained('assessment_aspects') // Merujuk ke tabel ini sendiri
                  ->onDelete('cascade'); // Jika parent dihapus, children juga terhapus
            $table->string('name');
            $table->enum('input_type', ['angka', 'huruf', 'biner', 'teks']);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_aspects');
    }
};

