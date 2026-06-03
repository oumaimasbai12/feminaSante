<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['user:id,nom,email', 'gynecologist:id,first_name,last_name,city'])
            ->orderByDesc('start_time');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $term = '%'.$request->string('search').'%';
            $query->where(function ($q) use ($term) {
                $q->where('reason', 'like', $term)
                    ->orWhereHas('user', fn ($u) => $u->where('nom', 'like', $term)->orWhere('email', 'like', $term))
                    ->orWhereHas('gynecologist', fn ($g) => $g->where('first_name', 'like', $term)->orWhere('last_name', 'like', $term));
            });
        }

        return response()->json([
            'message' => 'Appointments retrieved successfully.',
            'data' => $query->paginate(20),
        ]);
    }
}
