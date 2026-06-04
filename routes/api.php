<?php

use App\Http\Controllers\Api\Articles\ArticleCategoryController;
use App\Http\Controllers\Api\Articles\ArticleCommentController;
use App\Http\Controllers\Api\Articles\ArticleController;
use App\Http\Controllers\Api\Articles\ArticleLikeController;
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
use App\Http\Controllers\Api\Appointments\GynecologistAvailabilitySummaryController;
use App\Http\Controllers\Api\Appointments\GynecologistSlotController;
use App\Http\Controllers\Api\Assistant\ChatController;
use App\Http\Controllers\Api\Quiz\QuizPlayController;
use App\Http\Controllers\Api\Quiz\QuestionController;
use App\Http\Controllers\Api\Quiz\QuizController;
use App\Http\Controllers\Api\Quiz\QuizResultController;
use App\Http\Controllers\Api\Pregnancy\ContractionController;
use App\Http\Controllers\Api\Pregnancy\KickCounterController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Pregnancy\PregnancyCheckupController;
use App\Http\Controllers\Api\Pregnancy\PregnancyController;
use App\Http\Controllers\Api\Pregnancy\PregnancyDashboardController;
use App\Http\Controllers\Api\Menopause\MenopauseController;
use App\Http\Controllers\Api\Menopause\MenopauseDashboardController;
use App\Http\Controllers\Api\Menopause\MenopauseSymptomLogController;
use App\Http\Controllers\Api\Menopause\MenopauseTreatmentController;
use App\Http\Controllers\Api\Pregnancy\PregnancySymptomController;
use App\Http\Controllers\Api\Pregnancy\WeightGainController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── AUTH (public) ────────────────────────────────────
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    Route::post('/forgot-password', [\App\Http\Controllers\Api\Auth\PasswordResetController::class, 'request']);
    Route::post('/reset-password', [\App\Http\Controllers\Api\Auth\PasswordResetController::class, 'reset']);

    // ── PUBLIC (no auth needed) ──────────────────────────
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{article}', [ArticleController::class, 'show']);
    Route::get('/article-categories', [ArticleCategoryController::class, 'index']);
    Route::get('/gynecologists/filters', [GynecologistController::class, 'filters']);
    Route::get('/gynecologists', [GynecologistController::class, 'index']);
    Route::get('/gynecologists/{gynecologist}/availability', GynecologistAvailabilitySummaryController::class);
    Route::get('/gynecologists/{gynecologist}/slots', GynecologistSlotController::class);
    Route::get('/gynecologists/{gynecologist}', [GynecologistController::class, 'show']);
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
    Route::get('/quizzes/{quiz}/play', [QuizPlayController::class, 'play']);
    Route::get('/availabilities', [AvailabilityController::class, 'index']);

    // ── PROTECTED ────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard', DashboardController::class);
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update'])->middleware('log.sensitive');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->middleware('log.sensitive');
        Route::post('/logout', [ProfileController::class, 'logout']);

        Route::apiResource('/cycles', CycleController::class);
        Route::apiResource('/symptoms', SymptomController::class)->only(['index', 'store']);
        Route::apiResource('/predictions', PredictionController::class)->only(['index']);

        // Articles — write only (reads are public above)
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::post('/article-categories', [ArticleCategoryController::class, 'store']);
        Route::post('/articles/{article}/comments', [ArticleCommentController::class, 'store']);
        Route::post('/articles/{article}/like', [ArticleLikeController::class, 'toggle']);
        Route::post('/articles/{article}/share', [ArticleLikeController::class, 'share']);

        // Quizzes — write only (reads are public above)
        Route::post('/quizzes', [QuizController::class, 'store']);
        Route::post('/quizzes/{quiz}/questions', [QuestionController::class, 'store']);
        Route::post('/quizzes/{quiz}/questions/{question}/check', [QuizPlayController::class, 'checkAnswer']);
        Route::post('/quizzes/{quiz}/submit', [QuizResultController::class, 'store']);

        Route::get('/chats', [ChatController::class, 'index']);
        Route::post('/chats', [ChatController::class, 'store']);

        Route::apiResource('/notifications', NotificationController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

        Route::post('/availabilities', [AvailabilityController::class, 'store']);

        Route::apiResource('/appointments', AppointmentController::class)->only(['index', 'store', 'show', 'update']);
        Route::put('/appointments/{appointment}/preparation', [AppointmentController::class, 'updatePreparation']);
        Route::get('/visit-summaries', [\App\Http\Controllers\Api\Appointments\VisitSummaryController::class, 'index']);
        Route::get('/gynecologists/{gynecologist}/messages', [\App\Http\Controllers\Api\Appointments\PatientConsultationMessageController::class, 'index']);
        Route::post('/gynecologists/{gynecologist}/messages', [\App\Http\Controllers\Api\Appointments\PatientConsultationMessageController::class, 'store']);

        Route::apiResource('/pregnancies', PregnancyController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::get('/pregnancies/{pregnancy}/dashboard', [PregnancyDashboardController::class, 'show']);
        Route::get('/pregnancies/{pregnancy}/export', [PregnancyDashboardController::class, 'export']);
        Route::apiResource('/menopauses', MenopauseController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::get('/menopauses/{menopause}/dashboard', [MenopauseDashboardController::class, 'show']);
        Route::get('/menopause-symptoms/catalog', [MenopauseDashboardController::class, 'symptomCatalog']);
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

        Route::get('/pregnancies/{pregnancy}/symptoms', [PregnancySymptomController::class, 'index']);
        Route::post('/pregnancies/{pregnancy}/symptoms', [PregnancySymptomController::class, 'store']);
        Route::get('/pregnancy-symptoms/{pregnancySymptom}', [PregnancySymptomController::class, 'show']);
        Route::put('/pregnancy-symptoms/{pregnancySymptom}', [PregnancySymptomController::class, 'update']);
        Route::patch('/pregnancy-symptoms/{pregnancySymptom}', [PregnancySymptomController::class, 'update']);
        Route::delete('/pregnancy-symptoms/{pregnancySymptom}', [PregnancySymptomController::class, 'destroy']);

        Route::prefix('diseases')->group(function () {
            Route::get('/catalog', [DiseaseCatalogController::class, 'index']);
            Route::get('/catalog/{slug}', [DiseaseCatalogController::class, 'show']);
            Route::get('/categories', [DiseaseCategoryController::class, 'index']);
            Route::get('/categories/{slug}', [DiseaseCategoryController::class, 'show']);
            Route::post('/symptom-checker', SymptomCheckerController::class);
            Route::get('/prevention-tips', PreventionTipsController::class);
        });

        // ── ADMIN ────────────────────────────────────────
        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::get('/wikipedia-import', \App\Http\Controllers\Api\Admin\WikipediaImportController::class);
            Route::get('/dashboard', \App\Http\Controllers\Api\Admin\AdminDashboardController::class);
            Route::get('/appointments', [\App\Http\Controllers\Api\Admin\AdminAppointmentController::class, 'index']);
            Route::apiResource('/users', \App\Http\Controllers\Api\Admin\UserController::class)->only(['index', 'show', 'destroy']);
            Route::get('/gynecologists', [GynecologistController::class, 'adminIndex']);
            Route::post('/gynecologists', [GynecologistController::class, 'store']);
            Route::put('/gynecologists/{gynecologist}', [GynecologistController::class, 'update']);
            Route::delete('/gynecologists/{gynecologist}', [GynecologistController::class, 'destroy']);
            Route::put('/articles/{article}', [ArticleController::class, 'update']);
            Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);
        });

        // ── GYNECOLOGIST ─────────────────────────────────
        Route::prefix('gynecologist')->middleware('gynecologist')->group(function () {
            Route::get('/dashboard', \App\Http\Controllers\Api\Gynecologist\DashboardController::class);
            Route::get('/patients', \App\Http\Controllers\Api\Gynecologist\PatientListController::class);
            Route::get('/patients/{user}/messages', [\App\Http\Controllers\Api\Gynecologist\ConsultationMessageController::class, 'index']);
            Route::post('/patients/{user}/messages', [\App\Http\Controllers\Api\Gynecologist\ConsultationMessageController::class, 'store']);
            Route::get('/availabilities', [\App\Http\Controllers\Api\Gynecologist\GynecologistAvailabilityController::class, 'index']);
            Route::post('/availabilities', [\App\Http\Controllers\Api\Gynecologist\GynecologistAvailabilityController::class, 'store']);
            Route::delete('/availabilities/{availability}', [\App\Http\Controllers\Api\Gynecologist\GynecologistAvailabilityController::class, 'destroy']);
            Route::get('/patients/{user}/file', \App\Http\Controllers\Api\Gynecologist\PatientFileController::class);
            Route::put('/patients/{user}/priority', [\App\Http\Controllers\Api\Gynecologist\PatientPriorityController::class, 'update']);
            Route::get('/clinical-notes', [\App\Http\Controllers\Api\Gynecologist\ClinicalNoteController::class, 'index']);
            Route::post('/clinical-notes', [\App\Http\Controllers\Api\Gynecologist\ClinicalNoteController::class, 'store']);
            Route::put('/appointments/{appointment}/confirm', [\App\Http\Controllers\Api\Gynecologist\AppointmentController::class, 'confirm']);
            Route::put('/appointments/{appointment}/refuse', [\App\Http\Controllers\Api\Gynecologist\AppointmentController::class, 'refuse']);
            Route::put('/appointments/{appointment}/complete', [\App\Http\Controllers\Api\Gynecologist\AppointmentController::class, 'complete']);
            Route::put('/appointments/{appointment}/status', [\App\Http\Controllers\Api\Gynecologist\AppointmentController::class, 'updateStatus']);
            Route::put('/appointments/{appointment}/notes', [\App\Http\Controllers\Api\Gynecologist\AppointmentController::class, 'updateNotes']);
        });
    });
});