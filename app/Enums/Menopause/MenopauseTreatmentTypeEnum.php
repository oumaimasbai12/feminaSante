<?php

namespace App\Enums\Menopause;

enum MenopauseTreatmentTypeEnum: string
{
    case MEDICATION = 'medication';
    case THERAPY = 'therapy';
    case LIFESTYLE = 'lifestyle';
    case SUPPLEMENT = 'supplement';
    case ALTERNATIVE = 'alternative';
    case MONITORING = 'monitoring';
}
