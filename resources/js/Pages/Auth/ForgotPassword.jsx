import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Mail, ArrowLeft, ArrowRight, Copy, CheckCheck } from 'lucide-react';

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
        <div className='min-h-screen flex items-center justify-center p-4' style={{ background: 'linear-gradient(135deg,#fdf2f8,#fff5f5,#fff8ed)' }}>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <div className='text-4xl mb-3'>🔑</div>
                    <h1 className='text-2xl font-extrabold text-gray-900'>Mot de passe oublié</h1>
                    <p className='text-gray-500 mt-2'>Entrez votre email pour réinitialiser votre mot de passe</p>
                </div>

                <div className='bg-white rounded-3xl shadow-xl p-8 border border-pink-100'>
                    {!result ? (
                        <>
                            {error && (
                                <div className='mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2'>
                                    <span className='w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold'>!</span>
                                    {error}
                                </div>
                            )}
                            <form onSubmit={submit} className='space-y-5'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Adresse e-mail</label>
                                    <div className='relative'>
                                        <Mail size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                                        <input
                                            type='email'
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder='vous@exemple.com'
                                            className='w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 text-sm'
                                        />
                                    </div>
                                </div>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50'
                                    style={{ background: 'linear-gradient(135deg,#f472b6,#ffb6c1)' }}
                                >
                                    {loading ? (
                                        <><span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>Envoi...</>
                                    ) : (
                                        <>Réinitialiser mon mot de passe <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className='text-center space-y-4'>
                            <div className='text-5xl'>✅</div>
                            <h2 className='text-lg font-bold text-gray-900'>Lien généré !</h2>
                            <p className='text-sm text-gray-500'>
                                En production, ce lien serait envoyé par email. Pour l'instant, copiez-le ci-dessous :
                            </p>
                            <div className='bg-pink-50 rounded-xl p-4 text-left'>
                                <p className='text-xs text-gray-400 mb-2 font-medium'>Lien de réinitialisation :</p>
                                <p className='text-xs text-pink-700 break-all font-mono'>
                                    {window.location.origin + result.reset_url}
                                </p>
                            </div>
                            <button
                                onClick={copy}
                                className='w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-pink-200 text-pink-700 font-semibold text-sm hover:bg-pink-50 transition-all'
                            >
                                {copied ? <><CheckCheck size={17} className='text-green-500' />Copié !</> : <><Copy size={17} />Copier le lien</>}
                            </button>
                            <Link
                                href={result.reset_url}
                                className='block w-full py-3 rounded-xl text-white font-semibold text-sm text-center'
                                style={{ background: 'linear-gradient(135deg,#f472b6,#ffb6c1)' }}
                            >
                                Aller à la page de réinitialisation
                            </Link>
                        </div>
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