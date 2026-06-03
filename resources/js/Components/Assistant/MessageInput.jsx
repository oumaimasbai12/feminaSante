import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({ onSend, disabled = false }) {
    const [msg, setMsg] = useState('');

    const handleSend = () => {
        if (!msg.trim() || disabled) return;
        onSend?.(msg);
        setMsg('');
    };

    return (
        <div className="flex gap-2 p-4 bg-white border-t border-brand-border">
            <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={disabled}
                className="input-field flex-1"
                placeholder="Posez votre question de santé..."
            />
            <button
                type="button"
                onClick={handleSend}
                disabled={!msg.trim() || disabled}
                className="btn-primary px-4 disabled:opacity-50"
                aria-label="Envoyer"
            >
                <Send size={18} />
            </button>
        </div>
    );
}
