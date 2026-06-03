import React from 'react';

export default function ArticleDetail({ title, content, author, date, readTime }) {
 return (
 <article className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
 <div className="mb-8">
 <h1 className="text-4xl font-extrabold text-brand-ink tracking-tight leading-tight mb-6">{title}</h1>
 <div className="flex items-center gap-4 text-brand-muted font-medium">
 <div className="flex items-center gap-2">
 <div className="w-10 h-10 bg-brand-soft rounded-full"></div>
 <span className="text-brand-ink font-bold">{author}</span>
 </div>
 <span>•</span>
 <span>{date}</span>
 <span>•</span>
 <span>Lecture : {readTime} min</span>
 </div>
 </div>
 
 <div className="w-full h-64 md:h-96 bg-brand-soft rounded-2xl mb-10 overflow-hidden">
 {/* Image placeholder */}
 <div className="w-full h-full bg-brand-soft border border-brand-border"></div>
 </div>

 <div className="article-content max-w-none">
 {content || <p>Ceci est un paragraphe d'exemple généré automatiquement. Le contenu de l'article sera injecté ici depuis la base de données. Il peut contenir des listes, des titres de section, et du texte formaté.</p>}
 </div>
 </article>
 );
}
