import React from 'react';
import {
    Lightbulb,
    AlertTriangle,
    BookOpen,
    Pill,
    Plus,
    Clock,
    Smile,
    ThermometerSun,
    RefreshCw,
    Edit3,
} from 'lucide-react';
import GlassCard from '@/Components/UI/GlassCard';
import SymptomChart, { SymptomFrequencyChart } from './SymptomChart';

export default function MenopauseDashboard({
    menopauseId,
    dashboard,
    onRefresh,
    onOpenTab,
    onEditProfile,
}) {
    if (!menopauseId) return null;

    if (!dashboard) {
        return (
            <GlassCard className="p-8 text-center">
                <p className="text-brand-muted mb-4">Impossible de charger le tableau de bord.</p>
                <button type="button" onClick={onRefresh} className="btn-primary text-sm inline-flex items-center gap-2">
                    <RefreshCw size={16} />
                    Réessayer
                </button>
            </GlassCard>
        );
    }

    const { stage_tip, insights, charts, correlations, recent_logs, active_treatments } = dashboard;

    return (
        <div className="space-y-6">
            {stage_tip && (
                <GlassCard className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center shrink-0">
                            <Lightbulb size={20} className="text-brand-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
                                {stage_tip.title}
                            </p>
                            <p className="text-sm text-brand-ink leading-relaxed">{stage_tip.tip}</p>
                        </div>
                    </div>
                </GlassCard>
            )}

            {!insights && (
                <GlassCard className="p-8 text-center">
                    <BookOpen size={36} className="text-brand-border mx-auto mb-3" />
                    <p className="text-brand-ink font-semibold mb-1">Pas encore de données suffisantes</p>
                    <p className="text-sm text-brand-muted mb-4 max-w-md mx-auto">
                        Enregistrez vos symptômes pendant quelques jours pour voir apparaître vos graphiques et
                        insights personnalisés.
                    </p>
                    <button
                        type="button"
                        onClick={() => onOpenTab?.('journal')}
                        className="btn-primary text-sm inline-flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Aller au journal
                    </button>
                </GlassCard>
            )}

            {correlations?.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-brand-ink flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-500" />
                        Insights actionnables
                    </h3>
                    {correlations.map((c, i) => (
                        <GlassCard
                            key={i}
                            className={`p-4 text-sm ${
                                c.severity === 'high'
                                    ? 'border-amber-200 bg-amber-50/80 text-amber-900'
                                    : 'border-sky-200 bg-sky-50/80 text-sky-900'
                            }`}
                        >
                            {c.message}
                            <span className="block text-xs mt-1 opacity-70">
                                Corrélation détectée sur {c.occurrence_rate}% des jours concernés
                            </span>
                        </GlassCard>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SymptomChart title="Humeur (30 jours)" data={charts?.mood_chart || []} color="rose" unit="/10" />
                <SymptomChart title="Sommeil (30 jours)" data={charts?.sleep_chart || []} color="indigo" unit="/10" />
            </div>

            {charts?.symptom_frequency?.length > 0 && (
                <SymptomFrequencyChart data={charts.symptom_frequency} />
            )}

            {active_treatments?.length > 0 && (
                <GlassCard className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-brand-ink flex items-center gap-2">
                            <Pill size={16} className="text-brand-primary" />
                            Traitements en cours
                        </h3>
                        <button
                            type="button"
                            onClick={() => onOpenTab?.('treatments')}
                            className="text-xs font-bold text-brand-primary hover:opacity-80"
                        >
                            Voir tout →
                        </button>
                    </div>
                    <div className="space-y-2">
                        {active_treatments.slice(0, 3).map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between p-3 bg-brand-bg/60 rounded-xl text-sm border border-brand-border"
                            >
                                <span className="font-medium text-brand-ink">{t.name}</span>
                                <span className="text-xs text-brand-muted capitalize">{t.treatment_type}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onEditProfile}
                    className="btn-secondary text-sm inline-flex items-center gap-2"
                >
                    <Edit3 size={16} />
                    Modifier le profil
                </button>
            </div>

            {recent_logs?.length > 0 ? (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-brand-ink flex items-center gap-2">
                            <Clock size={18} className="text-brand-primary" />
                            Historique récent
                        </h3>
                        <button
                            type="button"
                            onClick={() => onOpenTab?.('journal')}
                            className="text-xs font-bold text-brand-primary hover:opacity-80"
                        >
                            Voir le journal →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recent_logs.map((log) => (
                            <GlassCard key={log.id} className="p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-semibold text-brand-ink">
                                        {new Date(log.log_date + 'T12:00:00').toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                        })}
                                    </span>
                                    <SeverityBadge severity={log.severity?.value ?? log.severity} />
                                </div>
                                <div className="flex gap-4 text-sm text-brand-muted">
                                    <span className="flex items-center gap-1">
                                        <Smile size={14} /> {log.mood_score}/10
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {log.sleep_quality}/10
                                    </span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {log.hot_flashes && (
                                        <Tag icon={<ThermometerSun size={10} />} label="Bouffées" />
                                    )}
                                    {log.night_sweats && <Tag label="Sueurs nocturnes" />}
                                    {log.mood_changes && <Tag label="Humeur" />}
                                    {log.sleep_changes && <Tag label="Sommeil" />}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ) : (
                <GlassCard className="p-8 text-center border-dashed">
                    <BookOpen size={32} className="mx-auto text-brand-muted/40 mb-3" />
                    <p className="text-brand-ink font-semibold mb-1">Aucun symptôme enregistré</p>
                    <p className="text-sm text-brand-muted mb-4">
                        Commencez dès aujourd&apos;hui pour suivre l&apos;évolution de vos symptômes.
                    </p>
                    <button
                        type="button"
                        onClick={() => onOpenTab?.('journal')}
                        className="btn-primary text-sm inline-flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Enregistrer mon premier symptôme
                    </button>
                </GlassCard>
            )}
        </div>
    );
}

function SeverityBadge({ severity }) {
    const map = {
        mild: 'bg-green-100 text-green-700',
        moderate: 'bg-amber-100 text-amber-700',
        severe: 'bg-red-100 text-red-700',
    };
    const labels = { mild: 'Légère', moderate: 'Modérée', severe: 'Sévère' };
    return (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${map[severity] || map.moderate}`}>
            {labels[severity] || severity}
        </span>
    );
}

function Tag({ label, icon }) {
    return (
        <span className="px-2 py-0.5 bg-brand-soft text-brand-primary rounded-full text-xs font-medium inline-flex items-center gap-1">
            {icon}
            {label}
        </span>
    );
}
