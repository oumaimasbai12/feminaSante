import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout, { AuthFormAlert } from '../../Layouts/AuthLayout';
import { Mail, ArrowRight, Copy, CheckCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await window.axios.post('/api/v1/forgot-password', { email });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(window.location.origin + result.reset_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AuthLayout
            title="Mot de passe oublié"
            subtitle="Entrez votre e-mail pour réinitialiser votre mot de passe"
        >
            <Head title="Mot de passe oublié - FeminaSante" />

            {!result ? (
                <>
                    {error && (
                        <AuthFormAlert type="error">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            {error}
                        </AuthFormAlert>
                    )}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-brand-ink mb-2">
                                Adresse e-mail
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vous@exemple.com"
                                    autoComplete="email"
                                    className="input-field pl-11"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Envoi…
                                </>
                            ) : (
                                <>
                                    Réinitialiser mon mot de passe <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </>
            ) : (
                <div className="text-center space-y-4">
                    <CheckCircle2 size={44} className="text-brand-primary mx-auto" />
                    <h2 className="text-lg font-bold text-brand-ink">Lien généré</h2>
                    <p className="text-sm text-brand-muted">
                        En production, ce lien serait envoyé par e-mail. Pour l&apos;instant, copiez-le
                        ci-dessous :
                    </p>
                    <div className="p-4 rounded-xl border border-brand-border bg-white/42 text-left">
                        <p className="text-xs text-brand-muted mb-2 font-medium">Lien de réinitialisation</p>
                        <p className="text-xs text-brand-ink break-all font-mono">
                            {window.location.origin + result.reset_url}
                        </p>
                    </div>
                    <button type="button" onClick={copy} className="btn-secondary w-full">
                        {copied ? (
                            <>
                                <CheckCheck size={17} className="text-emerald-600" />
                                Copié
                            </>
                        ) : (
                            <>
                                <Copy size={17} />
                                Copier le lien
                            </>
                        )}
                    </button>
                    <Link href={result.reset_url} className="btn-primary block w-full py-3 text-center">
                        Aller à la page de réinitialisation
                    </Link>
                </div>
            )}

            <div className="mt-6 text-center">
                <Link
                    href="/login"
                    className="text-sm text-brand-primary font-semibold hover:opacity-80 transition-opacity"
                >
                    Retour à la connexion
                </Link>
            </div>
        </AuthLayout>
    );
}
