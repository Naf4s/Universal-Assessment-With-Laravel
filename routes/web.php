<?php

use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\AssessmentAspectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirect root to login for unauthenticated users, or dashboard for authenticated users
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

// Dashboard route - accessible to all authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('curriculum-templates', CurriculumController::class)->except([
        'edit', 'show',
    ]);
    Route::post('curriculum-templates/{curriculum_template}/assessment-aspects', [AssessmentAspectController::class, 'store'])->name('curriculum-templates.assessment-aspects.store');
    
    // Routes untuk manajemen kurikulum
    Route::get('/admin/curriculum', [CurriculumController::class, 'index'])->name('admin.curriculum.index');
    Route::get('/admin/curriculum/create', [CurriculumController::class, 'create'])->name('admin.curriculum.create');
    Route::get('/admin/curriculum/{curriculum_template}', [CurriculumController::class, 'show'])->name('admin.curriculum.show');
    Route::post('/admin/curriculum/aspects', [CurriculumController::class, 'storeAspect'])->name('admin.curriculum.aspects.store');
    Route::put('/admin/curriculum/aspects/{aspect}', [CurriculumController::class, 'updateAspect'])->name('admin.curriculum.aspects.update');
    Route::delete('/admin/curriculum/aspects/{aspect}', [CurriculumController::class, 'destroyAspect'])->name('admin.curriculum.aspects.destroy');
    
    // Placeholder routes for admin navigation
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index');
    })->name('users.index');
});

// Guru routes (if needed for specific guru functionality)
Route::middleware(['auth', 'verified', 'role:guru'])->group(function () {
    // Placeholder routes for guru navigation
    Route::get('/my-classes', function () {
        return Inertia::render('Guru/MyClasses/Index');
    })->name('guru.my-classes');
});

// Kepsek routes (if needed for specific kepsek functionality)
Route::middleware(['auth', 'verified', 'role:kepsek'])->group(function () {
    // Placeholder routes for kepsek navigation
    Route::get('/reports', function () {
        return Inertia::render('Kepsek/Reports/Index');
    })->name('kepsek.reports');
});

// Siswa routes (if needed for specific siswa functionality)
Route::middleware(['auth', 'verified', 'role:siswa'])->group(function () {
    // Placeholder routes for siswa navigation
    Route::get('/my-grades', function () {
        return Inertia::render('Siswa/MyGrades/Index');
    })->name('siswa.my-grades');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';