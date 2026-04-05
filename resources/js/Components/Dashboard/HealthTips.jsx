import React from 'react';
import Card from '../Common/Card';

export default function HealthTips({ tips }) {
    // Scaffold fallback
    const dailyTip = tips?.length > 0 ? tips[0] : "L'hydratation joue un rôle clé dans la réduction des crampes menstruelles. Pensez à boire au moins 1.5L d'eau aujourd'hui !";

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 !shadow-none">
            <div className="flex gap-4">
                <div className="mt-1">
                    <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 shadow-sm">
                        💡
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-indigo-900 mb-2">Conseil Santé du Jour</h4>
                    <p className="text-indigo-800/80 leading-relaxed text-sm font-medium">{dailyTip}</p>
                </div>
            </div>
        </Card>
    );
}
