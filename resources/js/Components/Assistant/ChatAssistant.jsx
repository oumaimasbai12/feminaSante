import React, { useState } from 'react';
import AIDisclaimer from './AIDisclaimer';
import MessageList from './MessageList';
import SuggestedQuestions from './SuggestedQuestions';
import MessageInput from './MessageInput';

export default function ChatAssistant() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Bonjour ! Je suis l'assistant santé Femina. Comment puis-je vous aider aujourd'hui ?" }
    ]);

    const handleSend = (text) => {
        setMessages([...messages, { role: 'user', content: text }]);
        // Mock reply
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: "Ceci est une réponse générée dans notre version de démonstration." }]);
        }, 1000);
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg flex flex-col h-[700px] overflow-hidden">
            <div className="bg-indigo-600 p-4 shrink-0 flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">🤖</div>
                <div>
                    <h3 className="font-bold text-lg">Assistant Femina Santé</h3>
                    <p className="text-indigo-200 text-sm">Toujours là pour vous écouter.</p>
                </div>
            </div>
            
            <div className="p-4 shrink-0 border-b border-gray-100">
                <AIDisclaimer />
            </div>

            <MessageList messages={messages} />
            <SuggestedQuestions onSelect={handleSend} />
            <MessageInput onSend={handleSend} />
        </div>
    );
}
