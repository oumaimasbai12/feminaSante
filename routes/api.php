<?php

use App\Http\Controllers\Api\Articles\ArticleCategoryController;
use App\Http\Controllers\Api\Articles\ArticleCommentController;
use App\Http\Controllers\Api\Articles\ArticleController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\ProfileController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\CycleController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PredictionController;
use App\Http\Controllers\Api\SymptomController;
use App\Http\Controllers\Api\Diseases\DiseaseCatalogController;
use App\Http\Controllers\Api\Diseases\DiseaseCategoryController;
use App\Http\Controllers\Api\Diseases\SymptomCheckerController;
use App\Http\Controllers\Api\Diseases\PreventionTipsController;
use App\Http\Controllers\Api\Appointments\AppointmentController;
use App\Http\Controllers\Api\Appointments\AvailabilityController;
use App\Http\Controllers\Api\Appointments\GynecologistController;
use App\Http\Controllers\Api\Assistant\ChatController;
use App\Http\Controllers\Api\Quiz\QuestionController;
use App\Http\Controllers\Api\Quiz\QuizController;
use App\Http\Controllers\Api\Quiz\QuizResultController;
use App\Http\Controllers\Api\Pregnancy\ContractionController;
use App\Http\Controllers\Api\Pregnancy\KickCounterController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Pregnancy\PregnancyCheckupController;
use App\Http\Controllers\Api\Pregnancy\PregnancyController;
use App\Http\Controllers\Api\Menopause\MenopauseController;
use App\Http\Controllers\Api\Menopause\MenopauseSymptomLogController;
use App\Http\Controllers\Api\Menopause\MenopauseTreatmentController;
use App\Http\Controllers\Api\Pregnancy\WeightGainController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);

    // Educational disease catalog: readable without auth so the Inertia SPA can load data for guests.
    Route::prefix('diseases')->group(function () {
        Route::get('/catalog', [DiseaseCatalogController::class, 'index']);
        Route::get('/catalog/{slug}', [DiseaseCatalogController::class, 'show']);

        Route::get('/categories', [DiseaseCategoryController::class, 'index']);
        Route::get('/categories/{slug}', [DiseaseCategoryController::class, 'show']);

        Route::post('/symptom-checker', SymptomCheckerController::class);
        Route::get('/prevention-tips', PreventionTipsController::class);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard', DashboardController::class);
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update'])->middleware('log.sensitive');
        Route::post('/logout', [ProfileController::class, 'logout']);

        Route::apiResource('/cycles', CycleController::class);
        Route::apiResource('/symptoms', SymptomController::class)->only(['index', 'store']);
        Route::apiResource('/predictions', PredictionController::class)->only(['index']);

        Route::apiResource('/article-categories', ArticleCategoryController::class)->only(['index', 'store']);
        Route::apiResource('/articles', ArticleController::class)->only(['index', 'store', 'show']);
        Route::post('/articles/{article}/comments', [ArticleCommentController::class, 'store']);

        Route::apiResource('/quizzes', QuizController::class)->only(['index', 'store', 'show']);
        Route::post('/quizzes/{quiz}/questions', [QuestionController::class, 'store']);
        Route::post('/quizzes/{quiz}/submit', [QuizResultController::class, 'store']);

        Route::get('/chats', [ChatController::class, 'index']);
        Route::post('/chats', [ChatController::class, 'store']);
        Route::apiResource('/notifications', NotificationController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

        Route::apiResource('/gynecologists', GynecologistController::class)->only(['index', 'store', 'show']);
        Route::apiResource('/availabilities', AvailabilityController::class)->only(['index', 'store']);
        Route::apiResource('/appointments', AppointmentController::class)->only(['index', 'store', 'show', 'update']);

        Route::apiResource('/pregnancies', PregnancyController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::apiResource('/menopauses', MenopauseController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::get('/menopauses/{menopause}/symptom-logs', [MenopauseSymptomLogController::class, 'index']);
        Route::post('/menopauses/{menopause}/symptom-logs', [MenopauseSymptomLogController::class, 'store']);
        Route::get('/menopauses/{menopause}/treatments', [MenopauseTreatmentController::class, 'index']);
        Route::post('/menopauses/{menopause}/treatments', [MenopauseTreatmentController::class, 'store']);
        Route::get('/menopause-symptom-logs/{menopauseSymptomLog}', [MenopauseSymptomLogController::class, 'show']);
        Route::put('/menopause-symptom-logs/{menopauseSymptomLog}', [MenopauseSymptomLogController::class, 'update']);
        Route::patch('/menopause-symptom-logs/{menopauseSymptomLog}', [MenopauseSymptomLogController::class, 'update']);
        Route::delete('/menopause-symptom-logs/{menopauseSymptomLog}', [MenopauseSymptomLogController::class, 'destroy']);
        Route::get('/menopause-treatments/{menopauseTreatment}', [MenopauseTreatmentController::class, 'show']);
        Route::put('/menopause-treatments/{menopauseTreatment}', [MenopauseTreatmentController::class, 'update']);
        Route::patch('/menopause-treatments/{menopauseTreatment}', [MenopauseTreatmentController::class, 'update']);
        Route::delete('/menopause-treatments/{menopauseTreatment}', [MenopauseTreatmentController::class, 'destroy']);
        Route::get('/pregnancies/{pregnancy}/checkups', [PregnancyCheckupController::class, 'index']);
        Route::post('/pregnancies/{pregnancy}/checkups', [PregnancyCheckupController::class, 'store']);
        Route::get('/pregnancy-checkups/{pregnancyCheckup}', [PregnancyCheckupController::class, 'show']);
        Route::put('/pregnancy-checkups/{pregnancyCheckup}', [PregnancyCheckupController::class, 'update']);
        Route::patch('/pregnancy-checkups/{pregnancyCheckup}', [PregnancyCheckupController::class, 'update']);
        Route::delete('/pregnancy-checkups/{pregnancyCheckup}', [PregnancyCheckupController::class, 'destroy']);

        Route::get('/pregnancies/{pregnancy}/kicks', [KickCounterController::class, 'index']);
        Route::post('/pregnancies/{pregnancy}/kicks', [KickCounterController::class, 'store']);
        Route::get('/kick-counters/{kickCounter}', [KickCounterController::class, 'show']);
        Route::put('/kick-counters/{kickCounter}', [KickCounterController::class, 'update']);
        Route::patch('/kick-counters/{kickCounter}', [KickCounterController::class, 'update']);
        Route::delete('/kick-counters/{kickCounter}', [KickCounterController::class, 'destroy']);

        Route::get('/pregnancies/{pregnancy}/contractions', [ContractionController::class, 'index']);
        Route::post('/pregnancies/{pregnancy}/contractions', [ContractionController::class, 'store']);
        Route::get('/contractions/{contraction}', [ContractionController::class, 'show']);
        Route::put('/contractions/{contraction}', [ContractionController::class, 'update']);
        Route::patch('/contractions/{contraction}', [ContractionController::class, 'update']);
        Route::delete('/contractions/{contraction}', [ContractionController::class, 'destroy']);

        Route::get('/pregnancies/{pregnancy}/weight-gains', [WeightGainController::class, 'index']);
        Route::post('/pregnancies/{pregnancy}/weight-gains', [WeightGainController::class, 'store']);
        Route::get('/weight-gains/{weightGain}', [WeightGainController::class, 'show']);
        Route::put('/weight-gains/{weightGain}', [WeightGainController::class, 'update']);
        Route::patch('/weight-gains/{weightGain}', [WeightGainController::class, 'update']);
        Route::delete('/weight-gains/{weightGain}', [WeightGainController::class, 'destroy']);

        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::get('/dashboard', \App\Http\Controllers\Api\Admin\AdminDashboardController::class);
            Route::apiResource('/users', \App\Http\Controllers\Api\Admin\UserController::class)->only(['index', 'show', 'destroy']);
        });


    });
});
