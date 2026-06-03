import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthLayout, { AuthFormAlert } from '../../Layouts/AuthLayout';
import PasswordInput from '../../Components/PasswordInput';
import { Mail, ArrowRight, AlertTriangle } from 'lucide-react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await window.axios.post('/api/v1/login', form);
            const { token, user } = res.data;
            window.setAuthToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            const safeRedirect = redirect && redirect.startsWith('/') ? redirect : null;
            if (Boolean(user.is_admin)) {
                router.visit(safeRedirect?.startsWith('/admin') ? safeRedirect : '/admin/dashboard');
            } else if (Boolean(user.is_gynecologist)) {
                router.visit(safeRedirect?.startsWith('/gynecologist') ? safeRedirect : '/gynecologist/dashboard');
            } else {
                router.visit(safeRedirect || '/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants invalides. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Bon retour" subtitle="Connectez-vous pour continuer votre parcours santé">
            <Head title="Connexion - FeminaSante" />

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
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="vous@exemple.com"
                            autoComplete="email"
                            className="input-field pl-11"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-brand-ink mb-2">
                        Mot de passe
                    </label>
                    <PasswordInput
                        id="password"
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Votre mot de passe"
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-3.5">
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Connexion…
                        </>
                    ) : (
                        <>
                            Se connecter <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-brand-muted">
                Vous n&apos;avez pas de compte ?{' '}
                <Link href="/register" className="font-semibold text-brand-primary hover:opacity-80 transition-opacity">
                    Créer un compte gratuit
                </Link>
            </p>
        </AuthLayout>
    );
}
