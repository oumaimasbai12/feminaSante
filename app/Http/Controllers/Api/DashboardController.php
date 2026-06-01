<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\Articles\Article;
use App\Models\Assistant\Chat;
use App\Models\Appointments\Appointment;
use App\Models\Cycle;
use App\Models\Menopause\Menopause;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Quiz\QuizResult;
use App\Services\CycleService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request, CycleService $cycleService): JsonResponse
    {
        $user = $request->user();

        $cycles = Cycle::where('user_id', $user->id)->orderBy('start_date')->get();
        $latestCycle = $cycles->last();
        $activePregnancy = Pregnancy::where('user_id', $user->id)
            ->where('statuts', 'ongoing')
            ->latest('start_date')
            ->first();
        $activeMenopause = Menopause::where('user_id', $user->id)
            ->where('status', 'ongoing')
            ->latest('diagnosis_date')
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

        $predictions = $cycles->count() >= 2 ? $cycleService->getPredictions($cycles) : [];
        $nextPeriodPrediction = collect($predictions)->firstWhere('type', 'period');
        $nextOvulationPrediction = collect($predictions)->firstWhere('type', 'ovulation');

        $daysUntilNextPeriod = null;
        if ($nextPeriodPrediction) {
            $daysUntilNextPeriod = Carbon::now()->diffInDays(Carbon::parse($nextPeriodPrediction['predicted_date']), false);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'langage' => $user->langage,
            ],
            'stats' => [
                'cycles_count' => $cycles->count(),
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
                'predictions' => $predictions,
                'days_until_next_period' => $daysUntilNextPeriod,
                'current_cycle_day' => $latestCycle ? $cycleService->getCurrentCycleDay($latestCycle) : null,
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
