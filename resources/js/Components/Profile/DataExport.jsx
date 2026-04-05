import React from 'react';
import Card from '../Common/Card';

export default function DataExport() {
    return (
        <Card title="Gestion des Données">
            <div className="space-y-6">
                <div>
                    <h4 className="text-gray-900 font-bold mb-2">Exporte vos données</h4>
                    <p className="text-sm text-gray-600 mb-4">Téléchargez un fichier regroupant tout l'historique de vos cycles pour le partager facilement avec votre gynécologue ou médecin traitant.</p>
                    <button type="button" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm font-medium hover:bg-gray-50 transition flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Télécharger PDF
                    </button>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-red-600 font-bold mb-2">Zone Dangereuse</h4>
                    <p className="text-sm text-gray-600 mb-4">Supprimez définitivement votre compte et l'ensemble des données associées. Cette action est irréversible.</p>
                    <button type="button" className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md font-medium hover:bg-red-100 transition">
                        Supprimer le compte
                    </button>
                </div>
            </div>
        </Card>
    );
}
