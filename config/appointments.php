<?php

return [

    'blocking_statuses' => ['pending', 'confirmed'],

    /** Patient may exchange messages with a gynecologist only after at least one accepted RDV. */
    'patient_message_statuses' => ['confirmed', 'completed'],

    'common_reasons' => [
        'Consultation annuelle',
        'Douleurs pelviennes',
        'Suivi de grossesse',
        'Contraception',
        'Irregularités du cycle',
        'Symptômes de ménopause',
        'Fertilité',
        'Autre',
    ],

    'default_slot_minutes' => 30,

];
