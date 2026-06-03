import React from 'react';
import Card from '../Common/Card';

export default function DataExport() {
 return (
 <Card title="Gestion des Données">
 <div className="space-y-6">
 <div>
 <h4 className="text-brand-ink font-bold mb-2">Exporte vos données</h4>
 <p className="text-sm text-brand-muted mb-4">Téléchargez un fichier regroupant tout l'historique de vos cycles pour le partager facilement avec votre gynécologue ou médecin traitant.</p>
                        <button type="button" className="btn-secondary inline-flex items-center gap-2">
 Télécharger PDF
 </button>
 </div>
 
 <div className="pt-6 border-t border-brand-border">
 <h4 className="text-red-600 font-bold mb-2">Zone Dangereuse</h4>
 <p className="text-sm text-brand-muted mb-4">Supprimez définitivement votre compte et l'ensemble des données associées. Cette action est irréversible.</p>
 <button type="button" className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md font-medium hover:bg-red-100 transition">
 Supprimer le compte
 </button>
 </div>
 </div>
 </Card>
 );
}
