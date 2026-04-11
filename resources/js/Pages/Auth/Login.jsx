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
                <div className='mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2'>
                    <span className='w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold'>!</span>
                    {error}
                </div>
            )}
            <form onSubmit={submit} className='space-y-5'>
                <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Adresse e-mail</label>
                    <div className='relative'>
                        <Mail size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                        <input type='email' required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder='vous@exemple.com' className='input-field pl-11' />
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Mot de passe</label>
                    <div className='relative'>
                        <Lock size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                        <input type={show ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder='Votre mot de passe' className='input-field pl-11 pr-11' />
                        <button type='button' onClick={() => setShow(!show)} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <label className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
                        <input type='checkbox' className='rounded border-violet-300 text-violet-600 focus:ring-violet-300' />
                        Se souvenir de moi
                    </label>
                    <a href='#' className='text-sm font-semibold text-violet-700 hover:text-violet-800 transition-colors'>Mot de passe oublié ?</a>
                </div>
                <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-2'>
                    {loading ? (<><span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>Connexion...</>) : (<>Se connecter <ArrowRight size={18} /></>)}
                </button>
            </form>
            <p className='mt-8 text-center text-sm text-gray-500'>
                Vous n'avez pas de compte ?{' '}
                <Link href='/register' className='font-semibold text-violet-700 hover:text-violet-800 transition-colors'>Créer un compte gratuit</Link>
            </p>
        </AuthLayout>
    );
}