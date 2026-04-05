<?php

namespace App\Enums\Pregnancy;

enum PregnancyTypeEnum: string
{
    case SIMPLE = 'simple';
    case TWINS = 'twins';
    case TRIPLETS = 'triplets';
    case MULTIPLES = 'multiples';
}
