import React from 'react';
import Logo from '../Components/Logo';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className='min-h-screen flex' style={{background:'linear-gradient(135deg,#fff0f5 0%,#fdf4ff 50%,#f0f7ff 100%)'}}>
            {/* Left decorative panel */}
            <div className='hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col items-center justify-center' style={{background:'linear-gradient(160deg,#be185d 0%,#9d174d 40%,#6b21a8 100%)'}}>
                <div className='absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-blob' style={{background:'radial-gradient(circle,#f9a8d4,transparent)'}}></div>
                <div className='absolute bottom-20 right-10 w-56 h-56 rounded-full opacity-20 animate-blob animation-delay-2000' style={{background:'radial-gradient(circle,#c4b5fd,transparent)'}}></div>
                <div className='relative z-10 text-center px-10'>
                    <Logo size='xl' light className='justify-center mb-8' />
                    <h2 className='text-3xl font-bold text-white mb-4'>Your health, your story</h2>
                    <p className='text-white/70 text-lg leading-relaxed'>Track your cycle, monitor your health, and connect with the care you deserve.</p>
                    <div className='mt-10 grid grid-cols-3 gap-4'>
                        {[['Cycle Tracking','🌸'],['AI Insights','🤖'],['Expert Care','💚']].map(([l,e]) => (
                            <div key={l} className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center'>
                                <div className='text-3xl mb-2'>{e}</div>
                                <div className='text-white/80 text-xs font-medium'>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Right form panel */}
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
