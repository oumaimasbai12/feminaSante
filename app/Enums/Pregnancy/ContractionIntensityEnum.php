<?php

namespace App\Enums\Pregnancy;

enum ContractionIntensityEnum: string
{
    case MILD = 'mild';
    case MODERATE = 'moderate';
    case STRONG = 'strong';
    case VERY_STRONG = 'very strong';
}
