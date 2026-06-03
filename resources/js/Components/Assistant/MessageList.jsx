import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function MessageList({ messages = [] }) {
    return (
        <div className="flex-grow p-6 overflow-y-auto bg-brand-bg/40 space-y-6">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-muted">
                    <MessageCircle size={64} className="mb-4 text-brand-border" strokeWidth={1} />
                    <p className="font-medium">Posez-moi vos questions !</p>
                </div>
            ) : (
                messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-brand-primary text-white rounded-tr-sm' : 'bg-white text-brand-ink border border-brand-border rounded-tl-sm'}`}>
                            {m.content}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
