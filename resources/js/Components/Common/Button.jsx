import React from 'react';

export default function Button({ type = 'button', className = '', processing, children, variant = 'primary', ...props }) {
    const baseStyle = "inline-flex items-center justify-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-rose-600 border-transparent text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500",
        secondary: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-indigo-500",
        danger: "bg-red-600 border-transparent text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
        ghost: "bg-transparent border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
    };

    return (
        <button
            {...props}
            type={type}
            className={`${baseStyle} ${variants[variant]} ${processing ? 'opacity-75 cursor-wait' : ''} ${className}`}
            disabled={processing || props.disabled}
        >
            {processing && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
