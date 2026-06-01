import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await window.axios.post('/api/v1/login', form);
            const { token, user } = res.data;
            window.setAuthToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            if (user.is_admin) {
                router.visit('/admin/dashboard');
            } else if (user.is_gynecologist) {
                router.visit('/gynecologist/dashboard');
            } else {
                router.visit('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants invalides. Veuillez réessayer.');
        } finally { setLoading(false); }
    };

    return (
        <AuthLayout title='Bon retour 👋' subtitle='Connectez-vous pour continuer votre parcours santé'>
            {error && (
                <div className='mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center gap-2'>
                    <span className='w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold'>!</span>
                    {error}
                </div>
            )}
            <form onSubmit={submit} className='space-y-5'>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>Adresse e-mail</label>
                    <div className='relative'>
                        <Mail size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input 
                            type='email' 
                            required 
                            value={form.email} 
                            onChange={e => setForm({ ...form, email: e.target.value })} 
                            placeholder='vous@exemple.com' 
                            className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all pl-11'
                        />
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>Mot de passe</label>
                    <div className='relative'>
                        <Lock size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input 
                            type={show ? 'text' : 'password'} 
                            required 
                            value={form.password} 
                            onChange={e => setForm({ ...form, password: e.target.value })} 
                            placeholder='Votre mot de passe' 
                            className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all pl-11 pr-11'
                        />
                        <button 
                            type='button' 
                            onClick={() => setShow(!show)} 
                            className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                        >
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <label className='flex items-center gap-2 text-sm text-slate-600 cursor-pointer'>
                        <input type='checkbox' className='rounded border-slate-300 text-rose-600 focus:ring-rose-200' />
                        Se souvenir de moi
                    </label>
                    <Link href='/forgot-password' className='text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors'>Mot de passe oublié ?</Link>
                </div>
                <button 
                    type='submit' 
                    disabled={loading} 
                    className='w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm disabled:opacity-50'
                >
                    {loading ? (
                        <><span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>Connexion...</>
                    ) : (
                        <>Se connecter <ArrowRight size={18} /></>
                    )}
                </button>
            </form>
            <p className='mt-8 text-center text-sm text-slate-500'>
                Vous n'avez pas de compte ?{' '}
                <Link href='/register' className='font-semibold text-rose-600 hover:text-rose-700 transition-colors'>Créer un compte gratuit</Link>
            </p>
        </AuthLayout>
    );
}
