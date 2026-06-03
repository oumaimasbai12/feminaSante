import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GlassCard from '@/Components/UI/GlassCard';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

const suggestions = [
    'Quels sont les symptômes normaux du SPM ?',
    "Comment suivre l'ovulation à la maison ?",
    'Quels aliments aident pendant les règles ?',
    'Quand consulter un gynécologue ?',
    'Quelle est la durée normale d\'un cycle ?',
    'Comment le stress affecte mon cycle ?',
];

const INITIAL_MESSAGE = {
    role: 'assistant',
    content:
        'Bonjour ! Je suis Femina, votre assistante de santé féminine. Je suis là pour vous aider avec vos questions sur le cycle, la grossesse, la ménopause et le bien-être. Comment puis-je vous aider aujourd\'hui ?',
    time: new Date(),
};

function MessageSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-brand-bg shrink-0" />
                    <div className={`h-16 rounded-2xl bg-brand-bg ${i % 2 === 0 ? 'w-2/5' : 'w-3/5'}`} />
                </div>
            ))}
        </div>
    );
}

export default function Chat() {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        window.axios
            .get('/api/v1/chats')
            .then((r) => {
                const chats = Array.isArray(r.data) ? r.data : [];
                if (chats.length === 0) return;

                const history = [];
                [...chats].reverse().forEach((c) => {
                    if (c.message) {
                        history.push({
                            role: 'user',
                            content: c.message,
                            time: new Date(c.created_at),
                        });
                    }
                    if (c.response) {
                        history.push({
                            role: 'assistant',
                            content: c.response,
                            time: new Date(c.completed_at || c.created_at),
                        });
                    }
                });
                if (history.length > 0) setMessages(history);
            })
            .catch(() => {})
            .finally(() => setHistoryLoading(false));
    }, []);

    const userMessageCount = messages.filter((m) => m.role === 'user').length;

    const send = async (msg) => {
        const text = (msg || input).trim();
        if (!text || loading) return;
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: text, time: new Date() }]);
        setLoading(true);
        try {
            const r = await window.axios.post('/api/v1/chats', { message: text });
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content:
                        r.data.chat?.response ||
                        r.data.response ||
                        r.data.message ||
                        'J\'ai reçu votre message.',
                    time: new Date(),
                },
            ]);
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content:
                        'Je rencontre des difficultés à me connecter pour le moment. Veuillez réessayer dans un instant.',
                    time: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const resetConversation = () => {
        setMessages([{ ...INITIAL_MESSAGE, time: new Date() }]);
        setInput('');
        inputRef.current?.focus();
    };

    const fmt = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return (
        <AppLayout title="Assistant Santé IA">
            <Head title="Assistant Santé IA - FeminaSante" />

            <p className="text-brand-muted text-sm mb-4">
                Posez vos questions en toute confidentialité sur votre santé féminine.
            </p>

            <div className="flex flex-col w-full" style={{ height: 'calc(100vh - 180px)', minHeight: '420px' }}>
                <GlassCard className="flex flex-col h-full overflow-hidden p-0">
                    <div className="flex items-center gap-4 p-4 sm:p-5 border-b border-brand-border bg-brand-bg/40">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary shrink-0">
                            <Bot size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-brand-ink">Femina — Assistante IA</div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-brand-muted text-xs truncate">
                                    En ligne · Santé féminine
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {userMessageCount > 0 && (
                                <button
                                    type="button"
                                    onClick={resetConversation}
                                    className="p-2 rounded-xl border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary/30 transition-colors duration-300"
                                    title="Nouvelle conversation"
                                >
                                    <RefreshCw size={18} />
                                </button>
                            )}
                            <Sparkles size={20} className="text-brand-primary/50 hidden sm:block" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-brand-bg/20">
                        {historyLoading ? (
                            <MessageSkeleton />
                        ) : (
                            <>
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border surface-transition ${
                                                m.role === 'user'
                                                    ? 'bg-brand-bg border-brand-border text-brand-primary'
                                                    : 'bg-brand-soft border-brand-primary/20 text-brand-primary'
                                            }`}
                                        >
                                            {m.role === 'user' ? (
                                                <User size={16} />
                                            ) : (
                                                <Bot size={16} />
                                            )}
                                        </div>
                                        <div
                                            className={`max-w-[85%] sm:max-w-[75%] flex flex-col gap-1 ${
                                                m.role === 'user' ? 'items-end' : 'items-start'
                                            }`}
                                        >
                                            <div
                                                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed surface-transition ${
                                                    m.role === 'user'
                                                        ? 'bg-brand-soft text-brand-ink border border-brand-primary/20 rounded-tr-sm'
                                                        : 'bg-brand-bg/90 text-brand-ink border border-brand-border rounded-tl-sm'
                                                }`}
                                            >
                                                {m.content}
                                            </div>
                                            <span className="text-xs text-brand-muted px-1">{fmt(m.time)}</span>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-soft border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                                            <Bot size={16} />
                                        </div>
                                        <div className="bg-brand-bg border border-brand-border rounded-2xl rounded-tl-sm px-5 py-3">
                                            <div className="flex gap-1.5">
                                                {[0, 1, 2].map((i) => (
                                                    <span
                                                        key={i}
                                                        className="w-2 h-2 rounded-full bg-brand-primary/60 animate-bounce"
                                                        style={{ animationDelay: `${i * 0.15}s` }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={endRef} />
                    </div>

                    {!historyLoading && userMessageCount === 0 && (
                        <div className="px-4 sm:px-5 pb-4 bg-brand-bg/20 border-t border-brand-border/60">
                            <p className="text-xs font-semibold text-brand-muted mb-3 pt-3">
                                Questions suggérées
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => send(s)}
                                        disabled={loading}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-bg text-brand-ink border border-brand-border hover:border-brand-primary/30 hover:bg-brand-soft/80 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-t border-brand-border bg-brand-bg/40">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                send();
                            }}
                            className="flex gap-3"
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez-moi vos questions de santé…"
                                className="input-field flex-1 py-3"
                                disabled={loading || historyLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading || historyLoading}
                                className="btn-primary w-12 h-12 p-0 flex items-center justify-center shrink-0 disabled:opacity-50"
                                aria-label="Envoyer"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </GlassCard>
            </div>
        </AppLayout>
    );
}
