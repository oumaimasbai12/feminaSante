import React from 'react';

export default function PregnancySymptoms() {
 const list = [
 { name: 'Nausées', level: 'Faible', date: 'Aujourd\'hui' },
 { name: 'Fatigue', level: 'Élevé', date: 'Hier' }
 ];

 return (
 <div className="glass-panel p-6">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold text-brand-ink">Derniers Symptômes</h3>
 <button className="text-brand-primary font-medium text-sm hover:underline">Saisir</button>
 </div>
 <div className="space-y-3">
 {list.map((s, i) => (
 <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-brand-border bg-brand-soft/60">
 <div>
 <p className="font-semibold text-brand-ink">{s.name}</p>
 <p className="text-xs text-brand-muted">{s.date}</p>
 </div>
 <span className={`px-2 py-1 rounded text-xs font-bold ${s.level === 'Élevé' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
 {s.level}
 </span>
 </div>
 ))}
 </div>
 </div>
 );
}
