import React, { useState } from 'react';

export default function ArticleComments() {
 const [comment, setComment] = useState("");

 return (
 <div className="max-w-4xl mx-auto mt-12 glass-panel p-8 border border-brand-border">
 <h3 className="text-2xl font-bold text-brand-ink mb-6">Commentaires (2)</h3>
 
 <div className="flex gap-4 mb-10">
 <div className="w-12 h-12 bg-brand-soft rounded-full flex-shrink-0 flex items-center justify-center font-bold text-brand-primary">VO</div>
 <div className="flex-grow">
 <textarea 
 className="w-full rounded-xl border-brand-border focus:border-brand-border0 focus:ring-brand-primary/400 mb-2 resize-none" 
 rows="3" 
 placeholder="Partagez votre avis ou votre expérience..."
 value={comment}
 onChange={(e) => setComment(e.target.value)}
 ></textarea>
 <div className="flex justify-end">
 <button className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition">Publier</button>
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="border-b border-brand-border pb-6 flex gap-4">
 <div className="w-10 h-10 bg-brand-soft rounded-full flex-shrink-0"></div>
 <div>
 <div className="flex items-baseline gap-2 mb-1">
 <span className="font-bold text-brand-ink">Sophie</span>
 <span className="text-xs text-brand-muted">Il y a 2h</span>
 </div>
 <p className="text-brand-muted">Article très intéressant, merci pour ces conseils !</p>
 </div>
 </div>
 </div>
 </div>
 );
}
