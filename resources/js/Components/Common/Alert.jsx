import React, { useState } from 'react';

export default function Alert({ type = 'info', title, children, dismissible = false }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const styles = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        error: "bg-red-50 border-red-200 text-red-800",
    };

    const icons = {
        info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        success: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
        warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        error: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    };

    return (
        <div className={`border-l-4 p-4 rounded-r-md ${styles[type]} relative shadow-sm mb-4`} role="alert">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {icons[type]}
                    </svg>
                </div>
                <div className="ml-3 pr-8">
                    {title && <h3 className="text-sm font-bold mb-1">{title}</h3>}
                    <div className="text-sm">{children}</div>
                </div>
                {dismissible && (
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-current opacity-60 hover:opacity-100"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
