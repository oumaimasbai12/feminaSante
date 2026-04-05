import React from 'react';
import Card from '../Common/Card';

export default function ProfileForm({ user }) {
    return (
        <Card title="Informations Personnelles" className="mb-6">
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom / Nom</label>
                        <input type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" defaultValue={user?.name || ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" defaultValue={user?.email || ''} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                        <input type="number" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" defaultValue={user?.age || ''} />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button type="button" className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition shadow-sm">
                        Enregistrer
                    </button>
                </div>
            </form>
        </Card>
    );
}
