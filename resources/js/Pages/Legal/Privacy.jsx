import React from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../../Components/Logo';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-pink-50/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <Link href="/" className="mb-8">
                <Logo size="lg" />
            </Link>

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-pink-100 p-8 md:p-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Politique de Confidentialité</h1>
                    <p className="text-gray-500">Dernière mise à jour : {new Date().getFullYear()}</p>
                </div>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Collecte de données</h2>
                        <p>
                            Chez FeminaSante, nous prenons la protection de vos données médicales très au sérieux. 
                            Nous collectons uniquement les données que vous choisissez de nous fournir, notamment :
                            votre nom, votre adresse email, les dates relatives à vos cycles menstruels ou de grossesse, 
                            ainsi que vos symptômes enregistrés.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Utilisation de vos données</h2>
                        <p>
                            Vos informations personnelles et médicales nous permettent de vous fournir un algorithme 
                            efficace pour le suivi de votre cycle et de votre grossesse. L'intelligence artificielle 
                            utilise ces données pour générer des prédictions précises. Vos dossiers ne sont 
                            jamais vendus ou transmis à des réseaux publicitaires tiers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Protection et Sécurité</h2>
                        <p>
                            Toutes vos données de santé sont stockées sur des serveurs hautement sécurisés 
                            et bénéficient d'un cryptage industriel. L'accès à vos propres données est 
                            entièrement protégé par votre mot de passe et l'authentification de session.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Vos Droits (RGPD)</h2>
                        <p>
                            Conformément à la réglementation européenne, vous avez un accès total à vos données. 
                            Vous pouvez à tout moment demander un export de l'ensemble de votre historique de cycle, 
                            ainsi que la suppression immédiate et définitive de votre compte et de toutes vos 
                            données depuis vos paramètres de profil.
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-800 transition-colors">
                        &larr; Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
