import React from 'react';
import Card from '../Common/Card';

export default function AppointmentForm() {
    return (
        <Card title="Finaliser le rendez-vous">
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Motif de consultation</label>
                    <select className="input-field">
                        <option>Consultation de suivi</option>
                        <option>Urgence gynécologique</option>
                        <option>Première consultation</option>
                        <option>Suivi de grossesse</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-brand-ink mb-2">Nouveau patient ?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer gap-2">
                            <input type="radio" name="new" className="text-brand-primary focus:ring-brand-primary/30" />
                            <span className="text-brand-ink">Oui</span>
                        </label>
                        <label className="flex items-center cursor-pointer gap-2">
                            <input type="radio" name="new" defaultChecked className="text-brand-primary focus:ring-brand-primary/30" />
                            <span className="text-brand-ink">Non</span>
                        </label>
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t border-brand-border">
                    <button type="button" className="btn-primary w-full">
                        Confirmer le rendez-vous
                    </button>
                </div>
            </form>
        </Card>
    );
}
