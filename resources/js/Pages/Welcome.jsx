import React from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../Components/Logo';
import { Heart, Activity, Brain, Stethoscope, Baby, BookOpen, ArrowRight, CheckCircle, Star } from 'lucide-react';

const features = [
    { icon: Heart, title: 'Cycle Tracking', desc: 'Track your menstrual cycle, symptoms, and mood with intelligent predictions.', color: 'from-rose-400 to-pink-500' },
    { icon: Activity, title: 'Health Insights', desc: 'AI-powered analysis of your health patterns and personalized recommendations.', color: 'from-pink-400 to-fuchsia-500' },
    { icon: Brain, title: 'Health Quizzes', desc: 'Interactive quizzes to help you understand your body and health better.', color: 'from-fuchsia-400 to-purple-500' },
    { icon: Stethoscope, title: 'Expert Network', desc: 'Connect with certified gynecologists and book appointments easily.', color: 'from-purple-400 to-indigo-500' },
    { icon: Baby, title: 'Pregnancy Care', desc: 'Complete pregnancy tracking from first trimester to birth.', color: 'from-indigo-400 to-blue-500' },
    { icon: BookOpen, title: 'Health Library', desc: 'Curated articles and resources from medical experts for women’s health.', color: 'from-blue-400 to-cyan-500' },
];

const stats = [{ v: '50K+', l: 'Women Empowered' }, { v: '200+', l: 'Health Articles' }, { v: '98%', l: 'Satisfaction Rate' }, { v: '24/7', l: 'AI Support' }];

export default function Welcome() {
    return (
        <div className='min-h-screen bg-white overflow-x-hidden'>
            {/* Nav */}
            <nav className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-pink-100/40'>
                <Logo size='md' />
                <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-600'>
                    <a href='#features' className='hover:text-pink-600 transition-colors'>Features</a>
                    <a href='#about' className='hover:text-pink-600 transition-colors'>About</a>
                    <a href='#stats' className='hover:text-pink-600 transition-colors'>Stats</a>
                </div>
                <div className='flex items-center gap-3'>
                    <Link href='/login' className='text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors px-4 py-2'>Sign In</Link>
                    <Link href='/register' className='btn-primary text-sm'>Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className='relative min-h-screen flex items-center pt-20 overflow-hidden' style={{background:'linear-gradient(135deg,#fff0f5 0%,#fdf4ff 50%,#f0f4ff 100%)'}}>
                <div className='absolute top-20 -left-20 w-96 h-96 rounded-full opacity-30 animate-blob' style={{background:'radial-gradient(circle,#fda4af,transparent)'}}></div>
                <div className='absolute top-40 right-10 w-80 h-80 rounded-full opacity-25 animate-blob animation-delay-2000' style={{background:'radial-gradient(circle,#d8b4fe,transparent)'}}></div>
                <div className='absolute bottom-20 left-1/3 w-64 h-64 rounded-full opacity-20 animate-blob animation-delay-4000' style={{background:'radial-gradient(circle,#fbcfe8,transparent)'}}></div>
                <div className='relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-20'>
                    <div>
                        <div className='inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-sm font-semibold px-4 py-2 rounded-full mb-6'>
                            <span className='w-2 h-2 rounded-full bg-pink-500 animate-pulse'></span>
                            Women's Health Platform
                        </div>
                        <h1 className='text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6'>
                            Take charge of<br/>
                            <span className='text-gradient'>your health</span><br/>
                            with confidence
                        </h1>
                        <p className='text-xl text-gray-500 leading-relaxed mb-10'>FeminaSanté is your intelligent health companion — track your cycle, monitor your pregnancy, connect with experts, and understand your body like never before.</p>
                        <div className='flex flex-wrap gap-4 mb-10'>
                            <Link href='/register' className='btn-primary flex items-center gap-2 text-base'>
                                Start Your Journey <ArrowRight size={18}/>
                            </Link>
                            <Link href='/login' className='flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-pink-200 text-pink-700 font-semibold hover:bg-pink-50 transition-all text-base'>
                                Sign In
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-6'>
                            {['Free to start','No credit card','Cancel anytime'].map(t => (
                                <div key={t} className='flex items-center gap-2 text-sm text-gray-500'>
                                    <CheckCircle size={16} className='text-pink-500'/>{t}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='relative flex justify-center'>
                        <div className='relative animate-float'>
                            <div className='w-80 h-80 lg:w-96 lg:h-96 rounded-3xl shadow-2xl overflow-hidden' style={{background:'linear-gradient(135deg,#be185d,#7e22ce)'}}>
                                <div className='absolute inset-0 flex flex-col items-center justify-center text-white p-8'>
                                    <Logo size='xl' light className='justify-center mb-6'/>
                                    <div className='grid grid-cols-2 gap-3 w-full'>
                                        {[{l:'Cycle Day',v:'Day 14'},{l:'Next Period',v:'14 days'},{l:'Phase',v:'Ovulation'},{l:'Mood',v:'😊 Great'}].map(s => (
                                            <div key={s.l} className='bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center'>
                                                <div className='text-lg font-bold'>{s.v}</div>
                                                <div className='text-xs text-white/70'>{s.l}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{background:'linear-gradient(135deg,#EC4899,#A855F7)'}}><Heart size={20} className='text-white'/></div>
                                <div><div className='text-xs text-gray-500'>Cycle length</div><div className='font-bold text-gray-900'>28 days avg</div></div>
                            </div>
                            <div className='absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3'>
                                <div className='text-2xl'>🌸</div>
                                <div><div className='text-xs text-gray-500'>Prediction</div><div className='font-bold text-gray-900'>98% accurate</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section id='stats' className='py-16' style={{background:'linear-gradient(135deg,#be185d,#9d174d,#6b21a8)'}}>
                <div className='max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8'>
                    {stats.map(s => (
                        <div key={s.v} className='text-center'>
                            <div className='text-4xl font-extrabold text-white mb-1'>{s.v}</div>
                            <div className='text-pink-200 text-sm'>{s.l}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id='features' className='py-24 px-6' style={{background:'linear-gradient(180deg,#fff0f5 0%,white 100%)'}}>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-16'>
                        <span className='text-pink-600 font-semibold text-sm uppercase tracking-wider'>Everything you need</span>
                        <h2 className='text-4xl font-extrabold text-gray-900 mt-3 mb-4'>Your complete health companion</h2>
                        <p className='text-gray-500 max-w-2xl mx-auto text-lg'>From cycle tracking to pregnancy care — we've got every aspect of your women's health covered.</p>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {features.map(f => {
                            const I = f.icon;
                            return (
                                <div key={f.title} className='card card-hover group'>
                                    <div className={'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ' + f.color}>
                                        <I size={22} className='text-white'/>
                                    </div>
                                    <h3 className='text-lg font-bold text-gray-900 mb-2'>{f.title}</h3>
                                    <p className='text-gray-500 text-sm leading-relaxed'>{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonial / CTA */}
            <section className='py-24 px-6 text-center' style={{background:'linear-gradient(135deg,#fff0f5,#fdf4ff)'}}>
                <div className='max-w-3xl mx-auto'>
                    <div className='flex justify-center gap-1 mb-6'>{[...Array(5)].map((_,i)=><Star key={i} size={24} className='text-amber-400 fill-amber-400'/>)}</div>
                    <blockquote className='text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed mb-8'>“FeminaSanté helped me understand my body in ways I never thought possible. The cycle predictions are incredibly accurate!”</blockquote>
                    <p className='text-gray-500 mb-12'>— Sarah M., user since 2024</p>
                    <h2 className='text-4xl font-extrabold text-gray-900 mb-4'>Ready to start your journey?</h2>
                    <p className='text-gray-500 text-lg mb-8'>Join thousands of women who trust FeminaSanté for their health.</p>
                    <Link href='/register' className='btn-primary inline-flex items-center gap-2 text-lg px-8 py-4'>
                        Create Free Account <ArrowRight size={20}/>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className='py-8 px-6 border-t border-pink-100'>
                <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
                    <Logo size='sm'/>
                    <p className='text-gray-400 text-sm'>© 2024 FeminaSanté. All rights reserved.</p>
                    <div className='flex gap-6 text-sm text-gray-500'>
                        <a href='#' className='hover:text-pink-600 transition-colors'>Privacy</a>
                        <a href='#' className='hover:text-pink-600 transition-colors'>Terms</a>
                        <a href='#' className='hover:text-pink-600 transition-colors'>Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
