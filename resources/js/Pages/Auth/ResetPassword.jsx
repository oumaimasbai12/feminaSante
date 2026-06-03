import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthLayout, { AuthFormAlert } from '../../Layouts/AuthLayout';
import PasswordInput from '../../Components/PasswordInput';
import { ArrowRight, Lock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function ResetPassword() {
    const [form, setForm] = useState({ password: '', password_confirmation: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token') || '');
        setEmail(params.get('email') || '');
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await window.axios.post('/api/v1/reset-password', {
                email,
                token,
                password: form.password,
                password_confirmation: form.password_confirmation,
            });
            setSuccess(true);
            setTimeout(() => router.visit('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe sécurisé">
            <Head title="Réinitialisation - FeminaSante" />

            {success ? (
                <div className="text-center space-y-4 py-4">
                    <CheckCircle2 size={48} className="text-brand-primary mx-auto" />
                    <h2 className="text-lg font-bold text-brand-ink">Mot de passe modifié</h2>
                    <p className="text-sm text-brand-muted">Redirection vers la connexion…</p>
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
                </div>
            ) : (
                <>
                    {error && (
                        <AuthFormAlert type="error">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            {error}
                        </AuthFormAlert>
                    )}
                    {!token && (
                        <AuthFormAlert type="error">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            Lien de réinitialisation invalide. Veuillez recommencer.
                        </AuthFormAlert>
                    )}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-brand-ink mb-2">
                                Nouveau mot de passe
                            </label>
                            <PasswordInput
                                id="password"
                                required
                                minLength={8}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Minimum 8 caractères"
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-semibold text-brand-ink mb-2"
                            >
                                Confirmer le mot de passe
                            </label>
                            <PasswordInput
                                id="password_confirmation"
                                required
                                minLength={8}
                                value={form.password_confirmation}
                                onChange={(e) =>
                                    setForm({ ...form, password_confirmation: e.target.value })
                                }
                                placeholder="Répétez le mot de passe"
                                autoComplete="new-password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full btn-primary py-3.5"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Modification…
                                </>
                            ) : (
                                <>
                                    <Lock size={16} />
                                    Modifier mon mot de passe
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}

            {!success && (
                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-sm text-brand-primary font-semibold hover:opacity-80 transition-opacity"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
}
