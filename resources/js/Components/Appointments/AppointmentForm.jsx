import React from 'react';
import Card from '../Common/Card';

export default function AppointmentForm() {
    return (
        <Card title="Finaliser le rendez-vous">
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motif de consultation</label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option>Consultation de suivi</option>
                        <option>Urgence gynécologique</option>
                        <option>Première consultation</option>
                        <option>Suivi de grossesse</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau patient ?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center"><input type="radio" name="new" className="mr-2 text-indigo-600" /> Oui</label>
                        <label className="flex items-center"><input type="radio" name="new" defaultChecked className="mr-2 text-indigo-600" /> Non</label>
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <button type="button" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm">
                        Confirmer le rendez-vous
                    </button>
                </div>
            </form>
        </Card>
    );
}
