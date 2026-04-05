import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'blob': 'blob 7s infinite',
                'spin-slow': 'spin 8s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
            },
            keyframes: {
                float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
                blob: { '0%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(30px,-50px) scale(1.1)' }, '66%': { transform: 'translate(-20px,20px) scale(0.9)' }, '100%': { transform: 'translate(0,0) scale(1)' } },
            },
        },
    },
    plugins: [],
};
