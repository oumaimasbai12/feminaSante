import React from 'react';
import Card from '../Common/Card';

export default function ProfileForm({ user }) {
    return (
        <Card title="Informations personnelles" className="mb-6">
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Prénom / Nom</label>
                        <input type="text" className="input-field" defaultValue={user?.name || ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Email</label>
                        <input type="email" className="input-field" defaultValue={user?.email || ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Âge</label>
                        <input type="number" className="input-field" defaultValue={user?.age || ''} />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-brand-border">
                    <button type="button" className="btn-primary">Enregistrer</button>
                </div>
            </form>
        </Card>
    );
}
