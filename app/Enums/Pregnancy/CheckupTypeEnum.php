<?php

namespace App\Enums\Pregnancy;

enum CheckupTypeEnum: string
{
    case FIRST_TRIMESTER_ULTRASOUND = 'first_trimester_ultrasound';
    case SECOND_TRIMESTER_ULTRASOUND = 'second_trimester_ultrasound';
    case THIRD_TRIMESTER_ULTRASOUND = 'third_trimester_ultrasound';
    case BLOOD_TEST = 'blood_test';
    case URINE_TEST = 'urine_test';
    case GLUCOSE_TEST = 'glucose_test';
    case GROUP_B_STREP = 'group_b_strep';
    case GENERAL_CHECKUP = 'general_checkup';
    case OTHER = 'other';
}
