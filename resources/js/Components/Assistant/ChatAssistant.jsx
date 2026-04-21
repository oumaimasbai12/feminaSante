import React, { useState, useRef } from 'react';
import AIDisclaimer from './AIDisclaimer';
import MessageList from './MessageList';
import SuggestedQuestions from './SuggestedQuestions';
import MessageInput from './MessageInput';

export default function ChatAssistant() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Bonjour ! Je suis Femina, votre assistante santé. Comment puis-je vous aider aujourd'hui ?" }
    ]);
    const [loading, setLoading] = useState(false);
    const sessionId = useRef(crypto.randomUUID());

    const handleSend = async (text) => {
        if (!text.trim() || loading) return;

        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setLoading(true);

        try {
            const res = await window.axios.post('/api/v1/chats', {
                message: text,
                session_id: sessionId.current,
                context: {
                    history: messages.slice(-6).map(m => ({
                        [m.role === 'user' ? 'user' : 'assistant']: m.content
                    }))
                }
            });

            const reply = res.data?.chat?.response ?? "Je n'ai pas pu générer une réponse. Veuillez réessayer.";
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Désolée, je rencontre une difficulté technique. Veuillez réessayer dans un moment."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg flex flex-col h-[700px] overflow-hidden">
            <div className="bg-indigo-600 p-4 shrink-0 flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">🤖</div>
                <div>
                    <h3 className="font-bold text-lg">Assistant Femina Santé</h3>
                    <p className="text-indigo-200 text-sm">
                        {loading ? 'En train de répondre...' : 'Toujours là pour vous écouter.'}
                    </p>
                </div>
            </div>

            <div className="p-4 shrink-0 border-b border-gray-100">
                <AIDisclaimer />
            </div>

            <MessageList messages={messages} loading={loading} />
            <SuggestedQuestions onSelect={handleSend} />
            <MessageInput onSend={handleSend} disabled={loading} />
        </div>
    );
}