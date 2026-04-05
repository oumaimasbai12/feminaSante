import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Brain, Clock, Trophy, ArrowRight, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

const SAMPLE_QUIZ = { id: 1, title: 'Understanding Your Menstrual Cycle', description: 'Test your knowledge about the different phases and what to expect.', category: 'Cycle Health', difficulty: 'beginner', time_limit: 300, pass_score: 60, questions: [{ id:1, question:'How many phases does a typical menstrual cycle have?', options:[{id:1,text:'2 phases'},{id:2,text:'3 phases'},{id:3,text:'4 phases'},{id:4,text:'5 phases'}], correct_option_id:3 },{ id:2, question:'What is the average length of a menstrual cycle?', options:[{id:1,text:'21 days'},{id:2,text:'28 days'},{id:3,text:'35 days'},{id:4,text:'All of the above can be normal'}], correct_option_id:4 }] };

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState([SAMPLE_QUIZ]);
    const [active, setActive] = useState(null);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [done, setDone] = useState(false);
    const [time, setTime] = useState(300);

    useEffect(()=>{
        window.axios.get('/api/v1/quizzes').then(r=>{
            const d = Array.isArray(r.data)?r.data:(r.data.data||[]);
            if(d.length>0) setQuizzes(d);
        }).catch(()=>{});
    },[]);

    useEffect(()=>{
        if(!active||done) return;
        const t = setInterval(()=>setTime(t=>{ if(t<=1){setDone(true);return 0;} return t-1; }),1000);
        return ()=>clearInterval(t);
    },[active,done]);

    const start = (q) => { setActive(q); setStep(0); setAnswers({}); setDone(false); setTime(q.time_limit||300); };
    const pick = (qid, oid) => setAnswers(a=>({...a,[qid]:oid}));
    const next = () => { if(step<(active.questions||[]).length-1) setStep(s=>s+1); else setDone(true); };
    const score = () => { const qs=active?.questions||[]; const correct=qs.filter(q=>answers[q.id]===q.correct_option_id).length; return Math.round(correct/qs.length*100); };
    const fmt = (s) => Math.floor(s/60)+':'+(s%60).toString().padStart(2,'0');

    const diffColors = { beginner:'bg-green-100 text-green-700', intermediate:'bg-amber-100 text-amber-700', advanced:'bg-red-100 text-red-700' };

    return (
        <AppLayout title='Health Quizzes'>
            {!active && (
                <div>
                    <p className='text-gray-500 mb-6'>Test your knowledge about women’s health and earn insights.</p>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {quizzes.map(q=>(
                            <div key={q.id} className='card card-hover group'>
                                <div className='w-14 h-14 rounded-2xl flex items-center justify-center mb-4' style={{background:'linear-gradient(135deg,#be185d,#7e22ce)'}}>
                                    <Brain size={28} className='text-white'/>
                                </div>
                                <div className='flex items-center gap-2 mb-3'>
                                    <span className={'px-2.5 py-1 rounded-full text-xs font-bold capitalize '+(diffColors[q.difficulty]||'bg-pink-100 text-pink-700')}>{q.difficulty||'Beginner'}</span>
                                    <span className='text-xs text-gray-400'>{q.category}</span>
                                </div>
                                <h3 className='font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors'>{q.title}</h3>
                                <p className='text-sm text-gray-500 mb-4 line-clamp-2'>{q.description}</p>
                                <div className='flex items-center gap-4 text-xs text-gray-400 mb-4'>
                                    <span className='flex items-center gap-1'><Clock size={13}/>{Math.round((q.time_limit||300)/60)} min</span>
                                    <span className='flex items-center gap-1'><Trophy size={13}/>Pass: {q.pass_score||60}%</span>
                                </div>
                                <button onClick={()=>start(q)} className='btn-primary w-full text-sm flex items-center justify-center gap-2'>Start Quiz <ArrowRight size={15}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {active && !done && (() => {
                const qs = active.questions||[];
                const q = qs[step];
                if(!q) return null;
                const prog = ((step+1)/qs.length)*100;
                return (
                    <div className='max-w-2xl mx-auto'>
                        {/* Header */}
                        <div className='flex items-center justify-between mb-6'>
                            <button onClick={()=>setActive(null)} className='flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors font-medium text-sm'><ChevronLeft size={18}/>Back to Quizzes</button>
                            <div className='flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 text-pink-700 font-semibold text-sm'><Clock size={16}/>{fmt(time)}</div>
                        </div>
                        {/* Progress */}
                        <div className='card mb-5'>
                            <div className='flex justify-between text-sm text-gray-500 mb-2'><span>Question {step+1} of {qs.length}</span><span className='font-semibold text-pink-600'>{Math.round(prog)}%</span></div>
                            <div className='bg-pink-100 rounded-full h-2'><div className='rounded-full h-2 transition-all' style={{width:prog+'%',background:'linear-gradient(135deg,#EC4899,#A855F7)'}}></div></div>
                        </div>
                        {/* Question */}
                        <div className='card mb-4'>
                            <div className='w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold mb-4' style={{background:'linear-gradient(135deg,#EC4899,#A855F7)'}}>{step+1}</div>
                            <h3 className='text-lg font-bold text-gray-900 mb-6'>{q.question}</h3>
                            <div className='space-y-3'>
                                {(q.options||[]).map(o=>(
                                    <button key={o.id} onClick={()=>pick(q.id,o.id)} className={'w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium '+(answers[q.id]===o.id?'border-pink-500 bg-pink-50 text-pink-800':'border-gray-100 text-gray-700 hover:border-pink-200 hover:bg-pink-50/50')}>
                                        <span className={'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 '+(answers[q.id]===o.id?'bg-pink-500 text-white':'bg-gray-100 text-gray-500')}>{String.fromCharCode(65+(q.options||[]).indexOf(o))}</span>
                                        {o.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <button disabled={step===0} onClick={()=>setStep(s=>s-1)} className='px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all disabled:opacity-40'>Previous</button>
                            <button onClick={next} disabled={!answers[q.id]} className='btn-primary flex items-center gap-2 disabled:opacity-50'>{step===qs.length-1?'Finish Quiz':'Next Question'} <ArrowRight size={17}/></button>
                        </div>
                    </div>
                );
            })()}

            {active && done && (() => {
                const s = score();
                const passed = s >= (active.pass_score||60);
                return (
                    <div className='max-w-lg mx-auto text-center'>
                        <div className='card'>
                            <div className='text-7xl mb-6'>{passed?'🏆':'🌱'}</div>
                            <h2 className='text-2xl font-extrabold text-gray-900 mb-2'>{passed?'Congratulations!':'Keep Learning!'}</h2>
                            <div className='text-6xl font-black my-6 text-gradient'>{s}%</div>
                            <div className={'inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm mb-6 '+(passed?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700')}>
                                {passed?<CheckCircle size={18}/>:<XCircle size={18}/>}
                                {passed?'Passed! Great job':'Not quite — try again'}
                            </div>
                            <p className='text-gray-500 mb-8'>{passed?'You demonstrated excellent knowledge about women’s health!':'Keep exploring our health articles to improve your score.'}</p>
                            <div className='flex gap-3 justify-center'>
                                <button onClick={()=>start(active)} className='btn-primary flex items-center gap-2'>Retake Quiz</button>
                                <button onClick={()=>setActive(null)} className='border-2 border-pink-200 text-pink-700 font-semibold rounded-xl px-5 py-3 hover:bg-pink-50 transition-all'>More Quizzes</button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </AppLayout>
    );
}
