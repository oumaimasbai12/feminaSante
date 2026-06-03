<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Gynecologist;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class GynecologistController extends Controller
{
    public function adminIndex(): JsonResponse
    {
        $gynecologists = Gynecologist::query()
            ->with('user:id,email,is_gynecologist')
            ->withCount([
                'appointments',
                'availabilities as upcoming_availabilities_count' => fn ($q) => $q
                    ->where('is_available', true)
                    ->whereDate('date', '>=', now()->toDateString()),
            ])
            ->orderByDesc('rating')
            ->get()
            ->map(fn (Gynecologist $g) => [
                ...$g->toArray(),
                'has_portal_account' => (bool) $g->user_id,
                'portal_email' => $g->user?->email ?? $g->email,
            ]);

        return response()->json($gynecologists);
    }

    public function index(Request $request): JsonResponse
    {
        $gynecologists = Gynecologist::query()
            ->active()
            ->byCity($request->string('city')->toString() ?: null)
            ->bySpeciality($request->string('speciality')->toString() ?: null)
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = '%'.$request->string('search').'%';
                $query->where(function ($q) use ($term) {
                    $q->where('first_name', 'like', $term)
                        ->orWhere('last_name', 'like', $term)
                        ->orWhere('speciality', 'like', $term);
                });
            })
            ->orderByDesc('rating')
            ->get();

        return response()->json($gynecologists);
    }

    public function filters(): JsonResponse
    {
        $base = Gynecologist::query()->active();

        return response()->json([
            'cities' => (clone $base)->distinct()->orderBy('city')->pluck('city')->filter()->values(),
            'specialities' => (clone $base)->distinct()->orderBy('speciality')->pluck('speciality')->filter()->values(),
            'common_reasons' => config('appointments.common_reasons', []),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'speciality' => ['nullable', 'string'],
            'license_number' => ['nullable', 'string', 'max:50', 'unique:gynecologists,license_number'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'adress' => ['required_without:address', 'string'],
            'address' => ['required_without:adress', 'string'],
            'city' => ['required', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'consultation_type' => ['nullable', 'array'],
            'consultation_duration' => ['nullable', 'integer'],
            'consultation_fee' => ['nullable', 'numeric'],
            'bio' => ['nullable', 'string'],
            'languages_spoken' => ['nullable', 'array'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $password = $data['password'] ?? 'Gynecologue123!';
        $nom = trim("{$data['first_name']} {$data['last_name']}");

        $gynecologist = DB::transaction(function () use ($data, $password, $nom) {
            $user = User::create([
                'nom' => $nom,
                'email' => $data['email'],
                'motDePasse' => Hash::make($password),
                'is_gynecologist' => true,
                'birth_date' => '1980-01-01',
                'gender' => 'female',
                'langage' => 'fr',
            ]);

            return Gynecologist::create([
                ...$data,
                'user_id' => $user->id,
                'adress' => $data['adress'] ?? $data['address'],
                'consultation_duration' => $data['consultation_duration'] ?? 30,
                'rating' => 0,
                'review_count' => 0,
                'is_active' => false,
            ]);
        });

        return response()->json([
            'message' => 'Gynécologue créée avec compte de connexion. Le profil sera visible après ajout de disponibilités.',
            'gynecologist' => $gynecologist->load('user:id,email'),
            'temporary_password' => $data['password'] ?? null ? null : $password,
        ], 201);
    }

    public function show(Request $request, Gynecologist $gynecologist): JsonResponse
    {
        if (! $gynecologist->is_active && ! $request->user()?->is_admin) {
            return response()->json(['message' => 'Gynecologist not available.'], 404);
        }

        return response()->json(
            $gynecologist->load(['availabilities', 'user:id,email,is_gynecologist'])
        );
    }

    public function update(Request $request, Gynecologist $gynecologist): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'speciality' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'adress' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'consultation_type' => ['nullable', 'array'],
            'consultation_duration' => ['nullable', 'integer'],
            'consultation_fee' => ['nullable', 'numeric'],
            'bio' => ['nullable', 'string'],
            'languages_spoken' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        DB::transaction(function () use ($data, $gynecologist) {
            $gynecologist->update(collect($data)->except('password')->all());

            if ($gynecologist->user_id) {
                $userUpdates = [];
                if (isset($data['first_name']) || isset($data['last_name'])) {
                    $userUpdates['nom'] = trim(($data['first_name'] ?? $gynecologist->first_name).' '.($data['last_name'] ?? $gynecologist->last_name));
                }
                if (! empty($data['email'])) {
                    $userUpdates['email'] = $data['email'];
                }
                if (! empty($data['password'])) {
                    $userUpdates['motDePasse'] = Hash::make($data['password']);
                }
                if ($userUpdates) {
                    User::where('id', $gynecologist->user_id)->update($userUpdates);
                }
            } elseif (! empty($data['email'])) {
                $user = User::create([
                    'nom' => trim("{$gynecologist->first_name} {$gynecologist->last_name}"),
                    'email' => $data['email'],
                    'motDePasse' => Hash::make($data['password'] ?? 'Gynecologue123!'),
                    'is_gynecologist' => true,
                    'birth_date' => '1980-01-01',
                    'gender' => 'female',
                    'langage' => 'fr',
                ]);
                $gynecologist->update(['user_id' => $user->id]);
            }
        });

        return response()->json([
            'message' => 'Mis à jour.',
            'gynecologist' => $gynecologist->fresh()->load('user:id,email'),
        ]);
    }

    public function destroy(Gynecologist $gynecologist): JsonResponse
    {
        DB::transaction(function () use ($gynecologist) {
            $userId = $gynecologist->user_id;
            $gynecologist->delete();

            if ($userId) {
                $user = User::find($userId);
                if ($user && ! $user->is_admin) {
                    $user->delete();
                }
            }
        });

        return response()->json(['message' => 'Praticien supprimé.']);
    }
}
