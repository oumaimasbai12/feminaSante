import React, { useState } from 'react';
import axios from 'axios';
import DiseaseCard from './DiseaseCard';
import MedicalDisclaimer from './MedicalDisclaimer';

export default function SymptomChecker() {
 const [selectedSymptoms, setSelectedSymptoms] = useState([]);
 const [inputValue, setInputValue] = useState('');
 const [results, setResults] = useState(null);
 const [loading, setLoading] = useState(false);

 const commonSymptoms = ["Douleur pelvienne","Règles douloureuses","Saignements abondants","Fatigue","Douleurs lors des rapports","Infertilité","Bouffées de chaleur"];

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
 <div className="bg-white p-6 md:p-10 rounded-2xl border border-brand-border glass-card">
 <h2 className="text-3xl font-extrabold text-brand-ink mb-3 tracking-tight">Vérificateur de Symptômes</h2>
 <p className="text-brand-muted mb-8 text-lg">Sélectionnez vos symptômes pour découvrir quelles affections y sont généralement associées.</p>
 
 <MedicalDisclaimer />

 <div className="mb-8 mt-8">
 <label className="block text-sm font-semibold text-brand-muted mb-2">Ajoutez ou sélectionnez vos symptômes :</label>
 <div className="flex gap-2 mb-4">
 <input 
 type="text" 
 value={inputValue}
 onChange={(e) => setInputValue(e.target.value)}
 onKeyPress={(e) => {
 if (e.key === 'Enter' && inputValue) addSymptom(inputValue);
 }}
 className="flex-grow py-3 px-4 rounded-xl border-brand-border focus:border-brand-border0 focus:ring-brand-primary/400"
 placeholder="Ex: Douleur pelvienne, saignements..."
 />
 <button 
 onClick={() => inputValue && addSymptom(inputValue)}
 className="bg-brand-primary font-medium whitespace-nowrap text-white px-6 py-3 rounded-xl hover:bg-brand-dark transition"
 >
 Ajouter
 </button>
 </div>
 
 <div className="mt-4 flex flex-wrap gap-2">
 {commonSymptoms.filter(s => !selectedSymptoms.includes(s)).map(symp => (
 <button 
 key={symp}
 onClick={() => addSymptom(symp)}
 className="text-sm px-4 py-2 rounded-full border border-brand-border hover:border-brand-primary/30 hover:bg-brand-soft/60 hover:text-brand-primary text-brand-muted transition"
 >
 + {symp}
 </button>
 ))}
 </div>
 </div>

 <div className="mb-8 flex flex-wrap gap-2 min-h-[40px]">
 {selectedSymptoms.length === 0 && (
 <span className="text-brand-muted italic">Aucun symptôme sélectionné pour le moment.</span>
 )}
 {selectedSymptoms.map(symp => (
 <span key={symp} className="bg-brand-soft text-brand-muted text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
 {symp}
 <button onClick={() => removeSymptom(symp)} className="text-brand-muted hover:text-brand-ink focus:outline-none transition-colors ml-1">
 &times;
 </button>
 </span>
 ))}
 </div>

 <button 
 onClick={checkSymptoms}
 disabled={selectedSymptoms.length === 0 || loading}
 className={`w-full py-4 rounded-xl font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/400 ${
 selectedSymptoms.length === 0 || loading 
 ? 'bg-brand-soft text-brand-muted cursor-not-allowed' 
 : 'btn-primary w-full py-4 text-lg'
 }`}
 >
 {loading ? 'Analyse éducative en cours...' : 'Trouver les correspondances possibles'}
 </button>

 {results && (
 <div className="mt-10 pt-10 border-t border-brand-border animate-in fade-in slide-in-from-bottom-4 duration-500">
 <h3 className="text-2xl font-bold text-brand-ink mb-6">Affections pouvant correspondre ({results.length}) :</h3>
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
 <div className="bg-brand-soft/60 text-center py-10 rounded-xl border border-brand-border">
 <p className="text-brand-muted text-lg">Aucune correspondance éducative trouvée pour la combinaison de ces symptômes précis.</p>
 </div>
 )}
 </div>
 )}
 </div>
 );
}
