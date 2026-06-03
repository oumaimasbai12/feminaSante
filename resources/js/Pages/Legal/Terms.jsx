import React from 'react';
import { Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import Logo from '../../Components/Logo';

export default function Terms() {
 return (
 <div className="min-h-screen fs-app-bg py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
 <Link href="/" className="mb-8">
 <Logo size="lg" />
 </Link>

 <div className="w-full max-w-3xl page-blocks">
 <div className="w-full glass-panel-strong p-8 md:p-12">
 <div className="mb-8 text-center">
 <h1 className="text-3xl font-extrabold text-brand-ink mb-2">Conditions Générales d'Utilisation</h1>
 <p className="text-brand-muted">Dernière mise à jour : {new Date().getFullYear()}</p>
 </div>

 <div className="space-y-8 text-brand-muted leading-relaxed">
 <div className="p-4 glass-panel border-brand-border rounded-2xl">
 <h2 className="text-sm font-bold text-brand-ink uppercase tracking-widest mb-2 flex items-center gap-2">
 <AlertTriangle size={16} aria-hidden />
 Conseil Médical IMPORTANT
 </h2>
 <p className="text-sm text-brand-muted">
 FeminaSante est un outil technologique conçu pour le suivi et l'assistance et ne remplace
 <strong> en aucun cas</strong> l'avis d'un professionnel de santé, un diagnostic médical
 ou un traitement de santé. En cas de doute, consultez toujours un professionnel médical qualifié.
 </p>
 </div>

 <section>
 <h2 className="text-xl font-bold text-brand-ink mb-3">1. Utilisation de l'Assistant IA</h2>
 <p>
 L'assistant IA est configuré pour répondre à des questions générales sur le suivi du cycle,
 de la grossesse et la santé de la femme. Cependant, il peut générer des erreurs ou fournir
 des informations contextuellement incomplètes. Vous assumez l'entière responsabilité des
 actions prises à la suite d'informations lues sur l'application.
 </p>
 </section>

 <section>
 <h2 className="text-xl font-bold text-brand-ink mb-3">2. Limitations de Résponsabilité</h2>
 <p>
 Nous fournissons des prévisions (prochaines règles, ovulation, date d'accouchement) basées
 exclusivement sur les moyennes statistiques et vos enregistrements. Ces dates
 <strong> ne sont que des prévisions</strong> et peuvent être biologiquement inexactes.
 </p>
 </section>

 <section>
 <h2 className="text-xl font-bold text-brand-ink mb-3">3. Règles de conduite</h2>
 <p>
 L'utilisation du réseau expert de FeminaSante pour planifier des rendez-vous avec des
 gynécologues doit se faire avec exactitude et intégrité. Les comptes enregistrant des
 faux rendez-vous à répétition pourront être suspendus sans notification.
 </p>
 </section>
 </div>

 <div className="mt-12 text-center">
 <Link href="/" className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-ink transition-colors">
 &larr; Retour à l'accueil
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
