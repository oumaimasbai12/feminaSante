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
            router.visit('/dashboard');
        } catch(err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <AuthLayout title='Welcome back' subtitle='Sign in to continue your health journey'>
            {error && (
                <div className='mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2'>
                    <span className='w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold'>!</span>
                    {error}
                </div>
            )}
            <form onSubmit={submit} className='space-y-5'>
                <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Email address</label>
                    <div className='relative'>
                        <Mail size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>
                        <input type='email' required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder='you@example.com' className='input-field pl-11'/>
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
                    <div className='relative'>
                        <Lock size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>
                        <input type={show?'text':'password'} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder='Your password' className='input-field pl-11 pr-11'/>
                        <button type='button' onClick={()=>setShow(!show)} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <label className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
                        <input type='checkbox' className='rounded border-pink-300 text-pink-500 focus:ring-pink-300'/>
                        Remember me
                    </label>
                    <a href='#' className='text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors'>Forgot password?</a>
                </div>
                <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-2'>
                    {loading ? (<><span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>Signing in...</>) : (<>Sign In <ArrowRight size={18}/></>)}
                </button>
            </form>
            <p className='mt-8 text-center text-sm text-gray-500'>
                Don't have an account?{' '}
                <Link href='/register' className='font-semibold text-pink-600 hover:text-pink-700 transition-colors'>Create one free</Link>
            </p>
        </AuthLayout>
    );
}
