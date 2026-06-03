import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    bg: '#F3F4F4',
                    primary: '#853953',
                    dark: '#612D53',
                    ink: '#2C2C2C',
                    muted: '#6B6B6B',
                    soft: 'rgba(133, 57, 83, 0.08)',
                    border: 'rgba(133, 57, 83, 0.14)',
                },
                /* Legacy aliases → new palette (gradual migration) */
                rose: {
                    50: 'rgba(133, 57, 83, 0.06)',
                    100: 'rgba(133, 57, 83, 0.10)',
                    200: 'rgba(133, 57, 83, 0.18)',
                    300: '#A86B82',
                    400: '#853953',
                    500: '#853953',
                    600: '#853953',
                    700: '#612D53',
                    800: '#612D53',
                    900: '#612D53',
                },
                slate: {
                    50: '#F3F4F4',
                    100: '#EBECEC',
                    200: 'rgba(44, 44, 44, 0.08)',
                    300: '#B0B0B0',
                    400: '#6B6B6B',
                    500: '#6B6B6B',
                    600: '#4A4A4A',
                    700: '#2C2C2C',
                    800: '#2C2C2C',
                    900: '#2C2C2C',
                },
                teal: {
                    50: 'rgba(133, 57, 83, 0.06)',
                    100: 'rgba(133, 57, 83, 0.10)',
                    200: 'rgba(133, 57, 83, 0.18)',
                    500: '#853953',
                    600: '#853953',
                    700: '#612D53',
                    800: '#612D53',
                },
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            transitionDuration: {
                DEFAULT: '300ms',
            },
            transitionTimingFunction: {
                DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%,100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
        },
    },
    plugins: [],
};
