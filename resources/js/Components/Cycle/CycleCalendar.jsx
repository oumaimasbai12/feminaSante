import React from 'react';

export default function CycleCalendar({ events = [] }) {
 // Scaffold UI for the calendar
 return (
 <div className="glass-panel p-6">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-xl font-bold text-brand-ink">Calendrier Menstruel</h3>
 <div className="flex gap-2">
 <button className="p-2 border border-brand-border rounded-lg hover:bg-brand-soft/60">&larr;</button>
 <span className="py-2 px-4 font-semibold text-brand-muted">Avril 2026</span>
 <button className="p-2 border border-brand-border rounded-lg hover:bg-brand-soft/60">&rarr;</button>
 </div>
 </div>
 
 <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-brand-muted no-stagger">
 <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
 </div>
 <div className="grid grid-cols-7 gap-2 text-center no-stagger">
 {/* Mockup days */}
 {[...Array(30)].map((_, i) => (
 <div 
 key={i} 
 className={`aspect-square flex flex-col items-center justify-center rounded-xl p-1 cursor-pointer transition ${
 i >= 12 && i <= 16 ? 'bg-brand-soft text-brand-ink font-bold border border-brand-primary/30' : 'hover:bg-brand-soft/60 text-brand-muted border border-transparent hover:border-brand-border'
 }`}
 >
 <span>{i + 1}</span>
 {(i >= 12 && i <= 16) && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1"></div>}
 {i === 24 && <div className="w-1.5 h-1.5 bg-brand-dark/70 rounded-full mt-1"></div>}
 </div>
 ))}
 </div>
 <div className="mt-6 flex gap-4 text-sm justify-center">
 <div className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-primary rounded-full"></div> Règles</div>
 <div className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-dark rounded-full"></div> Ovulation (prévue)</div>
 </div>
 </div>
 );
}
