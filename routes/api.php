<?php

use App\Http\Controllers\Api\ArticleCategoryController;
use App\Http\Controllers\Api\ArticleCommentController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\ProfileController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\CycleController;
use App\Http\Controllers\Api\PredictionController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\QuizResultController;
use App\Http\Controllers\Api\SymptomController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\GynecologistController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ContractionController;
use App\Http\Controllers\Api\KickCounterController;
use App\Http\Controllers\Api\PregnancyCheckupController;
use App\Http\Controllers\Api\PregnancyController;
use App\Http\Controllers\Api\WeightGainController;

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
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

        Route::apiResource('/gynecologists', GynecologistController::class)->only(['index', 'store', 'show']);
        Route::apiResource('/availabilities', AvailabilityController::class)->only(['index', 'store']);
        Route::apiResource('/appointments', AppointmentController::class)->only(['index', 'store', 'show', 'update']);

        Route::apiResource('/pregnancies', PregnancyController::class)->only(['index', 'store', 'show']);
        Route::post('/pregnancies/{pregnancy}/checkups', [PregnancyCheckupController::class, 'store']);
        Route::post('/pregnancies/{pregnancy}/kicks', [KickCounterController::class, 'store']);
        Route::post('/pregnancies/{pregnancy}/contractions', [ContractionController::class, 'store']);
        Route::post('/pregnancies/{pregnancy}/weight-gains', [WeightGainController::class, 'store']);



    });
});
