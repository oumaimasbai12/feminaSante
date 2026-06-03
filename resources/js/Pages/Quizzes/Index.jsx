import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import StatTile from '@/Components/UI/StatTile';
import {
    Brain,
    Clock,
    Trophy,
    ArrowRight,
    CheckCircle,
    XCircle,
    ChevronLeft,
    Sparkles,
    HelpCircle,
    Award,
    Sprout,
    ListChecks,
} from 'lucide-react';

const api = () => window.axios;

const DIFFICULTY = {
    beginner: { label: 'Débutant', className: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
    intermediate: { label: 'Intermédiaire', className: 'bg-amber-50 text-amber-800 border border-amber-200' },
    advanced: { label: 'Avancé', className: 'bg-red-50 text-red-800 border border-red-200' },
};

const CATEGORY_LABELS = {
    cycle: 'Cycle',
    pregnancy: 'Grossesse',
    diseases: 'Maladies',
    general: 'Général',
    nutrition: 'Nutrition',
    contraception: 'Contraception',
    menopause: 'Ménopause',
};

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    const [active, setActive] = useState(null);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [checking, setChecking] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [results, setResults] = useState(null);
    const [timeLeft, setTimeLeft] = useState(300);
    const startTimeRef = useRef(null);

    useEffect(() => {
        api()
            .get('/api/v1/quizzes')
            .then((r) => setQuizzes(Array.isArray(r.data) ? r.data : []))
            .catch(() => setQuizzes([]))
            .finally(() => setLoading(false));
    }, []);

    const stats = useMemo(() => {
        const questionTotal = quizzes.reduce((sum, q) => sum + (q.questions_count || 0), 0);
        const categories = new Set(quizzes.map((q) => q.category).filter(Boolean));
        const avgMins =
            quizzes.length > 0
                ? Math.round(
                      quizzes.reduce((sum, q) => sum + (q.time_limit || 300), 0) / quizzes.length / 60,
                  )
                : 0;
        return { questionTotal, categories: categories.size, avgMins };
    }, [quizzes]);

    const finishQuiz = useCallback(async (quiz, finalAnswers, elapsed) => {
        setSubmitting(true);
        try {
            const r = await api().post(`/api/v1/quizzes/${quiz.id}/submit`, {
                answers: finalAnswers,
                time_spent: elapsed,
            });
            setResults(r.data);
        } catch (e) {
            console.error('Submit failed', e);
            setResults({ passed: false, percentage: 0, error: true });
        } finally {
            setSubmitting(false);
        }
    }, []);

    useEffect(() => {
        if (!active || results || feedback) return;
        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
                    finishQuiz(active, answers, elapsed);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [active, results, feedback, answers, finishQuiz]);

    const startQuiz = async (q) => {
        setStarting(true);
        setResults(null);
        setFeedback(null);
        setAnswers({});
        setStep(0);
        try {
            const r = await api().get(`/api/v1/quizzes/${q.id}/play`);
            const quiz = r.data?.quiz || r.data;
            setActive(quiz);
            setTimeLeft(quiz.time_limit || 300);
            startTimeRef.current = Date.now();
        } catch (e) {
            console.error('Failed to load quiz', e);
        } finally {
            setStarting(false);
        }
    };

    const pickAnswer = (questionId, optionId) => {
        if (feedback || checking) return;
        setAnswers((a) => ({ ...a, [questionId]: optionId }));
    };

    const handleNext = async () => {
        const questions = active?.questions || [];
        const current = questions[step];
        if (!current || !answers[current.id]) return;

        setChecking(true);
        try {
            const r = await api().post(
                `/api/v1/quizzes/${active.id}/questions/${current.id}/check`,
                { option_id: answers[current.id] },
            );
            setFeedback(r.data?.feedback || null);
        } catch (e) {
            console.error('Check failed', e);
            setFeedback({ is_correct: false, explanation: 'Impossible de vérifier la réponse.' });
        } finally {
            setChecking(false);
        }
    };

    const continueAfterFeedback = () => {
        const questions = active?.questions || [];
        setFeedback(null);
        if (step < questions.length - 1) {
            setStep((s) => s + 1);
        } else {
            const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
            finishQuiz(active, answers, elapsed);
        }
    };

    const exitQuiz = () => {
        setActive(null);
        setResults(null);
        setFeedback(null);
        setStep(0);
        setAnswers({});
    };

    const timerUrgent = timeLeft <= 60;

    return (
        <AppLayout title="Quiz de santé">
            <Head title="Quiz de santé - FeminaSante" />

            {!active && !results && (
                <p className="text-brand-muted text-sm mb-6">
                    Testez vos connaissances sur la santé féminine — cycle, grossesse, nutrition et
                    bien-être.
                </p>
            )}

            {!active && !results && !loading && quizzes.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatTile label="Quiz disponibles" value={quizzes.length} sub="thématiques" icon={Brain} />
                    <StatTile
                        label="Questions"
                        value={stats.questionTotal}
                        sub="au total"
                        icon={ListChecks}
                    />
                    <StatTile label="Catégories" value={stats.categories} sub="sujets couverts" icon={Sparkles} />
                    <StatTile
                        label="Durée moyenne"
                        value={stats.avgMins ? `${stats.avgMins} min` : '—'}
                        sub="par quiz"
                        icon={Clock}
                    />
                </div>
            )}

            {!active && !results && (
                <div className="w-full">
                    {loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <GlassCard key={i} className="p-6 animate-pulse h-64" />
                            ))}
                        </div>
                    )}
                    {!loading && quizzes.length === 0 && (
                        <GlassCard className="text-center py-16 w-full">
                            <Brain size={40} className="text-brand-border mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-brand-ink mb-2">Aucun quiz disponible</h3>
                            <p className="text-sm text-brand-muted">
                                Revenez bientôt — de nouveaux quiz seront ajoutés.
                            </p>
                        </GlassCard>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {!loading &&
                            quizzes.map((q) => (
                                <QuizCard
                                    key={q.id}
                                    quiz={q}
                                    onStart={() => startQuiz(q)}
                                    starting={starting}
                                />
                            ))}
                    </div>
                </div>
            )}

            {active && !results && (() => {
                const questions = active.questions || [];
                const q = questions[step];
                if (!q) return null;
                const progress = ((step + 1) / questions.length) * 100;

                return (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <button
                                type="button"
                                onClick={exitQuiz}
                                className="flex items-center gap-2 text-brand-muted hover:text-brand-primary text-sm font-semibold transition-colors duration-300"
                            >
                                <ChevronLeft size={18} /> Retour aux quiz
                            </button>
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm tabular-nums border transition-colors duration-300 ${
                                    timerUrgent
                                        ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                                        : 'bg-brand-bg text-brand-primary border-brand-border'
                                }`}
                            >
                                <Clock size={16} />
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <GlassCard className="p-4">
                            <div className="flex justify-between text-sm text-brand-muted mb-2">
                                <span>
                                    Question {step + 1} sur {questions.length}
                                </span>
                                <span className="font-bold text-brand-primary">{Math.round(progress)}%</span>
                            </div>
                            <div className="bg-brand-border rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-brand-primary rounded-full h-2 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </GlassCard>

                        {!feedback ? (
                            <>
                                <GlassCard className="p-6">
                                    <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border text-brand-primary font-bold flex items-center justify-center mb-4">
                                        {step + 1}
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-ink mb-6 leading-snug">
                                        {q.question_text}
                                    </h3>
                                    <div className="space-y-3">
                                        {(q.options || []).map((o, idx) => {
                                            const selected = answers[q.id] === o.id;
                                            return (
                                                <button
                                                    key={o.id}
                                                    type="button"
                                                    onClick={() => pickAnswer(q.id, o.id)}
                                                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 font-medium ${
                                                        selected
                                                            ? 'border-brand-primary/40 bg-brand-soft text-brand-ink'
                                                            : 'border-brand-border text-brand-ink hover:border-brand-primary/30 hover:bg-brand-soft/60'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mr-3 border ${
                                                            selected
                                                                ? 'bg-brand-primary/15 text-brand-primary border-brand-primary/30'
                                                                : 'bg-brand-bg text-brand-muted border-brand-border'
                                                        }`}
                                                    >
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    {o.option_text}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </GlassCard>

                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <button
                                        type="button"
                                        disabled={step === 0}
                                        onClick={() => setStep((s) => s - 1)}
                                        className="btn-secondary disabled:opacity-40"
                                    >
                                        Précédent
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!answers[q.id] || checking}
                                        className="flex-1 btn-primary"
                                    >
                                        {checking
                                            ? 'Vérification…'
                                            : step === questions.length - 1
                                              ? 'Terminer le quiz'
                                              : 'Valider et continuer'}
                                        {!checking && <ArrowRight size={17} />}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <FeedbackPanel
                                feedback={feedback}
                                onContinue={continueAfterFeedback}
                                isLast={step === questions.length - 1}
                            />
                        )}
                    </div>
                );
            })()}

            {submitting && (
                <GlassCard className="text-center py-16 w-full">
                    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-brand-muted font-medium">Calcul de votre score…</p>
                </GlassCard>
            )}

            {results && !submitting && (
                <ResultsScreen
                    results={results}
                    quiz={active}
                    onRetry={() => active && startQuiz(active)}
                    onBack={() => exitQuiz()}
                    onStartRecommended={(q) => startQuiz(q)}
                />
            )}
        </AppLayout>
    );
}

function QuizCard({ quiz, onStart, starting }) {
    const diff = DIFFICULTY[quiz.difficulty] || DIFFICULTY.beginner;
    const mins = Math.round((quiz.time_limit || 300) / 60);
    const category =
        CATEGORY_LABELS[quiz.category] ||
        (quiz.category ? String(quiz.category).charAt(0).toUpperCase() + quiz.category.slice(1) : 'Général');

    return (
        <GlassCard className="p-6 flex flex-col h-full hover:border-brand-primary/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary mb-4">
                <Brain size={24} />
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${diff.className}`}>
                    {diff.label}
                </span>
                <span className="text-xs text-brand-muted">{category}</span>
            </div>
            <h3 className="font-bold text-brand-ink mb-2 group-hover:text-brand-primary transition-colors leading-snug">
                {quiz.title}
            </h3>
            <p className="text-sm text-brand-muted mb-4 line-clamp-2 flex-1">{quiz.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted mb-4">
                <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {mins} min
                </span>
                <span className="flex items-center gap-1">
                    <Trophy size={13} />
                    {quiz.passing_score || 70}% requis
                </span>
                <span className="flex items-center gap-1">
                    <HelpCircle size={13} />
                    {quiz.questions_count || 0} questions
                </span>
            </div>
            <button
                type="button"
                onClick={onStart}
                disabled={starting}
                className="w-full btn-primary text-sm disabled:opacity-50 mt-auto"
            >
                {starting ? 'Chargement…' : 'Commencer le quiz'} <ArrowRight size={15} />
            </button>
        </GlassCard>
    );
}

function FeedbackPanel({ feedback, onContinue, isLast }) {
    const correct = feedback.is_correct;

    return (
        <GlassCard
            className={`p-6 border-2 ${
                correct ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'
            }`}
        >
            <div className="flex items-center gap-3 mb-4">
                {correct ? (
                    <CheckCircle size={28} className="text-emerald-600 shrink-0" />
                ) : (
                    <XCircle size={28} className="text-amber-600 shrink-0" />
                )}
                <div>
                    <p className={`font-bold text-lg ${correct ? 'text-emerald-900' : 'text-amber-900'}`}>
                        {correct ? 'Bonne réponse !' : 'Pas tout à fait…'}
                    </p>
                    {!correct && feedback.correct_option_text && (
                        <p className="text-sm text-amber-800 mt-0.5">
                            La bonne réponse : <strong>{feedback.correct_option_text}</strong>
                        </p>
                    )}
                </div>
            </div>
            {feedback.explanation && (
                <div className="bg-brand-bg/80 rounded-xl p-4 mb-5 text-sm text-brand-ink leading-relaxed border border-brand-border">
                    <p className="font-semibold text-brand-ink mb-1 flex items-center gap-1">
                        <Sparkles size={14} className="text-brand-primary" /> À retenir
                    </p>
                    {feedback.explanation}
                </div>
            )}
            <button type="button" onClick={onContinue} className="w-full btn-primary">
                {isLast ? 'Voir mes résultats' : 'Question suivante'}
            </button>
        </GlassCard>
    );
}

function ResultsScreen({ results, quiz, onRetry, onBack, onStartRecommended }) {
    const passed = results.passed;
    const pct = results.percentage ?? 0;
    const recommended = results.recommended_quiz;

    return (
        <GlassCard className="p-8 sm:p-10 w-full max-w-2xl mx-auto text-center">
            {results.badge && passed && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-sm mb-4">
                    <Award size={18} />
                    {results.badge.label}
                </div>
            )}
            <div className="mb-4 flex justify-center">
                {passed ? (
                    <Trophy size={52} className="text-brand-primary" />
                ) : (
                    <Sprout size={52} className="text-brand-primary" />
                )}
            </div>
            <h2 className="text-2xl font-bold text-brand-ink mb-2">
                {passed ? 'Félicitations !' : "Continuez d'apprendre !"}
            </h2>
            <div className="text-5xl font-black text-brand-primary my-5 tabular-nums">{pct}%</div>
            <div
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm mb-4 border ${
                    passed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
            >
                {passed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                {passed ? 'Réussi !' : `Seuil requis : ${quiz?.passing_score || 70}%`}
            </div>
            <p className="text-brand-muted text-sm mb-6">
                {passed
                    ? 'Excellent travail ! Vous maîtrisez bien ce sujet.'
                    : 'Consultez nos articles de santé et réessayez pour améliorer votre score.'}
            </p>

            {recommended && (
                <div className="bg-brand-bg/80 border border-brand-border rounded-xl p-5 mb-6 text-left">
                    <p className="text-xs font-bold uppercase text-brand-primary mb-2">
                        Recommandé pour vous
                    </p>
                    <p className="font-bold text-brand-ink mb-1">{recommended.title}</p>
                    <p className="text-sm text-brand-muted mb-3">
                        Poursuivez avec un quiz du niveau suivant.
                    </p>
                    <button
                        type="button"
                        onClick={() => onStartRecommended(recommended)}
                        className="w-full btn-primary text-sm"
                    >
                        Commencer le quiz recommandé
                    </button>
                </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
                <button type="button" onClick={onRetry} className="btn-primary text-sm">
                    Refaire le quiz
                </button>
                <button type="button" onClick={onBack} className="btn-secondary text-sm">
                    Plus de quiz
                </button>
            </div>
        </GlassCard>
    );
}
