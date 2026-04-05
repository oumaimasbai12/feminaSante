<?php

namespace App\Enums\Pregnancy;

enum PregnancyStatusEnum: string
{
    case ONGOING = 'ongoing';
    case COMPLETED = 'completed';
    case MISCARRIAGE = 'miscarriage';
    case TERMINATED = 'terminated';
}
