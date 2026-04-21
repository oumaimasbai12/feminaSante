import React from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../../Components/Logo';

export default function Terms() {
    return (
        <div className="min-h-screen bg-pink-50/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <Link href="/" className="mb-8">
                <Logo size="lg" />
            </Link>

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-pink-100 p-8 md:p-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Conditions Générales d'Utilisation</h1>
                    <p className="text-gray-500">Dernière mise à jour : {new Date().getFullYear()}</p>
                </div>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                        <h2 className="text-sm font-bold text-orange-900 uppercase tracking-widest mb-2">⚠️ Conseil Médical IMPORTANT</h2>
                        <p className="text-sm text-orange-800">
                            FeminaSante est un outil technologique conçu pour le suivi et l'assistance et ne remplace 
                            <strong> en aucun cas</strong> l'avis d'un professionnel de santé, un diagnostic médical 
                            ou un traitement de santé. En cas de doute, consultez toujours un professionnel médical qualifié.
                        </p>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Utilisation de l'Assistant IA</h2>
                        <p>
                            L'assistant IA est configuré pour répondre à des questions générales sur le suivi du cycle, 
                            de la grossesse et la santé de la femme. Cependant, il peut générer des erreurs ou fournir 
                            des informations contextuellement incomplètes. Vous assumez l'entière responsabilité des 
                            actions prises à la suite d'informations lues sur l'application.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Limitations de Résponsabilité</h2>
                        <p>
                            Nous fournissons des prévisions (prochaines règles, ovulation, date d'accouchement) basées
                            exclusivement sur les moyennes statistiques et vos enregistrements. Ces dates 
                            <strong> ne sont que des prévisions</strong> et peuvent être biologiquement inexactes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Règles de conduite</h2>
                        <p>
                            L'utilisation du réseau expert de FeminaSante pour planifier des rendez-vous avec des 
                            gynécologues doit se faire avec exactitude et intégrité. Les comptes enregistrant des 
                            faux rendez-vous à répétition pourront être suspendus sans notification.
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
