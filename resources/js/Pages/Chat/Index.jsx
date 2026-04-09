import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

const suggestions = [
    'Quels sont les symptômes normaux du SPM ?',
    'Comment suivre l’ovulation à la maison ?',
    'Quels aliments aident pendant les règles ?',
    'Quand consulter un gynécologue ?',
    'Quelle est la durée normale d’un cycle ?',
    'Comment le stress affecte mon cycle ?',
];

export default function Chat() {
    const [messages, setMessages] = useState([{ role:'assistant', content: 'Hello! 🌸 I’m your FeminaSanté AI health assistant. I’m here to help you with questions about women’s health, menstrual cycles, pregnancy, and more. What would you like to know today?', time: new Date() }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = async (msg) => {
        const text = (msg || input).trim();
        if (!text || loading) return;
        setInput('');
        const userMsg = { role: 'user', content: text, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        try {
            const r = await window.axios.post('/api/v1/chats', { message: text });
            setMessages(prev => [...prev, { role: 'assistant', content: r.data.response || r.data.message || 'I received your message!', time: new Date() }]);
        } catch(e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'I’m having trouble connecting right now. Please try again in a moment. 🌸', time: new Date() }]);
        }
        setLoading(false);
        inputRef.current?.focus();
    };

    const fmt = (d) => d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

    return (
        <AppLayout title='Assistant Santé IA'>
            <div className='flex flex-col h-full' style={{height:'calc(100vh - 130px)'}}>
                <div className='card flex flex-col h-full overflow-hidden p-0'>
                    {/* Header */}
                    <div className='flex items-center gap-4 p-5 border-b border-violet-50' style={{background:'linear-gradient(135deg,#1e1b4b,#4f46e5)'}}>
                        <div className='w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center'><Bot size={26} className='text-white'/></div>
                        <div>
                            <div className='font-bold text-white'>FeminaSanté AI</div>
                            <div className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></span><span className='text-pink-200 text-xs'>Online • Women's Health Expert</span></div>
                        </div>
                        <div className='ml-auto'><Sparkles size={22} className='text-white/60'/></div>
                    </div>

                    {/* Messages */}
                    <div className='flex-1 overflow-y-auto p-5 space-y-4'>
                        {messages.map((m, i) => (
                            <div key={i} className={'flex gap-3 ' + (m.role==='user'?'flex-row-reverse':'')}>
                                <div className={'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ' + (m.role==='user'?'bg-gradient-to-br from-pink-400 to-purple-600':'bg-gradient-to-br from-rose-400 to-pink-600')}>
                                    {m.role==='user'?<User size={16} className='text-white'/>:<Bot size={16} className='text-white'/>}
                                </div>
                                <div className={'max-w-[75%] ' + (m.role==='user'?'items-end':'items-start') + ' flex flex-col gap-1'}>
                                    <div className={'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ' + (m.role==='user'?'text-white rounded-tr-sm':'bg-white text-gray-700 border border-violet-50 rounded-tl-sm')} style={m.role==='user'?{background:'linear-gradient(135deg,#7C3AED,#D97706)'}:{}}>
                                        {m.content}
                                    </div>
                                    <span className='text-xs text-gray-400 px-1'>{fmt(m.time)}</span>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className='flex gap-3'>
                                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center'><Bot size={16} className='text-white'/></div>
                                <div className='bg-white border border-violet-50 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm'>
                                    <div className='flex gap-1.5'>{[0,1,2].map(i=><span key={i} className='w-2 h-2 rounded-full bg-pink-400 animate-bounce' style={{animationDelay:i*0.15+'s'}}></span>)}</div>
                                </div>
                            </div>
                        )}
                        <div ref={endRef}/>
                    </div>

                    {/* Suggestions */}
                    {messages.length <= 2 && (
                        <div className='px-5 pb-4'>
                            <p className='text-xs font-semibold text-gray-400 mb-3'>Questions suggérées :</p>
                            <div className='flex flex-wrap gap-2'>
                                {suggestions.map(s=>(
                                    <button key={s} onClick={()=>send(s)} className='px-3 py-1.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 hover:border-violet-300 transition-all'>{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className='p-4 border-t border-violet-50 bg-white/80'>
                        <form onSubmit={e=>{e.preventDefault();send();}} className='flex gap-3'>
                            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder='Posez-moi vos questions de santé...' className='input-field flex-1 py-3' disabled={loading}/>
                            <button type='submit' disabled={!input.trim()||loading} className='w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50' style={{background:'linear-gradient(135deg,#7C3AED,#D97706)'}}><Send size={18}/></button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
