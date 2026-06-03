import React from 'react';
import { Smile, Frown, Angry, Moon, X } from 'lucide-react';
import Modal from '../Common/Modal';

const MOODS = [
    { id: 'happy', icon: Smile, label: 'Bien' },
    { id: 'sad', icon: Frown, label: 'Triste' },
    { id: 'angry', icon: Angry, label: 'Irritable' },
    { id: 'tired', icon: Moon, label: 'Fatiguée' },
];

export default function AddEntryModal({ isOpen, onClose }) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-brand-border pb-4">
                    <h2 className="text-xl font-bold text-brand-ink">Saisir de nouvelles données</h2>
                    <button type="button" onClick={onClose} className="text-brand-muted hover:text-brand-ink">
                        <X size={22} />
                    </button>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Période de règles</label>
                        <select className="input-field">
                            <option value="none">Pas de règles</option>
                            <option value="light">Légères</option>
                            <option value="medium">Moyennes</option>
                            <option value="heavy">Abondantes</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-brand-ink mb-2">Humeur</label>
                        <div className="flex gap-3">
                            {MOODS.map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    title={label}
                                    className="flex flex-col items-center gap-1 p-3 border border-brand-border rounded-xl hover:bg-brand-soft/60 hover:border-brand-primary/40 transition-colors text-brand-primary"
                                >
                                    <Icon size={22} />
                                    <span className="text-[10px] font-medium text-brand-muted">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
                        <button type="button" className="btn-primary">Enregistrer</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
