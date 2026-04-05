<?php

namespace App\Enums\Cycle;

enum MoodEnum: string
{
    case HAPPY = 'happy';
    case SAD = 'sad';
    case IRRITABLE = 'irritable';
    case ANXIOUS = 'anxious';
    case CALM = 'calm';
    case OTHER = 'other';
}
