import React from 'react';
import Card from '../Common/Card';

export default function NotificationSettings() {
    return (
        <Card title="Paramètres des notifications" className="mb-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-brand-border">
                    <div>
                        <h4 className="text-brand-ink font-semibold">Rappels de règles</h4>
                        <p className="text-sm text-brand-muted mt-1">Être notifiée quelques jours avant vos prochaines règles prévues.</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="block bg-brand-primary w-14 h-8 rounded-full" />
                            <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6" />
                        </div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-brand-border">
                    <div>
                        <h4 className="text-brand-ink font-semibold">Pilule / contraception</h4>
                        <p className="text-sm text-brand-muted mt-1">Rappels quotidiens pour la prise de votre contraception.</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" />
                            <div className="block bg-brand-soft w-14 h-8 rounded-full" />
                            <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
                        </div>
                    </label>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="button" className="btn-primary">Mettre à jour</button>
                </div>
            </div>
        </Card>
    );
}
