import React from 'react';
import { Search } from 'lucide-react';

export default function GynecologistSearch() {
    return (
        <div className="glass-card mb-6">
            <h2 className="text-xl font-bold text-brand-ink mb-4">Trouver un gynécologue</h2>
            <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1">
                    <input type="text" placeholder="Spécialité (ex: Obstétrique)" className="input-field" />
                </div>
                <div className="flex-1">
                    <input type="text" placeholder="Ville ou code postal" className="input-field" />
                </div>
                <button type="button" className="btn-primary inline-flex items-center gap-2">
                    <Search size={18} />
                    Rechercher
                </button>
            </div>
        </div>
    );
}
