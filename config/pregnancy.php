<?php

return [

    'default_cycle_days' => 280,

    'symptoms' => [
        'Nausées',
        'Fatigue',
        'Maux de dos',
        'Brûlures d\'estomac',
        'Insomnie',
        'Crampes',
        'Maux de tête',
        'Vertiges',
        'Gonflements',
        'Essoufflement',
        'Envies alimentaires',
        'Sautes d\'humeur',
    ],

    'milestones' => [
        ['week' => 8, 'title' => 'Première échographie', 'description' => 'Datation de la grossesse et vérification du rythme cardiaque fœtal.', 'checkup_type' => 'ultrasound'],
        ['week' => 12, 'title' => 'Consultation 1er trimestre', 'description' => 'Bilan de santé, dépistages et conseils nutritionnels.', 'checkup_type' => 'first_trimester'],
        ['week' => 16, 'title' => 'Suivi de routine', 'description' => 'Contrôle de la croissance et des symptômes maternels.', 'checkup_type' => 'routine'],
        ['week' => 22, 'title' => 'Échographie morphologique', 'description' => 'Examen détaillé de l\'anatomie fœtale.', 'checkup_type' => 'ultrasound'],
        ['week' => 28, 'title' => 'Consultation 3e trimestre', 'description' => 'Surveillance tensionnelle, prise de poids et préparation à l\'accouchement.', 'checkup_type' => 'third_trimester'],
        ['week' => 32, 'title' => 'Contrôle de croissance', 'description' => 'Vérification du poids fœtal et de la position.', 'checkup_type' => 'routine'],
        ['week' => 36, 'title' => 'Test de tolérance au glucose', 'description' => 'Dépistage du diabète gestationnel si non réalisé.', 'checkup_type' => 'glucose_test'],
        ['week' => 38, 'title' => 'Consultation pré-accouchement', 'description' => 'Plan de naissance, signes d\'alerte et préparation finale.', 'checkup_type' => 'third_trimester'],
    ],

    'weekly_tips' => [
        1 => ['title' => 'Début de l\'aventure', 'tip' => 'Prenez de l\'acide folique si ce n\'est pas déjà fait et évitez l\'alcool et le tabac.', 'baby_size' => 'Taille d\'une graine de pavot'],
        4 => ['title' => 'Implantation', 'tip' => 'Reposez-vous en cas de fatigue. Une alimentation équilibrée soutient le développement précoce.', 'baby_size' => 'Taille d\'une graine de pavot'],
        8 => ['title' => 'Premier rendez-vous', 'tip' => 'Planifiez votre première échographie. Notez vos questions pour le professionnel de santé.', 'baby_size' => 'Taille d\'une framboise'],
        12 => ['title' => 'Fin du 1er trimestre', 'tip' => 'Les nausées diminuent souvent. Continuez une activité physique douce si votre médecin l\'autorise.', 'baby_size' => 'Taille d\'un citron vert'],
        16 => ['title' => 'Mouvements possibles', 'tip' => 'Vous pourriez commencer à sentir les premiers mouvements. Hydratez-vous régulièrement.', 'baby_size' => 'Taille d\'un avocat'],
        20 => ['title' => 'Moitié du parcours', 'tip' => 'L\'échographie morphologique approche. Surveillez votre prise de poids avec votre équipe soignante.', 'baby_size' => 'Taille d\'une banane'],
        24 => ['title' => 'Viabilité', 'tip' => 'Test de glucose et suivi tensionnel recommandés. Commencez à préparer la valise maternité.', 'baby_size' => 'Taille d\'un épi de maïs'],
        28 => ['title' => '3e trimestre', 'tip' => 'Comptez les mouvements fœtaux quotidiennement. Évitez de rester debout trop longtemps.', 'baby_size' => 'Taille d\'une aubergine'],
        32 => ['title' => 'Préparation active', 'tip' => 'Préparez votre plan de naissance et identifiez les signes d\'alerte à signaler immédiatement.', 'baby_size' => 'Taille d\'une courge'],
        36 => ['title' => 'Dernières semaines', 'tip' => 'Consultations plus fréquentes. Reposez-vous et surveillez contractions et pertes de liquide.', 'baby_size' => 'Taille d\'un melon'],
        40 => ['title' => 'Terme', 'tip' => 'Votre bébé peut arriver à tout moment. Gardez votre maternité et vos documents à portée de main.', 'baby_size' => 'Bébé prêt à naître'],
    ],

];
