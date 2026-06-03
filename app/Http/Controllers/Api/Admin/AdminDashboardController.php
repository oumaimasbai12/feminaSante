<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use App\Models\Appointments\Gynecologist;
use App\Models\Cycle;
use App\Models\Menopause\Menopause;
use App\Models\Pregnancy\Pregnancy;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'total_patients' => User::where('is_admin', false)->where('is_gynecologist', false)->count(),
            'total_gynecologists' => Gynecologist::count(),
            'active_gynecologists' => Gynecologist::where('is_active', true)->count(),
            'total_cycles_logged' => Cycle::count(),
            'total_pregnancies' => Pregnancy::count(),
            'total_menopauses' => Menopause::count(),
            'total_appointments' => Appointment::count(),
            'pending_appointments' => Appointment::where('status', 'pending')->count(),
            'confirmed_appointments' => Appointment::where('status', 'confirmed')->count(),
            'today_appointments' => Appointment::whereDate('start_time', Carbon::today())->count(),
        ];

        $recent_users = User::select('id', 'nom', 'email', 'created_at', 'is_admin', 'is_gynecologist')
            ->where('is_admin', false)
            ->where('is_gynecologist', false)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'nom' => $u->nom,
                'email' => $u->email,
                'created_at' => $u->created_at,
                'role' => 'patient',
            ]);

        $recent_appointments = Appointment::with(['user:id,nom', 'gynecologist:id,first_name,last_name'])
            ->orderByDesc('start_time')
            ->limit(5)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'patient_name' => $a->user?->nom,
                'doctor_name' => $a->gynecologist ? "Dr. {$a->gynecologist->first_name} {$a->gynecologist->last_name}" : null,
                'start_time' => $a->start_time,
                'status' => $a->status,
            ]);

        $charts = [
            'appointments_by_status' => [
                ['label' => 'En attente', 'value' => Appointment::where('status', 'pending')->count()],
                ['label' => 'Confirmés', 'value' => Appointment::where('status', 'confirmed')->count()],
                ['label' => 'Terminés', 'value' => Appointment::where('status', 'completed')->count()],
                ['label' => 'Refusés', 'value' => Appointment::where('status', 'cancelled')->count()],
            ],
            'registrations_last_7_days' => collect(range(6, 0))->map(function ($daysAgo) {
                $date = Carbon::today()->subDays($daysAgo);

                return [
                    'label' => $date->locale('fr')->isoFormat('ddd'),
                    'value' => User::where('is_admin', false)
                        ->where('is_gynecologist', false)
                        ->whereDate('created_at', $date)
                        ->count(),
                ];
            })->values()->all(),
        ];

        return response()->json([
            'message' => 'Dashboard statistics retrieved successfully.',
            'data' => [
                'stats' => $stats,
                'recent_users' => $recent_users,
                'recent_appointments' => $recent_appointments,
                'charts' => $charts,
            ],
        ]);
    }
}
