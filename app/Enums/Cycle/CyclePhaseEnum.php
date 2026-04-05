<?php

namespace App\Enums\Cycle;

enum CyclePhaseEnum: string
{
    case MENSTRUATION = 'menstruation';
    case FOLLICULAR = 'follicular';
    case OVULATION = 'ovulation';
    case LUTEAL = 'luteal';
}
