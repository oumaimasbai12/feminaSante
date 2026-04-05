import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = (k) => (e) => setForm({...form, [k]: e.target.value});

    const submit = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) { setError('Passwords do not match'); return; }
        setLoading(true); setError('');
        try {
            const res = await window.axios.post('/api/v1/register', form);
            const { token, user } = res.data;
            window.setAuthToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            router.visit('/dashboard');
        } catch(err) {
            const errs = err.response?.data?.errors;
            setError(errs ? Object.values(errs).flat().join(' ') : (err.response?.data?.message || 'Registration failed'));
        } finally { setLoading(false); }
    };

    const fields = [
        { key: 'name', label: 'Full name', type: 'text', icon: User, placeholder: 'Sarah Johnson' },
        { key: 'email', label: 'Email address', type: 'email', icon: Mail, placeholder: 'sarah@example.com' },
        { key: 'password', label: 'Password', type: show?'text':'password', icon: Lock, placeholder: 'Min. 8 characters', toggle: true },
        { key: 'password_confirmation', label: 'Confirm password', type: show?'text':'password', icon: Lock, placeholder: 'Repeat password' },
    ];

    return (
        <AuthLayout title='Create your account' subtitle='Start your personalized health journey today'>
            {error && (
                <div className='mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm'>{error}</div>
            )}
            <form onSubmit={submit} className='space-y-4'>
                {fields.map(f => {
                    const I = f.icon;
                    return (
                        <div key={f.key}>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>{f.label}</label>
                            <div className='relative'>
                                <I size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'/>
                                <input type={f.type} required value={form[f.key]} onChange={set(f.key)} placeholder={f.placeholder} className='input-field pl-11 pr-11'/>
                                {f.toggle && <button type='button' onClick={()=>setShow(!show)} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button>}
                            </div>
                        </div>
                    );
                })}
                <p className='text-xs text-gray-400 pt-1'>By creating an account, you agree to our <a href='#' className='text-pink-600 hover:underline'>Terms</a> and <a href='#' className='text-pink-600 hover:underline'>Privacy Policy</a>.</p>
                <button type='submit' disabled={loading} className='btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-2'>
                    {loading ? (<><span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>Creating account...</>) : (<>Create Account <ArrowRight size={18}/></>)}
                </button>
            </form>
            <p className='mt-8 text-center text-sm text-gray-500'>
                Already have an account?{' '}
                <Link href='/login' className='font-semibold text-pink-600 hover:text-pink-700 transition-colors'>Sign in</Link>
            </p>
        </AuthLayout>
    );
}
