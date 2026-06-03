import React from 'react';

export default function ArticleCategories({ categories = ['Cycle Menstruel', 'Maternité', 'Nutrition', 'Psychologie'] }) {
 return (
 <div className="bg-brand-soft/60 p-6 rounded-3xl mb-8">
 <h3 className="font-bold text-brand-ink tracking-wider uppercase text-sm mb-4">Filtrer par Sujet</h3>
 <div className="flex flex-wrap gap-2">
 <button className="px-4 py-2 bg-brand-primary text-white rounded-full text-sm font-bold">Tous</button>
 {categories.map((c, i) => (
 <button key={i} className="px-4 py-2 bg-white border border-brand-border text-brand-muted rounded-full text-sm font-medium hover:border-brand-primary/30 hover:text-brand-primary transition">
 {c}
 </button>
 ))}
 </div>
 </div>
 );
}
