import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function HealthTips({ tips }) {
 const dailyTip = tips?.length > 0 ? tips[0] : "L'hydratation joue un rôle clé dans la réduction des crampes menstruelles. Pensez à boire au moins 1.5L d'eau aujourd'hui !";

 return (
 <div className="glass-panel p-5 border-brand-primary/30 bg-brand-soft">
 <div className="flex gap-4">
 <div className="mt-1">
 <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-primary">
 <Lightbulb size={20} aria-hidden />
 </div>
 </div>
 <div>
 <h4 className="font-bold text-brand-ink mb-2">Conseil Santé du Jour</h4>
 <p className="text-brand-muted leading-relaxed text-sm font-medium">{dailyTip}</p>
 </div>
 </div>
 </div>
 );
}
