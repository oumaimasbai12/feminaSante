<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Résumé médical — Grossesse</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #2C2C2C;
            line-height: 1.5;
            background: #FFFFFF;
        }
        .header {
            border-bottom: 2px solid #853953;
            padding-bottom: 14px;
            margin-bottom: 22px;
        }
        .brand {
            font-size: 22px;
            font-weight: bold;
            color: #853953;
            letter-spacing: -0.3px;
        }
        .subtitle {
            color: #6B6B6B;
            font-size: 12px;
            margin-top: 4px;
        }
        h2 {
            font-size: 13px;
            font-weight: bold;
            color: #612D53;
            border-bottom: 1px solid rgba(133, 57, 83, 0.2);
            padding-bottom: 5px;
            margin: 20px 0 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        th, td {
            border: 1px solid #E5E5E5;
            padding: 7px 9px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background: #F3ECEF;
            color: #612D53;
            font-weight: bold;
            width: 35%;
        }
        thead th {
            background: #853953;
            color: #FFFFFF;
            width: auto;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        tbody td {
            background: #FFFFFF;
            color: #2C2C2C;
        }
        tbody tr:nth-child(even) td {
            background: #F9F9F9;
        }
        .grid-2 td { width: 50%; }
        .muted { color: #6B6B6B; font-size: 10px; }
        .disclaimer {
            background: #F9F5F7;
            border: 1px solid rgba(133, 57, 83, 0.22);
            border-left: 4px solid #853953;
            padding: 12px 14px;
            margin-top: 24px;
            font-size: 10px;
            color: #612D53;
            line-height: 1.55;
        }
        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-pending {
            background: #FEF3C7;
            color: #92400E;
            border: 1px solid #FDE68A;
        }
        .badge-done {
            background: #ECFDF5;
            color: #065F46;
            border: 1px solid #A7F3D0;
        }
        .badge-skipped {
            background: #F3F4F4;
            color: #6B6B6B;
            border: 1px solid #E5E5E5;
        }
        .empty { color: #9CA3AF; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">FeminaSante</div>
        <div class="subtitle">Résumé médical de grossesse</div>
        <div class="muted">Généré le {{ \Carbon\Carbon::parse($export['generated_at'])->format('d/m/Y à H:i') }}</div>
    </div>

    <h2>Informations patiente</h2>
    <table>
        <tr><th>Nom</th><td>{{ $export['patient']['name'] ?? '—' }}</td></tr>
        <tr><th>Email</th><td>{{ $export['patient']['email'] ?? '—' }}</td></tr>
        <tr><th>Date de naissance</th><td>{{ $export['patient']['birth_date'] ? \Carbon\Carbon::parse($export['patient']['birth_date'])->format('d/m/Y') : '—' }}</td></tr>
        <tr><th>Groupe sanguin</th><td>{{ $export['patient']['blood_type'] ?? '—' }}</td></tr>
    </table>

    <h2>Suivi de grossesse</h2>
    <table>
        <tr><th>Date des dernières règles</th><td>{{ \Carbon\Carbon::parse($export['pregnancy']['start_date'])->format('d/m/Y') }}</td></tr>
        <tr><th>Date d'accouchement prévue</th><td>{{ $export['pregnancy']['due_date'] ? \Carbon\Carbon::parse($export['pregnancy']['due_date'])->format('d/m/Y') : '—' }}</td></tr>
        <tr><th>Semaine actuelle</th><td>Semaine {{ $export['pregnancy']['current_week'] }} / 40</td></tr>
        <tr><th>Type de grossesse</th><td>
            @switch($export['pregnancy']['pregnancy_type'])
                @case('twins') Jumeaux @break
                @case('triplets') Triplés @break
                @case('multiples') Multiples @break
                @default Simple
            @endswitch
        </td></tr>
        <tr><th>Statut</th><td>{{ ucfirst($export['pregnancy']['statuts']) }}</td></tr>
        <tr><th>Grossesse à risque</th><td>{{ $export['pregnancy']['high_risk'] ? 'Oui' : 'Non' }}</td></tr>
        @if($export['pregnancy']['risk_factors'])
            <tr><th>Facteurs de risque</th><td>{{ $export['pregnancy']['risk_factors'] }}</td></tr>
        @endif
        @if($export['pregnancy']['notes'])
            <tr><th>Notes</th><td>{{ $export['pregnancy']['notes'] }}</td></tr>
        @endif
    </table>

    <h2>Conseil de la semaine {{ $export['weekly_tip']['week'] }}</h2>
    <table>
        <tr><th>Titre</th><td>{{ $export['weekly_tip']['title'] }}</td></tr>
        <tr><th>Conseil</th><td>{{ $export['weekly_tip']['tip'] }}</td></tr>
        <tr><th>Taille du bébé</th><td>{{ $export['weekly_tip']['baby_size'] }}</td></tr>
    </table>

    <h2>Rendez-vous planifiés</h2>
    @if(count($export['milestones']))
        <table>
            <thead>
                <tr>
                    <th>Semaine</th>
                    <th>Titre</th>
                    <th>Date prévue</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                @foreach($export['milestones'] as $milestone)
                    <tr>
                        <td>S{{ $milestone->week }}</td>
                        <td>{{ $milestone->title }}<br><span class="muted">{{ $milestone->description }}</span></td>
                        <td>{{ $milestone->scheduled_date->format('d/m/Y') }}</td>
                        <td>
                            @if($milestone->status === 'completed')<span class="badge badge-done">Fait</span>
                            @elseif($milestone->status === 'skipped')<span class="badge badge-skipped">Ignoré</span>
                            @else<span class="badge badge-pending">Prévu</span>@endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="empty">Aucun rendez-vous planifié.</p>
    @endif

    <h2>Consultations enregistrées</h2>
    @if(count($export['checkups']))
        <table>
            <thead>
                <tr><th>Date</th><th>Semaine</th><th>Type</th><th>Poids</th><th>Notes</th></tr>
            </thead>
            <tbody>
                @foreach($export['checkups'] as $checkup)
                    <tr>
                        <td>{{ $checkup->checkup_date->format('d/m/Y') }}</td>
                        <td>S{{ $checkup->week }}</td>
                        <td>{{ $checkup->checkup_type }}</td>
                        <td>{{ $checkup->weight ? $checkup->weight.' kg' : '—' }}</td>
                        <td>{{ $checkup->notes ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="empty">Aucune consultation enregistrée.</p>
    @endif

    <h2>Suivi du poids</h2>
    @if(count($export['weight_gains']))
        <table>
            <thead>
                <tr><th>Date</th><th>Semaine</th><th>Poids (kg)</th><th>Notes</th></tr>
            </thead>
            <tbody>
                @foreach($export['weight_gains'] as $entry)
                    <tr>
                        <td>{{ $entry->date->format('d/m/Y') }}</td>
                        <td>S{{ $entry->week }}</td>
                        <td>{{ $entry->weight }}</td>
                        <td>{{ $entry->notes ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="empty">Aucune pesée enregistrée.</p>
    @endif

    <h2>Mouvements fœtaux (10 dernières sessions)</h2>
    @if(count($export['kick_counters']))
        <table>
            <thead>
                <tr><th>Date</th><th>Coups</th><th>Durée</th><th>Niveau d'activité</th></tr>
            </thead>
            <tbody>
                @foreach($export['kick_counters']->take(10) as $kick)
                    <tr>
                        <td>{{ $kick->date->format('d/m/Y') }}</td>
                        <td>{{ $kick->kicks_count }}</td>
                        <td>{{ $kick->start_time }} - {{ $kick->end_time ?? '?' }}</td>
                        <td>{{ $kick->activity_level ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="empty">Aucune session enregistrée.</p>
    @endif

    <h2>Contractions (10 dernières)</h2>
    @if(count($export['contractions']))
        <table>
            <thead>
                <tr><th>Début</th><th>Durée (s)</th><th>Intervalle (s)</th><th>Intensité</th></tr>
            </thead>
            <tbody>
                @foreach($export['contractions']->take(10) as $contraction)
                    <tr>
                        <td>{{ $contraction->start_time->format('d/m/Y H:i') }}</td>
                        <td>{{ $contraction->duration_seconds ?? '—' }}</td>
                        <td>{{ $contraction->interval_seconds ?? '—' }}</td>
                        <td>{{ $contraction->intensity ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="empty">Aucune contraction enregistrée.</p>
    @endif

    <h2>Symptômes (20 derniers)</h2>
    @if(count($export['symptoms']))
        <table>
            <thead>
                <tr><th>Date</th><th>Symptôme</th><th>Intensité</th><th>Notes</th></tr>
            </thead>
            <tbody>
                @foreach($export['symptoms']->take(20) as $symptom)
                    <tr>
                        <td>{{ $symptom->recorded_at->format('d/m/Y H:i') }}</td>
                        <td>{{ $symptom->name }}</td>
                        <td>{{ ucfirst($symptom->intensity) }}</td>
                        <td>{{ $symptom->notes ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="empty">Aucun symptôme enregistré.</p>
    @endif

    <div class="disclaimer">
        ⚠️ {{ $export['disclaimer'] }}
    </div>
</body>
</html>
