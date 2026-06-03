import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { getStoredUser } from '@/utils/auth';

export default function ConsultationMessages({ apiBase, emptyLabel = 'Aucun message.', currentUserId, onSent }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [userId, setUserId] = useState(currentUserId ?? getStoredUser()?.id);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (currentUserId) setUserId(currentUserId);
    }, [currentUserId]);

    const load = () => {
        setLoading(true);
        window.axios.get(apiBase)
            .then(r => setMessages(Array.isArray(r.data) ? r.data : []))
            .catch(() => setMessages([]))
            .finally(() => setLoading(false));
    };

    useEffect(load, [apiBase]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const send = async (e) => {
        e.preventDefault();
        if (!body.trim() || sending) return;
        setSending(true);
        try {
            const r = await window.axios.post(apiBase, { body: body.trim() });
            const msg = r.data.consultation_message;
            setMessages(prev => [...prev, msg]);
            setBody('');
            onSent?.();
        } catch (err) {
            alert(err.response?.data?.message || 'Envoi impossible.');
        }
        setSending(false);
    };

    return (
        <div className="flex flex-col h-80">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
                {loading && (
                    <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin text-brand-muted w-5 h-5" />
                    </div>
                )}
                {!loading && messages.length === 0 && (
                    <p className="text-sm text-brand-muted text-center py-6">{emptyLabel}</p>
                )}
                {messages.map(m => {
                    const mine = m.sender_id === userId;
                    return (
                        <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm surface-transition ${
                                mine ? 'bg-brand-primary text-white' : 'bg-brand-soft text-brand-ink border border-brand-border'
                            }`}>
                                {!mine && m.sender?.nom && (
                                    <p className="text-[10px] font-semibold opacity-70 mb-0.5">{m.sender.nom}</p>
                                )}
                                <p className="whitespace-pre-wrap">{m.body}</p>
                                <p className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-brand-muted'}`}>
                                    {new Date(m.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={send} className="flex gap-2">
                <input
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="Votre message..."
                    className="input-field flex-1 py-2.5"
                />
                <button type="submit" disabled={sending || !body.trim()} className="btn-primary px-3 py-2.5 disabled:opacity-50">
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </form>
        </div>
    );
}
