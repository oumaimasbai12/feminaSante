<?php

namespace App\Enums\Disease;

enum ResourceTypeEnum: string
{
    case ASSOCIATION = 'association';
    case WEBSITE = 'website';
    case VIDEO = 'video';
    case BOOK = 'book';
    case OTHER = 'other';
}
