import React from 'react';
import Modal from '../Common/Modal';

export default function AddEntryModal({ isOpen, onClose }) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Saisir de nouvelles données</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Période de Règles</label>
                        <select className="w-full rounded-xl border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
                            <option value="none">Pas de règles</option>
                            <option value="light">Légères</option>
                            <option value="medium">Moyennes</option>
                            <option value="heavy">Abondantes</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Humeur</label>
                        <div className="flex gap-4">
                            <button type="button" className="text-2xl p-3 border border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-rose-500">😊</button>
                            <button type="button" className="text-2xl p-3 border border-gray-200 rounded-xl hover:bg-gray-50">😢</button>
                            <button type="button" className="text-2xl p-3 border border-gray-200 rounded-xl hover:bg-gray-50">😠</button>
                            <button type="button" className="text-2xl p-3 border border-gray-200 rounded-xl hover:bg-gray-50">😴</button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="button" onClick={onClose} className="mr-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">Annuler</button>
                        <button type="button" className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700">Enregistrer</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
