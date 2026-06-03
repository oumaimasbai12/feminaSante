import React, { useEffect, useState } from 'react';
import {
    Baby,
    Calendar,
    CheckCircle,
    ChevronRight,
    Download,
    Footprints,
    Lightbulb,
    Scale,
    Stethoscope,
    Thermometer,
    Timer,
    TrendingUp,
    AlertTriangle,
} from 'lucide-react';
import GlassCard from '@/Components/UI/GlassCard';

const TOOL_LINKS = [
    { id: 'kicks', label: 'Coups de pied', desc: 'Compteur de mouvements', icon: Footprints },
    { id: 'contractions', label: 'Contractions', desc: 'Chronomètre', icon: Timer },
    { id: 'weight', label: 'Poids', desc: 'Courbe & historique', icon: Scale },
    { id: 'symptoms', label: 'Symptômes', desc: 'Journal quotidien', icon: Thermometer },
];

export default function PregnancyDashboard({ pregnancyId, currentWeek, progress, weekInfo, trimesters, onOpenTab }) {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState('');

    useEffect(() => {
        if (!pregnancyId) return;
        setLoading(true);
        window.axios.get(`/api/v1/pregnancies/${pregnancyId}/dashboard`)
            .then(r => setDashboard(r.data?.dashboard || null))
            .catch(() => setDashboard(null))
            .finally(() => setLoading(false));
    }, [pregnancyId]);

    const exportSummary = async () => {
        setExporting(true);
        setExportError('');
        try {
            const r = await window.axios.get(`/api/v1/pregnancies/${pregnancyId}/export`, {
                responseType: 'blob',
            });
            const blob = new Blob([r.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `femina-grossesse-${pregnancyId}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setExportError(e.response?.data?.message || 'Erreur lors de l\'export PDF.');
        }
        setExporting(false);
    };

    const weeklyTip = dashboard?.weekly_tip;
    const milestones = dashboard?.milestones || [];
    const weightChart = dashboard?.weight_chart || [];
    const maxWeight = Math.max(...weightChart.map(e => e.weight), 0);
    const minWeight = Math.min(...weightChart.map(e => e.weight), maxWeight);
    const range = maxWeight - minWeight || 1;

    if (loading) {
        return (
            <div className="space-y-6">
                <GlassCard className="h-32 animate-pulse no-enter" />
                <GlassCard className="h-48 animate-pulse no-enter" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <GlassCard key={i} className="h-24 animate-pulse no-enter" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {weeklyTip && (
                <GlassCard className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center shrink-0">
                            <Lightbulb size={22} className="text-brand-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">Conseil de la semaine {weeklyTip.week}</p>
                            <h3 className="text-lg font-bold text-brand-ink mb-2">{weeklyTip.title}</h3>
                            <p className="text-sm text-brand-muted leading-relaxed">{weeklyTip.tip}</p>
                            <p className="text-xs text-brand-primary mt-3 font-medium flex items-center gap-1.5">
                                <Baby size={14} /> {weeklyTip.baby_size}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            )}

            <GlassCard className="p-5">
                <h3 className="font-bold text-brand-ink mb-4">Progression des trimestres</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {trimesters.map((t, i) => {
                        const isCurrent =
                            (i === 0 && currentWeek <= 12) ||
                            (i === 1 && currentWeek > 12 && currentWeek <= 26) ||
                            (i === 2 && currentWeek > 26);
                        return (
                            <div
                                key={t.n}
                                className={`p-4 rounded-xl border surface-transition ${
                                    isCurrent
                                        ? 'border-brand-primary/35 bg-brand-bg/80'
                                        : t.done
                                          ? 'border-brand-border bg-brand-bg/60'
                                          : 'border-brand-border bg-brand-bg/40'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {t.done ? (
                                        <CheckCircle size={18} className="text-emerald-600" />
                                    ) : (
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 ${isCurrent ? 'border-brand-primary' : 'border-brand-border'}`}
                                        />
                                    )}
                                    <span className="font-bold text-brand-ink text-sm">{t.n}</span>
                                </div>
                                <p className="text-xs text-brand-muted">{t.w}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-5 p-4 rounded-xl bg-brand-bg/80 border border-brand-border">
                    <div className="flex justify-between text-xs text-brand-muted mb-2">
                        <span>Semaine 1</span>
                        <span className="text-brand-primary font-semibold">{Math.round(progress)}% complété</span>
                        <span>Semaine 40</span>
                    </div>
                    <div className="bg-brand-border rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-brand-primary rounded-full h-2 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-brand-ink flex items-center gap-2">
                        <Stethoscope size={18} className="text-brand-primary" /> Rendez-vous planifiés
                    </h3>
                    <span className="text-xs text-brand-muted">{milestones.filter(m => m.status === 'pending').length} à venir</span>
                </div>
                <div className="space-y-3">
                    {milestones.length === 0 && (
                        <p className="text-sm text-brand-muted py-4 text-center">Aucun rendez-vous planifié pour le moment.</p>
                    )}
                    {milestones.map(m => (
                        <div key={m.id} className="flex items-start gap-3 p-4 rounded-xl border border-brand-border bg-brand-bg/60 surface-transition hover:border-brand-primary/25">
                            <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
                                S{m.week}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-brand-ink text-sm">{m.title}</p>
                                <p className="text-xs text-brand-muted mt-1">{m.description}</p>
                                <p className="text-xs text-brand-primary mt-2 flex items-center gap-1">
                                    <Calendar size={12} /> {new Date(m.scheduled_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <span className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                m.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : m.status === 'skipped'
                                      ? 'bg-brand-bg text-brand-muted border border-brand-border'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                            }`}>
                                {m.status === 'completed' ? 'Fait' : m.status === 'skipped' ? 'Ignoré' : 'Prévu'}
                            </span>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {weightChart.length > 1 && (
                <GlassCard className="p-5">
                    <h3 className="font-bold text-brand-ink mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-brand-primary" /> Courbe de poids
                    </h3>
                    <div className="flex items-end gap-1 h-32">
                        {weightChart.map((e, i) => {
                            const height = ((e.weight - minWeight) / range) * 100;
                            return (
                                <div key={`${e.date}-${i}`} className="flex-1 flex flex-col items-center gap-1" title={`${e.weight} kg — Sem. ${e.week}`}>
                                    <span className="text-[10px] text-brand-muted font-medium">{e.weight}</span>
                                    <div className="w-full rounded-t-lg bg-brand-primary/85" style={{ height: `${Math.max(8, height)}%` }} />
                                    <span className="text-[10px] text-brand-muted">S{e.week}</span>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            )}

            <div>
                <h3 className="font-bold text-brand-ink mb-3 text-sm">Outils de suivi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {TOOL_LINKS.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                type="button"
                                onClick={() => onOpenTab?.(tool.id)}
                                className="glass-card p-4 text-left surface-transition hover:border-brand-primary/30 group flex items-center gap-3 w-full"
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary shrink-0 group-hover:border-brand-primary/30">
                                    <Icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-brand-ink text-sm">{tool.label}</p>
                                    <p className="text-xs text-brand-muted mt-0.5">{tool.desc}</p>
                                </div>
                                <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-primary shrink-0 transition-colors" />
                            </button>
                        );
                    })}
                </div>
            </div>

            <GlassCard className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-brand-ink text-sm mb-1">Résumé médical</h3>
                        <p className="text-xs text-brand-muted">
                            Exportez un PDF à partager avec votre gynécologue ou sage-femme.
                        </p>
                        {exportError && (
                            <p className="mt-2 text-xs text-red-700 flex items-center gap-1.5">
                                <AlertTriangle size={14} className="shrink-0" />
                                {exportError}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={exportSummary}
                        disabled={exporting}
                        className="btn-primary inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                    >
                        <Download size={16} />
                        {exporting ? 'Génération…' : 'Exporter PDF'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
