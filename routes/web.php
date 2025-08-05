<?php

use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\AssessmentAspectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'role:operator,guru'])->group(function () {
    Route::get('/dashboard', function () {
        return 'Dashboard khusus operator dan guru';
    });
    
});

Route::middleware(['role:operator'])->group(function () {
    Route::resource('curriculum-templates', CurriculumController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
