<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\Articles\Article;
use App\Models\Assistant\Chat;
use App\Models\Appointments\Appointment;
use App\Models\Cycle;
use App\Models\Menopause\Menopause;
use App\Models\Prediction;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Quiz\QuizResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $latestCycle = Cycle::where('user_id', $user->id)->latest('start_date')->first();
        $activePregnancy = Pregnancy::where('user_id', $user->id)
            ->where('statuts', 'ongoing')
            ->latest('start_date')
            ->first();
        $activeMenopause = Menopause::where('user_id', $user->id)
            ->where('status', 'ongoing')
            ->latest('diagnosis_date')
            ->first();
        $nextPrediction = Prediction::where('user_id', $user->id)
            ->whereDate('predicted_date', '>=', now()->toDateString())
            ->orderBy('predicted_date')
            ->first();
        $nextAppointment = Appointment::with('gynecologist')
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('start_time', '>=', now())
            ->orderBy('start_time')
            ->first();
        $latestQuizResult = QuizResult::with('quiz')
            ->where('user_id', $user->id)
            ->latest('completed_at')
            ->first();

        $unreadNotificationsQuery = AppNotification::where('user_id', $user->id)->whereNull('read_at');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'langage' => $user->langage,
            ],
            'stats' => [
                'cycles_count' => Cycle::where('user_id', $user->id)->count(),
                'pregnancies_count' => Pregnancy::where('user_id', $user->id)->count(),
                'menopauses_count' => Menopause::where('user_id', $user->id)->count(),
                'appointments_count' => Appointment::where('user_id', $user->id)->count(),
                'quiz_results_count' => QuizResult::where('user_id', $user->id)->count(),
                'unread_notifications_count' => (clone $unreadNotificationsQuery)->count(),
                'chat_messages_count' => Chat::where('user_id', $user->id)->count(),
            ],
            'health_overview' => [
                'latest_cycle' => $latestCycle,
                'active_pregnancy' => $activePregnancy,
                'active_menopause' => $activeMenopause,
                'next_prediction' => $nextPrediction,
            ],
            'care' => [
                'next_appointment' => $nextAppointment,
                'recent_notifications' => (clone $unreadNotificationsQuery)
                    ->latest('created_at')
                    ->limit(3)
                    ->get(),
            ],
            'learning' => [
                'latest_quiz_result' => $latestQuizResult,
                'featured_articles' => Article::with('category')
                    ->where('status', 'published')
                    ->orderByDesc('is_featured')
                    ->latest('published_at')
                    ->limit(3)
                    ->get(),
            ],
        ]);
    }
}
