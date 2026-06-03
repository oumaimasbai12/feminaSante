<?php

return [

    // Months without menstruation required to classify as post-menopause (clinical 12-month rule).
    'postmenopause_months' => 12,

    // Minimum age to enable menopause tracking (typical perimenopause onset).
    'min_tracking_age' => 45,

    // Predefined symptom catalog — seeded into menopause_symptoms table.
    'symptoms' => [
        ['slug' => 'hot_flashes', 'name_fr' => 'Bouffées de chaleur', 'category' => 'vasomotor', 'sort_order' => 1],
        ['slug' => 'night_sweats', 'name_fr' => 'Sueurs nocturnes', 'category' => 'vasomotor', 'sort_order' => 2],
        ['slug' => 'mood_changes', 'name_fr' => 'Sautes d\'humeur', 'category' => 'psychological', 'sort_order' => 3],
        ['slug' => 'sleep_changes', 'name_fr' => 'Troubles du sommeil', 'category' => 'sleep', 'sort_order' => 4],
        ['slug' => 'fatigue', 'name_fr' => 'Fatigue', 'category' => 'general', 'sort_order' => 5],
        ['slug' => 'brain_fog', 'name_fr' => 'Brouillard mental', 'category' => 'cognitive', 'sort_order' => 6],
        ['slug' => 'joint_pain', 'name_fr' => 'Douleurs articulaires', 'category' => 'physical', 'sort_order' => 7],
        ['slug' => 'headaches', 'name_fr' => 'Maux de tête', 'category' => 'physical', 'sort_order' => 8],
        ['slug' => 'weight_gain', 'name_fr' => 'Prise de poids', 'category' => 'physical', 'sort_order' => 9],
        ['slug' => 'dry_skin', 'name_fr' => 'Sécheresse cutanée', 'category' => 'physical', 'sort_order' => 10],
        ['slug' => 'libido_changes', 'name_fr' => 'Changements de libido', 'category' => 'sexual', 'sort_order' => 11],
        ['slug' => 'cycle_irregularity', 'name_fr' => 'Irrégularité du cycle', 'category' => 'menstrual', 'sort_order' => 12],
    ],

    // Correlation thresholds: alert when symptom spike coincides with lifestyle factor.
    'correlation_rules' => [
        [
            'symptom_slug' => 'hot_flashes',
            'factor' => 'stress_level',
            'threshold' => 7,
            'message' => 'Vos bouffées de chaleur semblent plus fréquentes les jours où votre niveau de stress est élevé (≥ 7/10).',
        ],
        [
            'symptom_slug' => 'hot_flashes',
            'factor' => 'caffeine_cups',
            'threshold' => 3,
            'message' => 'La consommation de caféine (≥ 3 tasses) pourrait amplifier vos bouffées de chaleur.',
        ],
        [
            'symptom_slug' => 'sleep_changes',
            'factor' => 'caffeine_cups',
            'threshold' => 2,
            'message' => 'Un sommeil perturbé coïncide souvent avec une consommation élevée de caféine.',
        ],
        [
            'symptom_slug' => 'mood_changes',
            'factor' => 'stress_level',
            'threshold' => 6,
            'message' => 'Vos sautes d\'humeur sont plus marquées lorsque le stress dépasse 6/10.',
        ],
        [
            'symptom_slug' => 'night_sweats',
            'factor' => 'alcohol_units',
            'threshold' => 2,
            'message' => 'Les sueurs nocturnes semblent plus fréquentes après consommation d\'alcool (≥ 2 unités).',
        ],
    ],

    'stage_tips' => [
        'perimenopause' => [
            'title' => 'Périménopause',
            'tip' => 'Les cycles peuvent devenir irréguliers. Notez vos symptômes quotidiennement pour identifier des schémas et en discuter avec votre professionnel de santé.',
        ],
        'menopause' => [
            'title' => 'Ménopause',
            'tip' => 'La ménopause est confirmée après 12 mois sans règles. Maintenez un mode de vie équilibré et suivez vos traitements prescrits.',
        ],
        'postmenopause' => [
            'title' => 'Post-ménopause',
            'tip' => 'Après la ménopause, la prévention osseuse et cardiovasculaire devient prioritaire. Consultez régulièrement votre médecin.',
        ],
    ],

];
