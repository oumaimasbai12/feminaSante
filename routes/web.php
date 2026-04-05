<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});

// Menopause Routes
Route::prefix('menopause')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Menopause/Index');
    });
});

// Pregnancy Routes
Route::prefix('pregnancy')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Pregnancy/Index');
    });
    Route::get('/tools', function () {
        return Inertia::render('Pregnancy/Tools');
    });
    Route::get('/week-by-week', function () {
        return Inertia::render('Pregnancy/WeekByWeek');
    });
});

// Diseases Routes
Route::prefix('diseases')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Diseases/Index');
    });
    Route::get('/library', function () {
        return Inertia::render('Diseases/Library');
    });
    Route::get('/symptom-checker', function () {
        return Inertia::render('Diseases/SymptomChecker');
    });
    Route::get('/category/{slug?}', function () {
        return Inertia::render('Diseases/Category');
    });
    Route::get('/{slug}', function ($slug) {
        return Inertia::render('Diseases/Show', ['diseaseSlug' => $slug]);
    });
});

// Cycle Routes
Route::prefix('cycle')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Cycle/Index');
    });
    Route::get('/history', function () {
        return Inertia::render('Cycle/History');
    });
});

