<?php

namespace App\Enums\Quiz;

enum QuizCategoryEnum: string
{
    case CYCLE = 'cycle';
    case PREGNANCY = 'pregnancy';
    case DISEASES = 'diseases';
    case CONTRACEPTION = 'contraception';
    case NUTRITION = 'nutrition';
    case GENERAL = 'general';
}
