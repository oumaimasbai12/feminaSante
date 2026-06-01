import React from 'react';
import Card from '../Common/Card';

export default function ProfileForm({ user }) {
    return (
        <Card title="Informations Personnelles" className="mb-6">
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Prénom / Nom</label>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all" 
                            defaultValue={user?.name || ''} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all" 
                            defaultValue={user?.email || ''} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Âge</label>
                        <input 
                            type="number" 
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all" 
                            defaultValue={user?.age || ''} 
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button 
                        type="button" 
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </Card>
    );
}
