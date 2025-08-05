<?php

use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\AssessmentAspectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:admin,guru'])->group(function () {
    Route::get('/dashboard', function () {
        return 'Dashboard khusus admin dan guru';
    });
    
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('curriculum-templates', CurriculumController::class)->except([
        'edit', 'show',
    ]);
    Route::post('curriculum-templates/{curriculum_template}/assessment-aspects', [AssessmentAspectController::class, 'store'])->name('curriculum-templates.assessment-aspects.store');
    
    // Routes untuk manajemen kurikulum
    Route::get('/admin/curriculum', [CurriculumController::class, 'index'])->name('admin.curriculum.index');
    Route::post('/admin/curriculum/aspects', [CurriculumController::class, 'storeAspect'])->name('admin.curriculum.aspects.store');
    Route::put('/admin/curriculum/aspects/{aspect}', [CurriculumController::class, 'updateAspect'])->name('admin.curriculum.aspects.update');
    Route::delete('/admin/curriculum/aspects/{aspect}', [CurriculumController::class, 'destroyAspect'])->name('admin.curriculum.aspects.destroy');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';