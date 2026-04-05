<?php

namespace App\Enums;

enum DiseaseCategoryEnum: string
{
    case INFECTION = 'infection';
    case CHRONIC = 'chronic';
    case HORMONAL = 'hormonal';
    case ONCOLOGY = 'oncology';
    case ANATOMICAL = 'anatomical';
    case PREGNANCY_RELATED = 'pregnancy-related';
    case OTHER = 'other';

    public function label(): string
    {
        return match($this) {
            self::INFECTION => 'Infections',
            self::CHRONIC => 'Maladies Chroniques',
            self::HORMONAL => 'Troubles Hormonaux',
            self::ONCOLOGY => 'Oncologie (Cancers)',
            self::ANATOMICAL => 'Anomalies Anatomiques',
            self::PREGNANCY_RELATED => 'Liées à la Grossesse',
            self::OTHER => 'Autres',
        };
    }
}
