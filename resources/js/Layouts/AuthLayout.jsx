import React from 'react';
import Logo from '../Components/Logo';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className='min-h-screen flex bg-slate-50'>
            <div className='hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col items-center justify-center bg-slate-900'>
                <div className='absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-500 via-transparent to-transparent'></div>
                <div className='relative z-10 text-center px-10'>
                    <Logo size='xl' light className='justify-center mb-8' />
                    <h2 className='text-3xl font-bold text-white mb-4'>Votre santé, votre histoire</h2>
                    <p className='text-slate-300 text-lg leading-relaxed'>Suivez votre cycle, surveillez votre santé et accédez aux soins que vous méritez.</p>
                    <div className='mt-10 grid grid-cols-3 gap-4'>
                        {[['Suivi du cycle','🌸'],['IA & Insights','🤖'],['Soins experts','💚']].map(([l,e]) => (
                            <div key={l} className='bg-white/5 border border-white/10 rounded-2xl p-4 text-center'>
                                <div className='text-3xl mb-2'>{e}</div>
                                <div className='text-slate-200 text-xs font-medium'>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12 bg-white'>
                <div className='w-full max-w-md'>
                    <div className='flex justify-center mb-8 lg:hidden'><Logo size='lg' /></div>
                    {title && (
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-slate-900 mb-2'>{title}</h1>
                            {subtitle && <p className='text-slate-500'>{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
