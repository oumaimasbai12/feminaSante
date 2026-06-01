import React from 'react';
import Card from '../Common/Card';

export default function AppointmentForm() {
    return (
        <Card title="Finaliser le rendez-vous">
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Motif de consultation</label>
                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all">
                        <option>Consultation de suivi</option>
                        <option>Urgence gynécologique</option>
                        <option>Première consultation</option>
                        <option>Suivi de grossesse</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nouveau patient ?</label>
                    <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="new" className="mr-2 text-rose-600 focus:ring-rose-500" />
                            <span className="text-slate-700">Oui</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="new" defaultChecked className="mr-2 text-rose-600 focus:ring-rose-500" />
                            <span className="text-slate-700">Non</span>
                        </label>
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                    <button type="button" className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm">
                        Confirmer le rendez-vous
                    </button>
                </div>
            </form>
        </Card>
    );
}
