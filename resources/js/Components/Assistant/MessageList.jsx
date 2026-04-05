import React from 'react';

export default function MessageList({ messages = [] }) {
    return (
        <div className="flex-grow p-6 overflow-y-auto bg-gray-50 space-y-6">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-16 h-16 mb-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    <p className="font-medium">Posez-moi vos questions !</p>
                </div>
            ) : (
                messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'}`}>
                            {m.content}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
