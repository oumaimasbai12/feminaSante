import React from 'react';
import ArticleCard from './ArticleCard';

export default function ArticleList() {
    const defaultArticles = [
        { title: "Comment atténuer les douleurs menstruelles naturellement", category: "Cycle Menstruel", author: "Dr. Lemoine", date: "Il y a 2 jours" },
        { title: "SOPK : Les dernières avancées de la recherche", category: "Affections", author: "Rédaction", date: "Il y a 1 semaine" },
        { title: "Grossesse et sport : que peut-on vraiment faire ?", category: "Maternité", author: "Dr. Mercier", date: "Il y a 2 semaines" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultArticles.map((art, i) => (
                <ArticleCard key={i} {...art} />
            ))}
        </div>
    );
}
