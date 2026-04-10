import React from 'react';

export default function Logo({ size = 'md', showText = true, className = '', light = false }) {
    const sizes = { xs: { w: 24, text: 'text-sm' }, sm: { w: 32, text: 'text-base' }, md: { w: 40, text: 'text-xl' }, lg: { w: 52, text: 'text-2xl' }, xl: { w: 68, text: 'text-3xl' } };
    const s = sizes[size] || sizes.md;
    const id = 'lg' + size;
    return (
        <div className={'flex items-center gap-2.5 ' + className}>
            <svg width={s.w} height={s.w} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                    <linearGradient id={id} x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stopColor={light ? '#c4b5fd' : '#5B21B6'}/>
                        <stop offset='55%' stopColor={light ? '#a78bfa' : '#7C3AED'}/>
                        <stop offset='100%' stopColor='#D97706'/>
                    </linearGradient>
                </defs>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#' + id + ')'} opacity='0.92' transform='rotate(0,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#' + id + ')'} opacity='0.82' transform='rotate(60,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#' + id + ')'} opacity='0.87' transform='rotate(120,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#' + id + ')'} opacity='0.92' transform='rotate(180,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#' + id + ')'} opacity='0.82' transform='rotate(240,24,24)'/>
                <ellipse cx='24' cy='12' rx='4.5' ry='11' fill={'url(#' + id + ')'} opacity='0.87' transform='rotate(300,24,24)'/>
                <circle cx='24' cy='24' r='7.5' fill={light ? 'rgba(255,255,255,0.15)' : 'white'}/>
                <path d='M24 29.5C24 29.5 18 25.2 18 21C18 18.8 19.8 17 22 17C23.1 17 23.9 17.8 24 18C24.1 17.8 24.9 17 26 17C28.2 17 30 18.8 30 21C30 25.2 24 29.5 24 29.5Z' fill={'url(#' + id + ')'}/>
            </svg>
            {showText && (
                <span className={'font-extrabold tracking-tight ' + s.text}>
                    <span className={light ? 'text-violet-200' : 'text-gradient'}>Femina</span>
                    <span className={light ? 'text-amber-300' : 'text-amber-700'}>Sante</span>
                </span>
            )}
        </div>
    );
}
