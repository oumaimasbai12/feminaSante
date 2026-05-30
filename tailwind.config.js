import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

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
                // Custom palette from image
                'femina-pink': {
                    50: '#FDF7F8',
                    100: '#E1C9CD', // Light Pink
                    200: '#F0CCD8',
                    300: '#E7ADBF',
                    400: '#DF8DA7',
                    500: '#DB779B', // Medium Pink
                    600: '#C9537D',
                    700: '#A14264',
                    800: '#79324B',
                    900: '#502132',
                },
                'femina-purple': {
                    50: '#F8F3F7',
                    100: '#F1E6F0',
                    200: '#D9A1D4', // Lavender
                    300: '#CCA6CC',
                    400: '#BA85BA',
                    500: '#86437E', // Dark Purple
                    600: '#743A6D',
                    700: '#62315C',
                    800: '#4F274A',
                    900: '#3D1E39',
                },
                'femina-olive': {
                    50: '#F6F6EF',
                    100: '#EEECE0',
                    200: '#DAD8BD',
                    300: '#C5C399',
                    400: '#B1AF76',
                    500: '#A5A05A', // Olive Green
                    600: '#848048',
                    700: '#636036',
                    800: '#424024',
                    900: '#212012',
                },
                // Map existing colors to new palette
                rose: {
                    50: '#FDF7F8',
                    100: '#E1C9CD',
                    200: '#F0CCD8',
                    300: '#E7ADBF',
                    400: '#DF8DA7',
                    500: '#DB779B',
                    600: '#DB779B',
                    700: '#A14264',
                    800: '#79324B',
                    900: '#502132',
                },
                pink: {
                     50: '#FDF7F8',
                     100: '#E1C9CD',
                     200: '#F0CCD8',
                     300: '#E7ADBF',
                     400: '#DF8DA7',
                     500: '#DB779B',
                     600: '#DB779B',
                     700: '#A14264',
                     800: '#79324B',
                     900: '#502132',
                 },
                 purple: {
                     50: '#F8F3F7',
                     100: '#F1E6F0',
                     200: '#D9A1D4',
                     300: '#CCA6CC',
                     400: '#BA85BA',
                     500: '#86437E',
                     600: '#743A6D',
                     700: '#62315C',
                     800: '#4F274A',
                     900: '#3D1E39',
                 },
                 violet: {
                     200: '#D9A1D4',
                     500: '#86437E',
                     700: '#62315C',
                 },
                teal: {
                     50: '#F6F6EF',
                     100: '#EEECE0',
                     200: '#DAD8BD',
                     300: '#C5C399',
                     400: '#B1AF76',
                     500: '#A5A05A',
                     600: '#848048',
                     700: '#636036',
                     800: '#424024',
                     900: '#212012',
                 },
                 emerald: {
                     50: '#F6F6EF',
                     100: '#EEECE0',
                     200: '#DAD8BD',
                     300: '#C5C399',
                     400: '#B1AF76',
                     500: '#A5A05A',
                     600: '#848048',
                     700: '#636036',
                     800: '#424024',
                     900: '#212012',
                 },
                 olive: {
                     50: '#F6F6EF',
                     100: '#EEECE0',
                     200: '#DAD8BD',
                     300: '#C5C399',
                     400: '#B1AF76',
                     500: '#A5A05A',
                     600: '#848048',
                     700: '#636036',
                     800: '#424024',
                     900: '#212012',
                 },
            },
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
