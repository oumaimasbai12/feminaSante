import React from 'react';

/** Tailwind-safe category glass-panel styles (no dynamic `bg-${x}` strings). */
const CATEGORY_CARD_STYLES = {
 blue: {
 wrapper:
 'block p-6 rounded-2xl border transition-all duration-200 bg-brand-soft/60 border-brand-border hover:border-brand-primary/30 group',
 iconWrapper:
 'w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-brand-soft text-brand-primary group-hover:scale-110 transition-transform',
 title: 'text-lg font-bold text-brand-ink mb-2',
 desc: 'text-sm text-brand-muted line-clamp-2',
 },
 green: {
 wrapper:
 'block p-6 rounded-2xl border transition-all duration-200 bg-green-50 border-green-100 hover:border-green-300 group',
 iconWrapper:
 'w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-green-200 text-green-700 group-hover:scale-110 transition-transform',
 title: 'text-lg font-bold text-green-900 mb-2',
 desc: 'text-sm text-green-800/80 line-clamp-2',
 },
 red: {
 wrapper:
 'block p-6 rounded-2xl border transition-all duration-200 bg-red-50 border-red-100 hover:border-red-300 group',
 iconWrapper:
 'w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-red-200 text-red-700 group-hover:scale-110 transition-transform',
 title: 'text-lg font-bold text-red-900 mb-2',
 desc: 'text-sm text-red-800/80 line-clamp-2',
 },
 purple: {
 wrapper:
 'block p-6 rounded-2xl border transition-all duration-200 bg-brand-soft/60 border-brand-border hover:border-brand-primary/30 group',
 iconWrapper:
 'w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-brand-soft text-brand-primary group-hover:scale-110 transition-transform',
 title: 'text-lg font-bold text-brand-ink mb-2',
 desc: 'text-sm text-brand-muted line-clamp-2',
 },
 orange: {
 wrapper:
 'block p-6 rounded-2xl border transition-all duration-200 bg-orange-50 border-orange-100 hover:border-orange-300 group',
 iconWrapper:
 'w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-orange-200 text-orange-700 group-hover:scale-110 transition-transform',
 title: 'text-lg font-bold text-orange-900 mb-2',
 desc: 'text-sm text-orange-800/80 line-clamp-2',
 },
 pink: {
 wrapper:
 'block p-6 rounded-2xl border transition-all duration-200 bg-brand-soft border-brand-border hover:border-brand-primary/40 group',
 iconWrapper:
 'w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-brand-soft text-brand-ink group-hover:scale-110 transition-transform',
 title: 'text-lg font-bold text-brand-ink mb-2',
 desc: 'text-sm text-brand-muted line-clamp-2',
 },
 indigo: {
 wrapper:
 'block p-6 rounded-2xl border transition-all duration-200 bg-brand-soft/60 border-brand-border hover:border-brand-primary/30 group',
 iconWrapper:
 'w-12 h-12 rounded-full mb-4 flex items-center justify-center bg-brand-soft text-brand-primary group-hover:scale-110 transition-transform',
 title: 'text-lg font-bold text-brand-ink mb-2',
 desc: 'text-sm text-brand-muted line-clamp-2',
 },
};

function getStyles(color) {
 const key = color && CATEGORY_CARD_STYLES[color] ? color : 'indigo';
 return CATEGORY_CARD_STYLES[key];
}

export default function DiseaseCategories({ categories }) {
 if (!categories || categories.length === 0) return null;

 return (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {categories.map((category) => {
 const styles = getStyles(category.color);
 return (
 <a key={category.id} href={`/diseases/category/${category.slug}`} className={styles.wrapper}>
 <div className={styles.iconWrapper}>
 {category.icon ? (
 <span className="text-xl" role="img" aria-label={category.nom}>
 {category.icon}
 </span>
 ) : (
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth="2"
 d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
 />
 </svg>
 )}
 </div>
 <h3 className={styles.title}>{category.nom}</h3>
 <p className={styles.desc}>{category.description}</p>
 </a>
 );
 })}
 </div>
 );
}
