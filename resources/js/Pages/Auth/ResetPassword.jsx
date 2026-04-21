import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
    const [form, setForm] = useState({ password: '', password_confirmation: '' });
    const [show, setShow] = useState(false);
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
        <div className='min-h-screen flex items-center justify-center p-4' style={{ background: 'linear-gradient(135deg,#fdf2f8,#fff5f5,#fff8ed)' }}>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <div className='text-4xl mb-3'>🔐</div>
                    <h1 className='text-2xl font-extrabold text-gray-900'>Nouveau mot de passe</h1>
                    <p className='text-gray-500 mt-2'>Choisissez un nouveau mot de passe sécurisé</p>
                </div>

                <div className='bg-white rounded-3xl shadow-xl p-8 border border-pink-100'>
                    {success ? (
                        <div className='text-center space-y-4'>
                            <div className='text-5xl'>🎉</div>
                            <h2 className='text-lg font-bold text-gray-900'>Mot de passe modifié !</h2>
                            <p className='text-sm text-gray-500'>Vous allez être redirigée vers la page de connexion...</p>
                            <div className='w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto'></div>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className='mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2'>
                                    <span className='w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold'>!</span>
                                    {error}
                                </div>
                            )}
                            {!token && (
                                <div className='mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm'>
                                    ⚠️ Lien de réinitialisation invalide. Veuillez recommencer.
                                </div>
                            )}
                            <form onSubmit={submit} className='space-y-5'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Nouveau mot de passe</label>
                                    <div className='relative'>
                                        <Lock size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                                        <input
                                            type={show ? 'text' : 'password'}
                                            required
                                            minLength={8}
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            placeholder='Minimum 8 caractères'
                                            className='w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                                        />
                                        <button type='button' onClick={() => setShow(!show)} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400'>
                                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Confirmer le mot de passe</label>
                                    <div className='relative'>
                                        <Lock size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                                        <input
                                            type={show ? 'text' : 'password'}
                                            required
                                            minLength={8}
                                            value={form.password_confirmation}
                                            onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                            placeholder='Répétez le mot de passe'
                                            className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm'
                                        />
                                    </div>
                                </div>
                                <button
                                    type='submit'
                                    disabled={loading || !token}
                                    className='w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50'
                                    style={{ background: 'linear-gradient(135deg,#f472b6,#ffb6c1)' }}
                                >
                                    {loading ? (
                                        <><span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>Modification...</>
                                    ) : (
                                        <>Modifier mon mot de passe <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                    <div className='mt-6 text-center'>
                        <Link href='/login' className='inline-flex items-center gap-2 text-sm text-pink-700 font-semibold hover:text-pink-800'>
                            <ArrowLeft size={15} />Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}