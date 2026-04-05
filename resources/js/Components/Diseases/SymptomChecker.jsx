import React, { useState } from 'react';
import axios from 'axios';
import DiseaseCard from './DiseaseCard';
import MedicalDisclaimer from './MedicalDisclaimer';

export default function SymptomChecker() {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const commonSymptoms = ["Douleur pelvienne", "Règles douloureuses", "Saignements abondants", "Fatigue", "Douleurs lors des rapports", "Infertilité", "Bouffées de chaleur"];

    const addSymptom = (symptom) => {
        if (!selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
        setInputValue('');
        setResults(null);
    };

    const removeSymptom = (symptom) => {
        setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        setResults(null);
    };

    const checkSymptoms = async () => {
        if (selectedSymptoms.length === 0) return;
        
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/diseases/symptom-checker', {
                symptoms: selectedSymptoms
            });
            setResults(response.data.data);
        } catch (error) {
            console.error("Error matching symptoms", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Vérificateur de Symptômes</h2>
            <p className="text-gray-600 mb-8 text-lg">Sélectionnez vos symptômes pour découvrir quelles affections y sont généralement associées.</p>
            
            <MedicalDisclaimer />

            <div className="mb-8 mt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ajoutez ou sélectionnez vos symptômes :</label>
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && inputValue) addSymptom(inputValue);
                        }}
                        className="flex-grow py-3 px-4 rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                        placeholder="Ex: Douleur pelvienne, saignements..."
                    />
                    <button 
                        onClick={() => inputValue && addSymptom(inputValue)}
                        className="bg-indigo-600 font-medium whitespace-nowrap text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
                    >
                        Ajouter
                    </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                    {commonSymptoms.filter(s => !selectedSymptoms.includes(s)).map(symp => (
                        <button 
                            key={symp}
                            onClick={() => addSymptom(symp)}
                            className="text-sm px-4 py-2 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 transition"
                        >
                            + {symp}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2 min-h-[40px]">
                {selectedSymptoms.length === 0 && (
                    <span className="text-gray-400 italic">Aucun symptôme sélectionné pour le moment.</span>
                )}
                {selectedSymptoms.map(symp => (
                    <span key={symp} className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                        {symp}
                        <button onClick={() => removeSymptom(symp)} className="text-indigo-400 hover:text-indigo-900 focus:outline-none transition-colors ml-1">
                            &times;
                        </button>
                    </span>
                ))}
            </div>

            <button 
                onClick={checkSymptoms}
                disabled={selectedSymptoms.length === 0 || loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    selectedSymptoms.length === 0 || loading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-md'
                }`}
            >
                {loading ? 'Analyse éducative en cours...' : 'Trouver les correspondances possibles'}
            </button>

            {results && (
                <div className="mt-10 pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Affections pouvant correspondre ({results.length}) :</h3>
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.map(disease => (
                                <DiseaseCard 
                                    key={disease.id} 
                                    disease={disease} 
                                    onClick={(d) => window.location.href = `/diseases/catalog/${d.slug}`} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 text-center py-10 rounded-xl border border-gray-100">
                            <p className="text-gray-500 text-lg">Aucune correspondance éducative trouvée pour la combinaison de ces symptômes précis.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
