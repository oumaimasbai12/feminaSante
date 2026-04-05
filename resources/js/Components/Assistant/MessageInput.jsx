import React, { useState } from 'react';

export default function MessageInput({ onSend }) {
    const [msg, setMsg] = useState("");

    const handleSend = () => {
        if (!msg.trim()) return;
        onSend && onSend(msg);
        setMsg("");
    };

    return (
        <div className="flex gap-2 p-4 bg-white border-t border-gray-100 rounded-b-3xl">
            <input 
                type="text" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-grow rounded-xl border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 px-4" 
                placeholder="Posez votre question de santé..."
            />
            <button 
                onClick={handleSend}
                disabled={!msg.trim()}
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
            >
                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
        </div>
    );
}
