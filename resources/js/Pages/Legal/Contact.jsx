import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../../Components/Logo';
import { Mail, CheckCircle } from 'lucide-react';

export default function Contact() {
 const [sent, setSent] = useState(false);

 const handleSubmit = (e) => {
 e.preventDefault();
 setTimeout(() => setSent(true), 500);
 };

 return (
 <div className="min-h-screen fs-app-bg py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
 <Link href="/" className="mb-8">
 <Logo size="lg" />
 </Link>

 <div className="w-full max-w-2xl page-blocks">
 <div className="w-full glass-panel-strong p-8 md:p-12">
 <div className="mb-8 text-center">
 <h1 className="text-3xl font-extrabold text-brand-ink mb-2">Contactez-nous</h1>
 <p className="text-brand-muted">
 Vous avez une question sur votre suivi, un problème technique ou besoin d'informations
 supplémentaires ? L'équipe FeminaSante est là pour vous !
 </p>
 </div>

 {sent ? (
 <div className="text-center py-12 bg-emerald-50/80 rounded-2xl border border-emerald-200/60">
 <CheckCircle size={48} className="text-emerald-600 mx-auto mb-4" />
 <h2 className="text-2xl font-bold text-emerald-800 mb-2">Message envoyé !</h2>
 <p className="text-emerald-700">Nous vous répondrons dans les plus brefs délais.</p>
 <button
 type="button"
 onClick={() => setSent(false)}
 className="mt-6 text-sm font-semibold text-emerald-700 hover:underline"
 >
 Envoyer un autre message
 </button>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-5">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div>
 <label className="block text-sm font-medium text-brand-muted mb-1">Nom complet</label>
 <input type="text" required className="input-field" />
 </div>
 <div>
 <label className="block text-sm font-medium text-brand-muted mb-1">Adresse email</label>
 <input type="email" required className="input-field" />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-brand-muted mb-1">Sujet</label>
 <input type="text" required className="input-field" />
 </div>

 <div>
 <label className="block text-sm font-medium text-brand-muted mb-1">Message</label>
 <textarea required rows="4" className="input-field"></textarea>
 </div>

 <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
 <Mail size={18} />
 Envoyer le message
 </button>
 </form>
 )}

 <div className="mt-12 pt-8 border-t border-brand-border text-center">
 <p className="text-brand-muted text-sm">Ou écrivez-nous directement à :</p>
 <a href="mailto:support@feminasante.com" className="text-brand-primary font-semibold hover:text-brand-ink transition-colors">
 support@feminasante.com
 </a>
 </div>

 <div className="mt-8 text-center">
 <Link href="/" className="inline-flex items-center text-sm font-semibold text-brand-muted hover:text-brand-ink transition-colors">
 &larr; Retour à l'accueil
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
