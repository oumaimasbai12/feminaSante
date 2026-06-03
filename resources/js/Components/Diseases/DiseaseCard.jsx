import React from 'react';

export default function DiseaseCard({ disease, onClick }) {
 return (
 <div 
 onClick={() => onClick(disease)}
 className="cursor-pointer glass-card p-6 flex flex-col h-full hover:bg-brand-soft/40 surface-transition"
 >
 <div className="flex flex-col mb-4">
 <div className="flex justify-between items-start mb-2">
 <h3 className="text-xl font-bold text-brand-ink line-clamp-1">{disease.nom}</h3>
 </div>
 {disease.category && (
 <span className="self-start px-3 py-1 text-xs font-medium rounded-full bg-brand-soft text-brand-muted">
 {disease.category.nom}
 </span>
 )}
 </div>
 
 <p className="text-sm text-brand-muted flex-grow mb-6 line-clamp-3 leading-relaxed">
 {disease.description}
 </p>
 
 <div className="flex items-center justify-between mt-auto border-t pt-4">
 <span className="text-brand-primary text-sm font-semibold group flex items-center gap-1 hover:text-brand-ink transition-colors">
 En savoir plus 
 <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
 </span>
 {disease.is_chronic && (
 <span className="text-xs text-red-500 font-medium">Chronique</span>
 )}
 </div>
 </div>
 );
}
