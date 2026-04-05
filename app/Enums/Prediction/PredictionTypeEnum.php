<?php

namespace App\Enums\Prediction;

enum PredictionTypeEnum: string
{
    case PERIOD = 'period';
    case OVULATION = 'ovulation';
    case FERTILE_WINDOW = 'fertile_window';
}
