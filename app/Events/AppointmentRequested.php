<?php

namespace App\Events;

use App\Models\Appointments\Appointment;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentRequested
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Appointment $appointment
    ) {
        $this->appointment->loadMissing(['gynecologist', 'user']);
    }
}
