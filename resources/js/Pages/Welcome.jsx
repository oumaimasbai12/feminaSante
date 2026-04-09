import React from 'react';
import { Link } from '@inertiajs/react';
import Logo from '../Components/Logo';
import { Heart, Activity, Brain, Stethoscope, Baby, BookOpen, ArrowRight, CheckCircle, Star } from 'lucide-react';

const features = [
    { icon: Heart, title: 'Suivi du cycle', desc: 'Suivez votre cycle menstruel, vos symptômes et votre humeur avec des prédictions intelligentes.', color: 'from-violet-500 to-purple-600' },
    { icon: Activity, title: 'Analyse de santé', desc: 'Analyse de vos habitudes de santé par IA avec des recommandations personnalisées.', color: 'from-purple-500 to-indigo-600' },
    { icon: Brain, title: 'Quiz de santé', desc: 'Des quiz interactifs pour mieux comprendre votre corps et votre santé.', color: 'from-indigo-500 to-blue-600' },
    { icon: Stethoscope, title: 'Réseau d’experts', desc: 'Consultez des gynécologues certifiés et prenez rendez-vous facilement.', color: 'from-amber-500 to-orange-500' },
    { icon: Baby, title: 'Suivi de grossesse', desc: 'Suivi complet de la grossesse du premier trimestre jusqu’à l’accouchement.', color: 'from-teal-500 to-cyan-600' },
    { icon: BookOpen, title: 'Bibliothèque santé', desc: 'Articles et ressources rédigés par des experts médicaux spécialisés.', color: 'from-rose-500 to-pink-600' },
];

const stats = [{ v: '50K+', l: 'Femmes accompagnées' }, { v: '200+', l: 'Articles de santé' }, { v: '98%', l: 'Taux de satisfaction' }, { v: '24/7', l: 'Support IA' }];

export default function Welcome() {
    return (
        <div className='min-h-screen bg-white overflow-x-hidden'>
            <nav className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-violet-100/40'>
                <Logo size='md' />
                <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-600'>
                    <a href='#features' className='hover:text-violet-700 transition-colors'>Fonctionnalités</a>
                    <a href='#stats' className='hover:text-violet-700 transition-colors'>Statistiques</a>
                    <a href='#about' className='hover:text-violet-700 transition-colors'>À propos</a>
                </div>
                <div className='flex items-center gap-3'>
                    <Link href='/login' className='text-sm font-semibold text-gray-700 hover:text-violet-700 transition-colors px-4 py-2'>Se connecter</Link>
                    <Link href='/register' className='btn-primary text-sm'>Commencer</Link>
                </div>
            </nav>

            <section className='relative min-h-screen flex items-center pt-20 overflow-hidden' style={{background:'linear-gradient(135deg,#f5f3ff 0%,#fdfbff 50%,#fff8ed 100%)'}}>
                <div className='absolute top-20 -left-20 w-96 h-96 rounded-full opacity-25 animate-blob' style={{background:'radial-gradient(circle,#a78bfa,transparent)'}}></div>
                <div className='absolute top-40 right-10 w-80 h-80 rounded-full opacity-20 animate-blob animation-delay-2000' style={{background:'radial-gradient(circle,#fcd34d,transparent)'}}></div>
                <div className='absolute bottom-20 left-1/3 w-64 h-64 rounded-full opacity-15 animate-blob animation-delay-4000' style={{background:'radial-gradient(circle,#c4b5fd,transparent)'}}></div>
                <div className='relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-20'>
                    <div>
                        <div className='inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-2 rounded-full mb-6'>
                            <span className='w-2 h-2 rounded-full bg-violet-500 animate-pulse'></span>
                            Plateforme de Santé Féminine
                        </div>
                        <h1 className='text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6'>
                            Prenez soin de<br/>
                            <span className='text-gradient'>votre santé</span><br/>
                            en toute confiance
                        </h1>
                        <p className='text-xl text-gray-500 leading-relaxed mb-10'>FeminaSanté est votre compagnon de santé intelligent — suivez votre cycle, surveillez votre grossesse, consultez des experts et comprenez votre corps comme jamais.</p>
                        <div className='flex flex-wrap gap-4 mb-10'>
                            <Link href='/register' className='btn-primary flex items-center gap-2 text-base'>Commencer maintenant <ArrowRight size={18}/></Link>
                            <Link href='/login' className='flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-violet-200 text-violet-700 font-semibold hover:bg-violet-50 transition-all text-base'>Se connecter</Link>
                        </div>
                        <div className='flex flex-wrap gap-6'>
                            {['Gratuit pour commencer','Sans carte bancaire','Annulation à tout moment'].map(t => (
                                <div key={t} className='flex items-center gap-2 text-sm text-gray-500'><CheckCircle size={16} className='text-violet-500'/>{t}</div>
                            ))}
                        </div>
                    </div>
                    <div className='relative flex justify-center'>
                        <div className='relative animate-float'>
                            <div className='w-80 h-80 lg:w-96 lg:h-96 rounded-3xl shadow-2xl overflow-hidden' style={{background:'linear-gradient(135deg,#1e1b4b,#4f46e5,#7c3aed)'}}>
                                <div className='absolute inset-0 flex flex-col items-center justify-center text-white p-8'>
                                    <Logo size='xl' light className='justify-center mb-6'/>
                                    <div className='grid grid-cols-2 gap-3 w-full'>
                                        {[{l:'Jour du cycle',v:'Jour 14'},{l:'Prochaines règles',v:'14 jours'},{l:'Phase',v:'Ovulation'},{l:'Humeur',v:'😊 Top'}].map(s => (
                                            <div key={s.l} className='bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center'>
                                                <div className='text-lg font-bold'>{s.v}</div>
                                                <div className='text-xs text-white/70'>{s.l}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{background:'linear-gradient(135deg,#7C3AED,#D97706)'}}><Heart size={20} className='text-white'/></div>
                                <div><div className='text-xs text-gray-500'>Durée du cycle</div><div className='font-bold text-gray-900'>28 jours moy.</div></div>
                            </div>
                            <div className='absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3'>
                                <div className='text-2xl'>🌸</div>
                                <div><div className='text-xs text-gray-500'>Précision</div><div className='font-bold text-gray-900'>98% fiable</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id='stats' className='py-16' style={{background:'linear-gradient(135deg,#1e1b4b,#3730a3,#4f46e5)'}}>
                <div className='max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8'>
                    {stats.map(s => (
                        <div key={s.v} className='text-center'>
                            <div className='text-4xl font-extrabold text-white mb-1'>{s.v}</div>
                            <div className='text-violet-200 text-sm'>{s.l}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section id='features' className='py-24 px-6' style={{background:'linear-gradient(180deg,#f5f3ff 0%,white 100%)'}}>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-16'>
                        <span className='text-violet-700 font-semibold text-sm uppercase tracking-wider'>Tout ce dont vous avez besoin</span>
                        <h2 className='text-4xl font-extrabold text-gray-900 mt-3 mb-4'>Votre compagnon de santé complet</h2>
                        <p className='text-gray-500 max-w-2xl mx-auto text-lg'>Du suivi du cycle au suivi de grossesse — chaque aspect de votre santé féminine est couvert.</p>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {features.map(f => { const I = f.icon; return (
                            <div key={f.title} className='card card-hover group'>
                                <div className={'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ' + f.color}><I size={22} className='text-white'/></div>
                                <h3 className='text-lg font-bold text-gray-900 mb-2'>{f.title}</h3>
                                <p className='text-gray-500 text-sm leading-relaxed'>{f.desc}</p>
                            </div>
                        ); })}
                    </div>
                </div>
            </section>

            <section id='about' className='py-24 px-6 text-center' style={{background:'linear-gradient(135deg,#f5f3ff,#fff8ed)'}}>
                <div className='max-w-3xl mx-auto'>
                    <div className='flex justify-center gap-1 mb-6'>{[...Array(5)].map((_,i)=><Star key={i} size={24} className='text-amber-400 fill-amber-400'/>)}</div>
                    <blockquote className='text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed mb-8'>“FeminaSanté m’a aidée à comprendre mon corps d’une façon que je n’aurais jamais cru possible. Les prédictions de cycle sont incroyablement précises !”</blockquote>
                    <p className='text-gray-500 mb-12'>— Sarah M., utilisatrice depuis 2024</p>
                    <h2 className='text-4xl font-extrabold text-gray-900 mb-4'>Prête à commencer votre parcours ?</h2>
                    <p className='text-gray-500 text-lg mb-8'>Rejoignez des milliers de femmes qui font confiance à FeminaSanté.</p>
                    <Link href='/register' className='btn-primary inline-flex items-center gap-2 text-lg px-8 py-4'>Créer un compte gratuit <ArrowRight size={20}/></Link>
                </div>
            </section>

            <footer className='py-8 px-6 border-t border-violet-100'>
                <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
                    <Logo size='sm'/>
                    <p className='text-gray-400 text-sm'>© 2024 FeminaSanté. Tous droits réservés.</p>
                    <div className='flex gap-6 text-sm text-gray-500'>
                        <a href='#' className='hover:text-violet-700 transition-colors'>Confidentialité</a>
                        <a href='#' className='hover:text-violet-700 transition-colors'>Conditions</a>
                        <a href='#' className='hover:text-violet-700 transition-colors'>Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
