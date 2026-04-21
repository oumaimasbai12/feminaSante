import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../../Components/Logo';
import { Mail, CheckCircle } from 'lucide-react';

export default function Contact() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate sending a message securely via API in the future
        setTimeout(() => setSent(true), 500);
    };

    return (
        <div className="min-h-screen bg-pink-50/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <Link href="/" className="mb-8">
                <Logo size="lg" />
            </Link>

            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-pink-100 p-8 md:p-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Contactez-nous</h1>
                    <p className="text-gray-500">
                        Vous avez une question sur votre suivi, un problème technique ou besoin d'informations 
                        supplémentaires ? L'équipe FeminaSante est là pour vous !
                    </p>
                </div>

                {sent ? (
                    <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
                        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-800 mb-2">Message envoyé !</h2>
                        <p className="text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
                        <button 
                            onClick={() => setSent(false)} 
                            className="mt-6 text-sm font-semibold text-green-700 hover:underline"
                        >
                            Envoyer un autre message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                <input type="text" required className="w-full px-4 py-2.5 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-pink-500 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                                <input type="email" required className="w-full px-4 py-2.5 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-pink-500 transition-all outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                            <input type="text" required className="w-full px-4 py-2.5 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-pink-500 transition-all outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea required rows="4" className="w-full px-4 py-2.5 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-pink-500 transition-all outline-none"></textarea>
                        </div>

                        <button type="submit" className="w-full px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                            <Mail size={18} />
                            Envoyer le message
                        </button>
                    </form>
                )}

                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-500 text-sm">Ou écrivez-nous directement à :</p>
                    <a href="mailto:support@feminasante.com" className="text-pink-600 font-semibold hover:text-pink-800 transition-colors">
                        support@feminasante.com
                    </a>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-pink-600 transition-colors">
                        &larr; Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
