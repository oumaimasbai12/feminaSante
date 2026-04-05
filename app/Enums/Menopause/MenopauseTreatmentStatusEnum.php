<?php

namespace App\Enums\Menopause;

enum MenopauseTreatmentStatusEnum: string
{
    case PLANNED = 'planned';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case STOPPED = 'stopped';
}
