<?php

namespace App\Enums\Pregnancy;

enum TimeToTenKicksEnum: string
{
    case UNDER_30MIN = '<30min';
    case FROM_30_TO_60MIN = '30-60min';
    case FROM_1_TO_2HOURS = '1-2hours';
    case OVER_2HOURS = '>2hours';
}
