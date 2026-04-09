import React from 'react';
import Logo from '../Components/Logo';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className='min-h-screen flex' style={{background:'linear-gradient(135deg,#f5f3ff 0%,#fdfbff 50%,#fff8ed 100%)'}}>
            <div className='hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col items-center justify-center' style={{background:'linear-gradient(160deg,#1e1b4b 0%,#3730a3 40%,#4f46e5 100%)'}}>
                <div className='absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-blob' style={{background:'radial-gradient(circle,#a78bfa,transparent)'}}></div>
                <div className='absolute bottom-20 right-10 w-56 h-56 rounded-full opacity-20 animate-blob animation-delay-2000' style={{background:'radial-gradient(circle,#fcd34d,transparent)'}}></div>
                <div className='relative z-10 text-center px-10'>
                    <Logo size='xl' light className='justify-center mb-8' />
                    <h2 className='text-3xl font-bold text-white mb-4'>Votre santé, votre histoire</h2>
                    <p className='text-white/70 text-lg leading-relaxed'>Suivez votre cycle, surveillez votre santé et accédez aux soins que vous méritez.</p>
                    <div className='mt-10 grid grid-cols-3 gap-4'>
                        {[['Suivi du cycle','🌸'],['IA & Insights','🤖'],['Soins experts','💚']].map(([l,e]) => (
                            <div key={l} className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center'>
                                <div className='text-3xl mb-2'>{e}</div>
                                <div className='text-white/80 text-xs font-medium'>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12'>
                <div className='w-full max-w-md'>
                    <div className='flex justify-center mb-8 lg:hidden'><Logo size='lg' /></div>
                    {title && (
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-gray-900 mb-2'>{title}</h1>
                            {subtitle && <p className='text-gray-500'>{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
