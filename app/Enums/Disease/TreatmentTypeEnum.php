<?php

namespace App\Enums\Disease;

enum TreatmentTypeEnum: string
{
    case MEDICATION = 'medication';
    case SURGERY = 'surgery';
    case THERAPY = 'therapy';
    case LIFESTYLE = 'lifestyle';
    case ALTERNATIVE = 'alternative';
}
