<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use App\Models\Cycle;
use App\Models\Menopause\Menopause;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Quiz\QuizResult;
use App\Models\User;
use App\Services\CycleService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function __construct(
        private readonly CycleService $cycleService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $query = User::select('id', 'nom', 'email', 'created_at', 'is_admin', 'is_gynecologist')
            ->where('is_admin', false)
            ->where('is_gynecologist', false)
            ->whereDoesntHave('gynecologistProfile');

        if ($request->filled('search')) {
            $term = '%'.$request->string('search').'%';
            $query->where(function ($q) use ($term) {
                $q->where('nom', 'like', $term)->orWhere('email', 'like', $term);
            });
        }

        $users = $query->orderByDesc('created_at')->paginate(15);

        return response()->json([
            'message' => 'Users retrieved successfully.',
            'data' => $users,
        ]);
    }

    public function show(User $user): JsonResponse
    {
        if ($user->is_admin || $user->is_gynecologist || $user->gynecologistProfile) {
            throw ValidationException::withMessages([
                'user' => ['Ce compte n\'est pas une patiente. Consultez la section Praticiens.'],
            ]);
        }

        $user->load(['pregnancies', 'menopauses']);

        $cycles = Cycle::where('user_id', $user->id)->orderByDesc('start_date')->limit(10)->get();
        $avgLength = $this->cycleService->calculateAverageCycleLength($cycles);
        $latestCycle = $cycles->first();

        $activePregnancy = $user->pregnancies->firstWhere('statuts', 'ongoing')
            ?? $user->pregnancies->sortByDesc('start_date')->first();

        $activeMenopause = $user->menopauses->firstWhere('status', 'ongoing')
            ?? $user->menopauses->sortByDesc('diagnosis_date')->first();

        $appointments = $user->appointments()
            ->with('gynecologist:id,first_name,last_name,city')
            ->orderByDesc('start_time')
            ->limit(10)
            ->get();

        $nextAppointment = Appointment::with('gynecologist:id,first_name,last_name,city')
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('start_time', '>=', now())
            ->orderBy('start_time')
            ->first();

        $allCycles = Cycle::where('user_id', $user->id)->orderBy('start_date')->get();
        $predictions = $allCycles->count() >= 2
            ? $this->cycleService->getPredictions($allCycles)
            : [];
        $nextPeriodPrediction = collect($predictions)->firstWhere('type', 'period');
        $daysUntilNextPeriod = $nextPeriodPrediction
            ? Carbon::now()->diffInDays(Carbon::parse($nextPeriodPrediction['predicted_date']), false)
            : null;

        return response()->json([
            'message' => 'User retrieved successfully.',
            'data' => [
                'user' => $user,
                'current_state' => $this->resolveCurrentState($activePregnancy, $activeMenopause, $latestCycle, $avgLength),
                'stats' => [
                    'cycles_count' => Cycle::where('user_id', $user->id)->count(),
                    'pregnancies_count' => Pregnancy::where('user_id', $user->id)->count(),
                    'menopauses_count' => Menopause::where('user_id', $user->id)->count(),
                    'appointments_count' => Appointment::where('user_id', $user->id)->count(),
                    'quiz_results_count' => QuizResult::where('user_id', $user->id)->count(),
                ],
                'health_overview' => [
                    'latest_cycle' => $latestCycle,
                    'active_pregnancy' => $activePregnancy && ($activePregnancy->statuts === 'ongoing' || ! $activePregnancy->statuts)
                        ? $activePregnancy
                        : null,
                    'active_menopause' => $activeMenopause && ($activeMenopause->status === 'ongoing' || ! $activeMenopause->status)
                        ? $activeMenopause
                        : null,
                    'days_until_next_period' => $daysUntilNextPeriod,
                    'current_cycle_day' => $latestCycle
                        ? $this->cycleService->getCurrentCycleDay($latestCycle, $avgLength ?? 28)
                        : null,
                ],
                'next_appointment' => $nextAppointment,
                'cycles' => $cycles,
                'appointments' => $appointments,
            ],
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->is_admin) {
            throw ValidationException::withMessages([
                'user' => ['Impossible de supprimer un compte administrateur.'],
            ]);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    private function resolveCurrentState(?Pregnancy $pregnancy, ?Menopause $menopause, ?Cycle $cycle, ?int $avgLength): array
    {
        if ($pregnancy && ($pregnancy->statuts === 'ongoing' || ! $pregnancy->statuts)) {
            return [
                'mode' => 'pregnancy',
                'label' => 'Grossesse',
                'detail' => 'Semaine '.($pregnancy->current_week ?? '—'),
            ];
        }

        if ($menopause && ($menopause->status === 'ongoing' || ! $menopause->status)) {
            $stage = $menopause->stage?->value ?? $menopause->stage;

            return [
                'mode' => 'menopause',
                'label' => 'Ménopause',
                'detail' => ucfirst(str_replace('_', ' ', (string) $stage)),
            ];
        }

        if ($cycle) {
            $day = $this->cycleService->getCurrentCycleDay($cycle, $avgLength ?? 28);

            return [
                'mode' => 'cycle',
                'label' => 'Cycle',
                'detail' => 'Jour '.$day,
            ];
        }

        return [
            'mode' => 'none',
            'label' => 'Aucun suivi actif',
            'detail' => null,
        ];
    }
}
