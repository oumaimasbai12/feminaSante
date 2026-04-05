<?php

namespace App\Enums\Quiz;

enum QuestionTypeEnum: string
{
    case SINGLE = 'single';
    case MULTIPLE = 'multiple';
    case TRUE_FALSE = 'true_false';
}
