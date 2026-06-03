<?php

namespace App\Services;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Availability;
use App\Models\Appointments\Gynecologist;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentBookingService
{
    /**
     * @return array<int, string>
     */
    public function blockingStatuses(): array
    {
        return config('appointments.blocking_statuses', ['pending', 'confirmed']);
    }

    /**
     * Range overlap: existing.start < new.end AND existing.end > new.start
     */
    public function hasDoctorOverlap(int $gynecologistId, Carbon $start, Carbon $end, ?int $excludeAppointmentId = null): bool
    {
        $query = Appointment::query()
            ->where('gynecologist_id', $gynecologistId)
            ->whereIn('status', $this->blockingStatuses())
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start);

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }

    public function hasUserOverlap(int $userId, Carbon $start, Carbon $end, ?int $excludeAppointmentId = null): bool
    {
        $query = Appointment::query()
            ->where('user_id', $userId)
            ->whereIn('status', $this->blockingStatuses())
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start);

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }

    public function isWithinAvailability(Gynecologist $gynecologist, Carbon $start, Carbon $end): bool
    {
        $date = $start->toDateString();
        $startTime = $start->format('H:i:s');
        $endTime = $end->format('H:i:s');

        return Availability::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->where('is_available', true)
            ->whereDate('date', $date)
            ->where('start_time', '<=', $startTime)
            ->where('end_time', '>=', $endTime)
            ->exists();
    }

    /**
     * @return Collection<int, array{start_time: string, end_time: string, label: string, available: bool}>
     */
    public function getAvailableSlots(Gynecologist $gynecologist, Carbon $date): Collection
    {
        $duration = max(15, (int) ($gynecologist->consultation_duration ?: config('appointments.default_slot_minutes', 30)));
        $now = Carbon::now();

        $availabilities = Availability::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->where('is_available', true)
            ->whereDate('date', $date->toDateString())
            ->orderBy('start_time')
            ->get();

        $booked = Appointment::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->whereIn('status', $this->blockingStatuses())
            ->whereDate('start_time', $date->toDateString())
            ->get(['start_time', 'end_time']);

        $slots = collect();

        foreach ($availabilities as $availability) {
            $blockStart = Carbon::parse($date->toDateString().' '.$this->normalizeTime($availability->start_time));
            $blockEnd = Carbon::parse($date->toDateString().' '.$this->normalizeTime($availability->end_time));

            $cursor = $blockStart->copy();

            while ($cursor->copy()->addMinutes($duration)->lte($blockEnd)) {
                $slotStart = $cursor->copy();
                $slotEnd = $cursor->copy()->addMinutes($duration);

                if ($slotStart->lt($now)) {
                    $cursor->addMinutes($duration);
                    continue;
                }

                $overlaps = $booked->contains(function ($appointment) use ($slotStart, $slotEnd) {
                    return $appointment->start_time->lt($slotEnd) && $appointment->end_time->gt($slotStart);
                });

                if (! $overlaps) {
                    $slots->push([
                        'start_time' => $slotStart->toIso8601String(),
                        'end_time' => $slotEnd->toIso8601String(),
                        'label' => $slotStart->format('H:i'),
                        'available' => true,
                    ]);
                }

                $cursor->addMinutes($duration);
            }
        }

        return $slots->values();
    }

    /**
     * Upcoming dates with at least one bookable slot.
     *
     * @return Collection<int, array{date: string, label: string, slots_count: int, windows: Collection}>
     */
    public function getUpcomingAvailability(Gynecologist $gynecologist, int $daysAhead = 30): Collection
    {
        $from = Carbon::today();
        $to = $from->copy()->addDays($daysAhead);

        $windowsByDate = Availability::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->where('is_available', true)
            ->whereDate('date', '>=', $from)
            ->whereDate('date', '<=', $to)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get()
            ->groupBy(fn ($row) => $row->date->toDateString());

        $results = collect();

        foreach ($windowsByDate as $dateStr => $windows) {
            $date = Carbon::parse($dateStr);
            $slots = $this->getAvailableSlots($gynecologist, $date);

            if ($slots->isEmpty()) {
                continue;
            }

            $results->push([
                'date' => $dateStr,
                'label' => $date->locale('fr')->isoFormat('ddd D MMM'),
                'slots_count' => $slots->count(),
                'windows' => $windows->map(fn ($w) => [
                    'start' => substr($this->normalizeTime($w->start_time), 0, 5),
                    'end' => substr($this->normalizeTime($w->end_time), 0, 5),
                ])->values(),
            ]);
        }

        return $results->values();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function book(User $user, array $data): Appointment
    {
        $gynecologist = Gynecologist::query()
            ->active()
            ->findOrFail($data['gynecologist_id']);

        $start = Carbon::parse($data['start_time']);
        $end = Carbon::parse($data['end_time']);

        if ($start->lte(Carbon::now())) {
            throw ValidationException::withMessages([
                'start_time' => ['Ce créneau est déjà passé.'],
            ]);
        }

        if ($end->lte($start)) {
            throw ValidationException::withMessages([
                'end_time' => ['L\'heure de fin doit être après l\'heure de début.'],
            ]);
        }

        if (! $this->isWithinAvailability($gynecologist, $start, $end)) {
            throw ValidationException::withMessages([
                'start_time' => ['Ce créneau n\'est pas disponible pour ce médecin.'],
            ]);
        }

        return DB::transaction(function () use ($user, $gynecologist, $data, $start, $end) {
            if ($this->hasDoctorOverlap($gynecologist->id, $start, $end)) {
                throw ValidationException::withMessages([
                    'start_time' => ['Ce créneau vient d\'être réservé. Veuillez en choisir un autre.'],
                ]);
            }

            if ($this->hasUserOverlap($user->id, $start, $end)) {
                throw ValidationException::withMessages([
                    'start_time' => ['Vous avez déjà un rendez-vous sur ce créneau.'],
                ]);
            }

            return Appointment::create([
                'user_id' => $user->id,
                'gynecologist_id' => $gynecologist->id,
                'start_time' => $start,
                'end_time' => $end,
                'status' => 'pending',
                'consultation_type' => $data['consultation_type'] ?? 'in_person',
                'reason' => $data['reason'] ?? null,
                'notes' => $data['notes'] ?? null,
                'is_first_visit' => (bool) ($data['is_first_visit'] ?? false),
            ]);
        });
    }

    private function normalizeTime(mixed $time): string
    {
        if ($time instanceof Carbon) {
            return $time->format('H:i:s');
        }

        $value = (string) $time;

        return strlen($value) === 5 ? $value.':00' : $value;
    }
}
