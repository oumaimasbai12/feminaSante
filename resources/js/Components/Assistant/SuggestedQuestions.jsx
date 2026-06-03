import React from 'react';

export default function SuggestedQuestions({ onSelect }) {
 const questions = [
"Quels sont les symptômes fréquents de l'endométriose ?",
"Comment calculer ma période d'ovulation ?",
"Que faire en cas de règles très douloureuses ?"
 ];

 return (
 <div className="px-6 py-4 bg-white border-t border-brand-border flex gap-2 overflow-x-auto no-scrollbar">
 {questions.map((q, i) => (
 <button 
 key={i}
 onClick={() => onSelect && onSelect(q)}
 className="whitespace-nowrap px-4 py-2 bg-brand-soft/60 text-brand-primary text-sm font-medium rounded-full border border-brand-border hover:bg-brand-soft transition"
 >
 {q}
 </button>
 ))}
 </div>
 );
}
