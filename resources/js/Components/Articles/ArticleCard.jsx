import React from 'react';

export default function ArticleCard({ title, category, author, date, coverImage }) {
 return (
 <a href="#" className="glass-panel overflow-hidden border border-brand-border transition-all duration-200 transition group flex flex-col h-full">
 <div className="h-48 bg-brand-soft relative overflow-hidden flex-shrink-0">
 {coverImage ? (
 <img src={coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
 ) : (
 <div className="w-full h-full bg-brand-soft border-b border-brand-border"></div>
 )}
 <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-primary">
 {category}
 </span>
 </div>
 <div className="p-6 flex flex-col flex-grow">
 <h3 className="text-xl font-bold text-brand-ink leading-snug mb-3 group-hover:text-brand-primary transition line-clamp-2">
 {title}
 </h3>
 <div className="mt-auto pt-4 flex items-center justify-between text-sm text-brand-muted border-t border-brand-border">
 <span className="font-medium">{author}</span>
 <span>{date}</span>
 </div>
 </div>
 </a>
 );
}
