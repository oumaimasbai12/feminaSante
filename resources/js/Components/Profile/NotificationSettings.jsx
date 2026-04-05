import React from 'react';
import Card from '../Common/Card';

export default function NotificationSettings() {
    return (
        <Card title="Paramètres des Notifications" className="mb-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                        <h4 className="text-gray-900 font-medium font-semibold">Rappels de règles</h4>
                        <p className="text-sm text-gray-500 mt-1">Etre notifiée quelques jours avant vos prochaines règles prévues.</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="block bg-indigo-600 w-14 h-8 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
                        </div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                        <h4 className="text-gray-900 font-medium font-semibold">Pilule / Contraception</h4>
                        <p className="text-sm text-gray-500 mt-1">Rappels quotidiens pour la prise de votre contraception.</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" />
                            <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                        </div>
                    </label>
                </div>
                
                <div className="flex justify-end pt-2">
                    <button type="button" className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition shadow-sm">
                        Mettre à jour
                    </button>
                </div>
            </div>
        </Card>
    );
}
