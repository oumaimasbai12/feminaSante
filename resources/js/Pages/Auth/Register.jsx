import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthLayout, { AuthFormAlert } from '../../Layouts/AuthLayout';
import PasswordInput from '../../Components/PasswordInput';
import { Mail, User, ArrowRight, Cake, Moon, Info, AlertTriangle } from 'lucide-react';
import { MENOPAUSE_MIN_AGE, menopauseEligibilityMessage } from '../../utils/menopause';

const inputClass = 'input-field pl-11';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        age: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const ageHint = menopauseEligibilityMessage(form.age);
    const ageNum = parseInt(form.age, 10);
    const isOldEnough = ageNum >= MENOPAUSE_MIN_AGE;

    const submit = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (!ageNum || ageNum < 13 || ageNum > 120) {
            setError('Veuillez indiquer un âge valide (13 à 120 ans).');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await window.axios.post('/api/v1/register', {
                name: form.name,
                email: form.email,
                age: ageNum,
                password: form.password,
                password_confirmation: form.password_confirmation,
            });
            const { token, user } = res.data;
            window.setAuthToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            router.visit('/dashboard');
        } catch (err) {
            const errs = err.response?.data?.errors;
            setError(
                errs
                    ? Object.values(errs).flat().join(' ')
                    : err.response?.data?.message || 'Inscription impossible.',
            );
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'Nom complet', type: 'text', icon: User, placeholder: 'Sarah Dupont' },
        { key: 'email', label: 'Adresse e-mail', type: 'email', icon: Mail, placeholder: 'sarah@exemple.com' },
    ];

    return (
        <AuthLayout title="Créer votre compte" subtitle="Commencez votre parcours santé personnalisé">
            <Head title="Inscription - FeminaSante" />

            {error && (
                <AuthFormAlert type="error">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    {error}
                </AuthFormAlert>
            )}

            <form onSubmit={submit} className="space-y-5">
                {fields.map((f) => {
                    const I = f.icon;
                    return (
                        <div key={f.key}>
                            <label htmlFor={f.key} className="block text-sm font-semibold text-brand-ink mb-2">
                                {f.label}
                            </label>
                            <div className="relative">
                                <I size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                                <input
                                    id={f.key}
                                    type={f.type}
                                    required
                                    value={form[f.key]}
                                    onChange={set(f.key)}
                                    placeholder={f.placeholder}
                                    autoComplete={f.key === 'email' ? 'email' : 'name'}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    );
                })}

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-brand-ink mb-2">
                        Mot de passe
                    </label>
                    <PasswordInput
                        id="password"
                        required
                        minLength={8}
                        value={form.password}
                        onChange={set('password')}
                        placeholder="Min. 8 caractères"
                        autoComplete="new-password"
                    />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-semibold text-brand-ink mb-2">
                        Confirmer le mot de passe
                    </label>
                    <PasswordInput
                        id="password_confirmation"
                        required
                        minLength={8}
                        value={form.password_confirmation}
                        onChange={set('password_confirmation')}
                        placeholder="Répéter le mot de passe"
                        autoComplete="new-password"
                    />
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-semibold text-brand-ink mb-2">
                        Votre âge
                    </label>
                    <div className="relative">
                        <Cake size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input
                            id="age"
                            type="number"
                            required
                            min={13}
                            max={120}
                            value={form.age}
                            onChange={set('age')}
                            placeholder="Ex. 32"
                            className={inputClass}
                        />
                    </div>
                    {ageHint && (
                        <p
                            className={`mt-2 text-xs font-medium px-3 py-2 rounded-lg flex items-start gap-2 border ${
                                isOldEnough
                                    ? 'bg-brand-bg text-brand-primary border-brand-border'
                                    : 'bg-white/42 text-brand-muted border-brand-border'
                            }`}
                        >
                            {isOldEnough ? (
                                <Moon size={14} className="mt-0.5 flex-shrink-0" />
                            ) : (
                                <Info size={14} className="mt-0.5 flex-shrink-0" />
                            )}
                            {ageHint}
                        </p>
                    )}
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-3.5">
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Création du compte…
                        </>
                    ) : (
                        <>
                            Créer mon compte <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-xs text-brand-muted leading-relaxed">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" className="text-brand-primary font-semibold hover:opacity-80">
                    conditions d&apos;utilisation
                </Link>{' '}
                et notre{' '}
                <Link href="/privacy" className="text-brand-primary font-semibold hover:opacity-80">
                    politique de confidentialité
                </Link>
                .
            </p>

            <p className="mt-4 text-center text-sm text-brand-muted">
                Déjà un compte ?{' '}
                <Link href="/login" className="font-semibold text-brand-primary hover:opacity-80 transition-opacity">
                    Se connecter
                </Link>
            </p>
        </AuthLayout>
    );
}
