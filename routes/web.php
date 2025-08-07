<?php

use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\AssessmentAspectController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TestReportController;
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
    
    // Report routes - accessible to all authenticated users
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/student/{student?}', [ReportController::class, 'showStudentReport'])->name('student');
        Route::get('/student/{student}/filtered', [ReportController::class, 'showFilteredReport'])->name('filtered');
        Route::get('/export/{student?}', [ReportController::class, 'exportReport'])->name('export');
        Route::get('/years/{student?}', [ReportController::class, 'getAvailableYears'])->name('years');
        Route::get('/stats/{student?}', [ReportController::class, 'getReportStats'])->name('stats');
    });
    
    // API Route untuk mendapatkan siswa berdasarkan kelas
    Route::get('/api/classes/{classId}/students', [ReportController::class, 'getStudentsByClass'])->name('api.classes.students');
    
    // Test routes for development (only in local environment)
    if (app()->environment('local')) {
        Route::prefix('test')->name('test.')->group(function () {
            Route::get('/report-structure', [TestReportController::class, 'testReportStructure'])->name('report-structure');
            Route::get('/assessment-structure', [TestReportController::class, 'testAssessmentStructure'])->name('assessment-structure');
            Route::get('/student-grades', [TestReportController::class, 'testStudentGrades'])->name('student-grades');
        });
    }
});

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // We'll remove the `except` for 'edit' and 'show' if we want to use the resource for these, 
    // but since you have custom prefixed routes, let's just make sure the custom ones are complete.
    // Route::resource('curriculum-templates', CurriculumController::class)->except([
    //     'edit', 'show',
    // ]);
    // Removed the above resource definition to avoid confusion with custom routes below.

    Route::post('curriculum-templates/{curriculum_template}/assessment-aspects', [AssessmentAspectController::class, 'store'])->name('curriculum-templates.assessment-aspects.store');
    
    // Routes for curriculum management
    Route::get('/admin/curriculum', [CurriculumController::class, 'index'])->name('admin.curriculum.index');
    Route::get('/admin/curriculum/create', [CurriculumController::class, 'create'])->name('admin.curriculum.create');
    Route::get('/admin/curriculum/{curriculum_template}', [CurriculumController::class, 'show'])->name('admin.curriculum.show');
    Route::get('/admin/curriculum/{curriculum_template}/edit', [CurriculumController::class, 'edit'])->name('admin.curriculum.edit'); 
    Route::put('/admin/curriculum/{curriculum_template}', [CurriculumController::class, 'update'])->name('admin.curriculum.update'); 
    Route::post('/admin/curriculum', [CurriculumController::class, 'store'])->name('admin.curriculum.store');
    Route::delete('/admin/curriculum/{curriculum_template}', [CurriculumController::class, 'destroy'])->name('admin.curriculum.destroy');
    Route::post('/admin/curriculum/aspects', [CurriculumController::class, 'storeAspect'])->name('admin.curriculum.aspects.store');
    Route::put('/admin/curriculum/aspects/{aspect}', [CurriculumController::class, 'updateAspect'])->name('admin.curriculum.aspects.update');
    Route::delete('/admin/curriculum/aspects/{aspect}', [CurriculumController::class, 'destroyAspect'])->name('admin.curriculum.aspects.destroy');
    
    // Placeholder routes for admin navigation
    Route::get('/users', function () {
        return Inertia::render('Admin/Users/Index');
    })->name('users.index');
    
    // Bulk report routes for admin
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/bulk', [ReportController::class, 'showBulkReports'])->name('bulk');
        Route::get('/bulk/export', [ReportController::class, 'exportBulkReports'])->name('bulk.export');
    });
});

// Guru routes (if needed for specific guru functionality)
Route::middleware(['auth', 'verified', 'role:guru'])->group(function () {
    // Placeholder routes for guru navigation
    Route::get('/my-classes', function () {
        return Inertia::render('Guru/MyClasses/Index');
    })->name('guru.my-classes');
    
    // Routes for grade input
    Route::get('/input-penilaian', [App\Http\Controllers\GradeController::class, 'create'])->name('penilaian.create');
    Route::post('/input-penilaian', [App\Http\Controllers\GradeController::class, 'store'])->name('penilaian.store');
});

// Kepsek routes (if needed for specific kepsek functionality)
Route::middleware(['auth', 'verified', 'role:kepsek'])->group(function () {
    // Placeholder routes for kepsek navigation
    Route::get('/reports', function () {
        return Inertia::render('Kepsek/Reports/Index');
    })->name('kepsek.reports');
    
    // Bulk report routes for kepsek
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/bulk', [ReportController::class, 'showBulkReports'])->name('bulk');
        Route::get('/bulk/export', [ReportController::class, 'exportBulkReports'])->name('bulk.export');
    });
});


// Siswa routes (if needed for specific siswa functionality)
Route::middleware(['auth', 'verified', 'role:siswa'])->group(function () {
    // Placeholder routes for siswa navigation
    Route::get('/my-grades', function () {
        return Inertia::render('Siswa/MyGrades/Index');
    })->name('siswa.my-grades');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/laporan/cetak', [App\Http\Controllers\ReportController::class, 'create'])
        ->middleware('role:guru,kepsek')
        ->name('laporan.create');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
