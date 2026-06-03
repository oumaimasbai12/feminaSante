import React from 'react';

export default function CheckupPlanner() {
 const checkups = [
 { title:"1ère Échographie (T1)", period:"11 - 13 SA", status:"completed", date:"10 Janvier 2026" },
 { title:"Consultation 4ème mois", period:"16 - 19 SA", status:"completed", date:"10 Février 2026" },
 { title:"2ème Échographie (T2)", period:"20 - 24 SA", status:"upcoming", date:"15 Avril 2026" },
 { title:"Consultation 6ème mois", period:"24 - 28 SA", status:"pending", date:"Non programmé" }
 ];

 return (
 <div className="glass-panel p-6 h-full max-h-96 overflow-y-auto">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold text-brand-ink">Agenda Médical</h3>
 <button className="text-brand-primary font-medium text-sm hover:underline">+ Nouveau rdv</button>
 </div>
 
 <div className="relative border-l-2 border-brand-border ml-3 space-y-6 pb-4">
 {checkups.map((checkup, i) => (
 <div key={i} className="relative pl-6">
 <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${checkup.status === 'completed' ? 'bg-green-500' : checkup.status === 'upcoming' ? 'bg-brand-primary animate-pulse' : 'bg-brand-muted/40'}`}></div>
 <div>
 <h4 className={`font-bold ${checkup.status === 'completed' ? 'text-brand-muted line-through' : 'text-brand-ink'}`}>{checkup.title}</h4>
 <p className="text-sm text-brand-muted mt-1">{checkup.period} • {checkup.date}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}
