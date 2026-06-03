import React from 'react';

export default function WeekByWeek({ currentWeek = 24 }) {
 return (
 <div className="glass-panel p-8 border border-brand-border relative overflow-hidden h-full">
 <h3 className="text-xl font-bold text-brand-ink mb-6">Mon Bébé (S {currentWeek})</h3>
 
 <div className="flex flex-col items-center justify-center mb-8">
 <div className="w-32 h-32 bg-brand-soft rounded-full flex items-center justify-center text-6xl mb-4">
 🌽
 </div>
 <p className="text-brand-muted font-medium">Bébé a la taille d'un <span className="font-bold text-brand-ink">Épi de maïs</span></p>
 </div>

 <div className="space-y-4">
 <div>
 <h4 className="font-bold text-brand-ink">Développement</h4>
 <p className="text-sm text-brand-muted mt-1">À 24 semaines, les poumons de bébé continuent leur maturation et il réagit de plus en plus aux sons extérieurs. Ses empreintes digitales sont formées.</p>
 </div>
 <div className="pt-4 border-t border-brand-border">
 <h4 className="font-bold text-brand-ink">Pour vous</h4>
 <p className="text-sm text-brand-muted mt-1">Votre utérus dépasse maintenant votre nombril. Vous pourriez ressentir des brûlures d'estomac plus fréquentes.</p>
 </div>
 </div>
 
 <div className="mt-8">
 <button className="w-full py-3 border border-brand-border text-brand-primary bg-brand-soft/60 rounded-xl font-semibold hover:bg-brand-soft transition">
 Lire le détail de la semaine
 </button>
 </div>
 </div>
 );
}
