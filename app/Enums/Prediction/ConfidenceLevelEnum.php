<?php

namespace App\Enums\Prediction;

enum ConfidenceLevelEnum: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
}
