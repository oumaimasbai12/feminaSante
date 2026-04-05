import React from 'react';

export default function Logo({ size = 'md', showText = true, className = '', light = false }) {
    const sizes = { xs: { w: 24, text: 'text-sm' }, sm: { w: 32, text: 'text-base' }, md: { w: 40, text: 'text-xl' }, lg: { w: 52, text: 'text-2xl' }, xl: { w: 68, text: 'text-3xl' } };
    const s = sizes[size] || sizes.md;
    return (
        <div className={'flex items-center gap-2.5 ' + className}>
            <svg width={s.w} height={s.w} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                    <linearGradient id={'lg1' + size} x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stopColor='#F43F5E'/>
                        <stop offset='50%' stopColor='#EC4899'/>
                        <stop offset='100%' stopColor='#A855F7'/>
                    </linearGradient>
                </defs>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#lg1' + size + ')'} opacity='0.9' transform='rotate(0,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#lg1' + size + ')'} opacity='0.8' transform='rotate(60,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#lg1' + size + ')'} opacity='0.85' transform='rotate(120,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#lg1' + size + ')'} opacity='0.9' transform='rotate(180,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#lg1' + size + ')'} opacity='0.8' transform='rotate(240,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#lg1' + size + ')'} opacity='0.85' transform='rotate(300,24,24)'/>
                <circle cx='24' cy='24' r='7.5' fill={light ? 'rgba(255,255,255,0.15)' : 'white'}/>
                <path d='M24 29.5C24 29.5 18 25.2 18 21C18 18.8 19.8 17 22 17C23.1 17 23.9 17.8 24 18C24.1 17.8 24.9 17 26 17C28.2 17 30 18.8 30 21C30 25.2 24 29.5 24 29.5Z' fill={'url(#lg1' + size + ')'}/>
            </svg>
            {showText && (
                <span className={'font-extrabold tracking-tight ' + s.text}>
                    <span className={light ? 'text-pink-200' : 'text-gradient'}>Femina</span>
                    <span className={light ? 'text-white' : 'text-purple-800'}>Santé</span>
                </span>
            )}
        </div>
    );
}
